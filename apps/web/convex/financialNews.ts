import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

// ── Helper: get current user from auth identity ─────────────────────
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

// ── Get latest news items for a region (+ global) ───────────────────
// Returns the 10 most recent items matching the user's region or "global".
// If no user is authenticated, returns the 10 most recent across all regions.
export const getLatestNews = query({
  args: {
    region: v.optional(v.string()), // "NG" | "GB" | "US" | "global"
  },
  handler: async (ctx, args) => {
    // Try to infer region from the authenticated user
    let region = args.region;
    if (!region) {
      const user = await getCurrentUser(ctx);
      if (user) {
        region = user.country; // e.g. "NG", "GB", "US"
      }
    }

    if (region && region !== "global") {
      // Fetch region-specific + global news, sorted by publishedAt desc
      const regionNews = await ctx.db
        .query("financialNews")
        .withIndex("by_region", (q) => q.eq("region", region!))
        .order("desc")
        .take(10);

      const globalNews = await ctx.db
        .query("financialNews")
        .withIndex("by_region", (q) => q.eq("region", "global"))
        .order("desc")
        .take(10);

      // Merge, deduplicate, sort by publishedAt desc, take 10
      const merged = [...regionNews, ...globalNews];
      const seen = new Set<string>();
      const unique = merged.filter((item) => {
        if (seen.has(item._id)) return false;
        seen.add(item._id);
        return true;
      });
      unique.sort((a, b) => b.publishedAt - a.publishedAt);
      return unique.slice(0, 10);
    }

    // No region filter: return latest 10 across all regions
    return await ctx.db
      .query("financialNews")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(10);
  },
});

// ── Seed curated/mock news items ────────────────────────────────────
// Internal mutation for populating the table with editorial content.
// Called from the Convex dashboard or a cron job, not from the client.
export const seedNewsItems = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const items = [
      {
        title: "FGN Bonds Currently Yielding 18.5%",
        summary:
          "The Nigerian government is offering savings bonds at 18.5% annual yield. This is a fixed-income option where the government borrows money from you and pays it back with interest. Think of it like lending money to the government.",
        region: "NG",
        category: "bonds",
        source: "DMO",
        publishedAt: now,
      },
      {
        title: "Bank of England Holds Interest Rate at 4.5%",
        summary:
          "The UK central bank kept interest rates steady. This means savings accounts and mortgage rates stay roughly the same for now. If you have a variable rate mortgage, no change to your payments.",
        region: "GB",
        category: "policy",
        source: "Bank of England",
        publishedAt: now - 1 * 60 * 60 * 1000, // 1 hour ago
      },
      {
        title: "S&P 500 Up 12% Year-to-Date",
        summary:
          "The 500 biggest US companies have grown 12% in value this year on average. If you hold a global equity index fund, this is part of what's driving your returns.",
        region: "global",
        category: "markets",
        source: "Market Data",
        publishedAt: now - 2 * 60 * 60 * 1000,
      },
      {
        title: "CBN Lifts Restrictions on Crypto Trading",
        summary:
          "The Central Bank of Nigeria has eased restrictions on cryptocurrency trading through licensed exchanges. This means Nigerians can now more easily buy and sell crypto through regulated platforms.",
        region: "NG",
        category: "crypto",
        source: "CBN",
        publishedAt: now - 3 * 60 * 60 * 1000,
      },
      {
        title: "UK ISA Allowance Remains \u00A320,000",
        summary:
          "You can still invest up to \u00A320,000 per year in your ISA tax-free. Any gains, dividends, or interest earned inside your ISA are completely tax-free. If you haven't maxed yours out, consider it.",
        region: "GB",
        category: "savings",
        source: "HMRC",
        publishedAt: now - 4 * 60 * 60 * 1000,
      },
      {
        title: "Nigerian Stock Exchange Gains 8% in Q1",
        summary:
          "The Nigerian stock market has risen 8% since January. Companies listed on the exchange are collectively worth more than they were at the start of the year. This affects anyone holding Nigerian equities.",
        region: "NG",
        category: "markets",
        source: "NGX",
        publishedAt: now - 5 * 60 * 60 * 1000,
      },
      {
        title: "UK Gilt Yields Reach 4.2%",
        summary:
          "UK government bonds (gilts) are now paying 4.2% annually. Gilts are considered one of the safest investments because they are backed by the UK government. The yield tells you how much you earn each year.",
        region: "GB",
        category: "bonds",
        source: "Bank of England",
        publishedAt: now - 6 * 60 * 60 * 1000,
      },
      {
        title: "Global Inflation Continues to Ease",
        summary:
          "Prices are rising more slowly across most major economies. This is generally good news for your purchasing power and could lead central banks to lower interest rates, which tends to boost investment returns.",
        region: "global",
        category: "policy",
        source: "IMF",
        publishedAt: now - 7 * 60 * 60 * 1000,
      },
    ];

    for (const item of items) {
      await ctx.db.insert("financialNews", item);
    }

    return { inserted: items.length };
  },
});
