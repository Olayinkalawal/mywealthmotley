import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// ── Clerk Webhook ───────────────────────────────────────────────────
// Receives user.created, user.updated, user.deleted events from Clerk.
// In production, verify the webhook signature using svix.
http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify webhook signature with svix
    // const svixId = request.headers.get("svix-id");
    // const svixTimestamp = request.headers.get("svix-timestamp");
    // const svixSignature = request.headers.get("svix-signature");

    try {
      const body = await request.json();
      const eventType = body.type as string;

      if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = body.data;

        const primaryEmail = email_addresses?.find(
          (e: any) => e.id === body.data.primary_email_address_id
        );

        await ctx.runMutation(internal.users.createOrUpdateUser, {
          clerkId: id,
          email: primaryEmail?.email_address ?? "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          imageUrl: image_url,
        });
      }

      // TODO: Handle user.deleted - soft delete or anonymize user data

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Clerk webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// ── Mono Webhook ────────────────────────────────────────────────────
// Receives events from Mono: mono.events.account_connected,
// mono.events.account_updated, mono.events.reauthorisation_required
http.route({
  path: "/webhooks/mono",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify Mono webhook signature in production
    // const monoSignature = request.headers.get("mono-webhook-secret");

    try {
      const body = await request.json();
      const eventType = body.event as string;
      // Mono webhook data can have the account ID in different places
      const monoAccountId: string | undefined =
        body.data?.account?._id ??
        body.data?.account?.id ??
        body.data?.id;

      switch (eventType) {
        case "mono.events.account_connected":
          console.log("Mono account connected:", monoAccountId);
          if (monoAccountId) {
            // Trigger a full sync of account details + transactions
            await ctx.scheduler.runAfter(
              0,
              internal.mono.triggerSyncFromWebhook,
              { monoAccountId }
            );
          }
          break;

        case "mono.events.account_updated":
          console.log("Mono account updated:", monoAccountId);
          if (monoAccountId) {
            // Refresh account details and transactions
            await ctx.scheduler.runAfter(
              0,
              internal.mono.triggerSyncFromWebhook,
              { monoAccountId }
            );
          }
          break;

        case "mono.events.reauthorisation_required":
          // TODO: Notify user to re-authenticate their bank connection
          // For now, log the event. In production, you'd send a push/email notification.
          console.log("Mono reauth required:", monoAccountId);
          break;

        default:
          console.log("Unhandled Mono event:", eventType);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Mono webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// ── Paystack Webhook ────────────────────────────────────────────────
// Receives payment events: charge.success, subscription.create,
// subscription.disable, invoice.payment_failed, etc.
http.route({
  path: "/webhooks/paystack",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify Paystack signature using HMAC SHA-512
    // const paystackSignature = request.headers.get("x-paystack-signature");
    // const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(rawBody).digest("hex");

    try {
      const body = await request.json();
      const eventType = body.event as string;

      switch (eventType) {
        case "charge.success":
          // TODO: Update subscription status
          console.log("Paystack charge success:", body.data?.reference);
          break;

        case "subscription.create":
          // TODO: Create/update subscription record
          console.log("Paystack subscription created:", body.data?.subscription_code);
          break;

        case "subscription.not_renew":
        case "subscription.disable":
          // TODO: Handle subscription cancellation
          console.log("Paystack subscription ending:", body.data?.subscription_code);
          break;

        case "invoice.payment_failed":
          // TODO: Mark subscription as past_due, notify user
          console.log("Paystack payment failed:", body.data?.reference);
          break;

        default:
          console.log("Unhandled Paystack event:", eventType);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Paystack webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// ── Stripe Webhook ──────────────────────────────────────────────────
// Receives events for international users: checkout.session.completed,
// customer.subscription.updated, customer.subscription.deleted,
// invoice.payment_failed, etc.
http.route({
  path: "/webhooks/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify Stripe webhook signature
    // const stripeSignature = request.headers.get("stripe-signature");
    // Use Stripe SDK: stripe.webhooks.constructEvent(rawBody, stripeSignature, endpointSecret)

    try {
      const body = await request.json();
      const eventType = body.type as string;

      switch (eventType) {
        case "checkout.session.completed":
          // TODO: Activate subscription for the user
          console.log("Stripe checkout completed:", body.data?.object?.id);
          break;

        case "customer.subscription.updated":
          // TODO: Sync subscription status changes
          console.log("Stripe subscription updated:", body.data?.object?.id);
          break;

        case "customer.subscription.deleted":
          // TODO: Handle subscription cancellation
          console.log("Stripe subscription deleted:", body.data?.object?.id);
          break;

        case "invoice.payment_failed":
          // TODO: Mark subscription as past_due, notify user
          console.log("Stripe payment failed:", body.data?.object?.id);
          break;

        default:
          console.log("Unhandled Stripe event:", eventType);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
