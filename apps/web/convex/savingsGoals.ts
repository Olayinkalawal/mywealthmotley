import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Helper: resolve the current user from auth ──────────────────────
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();

  return user; // may be null if user not in DB yet
}

// ── Get all savings goals for the current user ──────────────────────
export const getGoals = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const goals = await ctx.db
      .query("savingsGoals")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    return goals;
  },
});

// ── Create a new savings goal ───────────────────────────────────────
export const createGoal = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    currency: v.string(),
    targetDate: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isLocked: v.boolean(),
    lockUntil: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const goalId = await ctx.db.insert("savingsGoals", {
      userId: user._id,
      name: args.name,
      targetAmount: args.targetAmount,
      currentAmount: 0,
      currency: args.currency,
      targetDate: args.targetDate,
      icon: args.icon,
      color: args.color,
      isLocked: args.isLocked,
      lockUntil: args.lockUntil,
      createdAt: Date.now(),
    });

    return goalId;
  },
});

// ── Update a savings goal ───────────────────────────────────────────
export const updateGoal = mutation({
  args: {
    goalId: v.id("savingsGoals"),
    name: v.optional(v.string()),
    targetAmount: v.optional(v.number()),
    currentAmount: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isLocked: v.optional(v.boolean()),
    lockUntil: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Savings goal not found");
    }

    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.targetAmount !== undefined) updates.targetAmount = args.targetAmount;
    if (args.currentAmount !== undefined) updates.currentAmount = args.currentAmount;
    if (args.targetDate !== undefined) updates.targetDate = args.targetDate;
    if (args.icon !== undefined) updates.icon = args.icon;
    if (args.color !== undefined) updates.color = args.color;
    if (args.isLocked !== undefined) updates.isLocked = args.isLocked;
    if (args.lockUntil !== undefined) updates.lockUntil = args.lockUntil;

    await ctx.db.patch(args.goalId, updates);
  },
});

// ── Delete a savings goal ───────────────────────────────────────────
export const deleteGoal = mutation({
  args: {
    goalId: v.id("savingsGoals"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Savings goal not found");
    }

    await ctx.db.delete(args.goalId);
  },
});
