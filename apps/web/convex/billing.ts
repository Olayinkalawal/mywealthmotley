import { v } from "convex/values";
import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Plan config ────────────────────────────────────────────────────
const PLANS = {
  pro: { amountKobo: 250000, label: "Pro" },
  premium: { amountKobo: 500000, label: "Premium" },
} as const;

type PlanId = keyof typeof PLANS;

// ── Helper: get current user from auth identity ─────────────────────
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

// ═══════════════════════════════════════════════════════════════════
// 1. initializePaystackPayment — Paystack transaction for Nigerian users
// ═══════════════════════════════════════════════════════════════════
export const initializePaystackPayment = action({
  args: {
    planId: v.union(v.literal("pro"), v.literal("premium")),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ authorization_url: string; reference: string }> => {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured");
    }

    // Look up user to get email
    const user: any = await ctx.runQuery(internal.billing.getUserById, {
      userId: args.userId,
    });
    if (!user) throw new Error("User not found");

    const plan = PLANS[args.planId];

    // Paystack plan codes from env vars
    const paystackPlanCode =
      args.planId === "pro"
        ? process.env.PAYSTACK_PRO_PLAN_CODE
        : process.env.PAYSTACK_PREMIUM_PLAN_CODE;

    if (!paystackPlanCode) {
      throw new Error(`Paystack plan code not configured for ${args.planId}`);
    }

    const callbackUrl =
      process.env.PAYSTACK_CALLBACK_URL ??
      "https://mywealthmotley.com/billing/callback";

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: plan.amountKobo,
          plan: paystackPlanCode,
          callback_url: callbackUrl,
          metadata: {
            userId: args.userId,
            planId: args.planId,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[billing] Paystack init error:", errorText);
      throw new Error("Failed to initialize Paystack payment");
    }

    const data = await response.json();

    return {
      authorization_url: data.data.authorization_url as string,
      reference: data.data.reference as string,
    };
  },
});

// ═══════════════════════════════════════════════════════════════════
// 2. initializeStripeCheckout — Stripe Checkout for international users
// ═══════════════════════════════════════════════════════════════════
export const initializeStripeCheckout = action({
  args: {
    planId: v.union(v.literal("pro"), v.literal("premium")),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Look up user to get email
    const user = await ctx.runQuery(internal.billing.getUserById, {
      userId: args.userId,
    });
    if (!user) throw new Error("User not found");

    // Stripe price IDs from env vars
    const stripePriceId =
      args.planId === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_PREMIUM_PRICE_ID;

    if (!stripePriceId) {
      throw new Error(`Stripe price ID not configured for ${args.planId}`);
    }

    const successUrl =
      process.env.STRIPE_SUCCESS_URL ??
      "https://mywealthmotley.com/billing/success?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL ??
      "https://mywealthmotley.com/billing/cancel";

    // Stripe API uses form-encoded body, NOT JSON
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("line_items[0][price]", stripePriceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", successUrl);
    params.append("cancel_url", cancelUrl);
    params.append("customer_email", user.email);
    params.append("metadata[userId]", args.userId);
    params.append("metadata[planId]", args.planId);

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[billing] Stripe checkout error:", errorText);
      throw new Error("Failed to create Stripe checkout session");
    }

    const session = await response.json();

    return {
      url: session.url as string,
    };
  },
});

// ═══════════════════════════════════════════════════════════════════
// 3. activateSubscription — called by webhook handlers
// ═══════════════════════════════════════════════════════════════════
export const activateSubscription = internalMutation({
  args: {
    userId: v.id("users"),
    tier: v.union(v.literal("pro"), v.literal("premium")),
    provider: v.union(v.literal("paystack"), v.literal("stripe")),
    externalId: v.string(),
    planCode: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();

    // Update the user record
    await ctx.db.patch(args.userId, {
      subscriptionTier: args.tier,
      subscriptionStatus: "active",
      subscriptionProvider: args.provider,
      subscriptionExternalId: args.externalId,
      lastActiveAt: now,
    });

    // Upsert the subscriptions table record
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const plan = PLANS[args.tier];
    const periodEnd = now + 30 * 24 * 60 * 60 * 1000; // ~30 days

    if (existingSub) {
      await ctx.db.patch(existingSub._id, {
        tier: args.tier,
        status: "active",
        provider: args.provider,
        externalId: args.externalId,
        planCode: args.planCode,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        amount: plan.amountKobo / 100,
      });
    } else {
      await ctx.db.insert("subscriptions", {
        userId: args.userId,
        tier: args.tier,
        status: "active",
        provider: args.provider,
        externalId: args.externalId,
        planCode: args.planCode,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        currency: args.provider === "paystack" ? "NGN" : "USD",
        amount: plan.amountKobo / 100,
        createdAt: now,
      });
    }

    // Create notification
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.createNotification,
      {
        userId: args.userId,
        title: "Subscription Activated",
        message: `Your ${plan.label} subscription is now active!`,
        type: "system",
        link: "/settings",
      }
    );
  },
});

// ═══════════════════════════════════════════════════════════════════
// 4. cancelSubscription — called by webhook handlers
// ═══════════════════════════════════════════════════════════════════
export const cancelSubscription = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    let userId = args.userId;

    // Look up by externalId if userId not provided
    if (!userId && args.externalId) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_externalId", (q) =>
          q.eq("externalId", args.externalId!)
        )
        .first();
      if (sub) userId = sub.userId;
    }

    if (!userId) {
      console.error("[billing] cancelSubscription: could not resolve user");
      return;
    }

    // Update user record — keep tier until period end
    await ctx.db.patch(userId, {
      subscriptionStatus: "canceled",
    });

    // Update subscription record
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .first();

    if (sub) {
      await ctx.db.patch(sub._id, {
        status: "canceled",
        cancelAtPeriodEnd: true,
      });
    }

    // Create notification
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.createNotification,
      {
        userId,
        title: "Subscription Cancelled",
        message:
          "Your subscription has been cancelled. You'll retain access until the end of your current billing period.",
        type: "system",
        link: "/settings",
      }
    );
  },
});

// ═══════════════════════════════════════════════════════════════════
// 5. markPaymentFailed — called by webhook handlers
// ═══════════════════════════════════════════════════════════════════
export const markPaymentFailed = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    externalId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    let userId = args.userId;

    // Look up by externalId if userId not provided
    if (!userId && args.externalId) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_externalId", (q) =>
          q.eq("externalId", args.externalId!)
        )
        .first();
      if (sub) userId = sub.userId;
    }

    if (!userId) {
      console.error("[billing] markPaymentFailed: could not resolve user");
      return;
    }

    // Update user record
    await ctx.db.patch(userId, {
      subscriptionStatus: "past_due",
    });

    // Update subscription record
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId!))
      .first();

    if (sub) {
      await ctx.db.patch(sub._id, {
        status: "past_due",
      });
    }

    // Create notification
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.createNotification,
      {
        userId,
        title: "Payment Failed",
        message:
          "We couldn't process your subscription payment. Please update your payment method to avoid losing access.",
        type: "system",
        link: "/settings",
      }
    );

    // Send email alert
    const user = await ctx.db.get(userId);
    if (user) {
      await ctx.scheduler.runAfter(0, internal.email.sendEmail, {
        to: user.email,
        subject: "Payment Failed — myWealthMotley",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0b0a;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <div style="text-align:center;margin-bottom:24px">
    <span style="font-size:24px;font-weight:bold;color:#ffb347">my</span><span style="font-size:24px;font-weight:bold;color:#ffffff">WealthMotley</span>
  </div>
  <div style="background:#1a1614;border:1px solid #2a2420;border-radius:16px;padding:32px 24px;color:#e5e5e5;font-size:14px;line-height:1.6">
    <h2 style="color:#ffffff;margin:0 0 16px;font-size:18px">Payment Failed</h2>
    <p>Hi ${user.firstName},</p>
    <p>We couldn't process your subscription payment. Please update your payment method to avoid losing access to your ${user.subscriptionTier} features.</p>
    <div style="text-align:center;margin-top:24px">
      <a href="https://mywealthmotley.com/settings" style="display:inline-block;padding:12px 32px;background:#ffb347;color:#0d0b0a;text-decoration:none;border-radius:8px;font-weight:bold">Update Payment Method</a>
    </div>
  </div>
  <div style="text-align:center;margin-top:24px;color:#968a84;font-size:11px">
    <p>myWealthMotley &mdash; Financial education for Africans</p>
  </div>
</div>
</body>
</html>`,
      });
    }
  },
});

// ═══════════════════════════════════════════════════════════════════
// 6. getSubscription — returns current user's subscription details
// ═══════════════════════════════════════════════════════════════════
export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return {
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      provider: user.subscriptionProvider ?? null,
      subscription: subscription
        ? {
            _id: subscription._id,
            externalId: subscription.externalId,
            planCode: subscription.planCode,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            currency: subscription.currency,
            amount: subscription.amount,
          }
        : null,
    };
  },
});

// ═══════════════════════════════════════════════════════════════════
// 7. cancelUserSubscription — user-initiated cancellation
// ═══════════════════════════════════════════════════════════════════
export const cancelUserSubscription = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.runQuery(internal.billing.getUserByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user) throw new Error("User not found");

    if (
      user.subscriptionTier === "free" ||
      user.subscriptionStatus === "canceled"
    ) {
      throw new Error("No active subscription to cancel");
    }

    const subscription = await ctx.runQuery(
      internal.billing.getSubscriptionByUserId,
      { userId: user._id }
    );

    if (!subscription) {
      throw new Error("No subscription record found");
    }

    if (user.subscriptionProvider === "paystack") {
      // Paystack: disable subscription
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      if (!paystackSecretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is not configured");
      }

      const response = await fetch(
        "https://api.paystack.co/subscription/disable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: subscription.externalId,
            token: subscription.planCode ?? subscription.externalId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[billing] Paystack cancel error:", errorText);
        throw new Error("Failed to cancel Paystack subscription");
      }
    } else if (user.subscriptionProvider === "stripe") {
      // Stripe: cancel at period end
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured");
      }

      const params = new URLSearchParams();
      params.append("cancel_at_period_end", "true");

      const response = await fetch(
        `https://api.stripe.com/v1/subscriptions/${subscription.externalId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[billing] Stripe cancel error:", errorText);
        throw new Error("Failed to cancel Stripe subscription");
      }
    }

    // Update local records
    await ctx.runMutation(internal.billing.cancelSubscription, {
      userId: user._id,
    });

    return { success: true };
  },
});

// ═══════════════════════════════════════════════════════════════════
// Internal queries — used by webhook handlers and actions
// ═══════════════════════════════════════════════════════════════════

// Look up user by email (for webhook handlers)
export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Look up user by ID (for actions that need user data)
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Look up user by Clerk ID (internal, for actions)
export const getUserByClerkIdInternal = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Get subscription record by userId (internal)
export const getSubscriptionByUserId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get subscription record by externalId (for webhook handlers)
export const getSubscriptionByExternalId = internalQuery({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});
