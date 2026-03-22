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

// ── Get current month's budget ──────────────────────────────────────
export const getCurrentBudget = query({
  args: {
    month: v.optional(v.string()), // "2026-03" format; defaults to current month
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const month = args.month ?? new Date().toISOString().slice(0, 7);

    const budget = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q: any) =>
        q.eq("userId", user._id).eq("month", month)
      )
      .unique();

    if (!budget) {
      return null;
    }

    // Fetch associated categories
    const categories = await ctx.db
      .query("budgetCategories")
      .withIndex("by_budgetId", (q: any) => q.eq("budgetId", budget._id))
      .collect();

    const totalAllocated = categories.reduce((sum: number, c: any) => sum + c.allocated, 0);
    const totalSpent = categories.reduce((sum: number, c: any) => sum + c.spent, 0);

    return {
      ...budget,
      categories,
      totalAllocated,
      totalSpent,
      remaining: budget.totalIncome - totalSpent,
      unallocated: budget.totalIncome - totalAllocated,
    };
  },
});

// ── Create a new monthly budget ─────────────────────────────────────
export const createBudget = mutation({
  args: {
    month: v.string(),
    mode: v.string(), // "flex" | "zero_based"
    totalIncome: v.number(),
    currency: v.string(),
    categories: v.array(
      v.object({
        name: v.string(),
        allocated: v.number(),
        color: v.optional(v.string()),
        icon: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    // Check if budget already exists for this month
    const existing = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q: any) =>
        q.eq("userId", user._id).eq("month", args.month)
      )
      .unique();

    if (existing) {
      throw new Error(`Budget already exists for ${args.month}. Update it instead.`);
    }

    const now = Date.now();

    const budgetId = await ctx.db.insert("budgets", {
      userId: user._id,
      month: args.month,
      mode: args.mode,
      totalIncome: args.totalIncome,
      currency: args.currency,
      createdAt: now,
      updatedAt: now,
    });

    // Create category allocations
    for (const cat of args.categories) {
      await ctx.db.insert("budgetCategories", {
        userId: user._id,
        budgetId,
        name: cat.name,
        allocated: cat.allocated,
        spent: 0,
        color: cat.color,
        icon: cat.icon,
      });
    }

    return budgetId;
  },
});

// ── Update a budget category (allocation or spent) ──────────────────
export const updateBudgetCategory = mutation({
  args: {
    categoryId: v.id("budgetCategories"),
    allocated: v.optional(v.number()),
    spent: v.optional(v.number()),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== user._id) {
      throw new Error("Budget category not found");
    }

    const updates: Record<string, any> = {};

    if (args.allocated !== undefined) updates.allocated = args.allocated;
    if (args.spent !== undefined) updates.spent = args.spent;
    if (args.name !== undefined) updates.name = args.name;
    if (args.color !== undefined) updates.color = args.color;
    if (args.icon !== undefined) updates.icon = args.icon;

    await ctx.db.patch(args.categoryId, updates);

    // Also update the parent budget's updatedAt
    await ctx.db.patch(category.budgetId, { updatedAt: Date.now() });
  },
});
