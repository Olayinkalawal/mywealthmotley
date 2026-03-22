import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "WM-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const join = mutation({
  args: {
    email: v.string(),
    country: v.string(),
    referredBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return {
        success: true,
        alreadyExists: true,
        position: existing.position,
        referralCode: existing.referralCode,
        referralCount: existing.referralCount,
      };
    }

    // Get current count for position
    const allEntries = await ctx.db.query("waitlist").collect();
    const position = allEntries.length + 1;

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = await ctx.db
      .query("waitlist")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
      .first();
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await ctx.db
        .query("waitlist")
        .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
        .first();
    }

    // If referred by someone, increment their referral count
    if (args.referredBy) {
      const referrer = await ctx.db
        .query("waitlist")
        .withIndex("by_referralCode", (q) =>
          q.eq("referralCode", args.referredBy!)
        )
        .first();
      if (referrer) {
        await ctx.db.patch(referrer._id, {
          referralCount: referrer.referralCount + 1,
        });
      }
    }

    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      country: args.country,
      referralCode,
      referredBy: args.referredBy,
      position,
      referralCount: 0,
      createdAt: Date.now(),
    });

    return {
      success: true,
      alreadyExists: false,
      position,
      referralCode,
      referralCount: 0,
    };
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const allEntries = await ctx.db.query("waitlist").collect();
    return allEntries.length;
  },
});

export const getByReferralCode = query({
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("waitlist")
      .withIndex("by_referralCode", (q) =>
        q.eq("referralCode", args.referralCode)
      )
      .first();
    if (!entry) return null;
    return {
      position: entry.position,
      referralCount: entry.referralCount,
      referralCode: entry.referralCode,
    };
  },
});
