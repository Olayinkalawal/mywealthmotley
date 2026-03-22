import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// ── HMAC Verification Helper ───────────────────────────────────────
// Uses Web Crypto API (available in Convex runtime) — NOT Node.js crypto.
async function verifyHmac(
  secret: string,
  payload: string,
  signature: string,
  algorithm: string = "SHA-256"
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

// ── Clerk Webhook ───────────────────────────────────────────────────
// Receives user.created, user.updated, user.deleted events from Clerk.
// Verifies webhook signature using svix HMAC-SHA256.
http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.text();

    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!clerkWebhookSecret) {
      console.error("CLERK_WEBHOOK_SECRET is not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    // Svix secrets are prefixed with "whsec_" and base64-encoded after that prefix
    const secretBytes = clerkWebhookSecret.startsWith("whsec_")
      ? clerkWebhookSecret.slice(6)
      : clerkWebhookSecret;

    const payload = `${svixId}.${svixTimestamp}.${body}`;

    // Svix signature header can contain multiple signatures separated by spaces
    // Each is in the format "v1,<base64-signature>"
    const expectedSignatures = svixSignature.split(" ");
    let verified = false;

    for (const sig of expectedSignatures) {
      const [version, signatureBase64] = sig.split(",");
      if (version !== "v1" || !signatureBase64) continue;

      // Decode the base64 secret to raw bytes for the key
      const encoder = new TextEncoder();
      const secretKeyBytes = Uint8Array.from(atob(secretBytes), (c) =>
        c.charCodeAt(0)
      );
      const key = await crypto.subtle.importKey(
        "raw",
        secretKeyBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signedBytes = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payload)
      );
      const computedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(signedBytes))
      );

      if (computedBase64 === signatureBase64) {
        verified = true;
        break;
      }
    }

    if (!verified) {
      console.error("Clerk webhook signature verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const parsedBody = JSON.parse(body);
      const eventType = parsedBody.type as string;

      if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } =
          parsedBody.data;

        const primaryEmail = email_addresses?.find(
          (e: any) => e.id === parsedBody.data.primary_email_address_id
        );

        await ctx.runMutation(internal.users.createOrUpdateUser, {
          clerkId: id,
          email: primaryEmail?.email_address ?? "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          imageUrl: image_url,
        });
      }

      // Handle user.deleted — full NDPA / UK GDPR purge
      if (eventType === "user.deleted") {
        const { id } = parsedBody.data;
        if (id) {
          await ctx.runMutation(internal.users.purgeUserData, {
            clerkId: id,
          });
          console.log(`User data purged for clerkId: ${id}`);
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Clerk webhook error:", error);
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

// ── Mono Webhook ────────────────────────────────────────────────────
// Receives events from Mono: mono.events.account_connected,
// mono.events.account_updated, mono.events.reauthorisation_required
// Verifies webhook secret header.
http.route({
  path: "/webhooks/mono",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const monoSignature = request.headers.get("mono-webhook-secret");
    const monoWebhookSecret = process.env.MONO_WEBHOOK_SECRET;

    if (!monoWebhookSecret) {
      console.error("MONO_WEBHOOK_SECRET is not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    if (!monoSignature || monoSignature !== monoWebhookSecret) {
      console.error("Mono webhook signature verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

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
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

// ── Paystack Webhook ────────────────────────────────────────────────
// Receives payment events: charge.success, subscription.create,
// subscription.disable, invoice.payment_failed, etc.
// Verifies signature using HMAC-SHA512.
http.route({
  path: "/webhooks/paystack",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const paystackSignature = request.headers.get("x-paystack-signature");

    if (!paystackSignature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    const body = await request.text();

    const isValid = await verifyHmac(
      paystackSecretKey,
      body,
      paystackSignature,
      "SHA-512"
    );

    if (!isValid) {
      console.error("Paystack webhook signature verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const parsedBody = JSON.parse(body);
      const eventType = parsedBody.event as string;

      switch (eventType) {
        case "charge.success":
          // TODO: Update subscription status
          console.log("Paystack charge success:", parsedBody.data?.reference);
          break;

        case "subscription.create":
          // TODO: Create/update subscription record
          console.log(
            "Paystack subscription created:",
            parsedBody.data?.subscription_code
          );
          break;

        case "subscription.not_renew":
        case "subscription.disable":
          // TODO: Handle subscription cancellation
          console.log(
            "Paystack subscription ending:",
            parsedBody.data?.subscription_code
          );
          break;

        case "invoice.payment_failed":
          // TODO: Mark subscription as past_due, notify user
          console.log(
            "Paystack payment failed:",
            parsedBody.data?.reference
          );
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
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

// ── Stripe Webhook ──────────────────────────────────────────────────
// Receives events for international users: checkout.session.completed,
// customer.subscription.updated, customer.subscription.deleted,
// invoice.payment_failed, etc.
// Verifies signature using HMAC-SHA256.
http.route({
  path: "/webhooks/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripeSignatureHeader = request.headers.get("stripe-signature");

    if (!stripeSignatureHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    // Parse the stripe-signature header to extract timestamp and v1 signature
    const elements = stripeSignatureHeader.split(",");
    let timestamp: string | undefined;
    let signature: string | undefined;

    for (const element of elements) {
      const [key, value] = element.split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }

    if (!timestamp || !signature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.text();
    const payload = `${timestamp}.${body}`;

    const isValid = await verifyHmac(
      stripeWebhookSecret,
      payload,
      signature,
      "SHA-256"
    );

    if (!isValid) {
      console.error("Stripe webhook signature verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const parsedBody = JSON.parse(body);
      const eventType = parsedBody.type as string;

      switch (eventType) {
        case "checkout.session.completed":
          // TODO: Activate subscription for the user
          console.log(
            "Stripe checkout completed:",
            parsedBody.data?.object?.id
          );
          break;

        case "customer.subscription.updated":
          // TODO: Sync subscription status changes
          console.log(
            "Stripe subscription updated:",
            parsedBody.data?.object?.id
          );
          break;

        case "customer.subscription.deleted":
          // TODO: Handle subscription cancellation
          console.log(
            "Stripe subscription deleted:",
            parsedBody.data?.object?.id
          );
          break;

        case "invoice.payment_failed":
          // TODO: Mark subscription as past_due, notify user
          console.log(
            "Stripe payment failed:",
            parsedBody.data?.object?.id
          );
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
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
