import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Helper: get current user from auth identity ─────────────────────
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

// ── Reusable audit log mutation (internal only) ─────────────────────
export const logAuditEvent = internalMutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    details: v.string(),
    targetUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminAuditLog", {
      adminUserId: args.userId,
      action: args.action,
      details: args.details,
      targetUserId: args.targetUserId,
      timestamp: Date.now(),
    });
  },
});

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

// ── Update consent record (upsert) ──────────────────────────────────
export const updateConsent = mutation({
  args: {
    consentType: v.string(), // "bank_data" | "marketing" | "analytics" | "data_processing"
    granted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    // Upsert: check if consent record exists for this type
    const existing = await ctx.db
      .query("consentRecords")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("consentType"), args.consentType))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        granted: args.granted,
        timestamp: Date.now(),
      });
    } else {
      await ctx.db.insert("consentRecords", {
        userId: user._id,
        consentType: args.consentType,
        granted: args.granted,
        timestamp: Date.now(),
      });
    }

    // Update user record timestamps
    const updates: Record<string, any> = {};
    if (args.consentType === "marketing") {
      updates.marketingConsentAt = args.granted ? Date.now() : undefined;
    }
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(user._id, updates);
    }
  },
});

// ── Purge all user data (NDPA / UK GDPR right-to-erasure) ───────────
// Called from the Clerk webhook handler when a user.deleted event fires.
// Deletes every row the user owns across all tables, then removes
// the users record itself.
export const purgeUserData = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      console.log(`[purgeUserData] No user found for clerkId: ${args.clerkId}`);
      return;
    }

    const userId = user._id;

    // Helper: collect and delete all docs matching a by_userId index
    async function deleteByUserId(table: string) {
      const docs = await (ctx.db as any)
        .query(table)
        .withIndex("by_userId", (q: any) => q.eq("userId", userId))
        .collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      return docs.length;
    }

    let totalDeleted = 0;

    // 1. Transactions
    totalDeleted += await deleteByUserId("transactions");

    // 2. Mono accounts
    totalDeleted += await deleteByUserId("monoAccounts");

    // 3. Manual assets
    totalDeleted += await deleteByUserId("manualAssets");

    // 4. Screenshot imports — also delete remaining storage files
    const imports = await ctx.db
      .query("screenshotImports")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const imp of imports) {
      if (imp.imageStorageId && !imp.imagePurged) {
        try {
          await ctx.storage.delete(imp.imageStorageId as any);
        } catch {
          // Storage file may already be gone; continue
        }
      }
      await ctx.db.delete(imp._id);
    }
    totalDeleted += imports.length;

    // 5. Budgets — collect IDs first so we can delete budget categories
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    const budgetIds = new Set(budgets.map((b) => b._id));
    for (const b of budgets) {
      await ctx.db.delete(b._id);
    }
    totalDeleted += budgets.length;

    // 6. Budget categories — by budgetId (no userId index on this table)
    for (const budgetId of budgetIds) {
      const cats = await ctx.db
        .query("budgetCategories")
        .withIndex("by_budgetId", (q) => q.eq("budgetId", budgetId))
        .collect();
      for (const cat of cats) {
        await ctx.db.delete(cat._id);
      }
      totalDeleted += cats.length;
    }

    // 7. Savings goals
    totalDeleted += await deleteByUserId("savingsGoals");

    // 8. Black Tax entries
    totalDeleted += await deleteByUserId("blackTaxEntries");

    // 9. Japa milestones
    totalDeleted += await deleteByUserId("japaMilestones");

    // 10. AI conversations
    totalDeleted += await deleteByUserId("aiConversations");

    // 11. Notifications
    totalDeleted += await deleteByUserId("notifications");

    // 12. Consent records
    totalDeleted += await deleteByUserId("consentRecords");

    // 13. Net worth snapshots
    totalDeleted += await deleteByUserId("netWorthSnapshots");

    // 14. Analytics events
    totalDeleted += await deleteByUserId("analyticsEvents");

    // 15. Finally, delete the user record itself
    await ctx.db.delete(user._id);
    totalDeleted += 1;

    console.log(
      `[purgeUserData] Deleted ${totalDeleted} records for user ${args.clerkId}`
    );
  },
});

// ── Get consent records for current user ────────────────────────────
export const getConsentRecords = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("consentRecords")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});
