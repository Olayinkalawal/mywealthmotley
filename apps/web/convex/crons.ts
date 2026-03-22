import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ── Refresh exchange rates every 6 hours ────────────────────────────
// Currency-API free tier allows frequent requests; we refresh for
// NGN, GBP, USD, CAD, EUR, AED, ZAR, GHS, KES pairs.
crons.interval(
  "refresh-exchange-rates",
  { hours: 6 },
  internal.exchangeRates.refreshRates,
  { baseCurrency: "USD" }
);

// Sync Mono transactions daily at 2:00 UTC
crons.daily(
  "sync-mono-transactions",
  { hourUTC: 2, minuteUTC: 0 },
  internal.mono.syncAllAccounts,
  {}
);

// Data retention: anonymize old transactions & purge stale screenshot imports
// Runs daily at 3:30 UTC (NDPA / UK GDPR compliance)
crons.daily(
  "data-retention",
  { hourUTC: 3, minuteUTC: 30 },
  internal.dataRetention.runDailyRetention,
  {}
);

// ── Refresh stock/ETF prices every 30 minutes ──────────────────────
// Fetches live prices from Yahoo Finance for all users' holdings
// and caches them in the priceCache table.
crons.interval(
  "refresh-market-prices",
  { minutes: 30 },
  internal.marketData.refreshAllUserPrices,
  {}
);

// ── Refresh financial news every 6 hours ────────────────────────────
// Fetches real news from NewsData.io / GNews.io (if API key is set)
// or falls back to curated mock data.
crons.interval(
  "refresh-financial-news",
  { hours: 6 },
  internal.financialNews.fetchFinancialNews,
  {}
);

// Weekly email digest — every Monday at 9:00 UTC
// Sends a summary of budget status, savings progress, and a motivational tip
// to all users active within the last 30 days (capped at 50 per run for Resend free tier).
crons.weekly(
  "weekly-email-digest",
  { dayOfWeek: "monday", hourUTC: 9, minuteUTC: 0 },
  internal.email.sendWeeklyDigests,
  {}
);

// TODO: Generate daily net worth snapshots
// crons.daily(
//   "net-worth-snapshots",
//   { hourUTC: 3, minuteUTC: 0 },
//   internal.netWorth.generateDailySnapshots,
//   {}
// );

// TODO: Check for expiring subscriptions
// crons.daily(
//   "subscription-expiry-check",
//   { hourUTC: 8, minuteUTC: 0 },
//   internal.subscriptions.checkExpiring,
//   {}
// );

export default crons;
