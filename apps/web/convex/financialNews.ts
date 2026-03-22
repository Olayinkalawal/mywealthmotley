import { v } from "convex/values";
import { query, internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

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

// ── Category classification ──────────────────────────────────────────
// Simple keyword-based categorization for news articles.
function classifyCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (/\b(bond|gilt|treasury|yield|fixed.?income|fgn)\b/.test(text)) return "bonds";
  if (/\b(crypto|bitcoin|btc|ethereum|eth|blockchain|defi|nft)\b/.test(text)) return "crypto";
  if (/\b(central.?bank|interest.?rate|monetary.?policy|inflation|cbn|boe|fed|regulation)\b/.test(text)) return "policy";
  if (/\b(sav(e|ing)|deposit|isa|pension|retirement|401k)\b/.test(text)) return "savings";
  if (/\b(stock|equity|market|index|s&p|nasdaq|ftse|ngx|share|ipo|etf|fund)\b/.test(text)) return "markets";

  return "general";
}

// ── Region detection ─────────────────────────────────────────────────
function detectRegion(title: string, description: string, sourceCountry?: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Check explicit country references
  if (/\b(nigeria|naira|ngn|cbn|lagos|abuja|nse|ngx|nairametrics)\b/.test(text)) return "NG";
  if (/\b(uk|britain|british|london|sterling|gbp|ftse|bank.?of.?england|gilt)\b/.test(text)) return "GB";
  if (/\b(us|american|wall.?street|fed|nasdaq|s&p|dow.?jones|dollar)\b/.test(text)) return "US";

  // Use source country if available
  if (sourceCountry) {
    const countryMap: Record<string, string> = {
      nigeria: "NG", ng: "NG",
      "united kingdom": "GB", gb: "GB", uk: "GB",
      "united states": "US", us: "US",
    };
    const mapped = countryMap[sourceCountry.toLowerCase()];
    if (mapped) return mapped;
  }

  return "global";
}

// ── Clean/humanize article summary ───────────────────────────────────
function humanizeSummary(title: string, rawDescription: string): string {
  let summary = rawDescription || title;

  // Strip HTML tags
  summary = summary.replace(/<[^>]*>/g, "");
  // Strip excessive whitespace
  summary = summary.replace(/\s+/g, " ").trim();
  // Remove "Read more..." type suffixes
  summary = summary.replace(/\s*read\s*more\.?\.?\.?\s*$/i, "");
  // Remove "[+NNN chars]" type artifacts
  summary = summary.replace(/\s*\[\+?\d+\s*chars?\]\s*/gi, "");
  // Truncate to ~300 chars if too long
  if (summary.length > 300) {
    summary = summary.substring(0, 297) + "...";
  }

  return summary || title;
}

// ── Insert news item (avoids duplicates by title) ────────────────────
export const insertNewsItem = internalMutation({
  args: {
    title: v.string(),
    summary: v.string(),
    region: v.string(),
    category: v.string(),
    source: v.string(),
    originalUrl: v.optional(v.string()),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check for duplicate by title (simple dedup)
    const existing = await ctx.db
      .query("financialNews")
      .withIndex("by_publishedAt")
      .order("desc")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();

    if (existing) {
      return { inserted: false, reason: "duplicate" };
    }

    await ctx.db.insert("financialNews", {
      title: args.title,
      summary: args.summary,
      region: args.region,
      category: args.category,
      source: args.source,
      originalUrl: args.originalUrl,
      publishedAt: args.publishedAt,
    });

    return { inserted: true };
  },
});

// ── NewsData.io article shape ────────────────────────────────────────
interface NewsDataArticle {
  title?: string;
  description?: string;
  content?: string;
  source_id?: string;
  source_name?: string;
  link?: string;
  pubDate?: string;
  country?: string[];
  category?: string[];
}

interface NewsDataResponse {
  status?: string;
  results?: NewsDataArticle[];
}

// ── GNews.io article shape ───────────────────────────────────────────
interface GNewsArticle {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  source?: { name?: string; url?: string };
  publishedAt?: string;
}

interface GNewsResponse {
  totalArticles?: number;
  articles?: GNewsArticle[];
}

// ── Fetch from NewsData.io (if API key available) ────────────────────
async function fetchFromNewsData(
  apiKey: string,
  country: string,
): Promise<NewsDataArticle[]> {
  try {
    const url = `https://newsdata.io/api/1/news?country=${country}&category=business&language=en&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`NewsData.io returned ${response.status} for ${country}`);
      return [];
    }
    const data: NewsDataResponse = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error(`NewsData.io fetch error for ${country}:`, error);
    return [];
  }
}

// ── Fetch from GNews.io (if API key available) ───────────────────────
async function fetchFromGNews(
  apiKey: string,
  country: string,
): Promise<GNewsArticle[]> {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=${country}&max=10&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`GNews.io returned ${response.status} for ${country}`);
      return [];
    }
    const data: GNewsResponse = await response.json();
    return data.articles ?? [];
  } catch (error) {
    console.error(`GNews.io fetch error for ${country}:`, error);
    return [];
  }
}

// ── Main news fetcher action ─────────────────────────────────────────
// Attempts to fetch from real APIs if keys are available, otherwise
// falls back to the seeded mock data (no-op).
export const fetchFinancialNews = internalAction({
  args: {},
  handler: async (ctx) => {
    // Check for API keys in environment
    const newsDataKey = process.env.NEWS_API_KEY;
    const gnewsKey = process.env.GNEWS_API_KEY;

    let totalInserted = 0;

    // ── Strategy 1: NewsData.io ──────────────────────────────────
    if (newsDataKey) {
      const regions = [
        { code: "ng", label: "NG" },
        { code: "gb", label: "GB" },
        { code: "us", label: "US" },
      ];

      for (const region of regions) {
        const articles = await fetchFromNewsData(newsDataKey, region.code);

        for (const article of articles) {
          if (!article.title) continue;

          const summary = humanizeSummary(
            article.title,
            article.description || article.content || ""
          );
          const category = classifyCategory(article.title, summary);
          const detectedRegion = detectRegion(
            article.title,
            summary,
            article.country?.[0]
          );

          const result = await ctx.runMutation(
            internal.financialNews.insertNewsItem,
            {
              title: article.title,
              summary,
              region: detectedRegion || region.label,
              category,
              source: article.source_name || article.source_id || "NewsData",
              originalUrl: article.link,
              publishedAt: article.pubDate
                ? new Date(article.pubDate).getTime()
                : Date.now(),
            }
          );

          if (result.inserted) totalInserted++;
        }
      }

      return { success: true, source: "newsdata.io", inserted: totalInserted };
    }

    // ── Strategy 2: GNews.io ─────────────────────────────────────
    if (gnewsKey) {
      const regions = [
        { code: "ng", label: "NG" },
        { code: "gb", label: "GB" },
        { code: "us", label: "US" },
      ];

      for (const region of regions) {
        const articles = await fetchFromGNews(gnewsKey, region.code);

        for (const article of articles) {
          if (!article.title) continue;

          const summary = humanizeSummary(
            article.title,
            article.description || article.content || ""
          );
          const category = classifyCategory(article.title, summary);
          const detectedRegion = detectRegion(article.title, summary);

          const result = await ctx.runMutation(
            internal.financialNews.insertNewsItem,
            {
              title: article.title,
              summary,
              region: detectedRegion || region.label,
              category,
              source: article.source?.name || "GNews",
              originalUrl: article.url,
              publishedAt: article.publishedAt
                ? new Date(article.publishedAt).getTime()
                : Date.now(),
            }
          );

          if (result.inserted) totalInserted++;
        }
      }

      return { success: true, source: "gnews.io", inserted: totalInserted };
    }

    // ── Strategy 3: No API key -- fall back to mock data seed ────
    // When no external API key is configured, seed with curated
    // editorial content so the UI is never empty.
    console.log(
      "No NEWS_API_KEY or GNEWS_API_KEY found. Falling back to mock seed data."
    );
    await ctx.runMutation(internal.financialNews.seedNewsItems, {});
    return { success: true, source: "mock-seed", inserted: 0 };
  },
});

// ── Seed curated/mock news items ────────────────────────────────────
// Internal mutation for populating the table with editorial content.
// Used as fallback when no external news API key is configured.
export const seedNewsItems = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if we already have recent mock items (less than 24h old)
    const recent = await ctx.db
      .query("financialNews")
      .withIndex("by_publishedAt")
      .order("desc")
      .first();

    if (recent && now - recent.publishedAt < 24 * 60 * 60 * 1000) {
      return { inserted: 0, reason: "recent_data_exists" };
    }

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
        publishedAt: now - 1 * 60 * 60 * 1000,
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
