// ── Currency ─────────────────────────────────────────────────────────
export const CURRENCIES = {
  NGN: "Nigerian Naira",
  GBP: "British Pound",
  USD: "US Dollar",
  CAD: "Canadian Dollar",
  EUR: "Euro",
  AED: "UAE Dirham",
  ZAR: "South African Rand",
  GHS: "Ghanaian Cedi",
  KES: "Kenyan Shilling",
} as const;

export type Currency = keyof typeof CURRENCIES;

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "\u20A6",
  GBP: "\u00A3",
  USD: "$",
  CAD: "C$",
  EUR: "\u20AC",
  AED: "AED",
  ZAR: "R",
  GHS: "GH\u20B5",
  KES: "KSh",
};

// ── Country ─────────────────────────────────────────────────────────
export const COUNTRIES = {
  NG: "Nigeria",
  GB: "United Kingdom",
  US: "United States",
  CA: "Canada",
  DE: "Germany",
  AE: "United Arab Emirates",
  GH: "Ghana",
  KE: "Kenya",
  ZA: "South Africa",
} as const;

export type Country = keyof typeof COUNTRIES;

/** Default currency for each country */
export const COUNTRY_CURRENCY: Record<Country, Currency> = {
  NG: "NGN",
  GB: "GBP",
  US: "USD",
  CA: "CAD",
  DE: "EUR",
  AE: "AED",
  GH: "GHS",
  KE: "KES",
  ZA: "ZAR",
};

// ── Asset types ─────────────────────────────────────────────────────
export const ASSET_TYPES = {
  bank: "Bank Account",
  investment: "Investment",
  pension: "Pension",
  property: "Property",
  crypto: "Cryptocurrency",
  cash: "Cash",
  other: "Other",
} as const;

export type AssetType = keyof typeof ASSET_TYPES;

// ── Budget modes ────────────────────────────────────────────────────
export const BUDGET_MODES = {
  flex: "Flex Budget",
  zero_based: "Zero-Based Budget",
} as const;

export type BudgetMode = keyof typeof BUDGET_MODES;

// ── Subscription tiers ──────────────────────────────────────────────
export const SUBSCRIPTION_TIERS = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export const SUBSCRIPTION_STATUSES = {
  active: "Active",
  trialing: "Trialing",
  past_due: "Past Due",
  canceled: "Canceled",
} as const;

export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUSES;

// ── Transaction types ───────────────────────────────────────────────
export type TransactionType = "debit" | "credit";

export type TransactionChannel =
  | "pos"
  | "web"
  | "atm"
  | "mobile"
  | "bank_transfer"
  | "direct_debit"
  | "other";

// ── Category layers ─────────────────────────────────────────────────
// Layer 1: Mono ML categories (from Mono API)
// Layer 2: Nigerian rule-based categories (our custom rules)
// Layer 3: User override (manual categorization)

export const NIGERIAN_EXPENSE_CATEGORIES = {
  // Food & Drink
  "jollof-and-chops": "Jollof & Chops",
  "suya-and-snacks": "Suya & Snacks",
  "eating-out": "Eating Out",
  groceries: "Groceries",

  // Transport
  "bolt-uber": "Bolt / Uber",
  fuel: "Fuel",
  transport: "Transport",

  // Bills & Utilities
  "data-airtime": "Data & Airtime",
  nepa: "NEPA (Electricity)",
  dstv: "DStv / GOtv",
  rent: "Rent",
  water: "Water",

  // Social & Entertainment
  owambe: "Owambe",
  "aso-ebi": "Aso Ebi",
  hangout: "Hangout",
  "church-mosque": "Church / Mosque",
  dating: "Dating",

  // Family
  "black-tax": "Black Tax",
  "school-fees": "School Fees",
  "family-support": "Family Support",

  // Shopping
  fashion: "Fashion",
  "phone-gadgets": "Phone & Gadgets",
  "beauty-grooming": "Beauty & Grooming",
  "home-decor": "Home & Decor",

  // Health
  "hospital-pharmacy": "Hospital / Pharmacy",
  "gym-fitness": "Gym & Fitness",
  "health-insurance": "Health Insurance (HMO)",

  // Savings & Investment
  "savings-deposit": "Savings Deposit",
  investment: "Investment",
  pension: "Pension",

  // Income
  salary: "Salary",
  freelance: "Freelance Income",
  "side-hustle": "Side Hustle",
  business: "Business Income",
  gift: "Gift Received",

  // Other
  "bank-charges": "Bank Charges",
  "loan-repayment": "Loan Repayment",
  insurance: "Insurance",
  education: "Education",
  miscellaneous: "Miscellaneous",
} as const;

export type NigerianExpenseCategory = keyof typeof NIGERIAN_EXPENSE_CATEGORIES;

// ── Nigerian categorization rules (Layer 2) ─────────────────────────
// These rules match against transaction narrations to auto-categorize.
export const NIGERIAN_CATEGORY_RULES: Array<{
  pattern: RegExp;
  category: NigerianExpenseCategory;
}> = [
  // Transport
  { pattern: /bolt|uber|ride/i, category: "bolt-uber" },
  { pattern: /fuel|petrol|filling station|nnpc|oando|total/i, category: "fuel" },

  // Bills
  { pattern: /mtn|glo|airtel|9mobile|airtime|data bundle/i, category: "data-airtime" },
  { pattern: /ikedc|ekedc|aedc|phed|nepa|electricity|prepaid meter/i, category: "nepa" },
  { pattern: /dstv|gotv|multichoice|startimes/i, category: "dstv" },

  // Food
  { pattern: /chicken republic|kilimanjaro|dominos|kfc|shoprite food|food court/i, category: "eating-out" },
  { pattern: /shoprite|spar|market|grocery/i, category: "groceries" },

  // Banking
  { pattern: /stamp duty|sms alert|maint.*fee|vat|card.*fee|transfer fee/i, category: "bank-charges" },

  // Savings & Investment
  { pattern: /piggyvest|cowrywise|risevest|bamboo|chaka/i, category: "investment" },
  { pattern: /pension|pencom|rsafund/i, category: "pension" },

  // Income patterns
  { pattern: /salary|payroll/i, category: "salary" },

  // Health
  { pattern: /pharmacy|hospital|clinic|hmo|hygeia|leadway health/i, category: "hospital-pharmacy" },

  // Education
  { pattern: /school fees|tuition|university|polytechnic/i, category: "school-fees" },
];

// ── Black Tax relationships ─────────────────────────────────────────
export const BLACK_TAX_RELATIONSHIPS = {
  mother: "Mother",
  father: "Father",
  sibling: "Sibling",
  extended_family: "Extended Family",
  other: "Other",
} as const;

export type BlackTaxRelationship = keyof typeof BLACK_TAX_RELATIONSHIPS;

export const BLACK_TAX_CATEGORIES = {
  school_fees: "School Fees",
  medical: "Medical Bills",
  rent: "Rent",
  food: "Food & Provisions",
  general_support: "General Support",
} as const;

export type BlackTaxCategory = keyof typeof BLACK_TAX_CATEGORIES;

// ── Japa destinations ───────────────────────────────────────────────
export const JAPA_DESTINATIONS = {
  UK: "United Kingdom",
  Canada: "Canada",
  US: "United States",
  Germany: "Germany",
  UAE: "United Arab Emirates",
  Australia: "Australia",
  "South Africa": "South Africa",
} as const;

export type JapaDestination = keyof typeof JAPA_DESTINATIONS;

export const JAPA_VISA_TYPES = {
  skilled_worker: "Skilled Worker Visa",
  student: "Student Visa",
  pr: "Permanent Residency",
  blue_card: "EU Blue Card",
} as const;

export type JapaVisaType = keyof typeof JAPA_VISA_TYPES;

// ── AI tone preferences ─────────────────────────────────────────────
export const AI_TONE_PREFERENCES = {
  warm: "Warm & Friendly",
  formal: "Formal & Professional",
} as const;

export type AiTonePreference = keyof typeof AI_TONE_PREFERENCES;

// ── Account types ───────────────────────────────────────────────────
export type BankAccountType = "savings" | "current";

// ── Screenshot import statuses ──────────────────────────────────────
export type ScreenshotImportStatus = "pending" | "processing" | "completed" | "failed";

// ── Consent types ───────────────────────────────────────────────────
export const CONSENT_TYPES = {
  bank_data: "Bank Data Access",
  marketing: "Marketing Communications",
  analytics: "Analytics Tracking",
  data_processing: "Data Processing (NDPA/GDPR)",
} as const;

export type ConsentType = keyof typeof CONSENT_TYPES;

// ── Payment providers ───────────────────────────────────────────────
export type PaymentProvider = "paystack" | "stripe";

// ── Subscription provider by country ────────────────────────────────
export const COUNTRY_PAYMENT_PROVIDER: Record<Country, PaymentProvider> = {
  NG: "paystack",
  GH: "paystack",
  KE: "paystack",
  ZA: "paystack",
  GB: "stripe",
  US: "stripe",
  CA: "stripe",
  DE: "stripe",
  AE: "stripe",
};
