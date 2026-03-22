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

// ── Get the user's Japa profile ─────────────────────────────────────
export const getJapaProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const profile = await ctx.db
      .query("japaMilestones")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();

    return profile;
  },
});

// ── Create a Japa emigration profile ────────────────────────────────
export const createJapaProfile = mutation({
  args: {
    destination: v.string(),
    visaType: v.string(),
    milestones: v.array(
      v.object({
        name: v.string(),
        targetAmount: v.number(),
        currentAmount: v.number(),
        currency: v.string(),
        isCompleted: v.boolean(),
        isLocked: v.boolean(),
      })
    ),
    targetDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    // Check if profile already exists
    const existing = await ctx.db
      .query("japaMilestones")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();

    if (existing) {
      throw new Error("Japa profile already exists. Update it instead.");
    }

    const totalRequired = args.milestones.reduce((sum, m) => sum + m.targetAmount, 0);
    const totalSaved = args.milestones.reduce((sum, m) => sum + m.currentAmount, 0);
    const readinessScore = totalRequired > 0 ? Math.round((totalSaved / totalRequired) * 100) : 0;

    const now = Date.now();

    return await ctx.db.insert("japaMilestones", {
      userId: user._id,
      destination: args.destination,
      visaType: args.visaType,
      milestones: args.milestones,
      totalRequired,
      totalSaved,
      readinessScore: Math.min(readinessScore, 100),
      targetDate: args.targetDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ── Update a specific milestone ─────────────────────────────────────
export const updateMilestone = mutation({
  args: {
    profileId: v.id("japaMilestones"),
    milestoneIndex: v.number(),
    currentAmount: v.number(),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== user._id) {
      throw new Error("Japa profile not found");
    }

    if (args.milestoneIndex < 0 || args.milestoneIndex >= profile.milestones.length) {
      throw new Error("Invalid milestone index");
    }

    // Update the milestone
    const updatedMilestones = [...profile.milestones];
    const existing = updatedMilestones[args.milestoneIndex];
    if (!existing) {
      throw new Error("Milestone not found at index");
    }
    updatedMilestones[args.milestoneIndex] = {
      ...existing,
      currentAmount: args.currentAmount,
      isCompleted: args.isCompleted ?? (args.currentAmount >= existing.targetAmount),
    };

    // Recalculate totals
    const totalSaved = updatedMilestones.reduce((sum, m) => sum + m.currentAmount, 0);
    const readinessScore = profile.totalRequired > 0
      ? Math.round((totalSaved / profile.totalRequired) * 100)
      : 0;

    await ctx.db.patch(args.profileId, {
      milestones: updatedMilestones,
      totalSaved,
      readinessScore: Math.min(readinessScore, 100),
      updatedAt: Date.now(),
    });
  },
});

// ── Calculate readiness score (standalone query) ────────────────────
export const calculateReadinessScore = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const profile = await ctx.db
      .query("japaMilestones")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .first();

    if (!profile) {
      return null;
    }

    const completedMilestones = profile.milestones.filter((m: any) => m.isCompleted).length;
    const totalMilestones = profile.milestones.length;
    const financialReadiness = profile.totalRequired > 0
      ? (profile.totalSaved / profile.totalRequired) * 100
      : 0;

    const milestoneCompletion = totalMilestones > 0
      ? (completedMilestones / totalMilestones) * 100
      : 0;

    // Weighted score: 70% financial, 30% milestone completion
    const overallScore = Math.round(financialReadiness * 0.7 + milestoneCompletion * 0.3);

    return {
      overallScore: Math.min(overallScore, 100),
      financialReadiness: Math.round(financialReadiness),
      milestoneCompletion: Math.round(milestoneCompletion),
      completedMilestones,
      totalMilestones,
      totalRequired: profile.totalRequired,
      totalSaved: profile.totalSaved,
      destination: profile.destination,
      visaType: profile.visaType,
      targetDate: profile.targetDate,
    };
  },
});
