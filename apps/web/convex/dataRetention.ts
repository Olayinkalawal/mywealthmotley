import { internalMutation } from "./_generated/server";

// ── Daily data retention: anonymize old transactions & purge stale imports ──
// NDPA / UK GDPR compliance: transaction narrations and merchant info
// older than 12 months are anonymized. Screenshot import metadata where
// the image has already been purged is cleaned up after 90 days.
export const runDailyRetention = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date();

    // ── 1. Anonymize transactions older than 12 months ─────────────
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const cutoffDate = twelveMonthsAgo.toISOString().slice(0, 10); // "YYYY-MM-DD"

    let transactionsAnonymized = 0;

    // Scan all transactions — Convex doesn't support range queries on
    // non-indexed fields, so we iterate and filter by date string comparison.
    const allTransactions = await ctx.db.query("transactions").collect();
    for (const tx of allTransactions) {
      // tx.date is ISO "YYYY-MM-DD"; lexicographic comparison works correctly
      if (tx.date < cutoffDate && tx.narration !== "Archived transaction") {
        await ctx.db.patch(tx._id, {
          narration: "Archived transaction",
          merchant: undefined,
          monoCategory: undefined,
          ruleCategory: undefined,
          userCategory: undefined,
          monoTransactionId: `archived_${tx._id}`,
          balance: undefined,
          amountConverted: undefined,
          fxRateAtDate: undefined,
          channel: undefined,
        });
        transactionsAnonymized++;
      }
    }

    // ── 2. Delete screenshot import records older than 90 days ─────
    //    Only those where imagePurged is already true (image gone from storage).
    const ninetyDaysAgo = now.getTime() - 90 * 24 * 60 * 60 * 1000;

    let importsDeleted = 0;

    const allImports = await ctx.db.query("screenshotImports").collect();
    for (const imp of allImports) {
      if (imp.imagePurged === true && imp.createdAt < ninetyDaysAgo) {
        await ctx.db.delete(imp._id);
        importsDeleted++;
      }
    }

    console.log(
      `[data-retention] Anonymized ${transactionsAnonymized} transactions, ` +
        `deleted ${importsDeleted} stale screenshot imports`
    );
  },
});
