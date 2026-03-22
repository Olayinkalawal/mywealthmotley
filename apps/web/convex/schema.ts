import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Users (synced from Clerk) ──────────────────────────────────────
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
    country: v.string(), // "NG", "GB", "US", "CA", "DE", "AE", "GH", "KE", "ZA"
    currency: v.string(), // "NGN", "GBP", "USD", "CAD", "EUR", "AED", "ZAR", "GHS", "KES"
    onboardingCompleted: v.boolean(),
    onboardingStep: v.optional(v.number()),
    subscriptionTier: v.string(), // "free" | "pro" | "premium"
    subscriptionStatus: v.string(), // "active" | "trialing" | "past_due" | "canceled"
    subscriptionProvider: v.optional(v.string()), // "paystack" | "stripe"
    subscriptionExternalId: v.optional(v.string()),
    ndpaConsentAt: v.optional(v.number()),
    gdprConsentAt: v.optional(v.number()),
    marketingConsentAt: v.optional(v.number()),
    moneyDnaArchetype: v.optional(v.string()),
    aiTonePreference: v.string(), // "warm" | "formal"
    createdAt: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  // ── Mono-connected bank accounts ───────────────────────────────────
  monoAccounts: defineTable({
    userId: v.id("users"),
    monoAccountId: v.string(),
    monoCode: v.optional(v.string()),
    institution: v.string(), // "GTBank", "Access Bank", etc.
    accountName: v.string(),
    accountNumber: v.optional(v.string()), // last 4 digits only
    balance: v.number(),
    currency: v.string(),
    type: v.string(), // "savings" | "current"
    lastSynced: v.number(),
    isActive: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_monoAccountId", ["monoAccountId"]),

  // ── Bank transactions from Mono ────────────────────────────────────
  transactions: defineTable({
    userId: v.id("users"),
    accountId: v.id("monoAccounts"),
    monoTransactionId: v.string(),
    narration: v.string(),
    amount: v.number(),
    type: v.string(), // "debit" | "credit"
    balance: v.optional(v.number()),
    date: v.string(), // ISO date
    currency: v.string(),
    monoCategory: v.optional(v.string()), // Layer 1: Mono ML
    ruleCategory: v.optional(v.string()), // Layer 2: Nigerian rules
    userCategory: v.optional(v.string()), // Layer 3: User override
    effectiveCategory: v.string(), // Resolved final category
    amountConverted: v.optional(v.number()), // In user's primary currency
    fxRateAtDate: v.optional(v.number()),
    merchant: v.optional(v.string()),
    channel: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"])
    .index("by_accountId", ["accountId"])
    .index("by_effectiveCategory", ["effectiveCategory"]),

  // ── Manually-added assets ──────────────────────────────────────────
  manualAssets: defineTable({
    userId: v.id("users"),
    name: v.string(), // "My Cowrywise Portfolio", "Pension - ARM", etc.
    type: v.string(), // "investment" | "pension" | "property" | "crypto" | "cash" | "other"
    platform: v.optional(v.string()), // "Cowrywise", "Trading 212", "Bamboo", "ARM Pensions"
    value: v.number(),
    currency: v.string(),
    lastUpdated: v.number(),
    screenshotImportId: v.optional(v.id("screenshotImports")),
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
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"]),

  // ── AI screenshot import records ───────────────────────────────────
  screenshotImports: defineTable({
    userId: v.id("users"),
    imageStorageId: v.string(), // Convex file storage ID
    extractedData: v.optional(v.string()), // JSON of AI extraction result
    platform: v.optional(v.string()), // Detected platform
    status: v.string(), // "pending" | "processing" | "completed" | "failed"
    errorMessage: v.optional(v.string()),
    processedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  // ── Monthly budgets ────────────────────────────────────────────────
  budgets: defineTable({
    userId: v.id("users"),
    month: v.string(), // "2026-03"
    mode: v.string(), // "flex" | "zero_based"
    totalIncome: v.number(),
    currency: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_month", ["userId", "month"]),

  // ── Budget category allocations ────────────────────────────────────
  budgetCategories: defineTable({
    userId: v.id("users"),
    budgetId: v.id("budgets"),
    name: v.string(), // "Jollof & Chops", "Data & Airtime", "Owambe", "Black Tax"
    allocated: v.number(),
    spent: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  }).index("by_budgetId", ["budgetId"]),

  // ── Virtual savings buckets ────────────────────────────────────────
  savingsGoals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    currency: v.string(),
    targetDate: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isLocked: v.boolean(),
    lockUntil: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ── Black Tax / family obligation tracking ─────────────────────────
  blackTaxEntries: defineTable({
    userId: v.id("users"),
    recipientName: v.string(),
    relationship: v.string(), // "mother" | "father" | "sibling" | "extended_family" | "other"
    amount: v.number(),
    currency: v.string(),
    date: v.string(),
    category: v.string(), // "school_fees" | "medical" | "rent" | "food" | "general_support"
    note: v.optional(v.string()),
    isRecurring: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"]),

  // ── Japa Ready Score milestones ────────────────────────────────────
  japaMilestones: defineTable({
    userId: v.id("users"),
    destination: v.string(), // "UK", "Canada", "US", "Germany", "UAE", "Australia", "South Africa"
    visaType: v.string(), // "skilled_worker" | "student" | "pr" | "blue_card"
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
    totalRequired: v.number(),
    totalSaved: v.number(),
    readinessScore: v.number(), // 0-100
    targetDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ── Cached FX rates ────────────────────────────────────────────────
  exchangeRates: defineTable({
    baseCurrency: v.string(),
    targetCurrency: v.string(),
    rate: v.number(),
    source: v.string(), // "currency-api" | "frankfurter" | "manual"
    fetchedAt: v.number(),
  }).index("by_currencies", ["baseCurrency", "targetCurrency"]),

  // ── Billing / subscriptions ────────────────────────────────────────
  subscriptions: defineTable({
    userId: v.id("users"),
    tier: v.string(),
    status: v.string(),
    provider: v.string(), // "paystack" | "stripe"
    externalId: v.string(),
    planCode: v.optional(v.string()),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    currency: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_externalId", ["externalId"]),

  // ── Usage analytics ────────────────────────────────────────────────
  analyticsEvents: defineTable({
    userId: v.optional(v.id("users")),
    event: v.string(),
    properties: v.optional(v.string()), // JSON
    sessionId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_event", ["event"]),

  // ── Admin audit log (compliance) ───────────────────────────────────
  adminAuditLog: defineTable({
    adminUserId: v.id("users"),
    action: v.string(),
    targetUserId: v.optional(v.id("users")),
    details: v.string(),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_adminUserId", ["adminUserId"])
    .index("by_timestamp", ["timestamp"]),

  // ── Historical net worth snapshots ─────────────────────────────────
  netWorthSnapshots: defineTable({
    userId: v.id("users"),
    date: v.string(), // "2026-03-18"
    totalValue: v.number(), // In user's primary currency
    breakdown: v.array(
      v.object({
        type: v.string(), // "bank" | "investment" | "pension" | "property" | "crypto" | "cash"
        value: v.number(),
        currency: v.string(),
        convertedValue: v.number(),
      })
    ),
    currencyBreakdown: v.array(
      v.object({
        currency: v.string(),
        value: v.number(),
        percentage: v.number(),
      })
    ),
    primaryCurrency: v.string(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"]),

  // ── NDPA / GDPR consent records ────────────────────────────────────
  consentRecords: defineTable({
    userId: v.id("users"),
    consentType: v.string(), // "bank_data" | "marketing" | "analytics" | "data_processing"
    granted: v.boolean(),
    timestamp: v.number(),
    ipAddress: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // ── AI Sholz conversations ──────────────────────────────────────
  aiConversations: defineTable({
    userId: v.id("users"),
    messages: v.array(
      v.object({
        role: v.string(), // "user" | "assistant" | "system"
        content: v.string(),
        timestamp: v.number(),
      })
    ),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_updatedAt", ["updatedAt"]),

  // ── In-app notifications ──────────────────────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "spending_alert" | "budget_warning" | "savings_milestone" | "japa_update" | "system" | "tip"
    isRead: v.boolean(),
    link: v.optional(v.string()), // optional route to navigate to
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_unread", ["userId", "isRead"]),

  // ── Waitlist signups ─────────────────────────────────────────────
  waitlist: defineTable({
    email: v.string(),
    country: v.string(), // Country code: "NG", "GB", "US", etc.
    referralCode: v.string(), // Unique referral code for this signup
    referredBy: v.optional(v.string()), // Referral code of the person who referred them
    position: v.number(), // Queue position
    referralCount: v.number(), // Number of successful referrals
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_referralCode", ["referralCode"])
    .index("by_position", ["position"]),
});
