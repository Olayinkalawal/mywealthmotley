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

// ── Get paginated transactions with optional date range filter ──────
export const getTransactions = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    accountId: v.optional(v.id("monoAccounts")),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { transactions: [], hasMore: false, nextCursor: undefined };
    const pageSize = args.limit ?? 50;

    let txQuery;

    if (args.accountId) {
      txQuery = ctx.db
        .query("transactions")
        .withIndex("by_accountId", (q: any) => q.eq("accountId", args.accountId));
    } else {
      txQuery = ctx.db
        .query("transactions")
        .withIndex("by_userId_date", (q: any) => {
          let built = q.eq("userId", user._id);
          if (args.startDate) {
            built = built.gte("date", args.startDate);
          }
          if (args.endDate) {
            built = built.lte("date", args.endDate);
          }
          return built;
        });
    }

    const results = await txQuery.order("desc").take(pageSize + 1);

    const hasMore = results.length > pageSize;
    const page = hasMore ? results.slice(0, pageSize) : results;

    return {
      transactions: page,
      hasMore,
      nextCursor: hasMore ? page[page.length - 1]?._id : undefined,
    };
  },
});

// ── Get transactions grouped by effective category ──────────────────
export const getTransactionsByCategory = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    let txQuery = ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q: any) => {
        let built = q.eq("userId", user._id);
        if (args.startDate) {
          built = built.gte("date", args.startDate);
        }
        if (args.endDate) {
          built = built.lte("date", args.endDate);
        }
        return built;
      });

    const transactions = await txQuery.collect();

    const grouped: Record<string, { category: string; total: number; count: number; transactions: typeof transactions }> = {};

    for (const tx of transactions) {
      const cat = tx.effectiveCategory;
      if (!grouped[cat]) {
        grouped[cat] = { category: cat, total: 0, count: 0, transactions: [] };
      }
      grouped[cat]!.total += tx.amount;
      grouped[cat]!.count += 1;
      grouped[cat]!.transactions.push(tx);
    }

    return Object.values(grouped).sort((a, b) => b.total - a.total);
  },
});

// ── Get spending summary for a period ───────────────────────────────
export const getSpendingSummary = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_date", (q: any) =>
        q.eq("userId", user._id).gte("date", args.startDate).lte("date", args.endDate)
      )
      .collect();

    let totalIncome = 0;
    let totalSpending = 0;

    for (const tx of transactions) {
      if (tx.type === "credit") {
        totalIncome += tx.amount;
      } else {
        totalSpending += tx.amount;
      }
    }

    const savings = totalIncome - totalSpending;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalSpending,
      savings,
      savingsRate,
      transactionCount: transactions.length,
      currency: user.currency,
    };
  },
});

// ── User category override (Layer 3) ────────────────────────────────
export const categorizeTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction || transaction.userId !== user._id) {
      throw new Error("Transaction not found");
    }

    await ctx.db.patch(args.transactionId, {
      userCategory: args.category,
      effectiveCategory: args.category, // User override takes precedence
    });
  },
});
