import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalMutation,
  internalAction,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

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

// ── MONO API BASE URL ───────────────────────────────────────────────
const MONO_API_BASE = "https://api.withmono.com/v2";

// ── Exchange authorization code for Mono account ID ─────────────────
// Called from the client after Mono Connect widget returns a code.
export const exchangeCode = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      throw new Error("MONO_SECRET_KEY is not configured");
    }

    // Exchange the auth code for an account ID via Mono API
    const response = await fetch(`${MONO_API_BASE}/accounts/auth`, {
      method: "POST",
      headers: {
        "mono-sec-key": monoSecretKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code: args.code }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Mono code exchange failed:", response.status, errorBody);
      throw new Error(`Mono API error: ${response.status}`);
    }

    const data = await response.json();
    const monoAccountId: string = data.id;

    if (!monoAccountId) {
      throw new Error("No account ID returned from Mono");
    }

    // Store the account record
    await ctx.runMutation(internal.mono.upsertAccount, {
      clerkId: identity.subject,
      monoAccountId,
      monoCode: args.code,
    });

    // Sync account details and transactions
    await ctx.runAction(internal.mono.syncAccountInternal, {
      monoAccountId,
    });

    return { monoAccountId };
  },
});

// ── Internal mutation: create or update a monoAccount record ────────
export const upsertAccount = internalMutation({
  args: {
    clerkId: v.string(),
    monoAccountId: v.string(),
    monoCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found for clerkId: " + args.clerkId);
    }

    // Check if this mono account already exists
    const existing = await ctx.db
      .query("monoAccounts")
      .withIndex("by_monoAccountId", (q: any) =>
        q.eq("monoAccountId", args.monoAccountId)
      )
      .unique();

    if (existing) {
      // Re-activate if previously disconnected
      await ctx.db.patch(existing._id, {
        isActive: true,
        monoCode: args.monoCode,
        lastSynced: Date.now(),
      });
      return existing._id;
    }

    // Create new account record with placeholder data (will be filled by sync)
    return await ctx.db.insert("monoAccounts", {
      userId: user._id,
      monoAccountId: args.monoAccountId,
      monoCode: args.monoCode,
      institution: "Loading...",
      accountName: "Loading...",
      balance: 0,
      currency: user.currency,
      type: "savings",
      lastSynced: Date.now(),
      isActive: true,
    });
  },
});

// ── Internal action: sync a single account (details + transactions) ─
export const syncAccountInternal = internalAction({
  args: {
    monoAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const monoSecretKey = process.env.MONO_SECRET_KEY;
    if (!monoSecretKey) {
      console.error("MONO_SECRET_KEY is not configured");
      return;
    }

    // 1. Fetch account details from Mono
    try {
      const accountResponse = await fetch(
        `${MONO_API_BASE}/accounts/${args.monoAccountId}`,
        {
          method: "GET",
          headers: {
            "mono-sec-key": monoSecretKey,
            Accept: "application/json",
          },
        }
      );

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        const account = accountData.data ?? accountData;

        await ctx.runMutation(internal.mono.updateAccountDetails, {
          monoAccountId: args.monoAccountId,
          institution: account.institution?.name ?? account.institution ?? "Unknown Bank",
          accountName: account.name ?? "Account",
          accountNumber: account.account_number
            ? account.account_number.slice(-4)
            : undefined,
          balance: typeof account.balance === "number"
            ? account.balance
            : parseFloat(account.balance) / 100 || 0,
          currency: account.currency ?? "NGN",
          type: account.type ?? "savings",
        });
      } else {
        console.error(
          "Failed to fetch account details:",
          accountResponse.status,
          await accountResponse.text()
        );
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }

    // 2. Fetch transactions from Mono
    try {
      const txResponse = await fetch(
        `${MONO_API_BASE}/accounts/${args.monoAccountId}/transactions?paginate=false`,
        {
          method: "GET",
          headers: {
            "mono-sec-key": monoSecretKey,
            Accept: "application/json",
          },
        }
      );

      if (txResponse.ok) {
        const txData = await txResponse.json();
        const transactions: any[] = txData.data ?? txData ?? [];

        if (Array.isArray(transactions) && transactions.length > 0) {
          // Process transactions in batches to avoid hitting Convex limits
          const BATCH_SIZE = 50;
          for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
            const batch = transactions.slice(i, i + BATCH_SIZE);
            await ctx.runMutation(internal.mono.upsertTransactions, {
              monoAccountId: args.monoAccountId,
              transactions: batch.map((tx: any) => ({
                monoTransactionId: tx._id ?? tx.id ?? `${Date.now()}-${Math.random()}`,
                narration: tx.narration ?? tx.description ?? "No description",
                amount: typeof tx.amount === "number"
                  ? tx.amount
                  : parseFloat(tx.amount) / 100 || 0,
                type: tx.type ?? (tx.debit ? "debit" : "credit"),
                balance: tx.balance != null
                  ? typeof tx.balance === "number"
                    ? tx.balance
                    : parseFloat(tx.balance) / 100
                  : undefined,
                date: tx.date ?? new Date().toISOString().split("T")[0]!,
                currency: tx.currency ?? "NGN",
                monoCategory: tx.category ?? undefined,
                merchant: tx.merchant ?? undefined,
                channel: tx.channel ?? undefined,
              })),
            });
          }
        }
      } else {
        console.error(
          "Failed to fetch transactions:",
          txResponse.status,
          await txResponse.text()
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  },
});

// ── Internal mutation: update account details after sync ─────────────
export const updateAccountDetails = internalMutation({
  args: {
    monoAccountId: v.string(),
    institution: v.string(),
    accountName: v.string(),
    accountNumber: v.optional(v.string()),
    balance: v.number(),
    currency: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("monoAccounts")
      .withIndex("by_monoAccountId", (q: any) =>
        q.eq("monoAccountId", args.monoAccountId)
      )
      .unique();

    if (!account) {
      console.error("Account not found for monoAccountId:", args.monoAccountId);
      return;
    }

    await ctx.db.patch(account._id, {
      institution: args.institution,
      accountName: args.accountName,
      accountNumber: args.accountNumber,
      balance: args.balance,
      currency: args.currency,
      type: args.type,
      lastSynced: Date.now(),
    });
  },
});

// ── Internal mutation: upsert transactions from Mono ────────────────
export const upsertTransactions = internalMutation({
  args: {
    monoAccountId: v.string(),
    transactions: v.array(
      v.object({
        monoTransactionId: v.string(),
        narration: v.string(),
        amount: v.number(),
        type: v.string(),
        balance: v.optional(v.number()),
        date: v.string(),
        currency: v.string(),
        monoCategory: v.optional(v.string()),
        merchant: v.optional(v.string()),
        channel: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("monoAccounts")
      .withIndex("by_monoAccountId", (q: any) =>
        q.eq("monoAccountId", args.monoAccountId)
      )
      .unique();

    if (!account) {
      console.error("Account not found for monoAccountId:", args.monoAccountId);
      return;
    }

    for (const tx of args.transactions) {
      // Check if transaction already exists (by monoTransactionId + accountId)
      const existing = await ctx.db
        .query("transactions")
        .withIndex("by_accountId", (q: any) => q.eq("accountId", account._id))
        .filter((q: any) =>
          q.eq(q.field("monoTransactionId"), tx.monoTransactionId)
        )
        .first();

      if (existing) {
        // Update existing transaction
        await ctx.db.patch(existing._id, {
          narration: tx.narration,
          amount: tx.amount,
          type: tx.type,
          balance: tx.balance,
          date: tx.date,
          monoCategory: tx.monoCategory,
          merchant: tx.merchant,
          channel: tx.channel,
          // Recompute effective category only if user hasn't overridden
          effectiveCategory:
            existing.userCategory ??
            tx.monoCategory ??
            existing.ruleCategory ??
            "uncategorized",
        });
      } else {
        // Insert new transaction
        await ctx.db.insert("transactions", {
          userId: account.userId,
          accountId: account._id,
          monoTransactionId: tx.monoTransactionId,
          narration: tx.narration,
          amount: tx.amount,
          type: tx.type,
          balance: tx.balance,
          date: tx.date,
          currency: tx.currency,
          monoCategory: tx.monoCategory,
          effectiveCategory: tx.monoCategory ?? "uncategorized",
          merchant: tx.merchant,
          channel: tx.channel,
        });
      }
    }
  },
});

// ── Public query: get connected accounts for the current user ───────
export const getConnectedAccounts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const accounts = await ctx.db
      .query("monoAccounts")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    return accounts.map((account: any) => ({
      _id: account._id,
      monoAccountId: account.monoAccountId,
      institution: account.institution,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
      type: account.type,
      lastSynced: account.lastSynced,
      isActive: account.isActive,
    }));
  },
});

// ── Public mutation: disconnect a bank account ──────────────────────
export const disconnectAccount = mutation({
  args: {
    accountId: v.id("monoAccounts"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Please sign in first");

    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== user._id) {
      throw new Error("Account not found");
    }

    // Soft-delete: mark as inactive rather than deleting
    await ctx.db.patch(args.accountId, {
      isActive: false,
    });

    return { success: true };
  },
});

// ── Public action: manually trigger a sync for an account ───────────
export const syncAccount = action({
  args: {
    accountId: v.id("monoAccounts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Look up the monoAccountId from the Convex record
    const account: any = await ctx.runQuery(
      internal.mono.getAccountById,
      { accountId: args.accountId }
    );

    if (!account) {
      throw new Error("Account not found");
    }

    // Trigger the sync
    await ctx.runAction(internal.mono.syncAccountInternal, {
      monoAccountId: account.monoAccountId,
    });

    return { success: true };
  },
});

// ── Internal query: get account by ID (for use in actions) ──────────
export const getAccountById = internalQuery({
  args: {
    accountId: v.id("monoAccounts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.accountId);
  },
});

// ── Internal mutation: handle webhook account sync trigger ──────────
export const triggerSyncFromWebhook = internalAction({
  args: {
    monoAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the account exists in our database
    const account: any = await ctx.runQuery(
      internal.mono.getAccountByMonoId,
      { monoAccountId: args.monoAccountId }
    );

    if (!account) {
      console.error(
        "Webhook sync: account not found for monoAccountId:",
        args.monoAccountId
      );
      return;
    }

    // Run the sync
    await ctx.runAction(internal.mono.syncAccountInternal, {
      monoAccountId: args.monoAccountId,
    });
  },
});

// ── Internal query: look up account by Mono account ID ──────────────
export const getAccountByMonoId = internalQuery({
  args: {
    monoAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("monoAccounts")
      .withIndex("by_monoAccountId", (q: any) =>
        q.eq("monoAccountId", args.monoAccountId)
      )
      .unique();
  },
});

// ── Internal action: sync all active accounts (for cron) ────────────
export const syncAllAccounts = internalAction({
  args: {},
  handler: async (ctx) => {
    // This is a simple wrapper to be used by a cron job
    // It fetches all active accounts and syncs each one
    const accounts: any[] = await ctx.runQuery(
      internal.mono.getAllActiveAccounts
    );

    for (const account of accounts) {
      try {
        await ctx.runAction(internal.mono.syncAccountInternal, {
          monoAccountId: account.monoAccountId,
        });
      } catch (error) {
        console.error(
          `Failed to sync account ${account.monoAccountId}:`,
          error
        );
      }
    }

    return { synced: accounts.length };
  },
});

// ── Internal query: get all active Mono accounts ────────────────────
export const getAllActiveAccounts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allAccounts = await ctx.db.query("monoAccounts").collect();
    return allAccounts.filter((a: any) => a.isActive);
  },
});
