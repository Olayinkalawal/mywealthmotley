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

// ── Get black tax entries with optional date range ──────────────────
export const getEntries = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const entries = await ctx.db
      .query("blackTaxEntries")
      .withIndex("by_userId_date", (q: any) => {
        let built = q.eq("userId", user._id);
        if (args.startDate) {
          built = built.gte("date", args.startDate);
        }
        if (args.endDate) {
          built = built.lte("date", args.endDate);
        }
        return built;
      })
      .order("desc")
      .collect();

    return entries;
  },
});

// ── Get summary: totals by relationship, category, and % of income ──
export const getSummary = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    totalIncome: v.optional(v.number()), // Pass in for % calculation
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const entries = await ctx.db
      .query("blackTaxEntries")
      .withIndex("by_userId_date", (q: any) =>
        q.eq("userId", user._id).gte("date", args.startDate).lte("date", args.endDate)
      )
      .collect();

    let total = 0;
    const byRelationship: Record<string, { relationship: string; total: number; count: number }> = {};
    const byCategory: Record<string, { category: string; total: number; count: number }> = {};

    for (const entry of entries) {
      total += entry.amount;

      // Group by relationship
      if (!byRelationship[entry.relationship]) {
        byRelationship[entry.relationship] = { relationship: entry.relationship, total: 0, count: 0 };
      }
      const relEntry = byRelationship[entry.relationship];
      if (relEntry) {
        relEntry.total += entry.amount;
        relEntry.count += 1;
      }

      // Group by category
      if (!byCategory[entry.category]) {
        byCategory[entry.category] = { category: entry.category, total: 0, count: 0 };
      }
      const catEntry = byCategory[entry.category];
      if (catEntry) {
        catEntry.total += entry.amount;
        catEntry.count += 1;
      }
    }

    const percentageOfIncome = args.totalIncome && args.totalIncome > 0
      ? (total / args.totalIncome) * 100
      : null;

    return {
      total,
      entryCount: entries.length,
      percentageOfIncome,
      byRelationship: Object.values(byRelationship).sort((a, b) => b.total - a.total),
      byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total),
      currency: user.currency,
    };
  },
});

// ── Add a new black tax entry ───────────────────────────────────────
export const addEntry = mutation({
  args: {
    recipientName: v.string(),
    relationship: v.string(),
    amount: v.number(),
    currency: v.string(),
    date: v.string(),
    category: v.string(),
    note: v.optional(v.string()),
    isRecurring: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    return await ctx.db.insert("blackTaxEntries", {
      userId: user._id,
      recipientName: args.recipientName,
      relationship: args.relationship,
      amount: args.amount,
      currency: args.currency,
      date: args.date,
      category: args.category,
      note: args.note,
      isRecurring: args.isRecurring,
    });
  },
});

// ── Delete a black tax entry ────────────────────────────────────────
export const deleteEntry = mutation({
  args: {
    entryId: v.id("blackTaxEntries"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.userId !== user._id) {
      throw new Error("Entry not found");
    }

    await ctx.db.delete(args.entryId);
  },
});
