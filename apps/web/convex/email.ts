import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ── HTML email template with WealthMotley branding ──────────────────
function wrapInTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0b0a;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <div style="text-align:center;margin-bottom:24px">
    <span style="font-size:24px;font-weight:bold;color:#ffb347">my</span><span style="font-size:24px;font-weight:bold;color:#ffffff">WealthMotley</span>
  </div>
  <div style="background:#1a1614;border:1px solid #2a2420;border-radius:16px;padding:32px 24px;color:#e5e5e5;font-size:14px;line-height:1.6">
    <h2 style="color:#ffffff;margin:0 0 16px;font-size:18px">${title}</h2>
    ${body}
  </div>
  <div style="text-align:center;margin-top:24px;color:#968a84;font-size:11px">
    <p>myWealthMotley — Financial education for Africans</p>
    <p>This is an automated notification. <a href="https://mywealthmotley.com/settings" style="color:#ffb347">Manage preferences</a></p>
  </div>
</div>
</body>
</html>`;
}

// ── Core email sender via Resend API ────────────────────────────────
export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (_ctx, args): Promise<{ success: boolean; reason?: string }> => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("[email] RESEND_API_KEY not configured, skipping:", args.subject);
      return { success: false, reason: "no_api_key" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "myWealthMotley <notifications@wealthmotley.com>",
          to: args.to,
          subject: args.subject,
          html: args.html,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[email] Resend API error:", error);
        return { success: false, reason: error };
      }

      return { success: true };
    } catch (error) {
      console.error("[email] Failed to send:", error);
      return { success: false, reason: String(error) };
    }
  },
});

// ── Welcome email ───────────────────────────────────────────────────
export const sendWelcomeEmail = internalAction({
  args: {
    to: v.string(),
    firstName: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const html = wrapInTemplate(
      `Welcome to myWealthMotley, ${args.firstName}!`,
      `<p>We're excited to have you on board. myWealthMotley is built to help Africans understand and grow their money — no jargon, no wahala.</p>
      <p>Here's how to get started:</p>
      <ul style="padding-left:20px;color:#e5e5e5">
        <li>Connect your bank account to see all your money in one place</li>
        <li>Set up your monthly budget with categories that match your lifestyle</li>
        <li>Chat with Mo, your AI financial companion</li>
      </ul>
      <p style="margin-top:16px">
        <a href="https://mywealthmotley.com/dashboard" style="display:inline-block;padding:12px 24px;background:#ffb347;color:#0d0b0a;text-decoration:none;border-radius:8px;font-weight:bold">Get Started</a>
      </p>`
    );

    await ctx.runAction(internal.email.sendEmail, {
      to: args.to,
      subject: `Welcome to myWealthMotley, ${args.firstName}!`,
      html,
    });
  },
});

// ── Budget alert email ──────────────────────────────────────────────
export const sendBudgetAlert = internalAction({
  args: {
    to: v.string(),
    firstName: v.string(),
    spent: v.number(),
    allocated: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const pct = Math.round((args.spent / args.allocated) * 100);
    const isOver = pct >= 100;
    const barColor = isOver ? "#ef4444" : "#ffb347";
    const barWidth = Math.min(pct, 100);

    const html = wrapInTemplate(
      isOver ? "Budget Alert: Over Budget!" : "Budget Alert: Approaching Limit",
      `<p>Hey ${args.firstName}, you've spent <strong>${args.currency} ${args.spent.toLocaleString()}</strong> of your <strong>${args.currency} ${args.allocated.toLocaleString()}</strong> budget this month (${pct}%).</p>
      <div style="background:#2a2420;border-radius:8px;height:12px;overflow:hidden;margin:16px 0">
        <div style="background:${barColor};height:100%;width:${barWidth}%;border-radius:8px"></div>
      </div>
      <p>${isOver ? "You've exceeded your budget. Review your spending to get back on track." : "You're close to your budget limit. Consider reviewing recent expenses."}</p>
      <p style="margin-top:16px">
        <a href="https://mywealthmotley.com/budget" style="display:inline-block;padding:12px 24px;background:#ffb347;color:#0d0b0a;text-decoration:none;border-radius:8px;font-weight:bold">View Budget</a>
      </p>`
    );

    await ctx.runAction(internal.email.sendEmail, {
      to: args.to,
      subject: isOver ? "Budget Alert: You've exceeded your budget" : "Budget Alert: You're approaching your limit",
      html,
    });
  },
});

// ── Weekly digest email ─────────────────────────────────────────────
export const sendWeeklyDigest = internalAction({
  args: {
    to: v.string(),
    firstName: v.string(),
    budgetSummary: v.optional(v.string()),
    savingsCount: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    const tips = [
      "Small, consistent savings beat large, irregular deposits every time.",
      "Automate your savings — set it and forget it.",
      "Review your subscriptions monthly. You might be paying for things you don't use.",
      "An emergency fund should cover 3-6 months of expenses.",
      "The best time to start investing was yesterday. The second best time is today.",
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];

    const budgetSection = args.budgetSummary
      ? `<div style="background:#2a2420;border-radius:8px;padding:16px;margin:12px 0">
          <p style="color:#ffb347;font-weight:bold;margin:0 0 4px">Budget Status</p>
          <p style="margin:0">${args.budgetSummary}</p>
        </div>`
      : "";

    const html = wrapInTemplate(
      `Your Weekly Money Update`,
      `<p>Hey ${args.firstName}, here's your weekly summary:</p>
      ${budgetSection}
      <div style="background:#2a2420;border-radius:8px;padding:16px;margin:12px 0">
        <p style="color:#ffb347;font-weight:bold;margin:0 0 4px">Savings Goals</p>
        <p style="margin:0">You have ${args.savingsCount} active savings goal${args.savingsCount !== 1 ? "s" : ""}.</p>
      </div>
      <div style="background:#2a2420;border-radius:8px;padding:16px;margin:12px 0">
        <p style="color:#ffb347;font-weight:bold;margin:0 0 4px">Mo's Tip of the Week</p>
        <p style="margin:0;font-style:italic">"${tip}"</p>
      </div>
      <p style="margin-top:16px">
        <a href="https://mywealthmotley.com/dashboard" style="display:inline-block;padding:12px 24px;background:#ffb347;color:#0d0b0a;text-decoration:none;border-radius:8px;font-weight:bold">View Dashboard</a>
      </p>`
    );

    await ctx.runAction(internal.email.sendEmail, {
      to: args.to,
      subject: `Your Weekly Money Update — myWealthMotley`,
      html,
    });
  },
});

// ── Helper queries for weekly digest ────────────────────────────────
export const getActiveUsers = internalQuery({
  args: {},
  handler: async (ctx): Promise<Array<{ _id: any; email: string; firstName: string; currency: string }>> => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const allUsers = await ctx.db.query("users").collect();
    return allUsers
      .filter((u) => u.lastActiveAt > thirtyDaysAgo)
      .slice(0, 50)
      .map((u) => ({
        _id: u._id,
        email: u.email,
        firstName: u.firstName,
        currency: u.currency,
      }));
  },
});

export const getUserBudgetSummary = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<string | null> => {
    const month = new Date().toISOString().slice(0, 7);
    const budget = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q: any) => q.eq("userId", args.userId).eq("month", month))
      .unique();
    if (!budget) return null;

    const categories = await ctx.db
      .query("budgetCategories")
      .withIndex("by_budgetId", (q: any) => q.eq("budgetId", budget._id))
      .collect();

    const totalSpent = categories.reduce((s: number, c: any) => s + c.spent, 0);
    const pct = budget.totalIncome > 0 ? Math.round((totalSpent / budget.totalIncome) * 100) : 0;
    return `You've spent ${budget.currency} ${totalSpent.toLocaleString()} of ${budget.currency} ${budget.totalIncome.toLocaleString()} (${pct}%)`;
  },
});

export const getUserSavingsCount = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<number> => {
    const goals = await ctx.db
      .query("savingsGoals")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
    return goals.length;
  },
});

// ── Weekly digest orchestrator ──────────────────────────────────────
export const sendWeeklyDigests = internalAction({
  args: {},
  handler: async (ctx): Promise<void> => {
    const users = await ctx.runQuery(internal.email.getActiveUsers, {});

    for (const user of users) {
      try {
        const budgetSummary = await ctx.runQuery(internal.email.getUserBudgetSummary, { userId: user._id });
        const savingsCount = await ctx.runQuery(internal.email.getUserSavingsCount, { userId: user._id });

        await ctx.runAction(internal.email.sendWeeklyDigest, {
          to: user.email,
          firstName: user.firstName,
          budgetSummary: budgetSummary ?? undefined,
          savingsCount,
        });
      } catch (err) {
        console.error(`[email] Failed to send digest to ${user.email}:`, err);
      }
    }

    console.log(`[email] Weekly digests sent to ${users.length} users`);
  },
});
