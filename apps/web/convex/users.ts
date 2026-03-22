import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Get current user by Clerk ID ─────────────────────────────────────
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// ── Get user by Clerk ID (for internal use from other functions) ─────
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// ── Create or update user from Clerk webhook ─────────────────────────
// Internal mutation: called from HTTP webhook handler, not from clients.
export const createOrUpdateUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        lastActiveAt: now,
      });
      return existing._id;
    }

    // New user defaults
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      country: "NG",
      currency: "NGN",
      onboardingCompleted: false,
      onboardingStep: 0,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      aiTonePreference: "warm",
      createdAt: now,
      lastActiveAt: now,
    });
  },
});

// ── Ensure user exists (auto-create from Clerk identity if missing) ──
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) return existing._id;

    // Create user from Clerk identity
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      firstName: identity.givenName ?? identity.name ?? "",
      lastName: identity.familyName ?? "",
      imageUrl: identity.pictureUrl ?? "",
      country: "NG",
      currency: "NGN",
      onboardingCompleted: false,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      aiTonePreference: "warm",
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });

    // Send welcome notifications to the new user
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.createWelcomeNotifications,
      { userId }
    );

    return userId;
  },
});

// ── Update onboarding step ───────────────────────────────────────────
export const updateOnboardingStep = mutation({
  args: { step: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingStep: args.step,
      lastActiveAt: Date.now(),
    });
  },
});

// ── Complete onboarding ──────────────────────────────────────────────
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
      lastActiveAt: Date.now(),
    });
  },
});

// ── Update user preferences (country, currency, AI tone) ────────────
export const updateUserPreferences = mutation({
  args: {
    country: v.optional(v.string()),
    currency: v.optional(v.string()),
    aiTonePreference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: Record<string, string | number> = {
      lastActiveAt: Date.now(),
    };

    if (args.country !== undefined) {
      updates.country = args.country;
    }
    if (args.currency !== undefined) {
      updates.currency = args.currency;
    }
    if (args.aiTonePreference !== undefined) {
      updates.aiTonePreference = args.aiTonePreference;
    }

    await ctx.db.patch(user._id, updates);
  },
});
