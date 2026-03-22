import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// ── Get latest 20 notifications for current user, newest first ──────
export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);
  },
});

// ── Get count of unread notifications ───────────────────────────────
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_unread", (q) =>
        q.eq("userId", user._id).eq("isRead", false)
      )
      .collect();

    return unread.length;
  },
});

// ── Mark a single notification as read ──────────────────────────────
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error("Notification not found");

    // Verify ownership
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || notification.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

// ── Mark all notifications as read for the current user ─────────────
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_unread", (q) =>
        q.eq("userId", user._id).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unread.map((n) => ctx.db.patch(n._id, { isRead: true }))
    );
  },
});

// ── Create a notification (called by other backend functions) ───────
export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.title,
      message: args.message,
      type: args.type,
      isRead: false,
      link: args.link,
      createdAt: Date.now(),
    });
  },
});

// ── Create welcome notifications for new users ──────────────────────
export const createWelcomeNotifications = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Welcome to WealthMotley!",
      message:
        "Start by connecting your bank account to see where your money goes.",
      type: "system",
      isRead: false,
      link: "/all-my-money",
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Set up your budget",
      message:
        "Create your first budget to track spending across Nigerian categories like Jollof & Chops, Data & Airtime, and Owambe.",
      type: "tip",
      isRead: false,
      link: "/budget",
      createdAt: now + 1, // +1ms to ensure ordering
    });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Try AI Sholz",
      message:
        "Chat with your personal financial education companion. Ask anything about money!",
      type: "tip",
      isRead: false,
      link: "/sholz",
      createdAt: now + 2, // +2ms to ensure ordering
    });
  },
});
