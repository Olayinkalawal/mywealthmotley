import { v } from "convex/values";
import { query, action, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Get exchange rate between two currencies ────────────────────────
export const getRate = query({
  args: {
    baseCurrency: v.string(),
    targetCurrency: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.baseCurrency === args.targetCurrency) {
      return { rate: 1, source: "identity", fetchedAt: Date.now() };
    }

    const rateRecord = await ctx.db
      .query("exchangeRates")
      .withIndex("by_currencies", (q) =>
        q.eq("baseCurrency", args.baseCurrency).eq("targetCurrency", args.targetCurrency)
      )
      .order("desc")
      .first();

    if (!rateRecord) {
      // Try inverse
      const inverse = await ctx.db
        .query("exchangeRates")
        .withIndex("by_currencies", (q) =>
          q.eq("baseCurrency", args.targetCurrency).eq("targetCurrency", args.baseCurrency)
        )
        .order("desc")
        .first();

      if (inverse) {
        return {
          rate: 1 / inverse.rate,
          source: `${inverse.source} (inverse)`,
          fetchedAt: inverse.fetchedAt,
        };
      }

      return null; // No rate available
    }

    return {
      rate: rateRecord.rate,
      source: rateRecord.source,
      fetchedAt: rateRecord.fetchedAt,
    };
  },
});

// ── Convert an amount between currencies (query helper) ─────────────
export const convertAmount = query({
  args: {
    amount: v.number(),
    fromCurrency: v.string(),
    toCurrency: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.fromCurrency === args.toCurrency) {
      return { converted: args.amount, rate: 1 };
    }

    const rateRecord = await ctx.db
      .query("exchangeRates")
      .withIndex("by_currencies", (q) =>
        q.eq("baseCurrency", args.fromCurrency).eq("targetCurrency", args.toCurrency)
      )
      .order("desc")
      .first();

    if (rateRecord) {
      return {
        converted: args.amount * rateRecord.rate,
        rate: rateRecord.rate,
      };
    }

    // Try inverse
    const inverse = await ctx.db
      .query("exchangeRates")
      .withIndex("by_currencies", (q) =>
        q.eq("baseCurrency", args.toCurrency).eq("targetCurrency", args.fromCurrency)
      )
      .order("desc")
      .first();

    if (inverse) {
      const rate = 1 / inverse.rate;
      return { converted: args.amount * rate, rate };
    }

    return { converted: args.amount, rate: 1 }; // Fallback
  },
});

// ── Internal mutation to upsert exchange rates ──────────────────────
export const upsertRate = internalMutation({
  args: {
    baseCurrency: v.string(),
    targetCurrency: v.string(),
    rate: v.number(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exchangeRates")
      .withIndex("by_currencies", (q) =>
        q.eq("baseCurrency", args.baseCurrency).eq("targetCurrency", args.targetCurrency)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rate: args.rate,
        source: args.source,
        fetchedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("exchangeRates", {
        baseCurrency: args.baseCurrency,
        targetCurrency: args.targetCurrency,
        rate: args.rate,
        source: args.source,
        fetchedAt: Date.now(),
      });
    }
  },
});

// ── Action: fetch FX rates from external API ────────────────────────
// Uses Currency-API (https://github.com/fawazahmed0/exchange-api)
// This is an internal ACTION because it's called by cron jobs and HTTP actions.
export const refreshRates = internalAction({
  args: {
    baseCurrency: v.optional(v.string()), // defaults to "USD"
  },
  handler: async (ctx, args) => {
    const base = (args.baseCurrency ?? "USD").toLowerCase();
    const targetCurrencies = ["ngn", "gbp", "usd", "cad", "eur", "aed", "zar", "ghs", "kes"];

    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`
      );

      if (!response.ok) {
        throw new Error(`Currency API returned ${response.status}`);
      }

      const data = await response.json();
      const rates = data[base];

      if (!rates) {
        throw new Error(`No rates found for ${base}`);
      }

      // Upsert each target currency rate
      for (const target of targetCurrencies) {
        if (target === base) continue;
        const rate = rates[target];
        if (rate !== undefined) {
          await ctx.runMutation(internal.exchangeRates.upsertRate, {
            baseCurrency: base.toUpperCase(),
            targetCurrency: target.toUpperCase(),
            rate,
            source: "currency-api",
          });
        }
      }

      return { success: true, ratesUpdated: targetCurrencies.length - 1 };
    } catch (error) {
      // Fallback to Frankfurter API (no NGN support, but covers major currencies)
      try {
        const targets = targetCurrencies
          .filter((c) => c !== base && c !== "ngn" && c !== "ghs" && c !== "kes")
          .map((c) => c.toUpperCase())
          .join(",");

        const response = await fetch(
          `https://api.frankfurter.app/latest?from=${base.toUpperCase()}&to=${targets}`
        );

        if (!response.ok) {
          throw new Error(`Frankfurter API returned ${response.status}`);
        }

        const data = await response.json();

        for (const [currency, rate] of Object.entries(data.rates as Record<string, number>)) {
          await ctx.runMutation(internal.exchangeRates.upsertRate, {
            baseCurrency: base.toUpperCase(),
            targetCurrency: currency,
            rate,
            source: "frankfurter",
          });
        }

        return { success: true, ratesUpdated: Object.keys(data.rates).length, fallback: true };
      } catch (fallbackError) {
        const message = fallbackError instanceof Error ? fallbackError.message : "Unknown error";
        return { success: false, error: message };
      }
    }
  },
});
