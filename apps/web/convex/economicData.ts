import { v } from "convex/values";
import { query, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Types ────────────────────────────────────────────────────────────

interface FREDObservation {
  date: string;
  value: string;
}

interface FREDResponse {
  observations?: FREDObservation[];
}

// ── Indicator configuration ─────────────────────────────────────────

const INDICATOR_CONFIG = [
  {
    indicator: "US_10Y_YIELD",
    fredSeriesId: "DGS10",
    label: "US 10-Year Treasury Yield",
    unit: "%",
    fallbackValue: 4.25,
    fallbackDate: "2026-03-20",
  },
  {
    indicator: "FED_RATE",
    fredSeriesId: "FEDFUNDS",
    label: "Federal Funds Rate",
    unit: "%",
    fallbackValue: 5.25,
    fallbackDate: "2026-03-01",
  },
  {
    indicator: "US_CPI",
    fredSeriesId: "CPIAUCSL",
    label: "US Consumer Price Index",
    unit: "index",
    fallbackValue: 316.6,
    fallbackDate: "2026-02-01",
  },
  {
    indicator: "NG_INFLATION",
    fredSeriesId: null, // No FRED series; use static/CBN data
    label: "Nigerian Inflation Rate",
    unit: "%",
    fallbackValue: 33.2,
    fallbackDate: "2026-02-01",
  },
  {
    indicator: "UK_BASE_RATE",
    fredSeriesId: null, // No FRED series; use static/BoE data
    label: "UK Base Rate",
    unit: "%",
    fallbackValue: 4.5,
    fallbackDate: "2026-03-01",
  },
] as const;

// ── Static fallback data ────────────────────────────────────────────
// Used when no FRED_API_KEY is configured. Values reflect latest
// publicly available data as of March 2026.

const FALLBACK_INDICATORS = INDICATOR_CONFIG.map((cfg) => ({
  indicator: cfg.indicator,
  value: cfg.fallbackValue,
  unit: cfg.unit,
  label: cfg.label,
  source: cfg.fredSeriesId ? "FRED (fallback)" : "Manual estimate",
  date: cfg.fallbackDate,
}));

// ── Query: get all current indicators ───────────────────────────────

export const getIndicators = query({
  args: {},
  handler: async (ctx) => {
    const indicators = await ctx.db
      .query("economicIndicators")
      .withIndex("by_indicator")
      .collect();

    // If no data in the table yet, return nothing (UI uses its own defaults)
    if (indicators.length === 0) {
      return null;
    }

    return indicators;
  },
});

// ── Internal mutation: upsert a single indicator ────────────────────

export const upsertIndicator = internalMutation({
  args: {
    indicator: v.string(),
    value: v.number(),
    unit: v.string(),
    label: v.string(),
    source: v.string(),
    date: v.string(),
    fetchedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find existing entry for this indicator
    const existing = await ctx.db
      .query("economicIndicators")
      .withIndex("by_indicator", (q) => q.eq("indicator", args.indicator))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        unit: args.unit,
        label: args.label,
        source: args.source,
        date: args.date,
        fetchedAt: args.fetchedAt,
      });
      return { updated: true };
    }

    await ctx.db.insert("economicIndicators", {
      indicator: args.indicator,
      value: args.value,
      unit: args.unit,
      label: args.label,
      source: args.source,
      date: args.date,
      fetchedAt: args.fetchedAt,
    });
    return { inserted: true };
  },
});

// ── Fetch from FRED API ─────────────────────────────────────────────

async function fetchFREDSeries(
  apiKey: string,
  seriesId: string,
): Promise<{ value: number; date: string } | null> {
  try {
    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=${seriesId}` +
      `&api_key=${apiKey}` +
      `&file_type=json` +
      `&sort_order=desc` +
      `&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`FRED API returned ${response.status} for ${seriesId}`);
      return null;
    }

    const data: FREDResponse = await response.json();
    const obs = data.observations?.[0];
    if (!obs || obs.value === ".") {
      // FRED uses "." for missing values
      return null;
    }

    return {
      value: parseFloat(obs.value),
      date: obs.date,
    };
  } catch (error) {
    console.error(`FRED fetch error for ${seriesId}:`, error);
    return null;
  }
}

// ── Main fetcher action ─────────────────────────────────────────────
// Called by the daily cron. Fetches from FRED if API key is available,
// otherwise seeds with static fallback data.

export const fetchEconomicIndicators = internalAction({
  args: {},
  handler: async (ctx) => {
    const fredApiKey = process.env.FRED_API_KEY;
    const now = Date.now();
    let totalUpdated = 0;

    if (fredApiKey) {
      // ── Fetch FRED-backed indicators ──────────────────────────
      for (const cfg of INDICATOR_CONFIG) {
        let value: number;
        let date: string;
        let source: string;

        if (cfg.fredSeriesId) {
          const result = await fetchFREDSeries(fredApiKey, cfg.fredSeriesId);
          if (result) {
            value = result.value;
            date = result.date;
            source = "FRED";
          } else {
            // FRED fetch failed; use fallback
            value = cfg.fallbackValue;
            date = cfg.fallbackDate;
            source = "FRED (fallback)";
          }
        } else {
          // Non-FRED indicators (NG inflation, UK base rate)
          value = cfg.fallbackValue;
          date = cfg.fallbackDate;
          source =
            cfg.indicator === "NG_INFLATION"
              ? "CBN"
              : cfg.indicator === "UK_BASE_RATE"
                ? "Bank of England"
                : "Manual estimate";
        }

        await ctx.runMutation(internal.economicData.upsertIndicator, {
          indicator: cfg.indicator,
          value,
          unit: cfg.unit,
          label: cfg.label,
          source,
          date,
          fetchedAt: now,
        });
        totalUpdated++;
      }

      return {
        success: true,
        source: "FRED",
        updated: totalUpdated,
      };
    }

    // ── No API key: seed with fallback data ───────────────────────
    console.log(
      "No FRED_API_KEY found. Seeding economic indicators with static fallback data."
    );

    for (const fb of FALLBACK_INDICATORS) {
      await ctx.runMutation(internal.economicData.upsertIndicator, {
        indicator: fb.indicator,
        value: fb.value,
        unit: fb.unit,
        label: fb.label,
        source: fb.source,
        date: fb.date,
        fetchedAt: now,
      });
      totalUpdated++;
    }

    return {
      success: true,
      source: "static-fallback",
      updated: totalUpdated,
    };
  },
});
