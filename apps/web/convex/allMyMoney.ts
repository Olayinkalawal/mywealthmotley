import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

// ── Helper: convert amount between currencies using cached rates ────
async function convertToUserCurrency(
  ctx: { db: any },
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ converted: number; rate: number }> {
  if (fromCurrency === toCurrency) {
    return { converted: amount, rate: 1 };
  }

  const rateRecord = await ctx.db
    .query("exchangeRates")
    .withIndex("by_currencies", (q: any) =>
      q.eq("baseCurrency", fromCurrency).eq("targetCurrency", toCurrency)
    )
    .order("desc")
    .first();

  if (!rateRecord) {
    // If no rate found, try the inverse
    const inverseRate = await ctx.db
      .query("exchangeRates")
      .withIndex("by_currencies", (q: any) =>
        q.eq("baseCurrency", toCurrency).eq("targetCurrency", fromCurrency)
      )
      .order("desc")
      .first();

    if (!inverseRate) {
      // Fallback: return unconverted with rate of 1 (should trigger rate refresh)
      return { converted: amount, rate: 1 };
    }

    const rate = 1 / inverseRate.rate;
    return { converted: amount * rate, rate };
  }

  return { converted: amount * rateRecord.rate, rate: rateRecord.rate };
}

// ── THE KILLER FEATURE: Calculate total net worth ───────────────────
export const getNetWorth = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userCurrency = user.currency;

    // Fetch all connected bank accounts
    const bankAccounts = await ctx.db
      .query("monoAccounts")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .collect();

    // Fetch all manual assets
    const manualAssets = await ctx.db
      .query("manualAssets")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    let totalNetWorth = 0;
    const accountBreakdown: Array<{
      id: string;
      name: string;
      type: string;
      value: number;
      currency: string;
      convertedValue: number;
      platform?: string;
      holdings?: Array<{
        ticker?: string;
        name: string;
        quantity?: number;
        value: number;
        currency: string;
      }>;
    }> = [];

    // Sum bank accounts
    for (const account of bankAccounts) {
      const { converted } = await convertToUserCurrency(
        ctx,
        account.balance,
        account.currency,
        userCurrency
      );
      totalNetWorth += converted;
      accountBreakdown.push({
        id: account._id,
        name: `${account.institution} - ${account.accountName}`,
        type: "bank",
        value: account.balance,
        currency: account.currency,
        convertedValue: converted,
      });
    }

    // Sum manual assets
    for (const asset of manualAssets) {
      const { converted } = await convertToUserCurrency(
        ctx,
        asset.value,
        asset.currency,
        userCurrency
      );
      totalNetWorth += converted;
      accountBreakdown.push({
        id: asset._id,
        name: asset.name,
        type: asset.type,
        value: asset.value,
        currency: asset.currency,
        convertedValue: converted,
        platform: asset.platform,
        holdings: asset.holdings,
      });
    }

    return {
      totalNetWorth,
      primaryCurrency: userCurrency,
      accounts: accountBreakdown,
      lastUpdated: Date.now(),
    };
  },
});

// ── Asset breakdown by type ─────────────────────────────────────────
export const getAssetBreakdown = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userCurrency = user.currency;

    const bankAccounts = await ctx.db
      .query("monoAccounts")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .collect();

    const manualAssets = await ctx.db
      .query("manualAssets")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    const breakdown: Record<string, { type: string; value: number; percentage: number; items: number }> = {};

    // Add bank balances
    for (const account of bankAccounts) {
      const { converted } = await convertToUserCurrency(ctx, account.balance, account.currency, userCurrency);
      if (!breakdown["bank"]) {
        breakdown["bank"] = { type: "bank", value: 0, percentage: 0, items: 0 };
      }
      breakdown["bank"]!.value += converted;
      breakdown["bank"]!.items += 1;
    }

    // Add manual assets by type
    for (const asset of manualAssets) {
      const { converted } = await convertToUserCurrency(ctx, asset.value, asset.currency, userCurrency);
      if (!breakdown[asset.type]) {
        breakdown[asset.type] = { type: asset.type, value: 0, percentage: 0, items: 0 };
      }
      breakdown[asset.type]!.value += converted;
      breakdown[asset.type]!.items += 1;
    }

    // Calculate percentages
    const total = Object.values(breakdown).reduce((sum, b) => sum + b.value, 0);
    for (const key of Object.keys(breakdown)) {
      const entry = breakdown[key];
      if (entry) {
        entry.percentage = total > 0 ? (entry.value / total) * 100 : 0;
      }
    }

    return {
      breakdown: Object.values(breakdown).sort((a, b) => b.value - a.value),
      total,
      currency: userCurrency,
    };
  },
});

// ── Currency allocation ─────────────────────────────────────────────
export const getCurrencyAllocation = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userCurrency = user.currency;

    const bankAccounts = await ctx.db
      .query("monoAccounts")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .collect();

    const manualAssets = await ctx.db
      .query("manualAssets")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    const byCurrency: Record<string, { currency: string; value: number; convertedValue: number; percentage: number }> = {};

    // Aggregate bank accounts by currency
    for (const account of bankAccounts) {
      const { converted } = await convertToUserCurrency(ctx, account.balance, account.currency, userCurrency);
      if (!byCurrency[account.currency]) {
        byCurrency[account.currency] = { currency: account.currency, value: 0, convertedValue: 0, percentage: 0 };
      }
      byCurrency[account.currency]!.value += account.balance;
      byCurrency[account.currency]!.convertedValue += converted;
    }

    // Aggregate manual assets by currency
    for (const asset of manualAssets) {
      const { converted } = await convertToUserCurrency(ctx, asset.value, asset.currency, userCurrency);
      if (!byCurrency[asset.currency]) {
        byCurrency[asset.currency] = { currency: asset.currency, value: 0, convertedValue: 0, percentage: 0 };
      }
      byCurrency[asset.currency]!.value += asset.value;
      byCurrency[asset.currency]!.convertedValue += converted;
    }

    // Calculate percentages based on converted values
    const totalConverted = Object.values(byCurrency).reduce((sum, c) => sum + c.convertedValue, 0);
    for (const key of Object.keys(byCurrency)) {
      const entry = byCurrency[key];
      if (entry) {
        entry.percentage = totalConverted > 0
          ? (entry.convertedValue / totalConverted) * 100
          : 0;
      }
    }

    return {
      allocations: Object.values(byCurrency).sort((a, b) => b.convertedValue - a.convertedValue),
      totalConverted,
      primaryCurrency: userCurrency,
    };
  },
});

// ── Add a manual asset ──────────────────────────────────────────────
export const addManualAsset = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    platform: v.optional(v.string()),
    value: v.number(),
    currency: v.string(),
    holdings: v.optional(
      v.array(
        v.object({
          ticker: v.optional(v.string()),
          name: v.string(),
          quantity: v.optional(v.number()),
          value: v.number(),
          currency: v.string(),
        })
      )
    ),
    notes: v.optional(v.string()),
    screenshotImportId: v.optional(v.id("screenshotImports")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    return await ctx.db.insert("manualAssets", {
      userId: user._id,
      name: args.name,
      type: args.type,
      platform: args.platform,
      value: args.value,
      currency: args.currency,
      lastUpdated: Date.now(),
      holdings: args.holdings,
      notes: args.notes,
      screenshotImportId: args.screenshotImportId,
    });
  },
});

// ── Update a manual asset ───────────────────────────────────────────
export const updateManualAsset = mutation({
  args: {
    assetId: v.id("manualAssets"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    platform: v.optional(v.string()),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    holdings: v.optional(
      v.array(
        v.object({
          ticker: v.optional(v.string()),
          name: v.string(),
          quantity: v.optional(v.number()),
          value: v.number(),
          currency: v.string(),
        })
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const asset = await ctx.db.get(args.assetId);
    if (!asset || asset.userId !== user._id) {
      throw new Error("Asset not found");
    }

    const updates: Record<string, any> = { lastUpdated: Date.now() };

    if (args.name !== undefined) updates.name = args.name;
    if (args.type !== undefined) updates.type = args.type;
    if (args.platform !== undefined) updates.platform = args.platform;
    if (args.value !== undefined) updates.value = args.value;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.holdings !== undefined) updates.holdings = args.holdings;
    if (args.notes !== undefined) updates.notes = args.notes;

    await ctx.db.patch(args.assetId, updates);
  },
});

// ── Delete a manual asset ───────────────────────────────────────────
export const deleteManualAsset = mutation({
  args: {
    assetId: v.id("manualAssets"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const asset = await ctx.db.get(args.assetId);
    if (!asset || asset.userId !== user._id) {
      throw new Error("Asset not found");
    }

    await ctx.db.delete(args.assetId);
  },
});
