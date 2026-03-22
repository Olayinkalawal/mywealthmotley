import { v } from "convex/values";
import { query } from "./_generated/server";

// ── Admin email allowlist (MVP) ────────────────────────────────────────
const ADMIN_EMAILS = [
  "headhoncho03@gmail.com",
  "solafunmi@wealthmotley.com",
];

// ── Helper: verify the caller is an admin ──────────────────────────────
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found");
  if (!ADMIN_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  return user;
}

// ── 1. getDashboardStats ───────────────────────────────────────────────
// Returns aggregate counts for the admin overview dashboard.
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // --- Users ---
    const allUsers = await ctx.db.query("users").collect();
    const totalUsers = allUsers.length;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const activeUsers = allUsers.filter(
      (u: any) => u.lastActiveAt && u.lastActiveAt > thirtyDaysAgo
    ).length;

    // Group by country
    const usersByCountry: Record<string, number> = {};
    for (const u of allUsers) {
      const country = (u as any).country ?? "Unknown";
      usersByCountry[country] = (usersByCountry[country] ?? 0) + 1;
    }

    // Group by subscription tier
    const usersByTier: Record<string, number> = {};
    for (const u of allUsers) {
      const tier = (u as any).subscriptionTier ?? "free";
      usersByTier[tier] = (usersByTier[tier] ?? 0) + 1;
    }

    // --- Budgets ---
    const allBudgets = await ctx.db.query("budgets").collect();
    const totalBudgets = allBudgets.length;

    // --- AI Conversations ---
    const allConversations = await ctx.db.query("aiConversations").collect();
    const totalConversations = allConversations.length;

    return {
      totalUsers,
      activeUsers,
      usersByCountry,
      usersByTier,
      totalBudgets,
      totalConversations,
    };
  },
});

// ── 2. getRecentUsers ──────────────────────────────────────────────────
// Returns the 20 most recently created users.
export const getRecentUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").order("desc").take(20);

    return users.map((u: any) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      country: u.country,
      subscriptionTier: u.subscriptionTier,
      subscriptionStatus: u.subscriptionStatus,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
      onboardingCompleted: u.onboardingCompleted,
      imageUrl: u.imageUrl,
    }));
  },
});

// ── 3. getUserDetail ───────────────────────────────────────────────────
// Returns full user record plus counts of related resources.
export const getUserDetail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Budget count
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    // Savings goals count
    const savingsGoals = await ctx.db
      .query("savingsGoals")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    // AI conversation count
    const conversations = await ctx.db
      .query("aiConversations")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    // Notification count
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    return {
      ...user,
      budgetCount: budgets.length,
      savingsGoalsCount: savingsGoals.length,
      conversationCount: conversations.length,
      notificationCount: notifications.length,
    };
  },
});

// ── 4. getRecentActivity ───────────────────────────────────────────────
// Returns latest audit log entries and notifications for the activity feed.
export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    // Latest 20 audit log entries (newest first, via by_timestamp index)
    const auditLogs = await ctx.db
      .query("adminAuditLog")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);

    // Latest 20 notifications across all users (newest first)
    const notifications = await ctx.db
      .query("notifications")
      .order("desc")
      .take(20);

    return {
      auditLogs,
      notifications,
    };
  },
});

// ── 5. getContentItems ─────────────────────────────────────────────────
// Returns all financialNews items for content management.
export const getContentItems = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query("financialNews")
      .withIndex("by_publishedAt")
      .order("desc")
      .collect();
  },
});
