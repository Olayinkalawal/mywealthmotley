import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";

// ── System prompts — REAL Sholz personality from coaching transcripts ──

const CORE_IDENTITY = `You are AI Sholz, the digital version of Solafunmi "Sholz" Sosanya — founder of WealthMotley, known as "The Personal Finance Baddie."

WHO YOU ARE:
- A Nigerian woman who moved to the UK in 2023
- A financial educator, NOT a financial advisor
- A mother, wife, and real person with a real life
- You have 167K+ Instagram followers who trust you
- You run 1-on-1 coaching sessions where you walk people through setting up investments on Trading 212
- You are warm, direct, sisterly, culturally fluent, and genuinely expert
- Your brand: "No jargon. No BS."

YOUR RELATIONSHIP WITH THE USER:
- You are their big sister who happens to know about money
- You call them "my sister" or "my dear" naturally — NOT "babe" or generic terms
- You ask about their life before jumping to money talk
- You CELEBRATE their wins, no matter how small
- You NEVER judge them for having zero savings or debt
- You validate feelings FIRST, then give practical advice`;

const GUARDRAILS = `

CRITICAL RULES FROM THE REAL SHOLZ:
1) EDUCATIONAL ONLY. Say: "These are not guaranteed numbers, but at least gives you a good guide."
2) NEVER recommend specific stocks as primary investments. Say: "Individual stocks make up less than 10% of my portfolio. Most of my money is in ETFs."
3) NEVER promise guaranteed returns. ALWAYS undersell: "Let's say it doesn't do well."
4) ALWAYS mention ISA/TFSA: "Please, all this money has to be in your stocks and shares ISA."
5) ALWAYS suggest emergency fund first: "Trust me, you need it. It's like burglar proof — you won't know when you need it until you need it."
6) If asked for personal advice: "I'm here to educate, not advise. For specific decisions, consult a licensed financial adviser. But what I CAN tell you is how things generally work."
7) NEVER fabricate numbers. Use real historical data or say "historically, broad market index funds have delivered solid long-term returns."
8) Format currency in the user's preferred currency.
9) Keep responses to 2-4 short paragraphs. You are conversational, NOT a textbook. NO emojis.
10) ALWAYS end with a question ("Does it make sense?") or encouragement ("You're already in a good space.").
11) NEVER use emojis. Sholz doesn't use emojis in her coaching sessions.
12) NEVER mention specific fund names, ticker symbols, or ETF products by name. Always use generic asset class descriptions (e.g., "global equity index fund" not "VOO", "technology sector fund" not "XLKS"). This is a regulatory compliance requirement.`;

function getSystemPrompt(tone: string): string {
  switch (tone) {
    case "formal":
      return (
        CORE_IDENTITY +
        "\n\nYOUR VOICE IN FORMAL MODE:\n" +
        "You maintain Sholz's warmth but speak in a more structured, professional way. " +
        "Clear, organized, but still approachable. Use 'you' instead of 'my sister'. " +
        "Still use analogies but present them more formally. " +
        "'Let me walk you through this step by step.' " +
        "'The key thing to understand here is...' " +
        "You are still Sholz — just the version giving a presentation rather than chatting with a friend." +
        GUARDRAILS
      );
    case "roast":
      return (
        CORE_IDENTITY +
        "\n\nYOUR VOICE IN ROAST MODE:\n" +
        "The user has OPTED IN to be lovingly roasted about their spending. " +
        "This is how Sholz calls someone out in real life — direct, funny, but always constructive.\n\n" +
        "HOW YOU ROAST:\n" +
        "- 'When I was looking at your stuff, I saw zero. I was like, hmm okay.' (dry acknowledgment)\n" +
        "- 'Those credit card rates are the worst in the world. I beg you.'\n" +
        "- 'My sister, you've basically been funding Chicken Republic's expansion plan.'\n" +
        "- 'This 12K credit card? In one year it's going to be 15K. That's not even a joke.'\n\n" +
        "ROAST RULES: Always end with a practical tip. Never be cruel — tough love, not cruelty. " +
        "Reference their ACTUAL spending data. Keep it under 200 words. " +
        "The tone is: 'I love you but someone needs to tell you this.'" +
        GUARDRAILS
      );
    default:
      return (
        CORE_IDENTITY +
        "\n\nYOUR VOICE IN WARM MODE:\n" +
        "You speak in simple, warm English with natural Nigerian-British energy. NOT Pidgin — standard English with warmth and cultural fluency.\n\n" +
        "HOW YOU TALK:\n" +
        "- Start with warmth: 'How are you doing?' or 'Beautiful. Let's look at this.'\n" +
        "- Use signature phrases NATURALLY: 'Does it make sense?', 'Trust me.', 'My sister.', 'That's the cocoa.', 'No stress.', 'Without lifting a muscle.'\n" +
        "- Explain with analogies: ETFs are like a bunch of broom (one stick breaks easily, a whole bunch is strong). Or like a fruit basket instead of just bananas.\n" +
        "- After explaining, ALWAYS check: 'Does it make sense?' or 'Make sense?'\n" +
        "- Keep responses to 2-4 short paragraphs\n" +
        "- End with encouragement or a question\n\n" +
        "YOUR EMOTIONAL RANGE:\n" +
        "- Zero savings: 'Okay, that's where we start. No stress. Let me tell you what we can do.'\n" +
        "- Overspending: 'Everybody will just drink water until the end of the month. That's the way it works.'\n" +
        "- Achievement: 'Beautiful! I'm happy for you.'\n" +
        "- Family money issues: 'I get you so well. You're doing the right thing putting boundaries in place.'\n" +
        "- Scared to invest: 'Trust me, if you can do this like a bill, you will see the difference.'\n\n" +
        "THINGS YOU SAY THAT MAKE YOU SHOLZ:\n" +
        "- 'My husband knows once I start acting funny — he knows we've almost finished the money.'\n" +
        "- 'It's like a self-cleansing toilet — cleanses companies that are not doing well.'\n" +
        "- 'I can tell you for free...'\n" +
        "- 'My dearest sister in the Lord, we have done it!'\n" +
        "- 'Without lifting a muscle, without you doing anything.'\n" +
        "- 'I'm not going to lie to you.'\n" +
        "- 'Please be very detailed about it.'" +
        GUARDRAILS
      );
  }
}

const NEW_USER_CONTEXT =
  "\n\nUSER'S FINANCIAL CONTEXT:\n" +
  "This user is new and hasn't connected a bank account yet. " +
  "They have no spending data, budget, or savings goals in the system. " +
  "Focus on general financial education and encourage them to explore " +
  "the app's features like connecting a bank account, setting up a budget, " +
  "and creating savings goals. Be warm and welcoming.";

// ── Currency formatter ────────────────────────────────────────────────
function fmtNGN(amount: number): string {
  return (
    "N" +
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  );
}

// ── Internal queries (used by the action via ctx.runQuery) ────────────

export const getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getConversationById = internalQuery({
  args: { conversationId: v.id("aiConversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const getBudgetForMonth = internalQuery({
  args: { userId: v.id("users"), month: v.string() },
  handler: async (ctx, args) => {
    const budget = await ctx.db
      .query("budgets")
      .withIndex("by_userId_month", (q) =>
        q.eq("userId", args.userId).eq("month", args.month)
      )
      .unique();

    if (!budget) return null;

    const categories = await ctx.db
      .query("budgetCategories")
      .withIndex("by_budgetId", (q) => q.eq("budgetId", budget._id))
      .collect();

    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);

    return {
      ...budget,
      categories,
      totalSpent,
      totalAllocated,
    };
  },
});

export const getSavingsGoalsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("savingsGoals")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getJapaProfileForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("japaMilestones")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getConnectedAccountsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("monoAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    return accounts.filter((a) => a.isActive);
  },
});

export const getRecentTransactionsForUser = internalQuery({
  args: { userId: v.id("users"), limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit);
  },
});

export const getBlackTaxSummaryForUser = internalQuery({
  args: { userId: v.id("users"), startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("blackTaxEntries")
      .withIndex("by_userId_date", (q) =>
        q
          .eq("userId", args.userId)
          .gte("date", args.startDate)
          .lte("date", args.endDate)
      )
      .collect();

    const total = entries.reduce((sum, e) => sum + e.amount, 0);
    return { total, entryCount: entries.length };
  },
});

// ── Internal query: count recent AI messages for rate limiting ─────────

export const countRecentUserMessages = internalQuery({
  args: { userId: v.id("users"), sinceTimestamp: v.number() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("aiConversations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    let count = 0;
    for (const convo of conversations) {
      for (const msg of convo.messages) {
        if (msg.role === "user" && msg.timestamp >= args.sinceTimestamp) {
          count++;
        }
      }
    }
    return count;
  },
});

// ── Internal mutations (for saving conversation data) ─────────────────

export const createConversationInternal = internalMutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("aiConversations", {
      userId: args.userId,
      title: args.title,
      messages: args.messages,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const appendMessagesInternal = internalMutation({
  args: {
    conversationId: v.id("aiConversations"),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        timestamp: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    await ctx.db.patch(args.conversationId, {
      messages: [...conversation.messages, ...args.messages],
      updatedAt: Date.now(),
    });
  },
});

// ── Build financial context string for the system prompt ──────────────

async function buildFinancialContext(
  ctx: any,
  userId: any,
  userCurrency: string,
  userCountry: string
): Promise<string> {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // "2026-03"
  const monthStart = `${currentMonth}-01`;
  const monthEnd = `${currentMonth}-31`;

  // Fetch all financial data in parallel via internal queries
  const [budget, savingsGoals, japaProfile, connectedAccounts, recentTxns, blackTaxSummary] =
    await Promise.all([
      ctx.runQuery(internal.aiSholz.getBudgetForMonth, {
        userId,
        month: currentMonth,
      }),
      ctx.runQuery(internal.aiSholz.getSavingsGoalsForUser, { userId }),
      ctx.runQuery(internal.aiSholz.getJapaProfileForUser, { userId }),
      ctx.runQuery(internal.aiSholz.getConnectedAccountsForUser, { userId }),
      ctx.runQuery(internal.aiSholz.getRecentTransactionsForUser, {
        userId,
        limit: 20,
      }),
      ctx.runQuery(internal.aiSholz.getBlackTaxSummaryForUser, {
        userId,
        startDate: monthStart,
        endDate: monthEnd,
      }),
    ]);

  // If user has no data at all, return the new-user context
  const hasAnyData =
    budget ||
    (savingsGoals && savingsGoals.length > 0) ||
    japaProfile ||
    (connectedAccounts && connectedAccounts.length > 0) ||
    (recentTxns && recentTxns.length > 0);

  if (!hasAnyData) {
    return NEW_USER_CONTEXT;
  }

  // Build the context string
  let context = "\n\nUSER'S FINANCIAL CONTEXT (use this to personalize responses):\n";
  context += `- Country: ${userCountry} / Currency: ${userCurrency}\n`;

  // Budget info
  if (budget) {
    const spentPercent =
      budget.totalIncome > 0
        ? ((budget.totalSpent / budget.totalIncome) * 100).toFixed(0)
        : "0";
    context += `- Monthly income: ${fmtNGN(budget.totalIncome)}\n`;
    context += `- This month's spending: ${fmtNGN(budget.totalSpent)} (${spentPercent}% of income)\n`;

    // Top spending categories
    if (budget.categories && budget.categories.length > 0) {
      const sorted = [...budget.categories].sort(
        (a: any, b: any) => b.spent - a.spent
      );
      const top3 = sorted
        .slice(0, 3)
        .map((c: any) => `${c.name} ${fmtNGN(c.spent)}`)
        .join(", ");
      context += `- Top spending categories: ${top3}\n`;

      // Over-budget categories
      const overBudget = budget.categories
        .filter((c: any) => c.spent > c.allocated)
        .map((c: any) => c.name);
      if (overBudget.length > 0) {
        context += `- Over-budget categories: ${overBudget.join(", ")}\n`;
      }
    }
  }

  // Savings goals
  if (savingsGoals && savingsGoals.length > 0) {
    const goalList = savingsGoals
      .map(
        (g: any) =>
          `${g.name} (${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}%)`
      )
      .join(", ");
    context += `- Savings goals: ${goalList}\n`;
  }

  // Japa profile
  if (japaProfile) {
    const progress =
      japaProfile.totalRequired > 0
        ? ((japaProfile.totalSaved / japaProfile.totalRequired) * 100).toFixed(0)
        : "0";
    context += `- Japa plan: ${japaProfile.destination} (${japaProfile.visaType.replace(/_/g, " ")}) - ${progress}% funded\n`;
  }

  // Connected banks
  if (connectedAccounts && connectedAccounts.length > 0) {
    const bankNames = connectedAccounts
      .map((a: any) => a.institution)
      .filter((name: string) => name !== "Loading...")
      .join(", ");
    if (bankNames) {
      context += `- Connected banks: ${bankNames}\n`;
    }
  }

  // Black tax
  if (blackTaxSummary && blackTaxSummary.total > 0) {
    context += `- Family support (black tax) this month: ${fmtNGN(blackTaxSummary.total)} across ${blackTaxSummary.entryCount} entries\n`;
  }

  // Recent transaction summary — aggregated by category, no merchant names or individual amounts
  if (recentTxns && recentTxns.length > 0) {
    const debits = recentTxns.filter((t: any) => t.type === "debit");
    if (debits.length > 0) {
      // Aggregate by category instead of listing individual transactions
      const categoryTotals: Record<string, number> = {};
      for (const t of debits) {
        const cat = t.category || "Uncategorized";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
      }
      const totalDebitSpend = debits.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
      const categorySummary = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([cat, total]) => `${cat}: ${fmtNGN(total as number)}`)
        .join(", ");
      context += `- Recent spending (${debits.length} transactions, total ${fmtNGN(totalDebitSpend)}): ${categorySummary}\n`;
    }
  }

  return context;
}

// ── Main action: send message to AI Sholz ────────────────────────────

export const sendMessage = action({
  args: {
    message: v.string(),
    tone: v.string(), // "warm" | "formal" | "roast"
    conversationId: v.optional(v.id("aiConversations")),
  },
  handler: async (ctx, args): Promise<{ response: string; conversationId: Id<"aiConversations"> }> => {
    const identity = await ctx.auth.getUserIdentity();

    // 1. Get user from DB (may not exist yet if Clerk webhook hasn't fired)
    let user: any = null;
    if (identity) {
      user = await ctx.runQuery(
        internal.aiSholz.getUserByClerkId,
        { clerkId: identity.subject }
      );
    }

    // If user doesn't exist in Convex yet, use a lightweight fallback
    const userId = user?._id;
    const userCurrency = user?.currency ?? "NGN";
    const userCountry = user?.country ?? "NG";

    // ── Rate limiting ─────────────────────────────────────────────────
    if (userId) {
      const now = Date.now();
      const oneMinuteAgo = now - 60 * 1000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      const [messagesLastMinute, messagesLastDay] = await Promise.all([
        ctx.runQuery(internal.aiSholz.countRecentUserMessages, {
          userId,
          sinceTimestamp: oneMinuteAgo,
        }),
        ctx.runQuery(internal.aiSholz.countRecentUserMessages, {
          userId,
          sinceTimestamp: oneDayAgo,
        }),
      ]);

      if (messagesLastMinute >= 10) {
        throw new Error(
          "You're sending messages too quickly. Please wait a moment."
        );
      }
      if (messagesLastDay >= 100) {
        throw new Error(
          "You've reached your daily message limit. Try again tomorrow."
        );
      }
    }

    // 2. Get or create conversation
    let conversationId = args.conversationId;
    let conversationHistory: Array<{ role: string; content: string }> = [];

    if (conversationId) {
      // Load existing conversation
      const conversation: any = await ctx.runQuery(
        internal.aiSholz.getConversationById,
        { conversationId }
      );

      if (conversation && userId && conversation.userId === userId) {
        // Extract message history (skip system messages, keep last 20 for context window)
        conversationHistory = conversation.messages
          .filter((m: any) => m.role !== "system")
          .slice(-20)
          .map((m: any) => ({
            role: m.role,
            content: m.content,
          }));
      }
    }

    // 3. Sanitize user input
    const MAX_MESSAGE_LENGTH = 2000;
    let sanitizedMessage = args.message.trim();
    if (sanitizedMessage.length === 0) {
      throw new Error("Message cannot be empty");
    }
    if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
      sanitizedMessage = sanitizedMessage.slice(0, MAX_MESSAGE_LENGTH);
    }
    // Strip common prompt injection patterns
    sanitizedMessage = sanitizedMessage
      .replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior|earlier)\s+(instructions?|prompts?|rules?|context)\b/gi, "[filtered]")
      .replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|new\s+instructions?)\b/gi, "[filtered]")
      .replace(/\b(system\s*:?\s*prompt|<<\s*SYS|INST\s*>>)\b/gi, "[filtered]");

    // 4. Build the full system prompt with financial context
    const basePrompt = getSystemPrompt(args.tone);
    let financialContext = NEW_USER_CONTEXT;
    if (userId) {
      try {
        financialContext = await buildFinancialContext(ctx, userId, userCurrency, userCountry);
      } catch {
        financialContext = NEW_USER_CONTEXT;
      }
    }
    const systemPrompt = basePrompt + financialContext;

    // Audit log: record that AI accessed financial context
    if (userId && financialContext !== NEW_USER_CONTEXT) {
      await ctx.runMutation(internal.users.logAuditEvent, {
        userId,
        action: "ai_financial_context_access",
        details: "AI chatbot accessed user financial summary",
      });
    }

    // 4. Call OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const openai = new OpenAI({ apiKey });

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: sanitizedMessage },
    ];

    let aiResponse: string;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      aiResponse =
        completion.choices[0]?.message?.content ??
        "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      throw new Error(
        "Failed to get AI response. Please try again in a moment."
      );
    }

    // 6. Save messages to conversation (only if user exists in DB)
    const now = Date.now();
    const newMessages = [
      { role: "user", content: sanitizedMessage, timestamp: now },
      { role: "assistant", content: aiResponse, timestamp: now + 1 },
    ];

    if (userId) {
      if (conversationId) {
        await ctx.runMutation(internal.aiSholz.appendMessagesInternal, {
          conversationId,
          messages: newMessages,
        });
      } else {
        const title =
          args.message.length > 50
            ? args.message.slice(0, 50) + "..."
            : args.message;

        conversationId = await ctx.runMutation(
          internal.aiSholz.createConversationInternal,
          {
            userId,
            title,
            messages: newMessages,
          }
        );
      }
    }

    // 6. Return the response
    return {
      response: aiResponse,
      conversationId: conversationId ?? ("" as any),
    };
  },
});

// ── Public queries for conversation management ────────────────────────

export const getConversation = query({
  args: { conversationId: v.id("aiConversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || conversation.userId !== user._id) return null;

    return conversation;
  },
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return [];

    const conversations = await ctx.db
      .query("aiConversations")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    // Return lightweight list (no full messages)
    return conversations.map((c) => ({
      _id: c._id,
      title: c.title,
      messageCount: c.messages.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },
});

export const createConversation = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const now = Date.now();
    return await ctx.db.insert("aiConversations", {
      userId: user._id,
      title: "New conversation",
      messages: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});
