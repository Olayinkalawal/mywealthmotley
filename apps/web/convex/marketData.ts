import { v } from "convex/values";
import { query, internalQuery, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Types ────────────────────────────────────────────────────────────
interface YahooQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  previousClose: number;
}

// ── fetchQuotes: fetch real-time prices from Yahoo Finance v8 ────────
// Yahoo Finance chart API (free, no API key required).
// Endpoint: https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}
export const fetchQuotes = internalAction({
  args: {
    tickers: v.array(v.string()),
  },
  handler: async (_ctx, args): Promise<(YahooQuote | null)[]> => {
    const results: (YahooQuote | null)[] = [];

    // Fetch in parallel, max ~10 concurrent to be polite
    const batchSize = 10;
    for (let i = 0; i < args.tickers.length; i += batchSize) {
      const batch = args.tickers.slice(i, i + batchSize);
      const promises = batch.map(async (ticker): Promise<YahooQuote | null> => {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; WealthMotley/1.0)",
            },
          });

          if (!response.ok) {
            console.error(`Yahoo Finance returned ${response.status} for ${ticker}`);
            return null;
          }

          const data = await response.json();
          const result = data?.chart?.result?.[0];
          if (!result) {
            console.error(`No chart result for ${ticker}`);
            return null;
          }

          const meta = result.meta;
          const price = meta.regularMarketPrice ?? 0;
          const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? 0;
          const change = price - previousClose;
          const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

          return {
            ticker: ticker.toUpperCase(),
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            currency: meta.currency ?? "USD",
            previousClose: Math.round(previousClose * 100) / 100,
          };
        } catch (error) {
          console.error(`Failed to fetch quote for ${ticker}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }

    return results;
  },
});

// ── upsertPriceCache: insert or update a cached price ────────────────
export const upsertPriceCache = internalMutation({
  args: {
    ticker: v.string(),
    price: v.number(),
    change: v.number(),
    changePercent: v.number(),
    currency: v.string(),
    previousClose: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("priceCache")
      .withIndex("by_ticker", (q) => q.eq("ticker", args.ticker))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        price: args.price,
        change: args.change,
        changePercent: args.changePercent,
        currency: args.currency,
        previousClose: args.previousClose,
        fetchedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("priceCache", {
        ticker: args.ticker,
        price: args.price,
        change: args.change,
        changePercent: args.changePercent,
        currency: args.currency,
        previousClose: args.previousClose,
        fetchedAt: Date.now(),
      });
    }
  },
});

// ── refreshPortfolioPrices: update holdings for a given user ─────────
// Looks up manualAssets, extracts tickers, fetches live prices,
// and caches results in the priceCache table.
export const refreshPortfolioPrices = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // 1. Gather all unique tickers from the user's manual assets
    const assets = await ctx.runQuery(
      internal.marketData.getManualAssetTickers,
      { userId: args.userId }
    );

    if (!assets || assets.length === 0) {
      return { success: true, tickersUpdated: 0 };
    }

    // Deduplicate tickers
    const tickerSet = new Set<string>();
    for (const ticker of assets) {
      tickerSet.add(ticker.toUpperCase());
    }
    const tickers = Array.from(tickerSet);

    if (tickers.length === 0) {
      return { success: true, tickersUpdated: 0 };
    }

    // 2. Fetch live quotes
    const quotes = await ctx.runAction(internal.marketData.fetchQuotes, {
      tickers,
    });

    // 3. Cache each successful quote
    let updated = 0;
    for (const quote of quotes) {
      if (quote) {
        await ctx.runMutation(internal.marketData.upsertPriceCache, {
          ticker: quote.ticker,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          currency: quote.currency,
          previousClose: quote.previousClose,
        });
        updated++;
      }
    }

    return { success: true, tickersUpdated: updated };
  },
});

// ── getManualAssetTickers: query helper for refreshPortfolioPrices ────
// Returns an array of ticker strings from a user's manual assets.
export const getManualAssetTickers = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const assets = await ctx.db
      .query("manualAssets")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const tickers: string[] = [];
    for (const asset of assets) {
      if (asset.holdings) {
        for (const holding of asset.holdings) {
          if (holding.ticker) {
            tickers.push(holding.ticker);
          }
        }
      }
    }
    return tickers;
  },
});

// ── refreshAllUserPrices: cron-friendly action to refresh all users ──
// Iterates all users and refreshes their portfolio prices.
export const refreshAllUserPrices = internalAction({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.runQuery(internal.marketData.getAllUserIds, {});

    let totalUpdated = 0;
    for (const userId of allUsers) {
      try {
        const result = await ctx.runAction(
          internal.marketData.refreshPortfolioPrices,
          { userId }
        );
        totalUpdated += result.tickersUpdated;
      } catch (error) {
        console.error(`Failed to refresh prices for user ${userId}:`, error);
      }
    }

    return { success: true, totalTickersUpdated: totalUpdated };
  },
});

// ── getAllUserIds: query helper for cron ──────────────────────────────
export const getAllUserIds = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => u._id);
  },
});

// ── getLatestPrices: return cached prices for given tickers ──────────
// Public query for the frontend to display live prices.
export const getLatestPrices = query({
  args: {
    tickers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const results: Record<
      string,
      {
        price: number;
        change: number;
        changePercent: number;
        currency: string;
        previousClose: number;
        fetchedAt: number;
      } | null
    > = {};

    for (const ticker of args.tickers) {
      const cached = await ctx.db
        .query("priceCache")
        .withIndex("by_ticker", (q) => q.eq("ticker", ticker.toUpperCase()))
        .first();

      if (cached) {
        results[ticker.toUpperCase()] = {
          price: cached.price,
          change: cached.change,
          changePercent: cached.changePercent,
          currency: cached.currency,
          previousClose: cached.previousClose,
          fetchedAt: cached.fetchedAt,
        };
      } else {
        results[ticker.toUpperCase()] = null;
      }
    }

    return results;
  },
});
