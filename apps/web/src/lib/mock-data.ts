import type { CurrencyCode } from "./constants";

// ── Asset types ─────────────────────────────────────────────────────
export type AssetType =
  | "bank"
  | "investment"
  | "pension"
  | "property"
  | "crypto"
  | "cash"
  | "other";

export type AssetSource = "mono" | "manual" | "screenshot";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  platform?: string;
  value: number;
  currency: CurrencyCode;
  convertedValue: number; // In user's primary currency (NGN)
  source: AssetSource;
  lastUpdated: number;
  notes?: string;
  holdings?: {
    ticker?: string;
    name: string;
    quantity?: number;
    value: number;
    currency: CurrencyCode;
  }[];
}

export interface AssetBreakdown {
  type: AssetType;
  label: string;
  value: number;
  percentage: number;
  items: number;
  color: string;
}

export interface CurrencyAllocation {
  currency: CurrencyCode;
  value: number;
  convertedValue: number;
  percentage: number;
  color: string;
}

export interface NetWorthSnapshot {
  date: string; // "2026-03" format
  label: string; // "Mar 2026"
  value: number;
}

// ── Exchange rates (base: USD) ──────────────────────────────────────
export const MOCK_EXCHANGE_RATES = new Map<string, number>([
  ["USD", 1],
  ["NGN", 1550],
  ["GBP", 0.79],
  ["EUR", 0.92],
  ["CAD", 1.36],
]);

// Helper to convert to NGN
function toNGN(amount: number, from: CurrencyCode): number {
  const fromRate = MOCK_EXCHANGE_RATES.get(from) ?? 1;
  const ngnRate = MOCK_EXCHANGE_RATES.get("NGN") ?? 1550;
  return (amount / fromRate) * ngnRate;
}

// ── Mock assets for a Nigerian user in the UK ───────────────────────
export const MOCK_ASSETS: Asset[] = [
  {
    id: "acc-1",
    name: "GTBank Savings",
    type: "bank",
    platform: "Guaranty Trust Bank",
    value: 2_500_000,
    currency: "NGN",
    convertedValue: 2_500_000,
    source: "mono",
    lastUpdated: Date.now() - 1000 * 60 * 30, // 30 min ago
  },
  {
    id: "acc-2",
    name: "Access Bank Current",
    type: "bank",
    platform: "Access Bank",
    value: 1_200_000,
    currency: "NGN",
    convertedValue: 1_200_000,
    source: "mono",
    lastUpdated: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "acc-3",
    name: "Cowrywise Portfolio",
    type: "investment",
    platform: "Cowrywise",
    value: 800_000,
    currency: "NGN",
    convertedValue: 800_000,
    source: "manual",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    holdings: [
      {
        name: "Cowrywise Dollar Fund",
        value: 400_000,
        currency: "NGN",
      },
      {
        name: "Cowrywise Regular Plan",
        value: 400_000,
        currency: "NGN",
      },
    ],
  },
  {
    id: "acc-4",
    name: "Trading 212 Stocks",
    type: "investment",
    platform: "Trading 212",
    value: 3_200,
    currency: "USD",
    convertedValue: toNGN(3_200, "USD"),
    source: "screenshot",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    holdings: [
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 5,
        value: 1_100,
        currency: "USD",
      },
      {
        ticker: "VUSA",
        name: "Vanguard S&P 500",
        quantity: 12,
        value: 2_100,
        currency: "USD",
      },
    ],
  },
  {
    id: "acc-5",
    name: "ARM Pension",
    type: "pension",
    platform: "ARM Pensions",
    value: 1_500_000,
    currency: "NGN",
    convertedValue: 1_500_000,
    source: "manual",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 14, // 2 weeks ago
  },
  {
    id: "acc-6",
    name: "Bitcoin",
    type: "crypto",
    platform: "Binance",
    value: 500,
    currency: "USD",
    convertedValue: toNGN(500, "USD"),
    source: "manual",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    notes: "Long-term hold, DCA weekly",
  },
  {
    id: "acc-7",
    name: "House Deposit Savings",
    type: "cash",
    platform: "Monzo",
    value: 5_000,
    currency: "GBP",
    convertedValue: toNGN(5_000, "GBP"),
    source: "manual",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    notes: "Saving for property deposit in the UK",
  },
];

// ── Derived data ────────────────────────────────────────────────────

// Total net worth in NGN
export const MOCK_TOTAL_NET_WORTH = MOCK_ASSETS.reduce(
  (sum, a) => sum + a.convertedValue,
  0,
);

// Total in USD equivalent
export const MOCK_TOTAL_NET_WORTH_USD = MOCK_TOTAL_NET_WORTH / (MOCK_EXCHANGE_RATES.get("NGN") ?? 1550);

// Last month's net worth (simulate 3.2% lower)
export const MOCK_LAST_MONTH_NET_WORTH = MOCK_TOTAL_NET_WORTH / 1.032;
export const MOCK_MONTHLY_CHANGE_PERCENT = 3.2;

// Primary / secondary currency
export const MOCK_PRIMARY_CURRENCY: CurrencyCode = "NGN";
export const MOCK_SECONDARY_CURRENCY: CurrencyCode = "USD";

// Asset type color map
export const ASSET_TYPE_COLORS: Record<AssetType, string> = {
  bank: "hsl(19.6, 33.3%, 42%)",          // Cocoa mid-tone (visible in both modes)
  investment: "hsl(7.7, 77.1%, 60.6%)",   // Coral (chart-2)
  pension: "hsl(41.8, 62.8%, 54.7%)",     // Gold (chart-3)
  property: "hsl(137.1, 25.7%, 48%)",     // Sage green (chart-4)
  crypto: "hsl(37.3, 90%, 47.3%)",        // Amber (chart-5)
  cash: "hsl(210, 40%, 55%)",             // Blue-ish
  other: "hsl(280, 30%, 55%)",            // Purple-ish
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  bank: "Banks",
  investment: "Investments",
  pension: "Pensions",
  property: "Property",
  crypto: "Crypto",
  cash: "Cash",
  other: "Other",
};

// ── Asset breakdown by type ─────────────────────────────────────────
export const MOCK_ASSET_BREAKDOWN: AssetBreakdown[] = (() => {
  const grouped: Record<string, { value: number; items: number }> = {};
  for (const asset of MOCK_ASSETS) {
    if (!grouped[asset.type]) {
      grouped[asset.type] = { value: 0, items: 0 };
    }
    grouped[asset.type]!.value += asset.convertedValue;
    grouped[asset.type]!.items += 1;
  }
  const total = Object.values(grouped).reduce((s, g) => s + g.value, 0);
  return Object.entries(grouped)
    .map(([type, data]) => ({
      type: type as AssetType,
      label: ASSET_TYPE_LABELS[type as AssetType],
      value: data.value,
      percentage: total > 0 ? (data.value / total) * 100 : 0,
      items: data.items,
      color: ASSET_TYPE_COLORS[type as AssetType],
    }))
    .sort((a, b) => b.value - a.value);
})();

// ── Currency allocation ─────────────────────────────────────────────
export const CURRENCY_COLORS: Record<string, string> = {
  NGN: "hsl(19.6, 33.3%, 42%)",
  USD: "hsl(7.7, 77.1%, 60.6%)",
  GBP: "hsl(41.8, 62.8%, 54.7%)",
  EUR: "hsl(137.1, 25.7%, 48%)",
  CAD: "hsl(37.3, 90%, 47.3%)",
};

export const MOCK_CURRENCY_ALLOCATION: CurrencyAllocation[] = (() => {
  const grouped: Record<string, { value: number; convertedValue: number }> = {};
  for (const asset of MOCK_ASSETS) {
    if (!grouped[asset.currency]) {
      grouped[asset.currency] = { value: 0, convertedValue: 0 };
    }
    grouped[asset.currency]!.value += asset.value;
    grouped[asset.currency]!.convertedValue += asset.convertedValue;
  }
  const totalConverted = Object.values(grouped).reduce(
    (s, g) => s + g.convertedValue,
    0,
  );
  return Object.entries(grouped)
    .map(([currency, data]) => ({
      currency: currency as CurrencyCode,
      value: data.value,
      convertedValue: data.convertedValue,
      percentage:
        totalConverted > 0 ? (data.convertedValue / totalConverted) * 100 : 0,
      color: CURRENCY_COLORS[currency] ?? "hsl(280, 30%, 55%)",
    }))
    .sort((a, b) => b.convertedValue - a.convertedValue);
})();

// ── Black Tax mock data ─────────────────────────────────────────────
export interface BlackTaxEntry {
  id: string;
  recipientName: string;
  relationship: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  note: string;
}

export interface BlackTaxSummary {
  totalThisYear: number;
  totalThisMonth: number;
  percentageOfIncome: number;
  monthlyAverage: number;
  byRelationship: Record<string, number>;
  byCategory: Record<string, number>;
}

export const MOCK_BLACK_TAX = {
  entries: [
    { id: "1", recipientName: "Mum", relationship: "mother", amount: 25000, currency: "NGN", date: "2026-03-15", category: "general_support", note: "Monthly support" },
    { id: "2", recipientName: "Sister - Aisha", relationship: "sibling", amount: 20000, currency: "NGN", date: "2026-03-08", category: "school_fees", note: "University fees contribution" },
    { id: "3", recipientName: "Uncle Bayo", relationship: "extended_family", amount: 15000, currency: "NGN", date: "2026-03-02", category: "medical", note: "Hospital bill" },
    { id: "4", recipientName: "Mum", relationship: "mother", amount: 30000, currency: "NGN", date: "2026-02-15", category: "rent", note: "Rent contribution" },
    { id: "5", recipientName: "Cousin Tunde", relationship: "extended_family", amount: 10000, currency: "NGN", date: "2026-02-20", category: "general_support", note: "" },
    { id: "6", recipientName: "Dad", relationship: "father", amount: 20000, currency: "NGN", date: "2026-02-10", category: "medical", note: "Medication" },
    { id: "7", recipientName: "Mum", relationship: "mother", amount: 25000, currency: "NGN", date: "2026-01-15", category: "general_support", note: "Monthly support" },
    { id: "8", recipientName: "Sister - Aisha", relationship: "sibling", amount: 35000, currency: "NGN", date: "2026-01-05", category: "school_fees", note: "New semester fees" },
  ] as BlackTaxEntry[],
  summary: {
    totalThisYear: 180000,
    totalThisMonth: 60000,
    percentageOfIncome: 13.3,
    monthlyAverage: 60000,
    byRelationship: { mother: 51, father: 11, sibling: 22, extended_family: 16 },
    byCategory: { general_support: 40, school_fees: 30, medical: 20, rent: 10 },
  } as BlackTaxSummary,
};

// ── Japa mock data ──────────────────────────────────────────────────
export interface JapaMilestone {
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface JapaProfile {
  destination: string;
  visaType: string;
  milestones: JapaMilestone[];
  totalRequired: number;
  totalSaved: number;
  readinessScore: number;
  targetDate: string;
  monthlySavings: number;
  estimatedReadyDate: string;
}

export const MOCK_JAPA: JapaProfile = {
  destination: "UK",
  visaType: "skilled_worker",
  milestones: [
    { name: "Visa Application Fee", targetAmount: 180000, currentAmount: 180000, currency: "NGN", isCompleted: true, isLocked: false },
    { name: "Flight Ticket", targetAmount: 450000, currentAmount: 450000, currency: "NGN", isCompleted: true, isLocked: false },
    { name: "Proof of Funds", targetAmount: 1200000, currentAmount: 984000, currency: "NGN", isCompleted: false, isLocked: false },
    { name: "First 3 Months Living", targetAmount: 2500000, currentAmount: 0, currency: "NGN", isCompleted: false, isLocked: true },
    { name: "Emergency Buffer", targetAmount: 500000, currentAmount: 0, currency: "NGN", isCompleted: false, isLocked: true },
  ],
  totalRequired: 4830000,
  totalSaved: 1614000,
  readinessScore: 33,
  targetDate: "2027-06-01",
  monthlySavings: 80000,
  estimatedReadyDate: "2028-01",
};

// ── Historical net worth trend (monthly) ────────────────────────────
export const MOCK_NET_WORTH_TREND: NetWorthSnapshot[] = [
  { date: "2025-04", label: "Apr 2025", value: 9_200_000 },
  { date: "2025-05", label: "May 2025", value: 9_450_000 },
  { date: "2025-06", label: "Jun 2025", value: 9_100_000 },
  { date: "2025-07", label: "Jul 2025", value: 9_800_000 },
  { date: "2025-08", label: "Aug 2025", value: 10_200_000 },
  { date: "2025-09", label: "Sep 2025", value: 10_500_000 },
  { date: "2025-10", label: "Oct 2025", value: 10_300_000 },
  { date: "2025-11", label: "Nov 2025", value: 10_800_000 },
  { date: "2025-12", label: "Dec 2025", value: 11_200_000 },
  { date: "2026-01", label: "Jan 2026", value: 11_600_000 },
  { date: "2026-02", label: "Feb 2026", value: MOCK_LAST_MONTH_NET_WORTH },
  { date: "2026-03", label: "Mar 2026", value: MOCK_TOTAL_NET_WORTH },
];

// ── Budget mock data ──────────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
}

export interface Budget {
  month: string;
  mode: "flex" | "strict";
  totalIncome: number;
  currency: string;
  categories: BudgetCategory[];
  totalAllocated: number;
  totalSpent: number;
}

export interface Transaction {
  id: string;
  narration: string;
  amount: number;
  type: "debit" | "credit";
  date: string;
  category: string;
  merchant: string;
}

export const MOCK_BUDGET: Budget = {
  month: "2026-03",
  mode: "flex" as const,
  totalIncome: 450000,
  currency: "NGN",
  categories: [
    { id: "rent", name: "Rent & Housing", allocated: 120000, spent: 120000, color: "#8B6B5A", icon: "home" },
    { id: "food", name: "Jollof & Chops", allocated: 72000, spent: 48200, color: "#E8614D", icon: "utensils" },
    { id: "transport", name: "Transport & Bolt", allocated: 55000, spent: 22100, color: "#5B9A6D", icon: "car" },
    { id: "data_airtime", name: "Data & Airtime", allocated: 20000, spent: 18400, color: "#2563EB", icon: "wifi" },
    { id: "family_support", name: "Family Support", allocated: 60000, spent: 45000, color: "#D4A843", icon: "users" },
    { id: "owambe", name: "Owambe & Aso Ebi", allocated: 50000, spent: 26000, color: "#EC4899", icon: "party-popper" },
    { id: "church_tithes", name: "Tithes & Offerings", allocated: 45000, spent: 45000, color: "#8B5CF6", icon: "heart" },
    { id: "utilities", name: "Utilities & Bills", allocated: 15000, spent: 8900, color: "#F59E0B", icon: "zap" },
    { id: "entertainment", name: "Entertainment", allocated: 13000, spent: 9800, color: "#A855F7", icon: "tv" },
  ],
  totalAllocated: 450000,
  totalSpent: 343400,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", narration: "POS - CHICKEN REPUBLIC LEKKI", amount: -3500, type: "debit", date: "2026-03-18", category: "food", merchant: "Chicken Republic" },
  { id: "2", narration: "MTN AIRTIME VTU", amount: -2000, type: "debit", date: "2026-03-18", category: "data_airtime", merchant: "MTN" },
  { id: "3", narration: "SALARY CREDIT - ACME LTD", amount: 450000, type: "credit", date: "2026-03-01", category: "income", merchant: "ACME Ltd" },
  { id: "4", narration: "BOLT RIDE PAYMENT", amount: -2800, type: "debit", date: "2026-03-17", category: "transport", merchant: "Bolt" },
  { id: "5", narration: "TRANSFER TO MUM - FAMILY", amount: -25000, type: "debit", date: "2026-03-15", category: "family_support", merchant: "" },
  { id: "6", narration: "RCCG OFFERING", amount: -15000, type: "debit", date: "2026-03-16", category: "church_tithes", merchant: "RCCG" },
  { id: "7", narration: "DSTV SUBSCRIPTION", amount: -8900, type: "debit", date: "2026-03-14", category: "utilities", merchant: "DSTV" },
  { id: "8", narration: "POS - SHOPRITE IKEJA", amount: -12500, type: "debit", date: "2026-03-13", category: "food", merchant: "Shoprite" },
  { id: "9", narration: "UBER RIDE PAYMENT", amount: -4200, type: "debit", date: "2026-03-12", category: "transport", merchant: "Uber" },
  { id: "10", narration: "ASO EBI - TOLA WEDDING", amount: -26000, type: "debit", date: "2026-03-10", category: "owambe", merchant: "" },
  { id: "11", narration: "TRANSFER TO SISTER - SCHOOL FEES", amount: -20000, type: "debit", date: "2026-03-08", category: "family_support", merchant: "" },
  { id: "12", narration: "GLO DATA BUNDLE", amount: -5000, type: "debit", date: "2026-03-07", category: "data_airtime", merchant: "Glo" },
  { id: "13", narration: "POS - DOMINOS PIZZA VI", amount: -6800, type: "debit", date: "2026-03-06", category: "food", merchant: "Dominos Pizza" },
  { id: "14", narration: "BOLT RIDE - AIRPORT", amount: -8500, type: "debit", date: "2026-03-05", category: "transport", merchant: "Bolt" },
  { id: "15", narration: "RENT PAYMENT - MARCH", amount: -120000, type: "debit", date: "2026-03-01", category: "rent", merchant: "" },
  { id: "16", narration: "FREELANCE PAYMENT - FIVERR", amount: 85000, type: "credit", date: "2026-03-04", category: "income", merchant: "Fiverr" },
  { id: "17", narration: "MTN DATA BUNDLE 10GB", amount: -3500, type: "debit", date: "2026-03-03", category: "data_airtime", merchant: "MTN" },
  { id: "18", narration: "TRANSFER - GENERATOR DIESEL", amount: -15000, type: "debit", date: "2026-03-02", category: "generator", merchant: "" },
  { id: "19", narration: "NETFLIX SUBSCRIPTION", amount: -5500, type: "debit", date: "2026-03-01", category: "entertainment", merchant: "Netflix" },
  { id: "20", narration: "MARKET - BALOGUN PROVISIONS", amount: -22000, type: "debit", date: "2026-02-28", category: "market", merchant: "Balogun Market" },
  { id: "21", narration: "TITHE - RCCG MARCH", amount: -30000, type: "debit", date: "2026-03-02", category: "church_tithes", merchant: "RCCG" },
  { id: "22", narration: "UBER RIDE PAYMENT", amount: -3100, type: "debit", date: "2026-02-27", category: "transport", merchant: "Uber" },
  { id: "23", narration: "POS - COLD STONE LEKKI", amount: -4500, type: "debit", date: "2026-02-26", category: "food", merchant: "Cold Stone" },
  { id: "24", narration: "HOSPITAL - REDDINGTON", amount: -35000, type: "debit", date: "2026-02-25", category: "health", merchant: "Reddington Hospital" },
  { id: "25", narration: "TRANSFER TO DAD - UPKEEP", amount: -30000, type: "debit", date: "2026-02-24", category: "family_support", merchant: "" },
  { id: "26", narration: "COWRYWISE SAVINGS DEPOSIT", amount: -50000, type: "debit", date: "2026-02-23", category: "savings", merchant: "Cowrywise" },
  { id: "27", narration: "SALARY CREDIT - ACME LTD", amount: 450000, type: "credit", date: "2026-02-01", category: "income", merchant: "ACME Ltd" },
  { id: "28", narration: "SPOTIFY SUBSCRIPTION", amount: -3200, type: "debit", date: "2026-02-20", category: "entertainment", merchant: "Spotify" },
  { id: "29", narration: "ELECTRICITY TOKEN - IKEJA", amount: -10000, type: "debit", date: "2026-02-18", category: "utilities", merchant: "Ikeja Electric" },
  { id: "30", narration: "POS - SHOPRITE AJAH", amount: -8900, type: "debit", date: "2026-02-15", category: "food", merchant: "Shoprite" },
];

// ── Savings Goals ─────────────────────────────────────────────────────

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  icon: string;
  color: string;
  isLocked: boolean;
  lockUntil?: string;
}

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", targetAmount: 500000, currentAmount: 320000, currency: "NGN", targetDate: "2026-12-31", icon: "shield", color: "#5B9A6D", isLocked: false },
  { id: "2", name: "Japa Fund", targetAmount: 3000000, currentAmount: 1200000, currency: "NGN", targetDate: "2027-06-01", icon: "plane", color: "#E8614D", isLocked: false },
  { id: "3", name: "New Laptop", targetAmount: 800000, currentAmount: 450000, currency: "NGN", targetDate: "2026-09-01", icon: "laptop", color: "#2563EB", isLocked: false },
  { id: "4", name: "Detty December Fund", targetAmount: 200000, currentAmount: 200000, currency: "NGN", targetDate: "2026-12-01", icon: "party-popper", color: "#D4A843", isLocked: true, lockUntil: "2026-11-25" },
  { id: "5", name: "Wedding Contribution", targetAmount: 150000, currentAmount: 80000, currency: "NGN", targetDate: "2026-08-15", icon: "heart", color: "#EC4899", isLocked: false },
];

// ── ETF Comparison Data ─────────────────────────────────────────────

export interface ETF {
  ticker: string;
  name: string;
  expenseRatio: number;
  returns: { "1y": number; "3y": number; "5y": number; "10y": number };
  dividendYield: number;
  riskLevel: number;
  topHoldings: string[];
}

export const MOCK_ETFS: ETF[] = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", expenseRatio: 0.03, returns: { "1y": 12.4, "3y": 9.8, "5y": 15.2, "10y": 13.1 }, dividendYield: 1.3, riskLevel: 3, topHoldings: ["Apple", "Microsoft", "Amazon", "NVIDIA", "Alphabet"] },
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", expenseRatio: 0.03, returns: { "1y": 11.8, "3y": 9.2, "5y": 14.6, "10y": 12.8 }, dividendYield: 1.3, riskLevel: 3, topHoldings: ["Apple", "Microsoft", "Amazon", "NVIDIA", "Meta"] },
  { ticker: "QQQ", name: "Invesco QQQ Trust", expenseRatio: 0.20, returns: { "1y": 18.2, "3y": 12.4, "5y": 21.3, "10y": 18.9 }, dividendYield: 0.5, riskLevel: 4, topHoldings: ["Apple", "Microsoft", "NVIDIA", "Amazon", "Meta"] },
  { ticker: "VEA", name: "Vanguard FTSE Developed Markets ETF", expenseRatio: 0.05, returns: { "1y": 5.4, "3y": 3.2, "5y": 7.1, "10y": 5.8 }, dividendYield: 3.1, riskLevel: 3, topHoldings: ["Nestle", "Samsung", "ASML", "Toyota", "Novo Nordisk"] },
  { ticker: "VWO", name: "Vanguard FTSE Emerging Markets ETF", expenseRatio: 0.08, returns: { "1y": 3.2, "3y": -1.4, "5y": 4.8, "10y": 3.9 }, dividendYield: 3.2, riskLevel: 4, topHoldings: ["TSMC", "Tencent", "Alibaba", "Reliance", "Meituan"] },
  { ticker: "BND", name: "Vanguard Total Bond Market ETF", expenseRatio: 0.03, returns: { "1y": 2.1, "3y": -1.8, "5y": 0.8, "10y": 1.5 }, dividendYield: 4.5, riskLevel: 1, topHoldings: ["US Treasury", "US Govt Bonds", "Corp Bonds", "MBS", "Agency Bonds"] },
  { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", expenseRatio: 0.06, returns: { "1y": 8.2, "3y": 7.1, "5y": 12.4, "10y": 11.8 }, dividendYield: 3.4, riskLevel: 2, topHoldings: ["Broadcom", "AbbVie", "Merck", "Coca-Cola", "Cisco"] },
  { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", expenseRatio: 0.09, returns: { "1y": 12.3, "3y": 9.7, "5y": 15.1, "10y": 13.0 }, dividendYield: 1.2, riskLevel: 3, topHoldings: ["Apple", "Microsoft", "Amazon", "NVIDIA", "Alphabet"] },
];

// ── Money Wrapped (annual financial summary) ────────────────────────

export interface MoneyWrapped {
  year: number;
  totalEarned: number;
  totalSpent: number;
  totalSaved: number;
  savingsRate: number;
  topCategory: { name: string; amount: number };
  familySupport: number;
  budgetStreak: number;
  moneyDna: string;
  previousDna: string;
  topMerchant: { name: string; amount: number; visits: number };
  currency: string;
}

export const MOCK_WRAPPED: MoneyWrapped = {
  year: 2026,
  totalEarned: 5_400_000,
  totalSpent: 4_620_000,
  totalSaved: 780_000,
  savingsRate: 14.4,
  topCategory: { name: "Jollof & Chops", amount: 456_000 },
  familySupport: 1_200_000,
  budgetStreak: 47,
  moneyDna: "first-gen-warrior",
  previousDna: "social-spender",
  topMerchant: { name: "Chicken Republic", amount: 168_000, visits: 48 },
  currency: "NGN",
};
