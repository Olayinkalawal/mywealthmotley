"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency } from "@/lib/currencies";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import type { Transaction } from "@/lib/mock-data";
import type { CurrencyCode } from "@/lib/constants";
import { useCurrency, useUserCurrency } from "@/hooks/use-currency";

// ── Styles (faithful port of react-app-8.js) ──────────────────────

const ts = {
  glassBg: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  tableBg: {
    background: "rgba(0,0,0,0.4)",
    borderRadius: "20px",
    overflow: "hidden" as const,
  },
  inputGlass: {
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    transition: "border-color 0.2s ease",
    outline: "none",
  },
  btnGhost: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#ffffff",
    transition: "all 0.2s ease",
  },
  btnBrandOutline: {
    background: "rgba(255, 179, 71, 0.05)",
    border: "1px solid rgba(255, 179, 71, 0.3)",
    color: "#ffb347",
    transition: "all 0.2s ease",
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    flexShrink: 0,
    color: "#ffffff",
  },
  iconBoxBrand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "rgba(255, 179, 71, 0.1)",
    border: "1px solid rgba(255, 179, 71, 0.2)",
    flexShrink: 0,
    color: "#ffb347",
  },
  categoryBadge: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  categoryBrandBadge: {
    background: "rgba(255, 179, 71, 0.1)",
    border: "1px solid rgba(255, 179, 71, 0.15)",
  },
  insightCard: {
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "24px",
  } as React.CSSProperties,
  insightCardAmber: {
    background: "rgba(255, 179, 71, 0.06)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 179, 71, 0.15)",
    borderRadius: "20px",
    padding: "24px",
  } as React.CSSProperties,
  subscriptionCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "16px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  } as React.CSSProperties,
  glow1: {
    position: "fixed" as const,
    top: "-20%",
    left: "10%",
    width: "60vw",
    height: "60vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
    background:
      "radial-gradient(circle, rgba(255, 179, 71, 0.12) 0%, transparent 60%)",
  },
  glow2: {
    position: "fixed" as const,
    bottom: "-30%",
    right: "-10%",
    width: "70vw",
    height: "70vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
    background:
      "radial-gradient(circle, rgba(230, 126, 34, 0.06) 0%, transparent 60%)",
  },
};

// ── Status Dot ─────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    completed: {
      backgroundColor: "#4ade80",
      boxShadow: "0 0 8px rgba(74, 222, 128, 0.4)",
    },
    pending: {
      backgroundColor: "#ffb347",
      boxShadow: "0 0 8px rgba(255, 179, 71, 0.4)",
    },
    processing: {
      backgroundColor: "#60a5fa",
      boxShadow: "0 0 8px rgba(96, 165, 250, 0.4)",
    },
  };
  return (
    <span
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        display: "inline-block",
        marginRight: "6px",
        ...(styles[status] || styles.completed),
      }}
    />
  );
}

// ── Icons ──────────────────────────────────────────────────────────

function MoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffb347"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffb347"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: "4px" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Transaction icon based on category ────────────────────────────

function getCategoryIcon(category: string) {
  const icons: Record<string, React.ReactElement> = {
    food: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    market: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    transport: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
      </svg>
    ),
    entertainment: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    income: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    data_airtime: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    family_support: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    church_tithes: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    rent: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    utilities: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    owambe: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    savings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2" />
        <path d="M2 9.1C1.7 10 2 10.7 2 11" />
      </svg>
    ),
    health: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  };

  return icons[category] || icons.income;
}

// ── Adapt Convex transaction data ─────────────────────────────────

interface DisplayTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  categoryType: "normal" | "brand";
  account: string;
  amount: string;
  amountType: "income" | "expense";
  status: "completed" | "pending" | "processing";
  iconCategory: string;
}

function adaptToDisplayTransactions(
  txns: Transaction[],
  currency: CurrencyCode,
): DisplayTransaction[] {
  return txns.map((tx) => {
    const isIncome = tx.type === "credit";
    const rawDate = new Date(tx.date);
    const dateStr = rawDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      id: tx.id,
      date: dateStr,
      description: tx.merchant || tx.narration.split(" - ")[0] || tx.narration,
      category: tx.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      categoryType: isIncome ? "brand" : "normal",
      account: isIncome ? "WealthMotley Savings" : "WealthMotley Checking",
      amount: `${isIncome ? "+" : "-"}${formatCurrency(Math.abs(tx.amount), currency)}`,
      amountType: isIncome ? "income" : "expense",
      status: "completed",
      iconCategory: tx.category,
    };
  });
}

// ── Category display config ───────────────────────────────────────

const CATEGORY_DISPLAY: Record<string, { label: string; color: string }> = {
  rent: { label: "Rent & Housing", color: "#E8614D" },
  food: { label: "Food & Groceries", color: "#F59E0B" },
  market: { label: "Market Shopping", color: "#F59E0B" },
  transport: { label: "Transport", color: "#5B9A6D" },
  data_airtime: { label: "Data & Airtime", color: "#2563EB" },
  family_support: { label: "Family Support", color: "#D4A843" },
  church_tithes: { label: "Tithes & Offerings", color: "#8B5CF6" },
  entertainment: { label: "Entertainment", color: "#A855F7" },
  utilities: { label: "Utilities & Bills", color: "#EC4899" },
  owambe: { label: "Owambe & Aso Ebi", color: "#EC4899" },
  savings: { label: "Savings", color: "#5B9A6D" },
  health: { label: "Health", color: "#EF4444" },
  generator: { label: "Generator & Fuel", color: "#F97316" },
};

interface CategoryBreakdown {
  category: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

// ── Mock subscriptions ───────────────────────────────────────────

interface Subscription {
  name: string;
  amount: number;
  frequency: "monthly" | "annual";
  nextPayment: string;
  color: string;
  initial: string;
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { name: "Netflix", amount: 4900, frequency: "monthly", nextPayment: "2026-04-01", color: "#E50914", initial: "N" },
  { name: "MTN Data", amount: 3000, frequency: "monthly", nextPayment: "2026-04-03", color: "#FFD700", initial: "M" },
  { name: "Showmax", amount: 2900, frequency: "monthly", nextPayment: "2026-04-05", color: "#FF6B00", initial: "S" },
  { name: "YouTube Premium", amount: 1100, frequency: "monthly", nextPayment: "2026-04-08", color: "#FF0000", initial: "Y" },
  { name: "Spotify", amount: 900, frequency: "monthly", nextPayment: "2026-04-10", color: "#1DB954", initial: "S" },
];

// ── Main Page ─────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { isAuthenticated } = useConvexAuth();
  const preferredCurrency = useUserCurrency();

  // Fetch real data from Convex
  const convexResult = useQuery(
    api.transactions.getTransactions,
    isAuthenticated ? {} : "skip",
  );
  const categorizeTransaction = useMutation(
    api.transactions.categorizeTransaction,
  );

  const isLoading = convexResult === undefined;

  // Adapt transactions
  const rawTransactions: Transaction[] = useMemo(() => {
    if (isLoading) return [];
    try {
      const rawTxns = convexResult?.transactions ?? [];
      if (rawTxns.length > 0) {
        return rawTxns.map((tx: any) => ({
          id: tx._id ?? tx.monoTransactionId ?? String(Math.random()),
          narration: tx.narration,
          amount:
            tx.type === "debit"
              ? -Math.abs(tx.amount)
              : Math.abs(tx.amount),
          type: tx.type as "debit" | "credit",
          date: tx.date,
          category:
            tx.effectiveCategory ??
            tx.userCategory ??
            tx.ruleCategory ??
            "other",
          merchant: tx.merchant ?? "",
        }));
      }
      return MOCK_TRANSACTIONS;
    } catch {
      return MOCK_TRANSACTIONS;
    }
  }, [convexResult, isLoading]);

  const currency: CurrencyCode = useMemo(() => {
    if (convexResult?.transactions?.[0]?.currency) {
      return convexResult.transactions[0].currency as CurrencyCode;
    }
    return preferredCurrency;
  }, [convexResult, preferredCurrency]);

  const displayTransactions = useMemo(
    () => adaptToDisplayTransactions(rawTransactions, currency),
    [rawTransactions, currency],
  );

  // ── Spending insights (computed from real transactions) ──────
  const { format: fmtCurrency } = useCurrency(currency);

  const spendingBreakdown: CategoryBreakdown[] = useMemo(() => {
    const debits = rawTransactions.filter((tx) => tx.type === "debit");
    const totalSpend = debits.reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const grouped: Record<string, number> = {};
    for (const tx of debits) {
      const cat = tx.category;
      if (cat === "income") continue;
      grouped[cat] = (grouped[cat] ?? 0) + Math.abs(tx.amount);
    }
    return Object.entries(grouped)
      .map(([cat, amount]) => ({
        category: cat,
        label: CATEGORY_DISPLAY[cat]?.label ?? cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        amount,
        percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
        color: CATEGORY_DISPLAY[cat]?.color ?? "#968a84",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [rawTransactions]);

  const moneyFlow = useMemo(() => {
    const totalIncome = rawTransactions
      .filter((tx) => tx.type === "credit")
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const totalSpending = rawTransactions
      .filter((tx) => tx.type === "debit")
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    return {
      income: totalIncome,
      spending: totalSpending,
      net: totalIncome - totalSpending,
    };
  }, [rawTransactions]);

  const topCategoryInsight = useMemo(() => {
    if (spendingBreakdown.length === 0) return null;
    const top = spendingBreakdown[0]!;
    // Simulate a month-over-month comparison (mock: 12% higher)
    const mockMoMDelta = 12;
    return {
      name: top.label,
      percentage: top.percentage.toFixed(1),
      momDelta: mockMoMDelta,
      direction: "higher" as const,
    };
  }, [spendingBreakdown]);

  const totalSubscriptionCost = MOCK_SUBSCRIPTIONS.reduce((s, sub) => s + sub.amount, 0);

  // ── Local state ────────────────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    return displayTransactions.filter((tx) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Income" && tx.amountType === "income") ||
        (activeFilter === "Expenses" && tx.amountType === "expense");
      const matchesSearch =
        searchQuery === "" ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [displayTransactions, activeFilter, searchQuery]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const dateRange = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, []);

  // Inject font import
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle category override
  const handleCategoryOverride = useCallback(
    async (transactionId: string, category: string) => {
      try {
        if (transactionId.includes("|") || transactionId.length > 20) {
          await categorizeTransaction({
            transactionId: transactionId as any,
            category,
          });
        }
      } catch (error) {
        console.error("Failed to categorize transaction:", error);
      }
    },
    [categorizeTransaction],
  );

  // ── Loading skeleton ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#0d0b0a",
          color: "#ffffff",
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div style={ts.glow1} />
        <div style={ts.glow2} />
        <main
          style={{
            flex: 1,
            position: "relative",
            zIndex: 10,
            paddingTop: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px 80px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <div>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  height: "48px",
                  width: "300px",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  height: "20px",
                  width: "200px",
                  marginTop: "12px",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
            </div>
            <div
              style={{
                ...ts.glassBg,
                borderRadius: "24px",
                height: "500px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#0d0b0a",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div style={ts.glow1} />
      <div style={ts.glow2} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px 80px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Header */}
          <header
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "24px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  color: "#ffffff",
                  marginBottom: "12px",
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                }}
              >
                Transactions
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#968a84",
                }}
              >
                <span style={{ fontSize: "1.125rem" }}>
                  Track every naira
                </span>
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 4 4"
                  fill="currentColor"
                  style={{ opacity: 0.5 }}
                >
                  <circle cx="2" cy="2" r="2" />
                </svg>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.875rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {dateRange}
                </span>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                width: "320px",
                maxWidth: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  pointerEvents: "none",
                  color: "#968a84",
                }}
              >
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  ...ts.inputGlass,
                  width: "100%",
                  borderRadius: "9999px",
                  padding: "12px 16px 12px 44px",
                  fontSize: "0.875rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          </header>

          {/* ── Spending Insights Section ─────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Mo's Spending Pattern Callout */}
            {topCategoryInsight && (
              <div style={ts.insightCardAmber}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      background: "rgba(255, 179, 71, 0.15)",
                      border: "1px solid rgba(255, 179, 71, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "22px",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "'DynaPuff', cursive",
                        fontSize: "0.95rem",
                        color: "#ffb347",
                        marginBottom: "6px",
                        fontWeight: 600,
                      }}
                    >
                      Mo&apos;s Spending Insight
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.8)",
                        lineHeight: 1.6,
                      }}
                    >
                      Your top spending category this month is{" "}
                      <span style={{ color: "#ffb347", fontWeight: 600 }}>{topCategoryInsight.name}</span>
                      {" "}at{" "}
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffb347", fontWeight: 700 }}>
                        {topCategoryInsight.percentage}%
                      </span>
                      {" "}of total spending. That&apos;s{" "}
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", fontWeight: 700 }}>
                        {topCategoryInsight.momDelta}% {topCategoryInsight.direction}
                      </span>
                      {" "}than last month. Consider setting a budget cap to keep this in check.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Money Flow Summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {/* Income */}
              <div style={ts.insightCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(74, 222, 128, 0.1)",
                      border: "1px solid rgba(74, 222, 128, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#968a84", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Income
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#4ade80",
                    lineHeight: 1.2,
                  }}
                >
                  {fmtCurrency(moneyFlow.income)}
                </p>
              </div>

              {/* Spending */}
              <div style={ts.insightCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                      <polyline points="17 18 23 18 23 12" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#968a84", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Spending
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#ef4444",
                    lineHeight: 1.2,
                  }}
                >
                  {fmtCurrency(moneyFlow.spending)}
                </p>
              </div>

              {/* Net Flow */}
              <div style={ts.insightCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(255, 179, 71, 0.1)",
                      border: "1px solid rgba(255, 179, 71, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#968a84", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Net Flow
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: moneyFlow.net >= 0 ? "#ffb347" : "#ef4444",
                    lineHeight: 1.2,
                  }}
                >
                  {moneyFlow.net >= 0 ? "+" : ""}{fmtCurrency(moneyFlow.net)}
                </p>
              </div>
            </div>

            {/* Monthly Spending Breakdown by Category */}
            <div style={ts.insightCard}>
              <h2
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  marginBottom: "20px",
                  fontWeight: 600,
                }}
              >
                Spending Breakdown
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {spendingBreakdown.slice(0, 8).map((cat) => (
                  <div key={cat.category}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.85rem",
                          color: "rgba(255, 255, 255, 0.85)",
                          fontWeight: 500,
                        }}
                      >
                        {cat.label}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.85rem",
                            color: "#ffffff",
                            fontWeight: 600,
                          }}
                        >
                          {fmtCurrency(cat.amount)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.75rem",
                            color: "#968a84",
                            minWidth: "42px",
                            textAlign: "right",
                          }}
                        >
                          {cat.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "4px",
                        background: "rgba(255, 255, 255, 0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(cat.percentage, 100)}%`,
                          height: "100%",
                          borderRadius: "4px",
                          background: cat.color,
                          transition: "width 0.6s ease",
                          boxShadow: `0 0 12px ${cat.color}40`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Subscriptions Section ─────────────────────────── */}
          <div style={ts.insightCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <h2
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                Subscriptions
              </h2>
              <div
                style={{
                  background: "rgba(255, 179, 71, 0.08)",
                  border: "1px solid rgba(255, 179, 71, 0.2)",
                  borderRadius: "9999px",
                  padding: "6px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#ffb347", fontWeight: 600 }}>
                  {fmtCurrency(totalSubscriptionCost)}/month
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {MOCK_SUBSCRIPTIONS.map((sub) => (
                <div key={sub.name} style={ts.subscriptionCard}>
                  {/* Initial badge */}
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: `${sub.color}20`,
                      border: `1px solid ${sub.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'DynaPuff', cursive",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: sub.color,
                      flexShrink: 0,
                    }}
                  >
                    {sub.initial}
                  </div>
                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#ffffff", marginBottom: "2px" }}>
                      {sub.name}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#968a84" }}>
                      {sub.frequency === "monthly" ? "Monthly" : "Annual"} &middot; Next: {new Date(sub.nextPayment).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  {/* Amount */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      flexShrink: 0,
                    }}
                  >
                    {fmtCurrency(sub.amount)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subscription tip */}
            <div
              style={{
                marginTop: "16px",
                padding: "14px 18px",
                background: "rgba(255, 179, 71, 0.05)",
                border: "1px solid rgba(255, 179, 71, 0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5 }}>
                You&apos;re spending{" "}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#ffb347", fontWeight: 700 }}>
                  {fmtCurrency(totalSubscriptionCost)}
                </span>
                /month on subscriptions. Review unused services to free up cash for savings.
              </p>
            </div>
          </div>

          {/* Filters Row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              zIndex: 20,
            }}
          >
            {/* Tab filters */}
            <div
              style={{
                display: "flex",
                padding: "4px",
                ...ts.glassBg,
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              {["All", "Income", "Expenses"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveFilter(filter);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: activeFilter === filter ? 600 : 500,
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                    background:
                      activeFilter === filter ? "#ffb347" : "transparent",
                    color:
                      activeFilter === filter ? "#0d0b0a" : "#968a84",
                    boxShadow:
                      activeFilter === filter
                        ? "0 0 15px rgba(255,179,71,0.3)"
                        : "none",
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  ...ts.btnGhost,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "9999px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <FilterIcon />
                All Categories
                <ChevronDown />
              </button>

              <button
                style={{
                  ...ts.btnGhost,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "9999px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <CalendarIcon />
                Last 30 days
                <ChevronDown />
              </button>

              <button
                style={{
                  ...ts.btnBrandOutline,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                <DownloadIcon />
                Download CSV
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div
            style={{
              display: "block",
              width: "100%",
              ...ts.glassBg,
              borderRadius: "24px",
              overflow: "hidden",
              padding: "4px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={ts.tableBg}>
              <table
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {[
                      "Date",
                      "Description",
                      "Category",
                      "Account",
                      "Amount",
                      "Status",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          color: "#968a84",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "20px 24px",
                          fontWeight: 600,
                          width:
                            i === 0
                              ? "128px"
                              : i === 2
                                ? "192px"
                                : i === 3
                                  ? "160px"
                                  : i === 4
                                    ? "144px"
                                    : i === 5
                                      ? "144px"
                                      : i === 6
                                        ? "64px"
                                        : "auto",
                          textAlign:
                            i === 4
                              ? "right"
                              : i === 6
                                ? "center"
                                : ("left" as any),
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {paginatedTransactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom:
                          idx < paginatedTransactions.length - 1
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "none",
                        backgroundColor:
                          hoveredRow === idx
                            ? "rgba(255, 179, 71, 0.15)"
                            : idx % 2 === 1
                              ? "rgba(255,255,255,0.015)"
                              : "transparent",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "#968a84",
                          fontSize: "0.875rem",
                        }}
                      >
                        {tx.date}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <div
                            style={
                              tx.categoryType === "brand"
                                ? ts.iconBoxBrand
                                : ts.iconBox
                            }
                          >
                            {getCategoryIcon(tx.iconCategory)}
                          </div>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#ffffff",
                            }}
                          >
                            {tx.description}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            ...(tx.categoryType === "brand"
                              ? ts.categoryBrandBadge
                              : ts.categoryBadge),
                            color:
                              tx.categoryType === "brand"
                                ? "#ffb347"
                                : "#d1d5db",
                          }}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td
                        style={{ padding: "16px 24px", color: "#968a84" }}
                      >
                        {tx.account}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "right",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "1rem",
                          fontWeight:
                            tx.amountType === "income" ? 700 : 600,
                          color:
                            tx.amountType === "income"
                              ? "#ffb347"
                              : "#ffffff",
                        }}
                      >
                        {tx.amount}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color:
                              tx.status === "pending"
                                ? "#9ca3af"
                                : "#d1d5db",
                          }}
                        >
                          <StatusDot status={tx.status} />
                          {tx.status.charAt(0).toUpperCase() +
                            tx.status.slice(1)}
                        </div>
                      </td>
                      <td
                        style={{ padding: "16px 24px", textAlign: "center" }}
                      >
                        <button
                          style={{
                            color: "#968a84",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "8px",
                            transition: "color 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#ffb347")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#968a84")
                          }
                        >
                          <MoreIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
              padding: "24px 0",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                color: "#968a84",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
              }}
            >
              Showing{" "}
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length,
                )}
              </span>{" "}
              of{" "}
              <span style={{ color: "#ffffff", fontWeight: 600 }}>
                {filteredTransactions.length}
              </span>{" "}
              transactions
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  ...ts.btnGhost,
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <ChevronLeft />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                }}
              >
                {Array.from(
                  { length: Math.min(3, totalPages) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9999px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: currentPage === p ? 700 : 400,
                      background:
                        currentPage === p ? "#ffb347" : "transparent",
                      color:
                        currentPage === p ? "#0d0b0a" : "#ffffff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {p}
                  </button>
                ))}
                {totalPages > 4 && (
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#968a84",
                    }}
                  >
                    ...
                  </span>
                )}
                {totalPages > 3 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "9999px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'JetBrains Mono', monospace",
                      background:
                        currentPage === totalPages
                          ? "#ffb347"
                          : "transparent",
                      color:
                        currentPage === totalPages
                          ? "#0d0b0a"
                          : "#ffffff",
                      fontWeight:
                        currentPage === totalPages ? 700 : 400,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                style={{
                  ...ts.btnGhost,
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                  cursor: "pointer",
                }}
              >
                <ChevronRight />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "0.875rem",
                fontFamily: "'Inter', sans-serif",
                color: "#968a84",
              }}
            >
              <span>Show:</span>
              <button
                style={{
                  ...ts.glassBg,
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  transition: "background 0.2s ease",
                }}
              >
                10
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
