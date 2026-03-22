"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";

// ── Styles (faithful port of react-app-7.js) ──────────────────────

const cs = {
  wrapper: {
    backgroundColor: "#0d0b0a",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    width: "100%",
    position: "relative" as const,
    overflowX: "hidden" as const,
  },
  ambientGlow1: {
    position: "fixed" as const,
    top: "-10%",
    left: "-10%",
    width: "50vw",
    height: "50vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
    background:
      "radial-gradient(circle, rgba(255, 179, 71, 0.12) 0%, transparent 70%)",
  },
  ambientGlow2: {
    position: "fixed" as const,
    bottom: "-10%",
    right: "-10%",
    width: "50vw",
    height: "50vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
    background:
      "radial-gradient(circle, rgba(230, 126, 34, 0.05) 0%, transparent 70%)",
  },
  main: {
    position: "relative" as const,
    zIndex: 10,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 5% 60px",
    width: "100%",
  },
  dashboardHeader: {
    marginBottom: "48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  h1: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "3rem",
    lineHeight: 1.1,
    color: "#ffffff",
    margin: 0,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    marginBottom: "48px",
  },
  kpiCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    position: "relative" as const,
    overflow: "hidden",
  },
  kpiCardHighlight: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 179, 71, 0.15)",
    borderRadius: "24px",
    padding: "24px",
    position: "relative" as const,
    overflow: "hidden",
  },
  kpiLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.75rem",
    color: "#968a84",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "12px",
    display: "block",
  },
  kpiValue: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "2rem",
    color: "#ffffff",
  },
  kpiValueGreen: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "2rem",
    color: "#ffb347",
  },
  kpiChange: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.75rem",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  changeUp: {
    color: "#2ecc71",
  },
  dashboardContent: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
  },
  contentCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "32px",
    padding: "32px",
  },
  contentCardGradient: {
    background:
      "linear-gradient(135deg, rgba(255, 179, 71, 0.05) 0%, rgba(255, 179, 71, 0) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "32px",
    padding: "32px",
  },
  cardTitle: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "1.5rem",
    marginBottom: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#ffffff",
  },
  spendingChart: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 80px",
    alignItems: "center",
    gap: "16px",
  },
  rowLabel: {
    fontSize: "0.875rem",
    color: "#968a84",
    fontWeight: 500,
  },
  barContainer: {
    height: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "#ffb347",
    borderRadius: "6px",
    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  rowValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: "#ffffff",
    textAlign: "right" as const,
  },
  mascotMini: {
    width: "100px",
    height: "100px",
    position: "relative" as const,
    marginBottom: "24px",
  },
  miniBody: {
    position: "absolute" as const,
    inset: 0,
    background: "#ffb347",
    borderRadius: "50%",
    boxShadow:
      "inset 10px 10px 15px rgba(255,255,255,0.4), inset -10px -10px 20px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  miniEyes: {
    display: "flex",
    gap: "12px",
    transform: "translateY(-5px)",
  },
  miniEye: {
    width: "8px",
    height: "4px",
    border: "2px solid #1a1614",
    borderRadius: "8px 8px 0 0",
    borderBottom: 0,
  },
  miniMouth: {
    position: "absolute" as const,
    bottom: "25px",
    width: "16px",
    height: "8px",
    background: "#1a1614",
    borderRadius: "0 0 16px 16px",
  },
  statusBadge: {
    display: "inline-flex",
    padding: "4px 12px",
    background: "rgba(255, 179, 71, 0.15)",
    borderRadius: "999px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    color: "#ffb347",
    marginTop: "12px",
  },
  sectionLabel: {
    display: "inline-block",
    padding: "6px 14px",
    background: "rgba(255, 179, 71, 0.1)",
    border: "1px solid rgba(255, 179, 71, 0.2)",
    borderRadius: "999px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#ffb347",
    marginBottom: "16px",
  },
  automationItem: {
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  addFlowButton: {
    marginTop: "32px",
    background: "transparent",
    border: "1px dashed #ffb347",
    color: "#ffb347",
    padding: "16px",
    borderRadius: "16px",
    width: "100%",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.8rem",
    cursor: "pointer",
  },
  loadingSkeleton: {
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
};

// ── Date helpers ─────────────────────────────────────────────────

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

function getCurrentMonthName() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ── Mascot Component ─────────────────────────────────────────────

function MascotMini() {
  return (
    <div style={cs.mascotMini}>
      <div style={cs.miniBody}>
        <div style={cs.miniEyes}>
          <div style={cs.miniEye}></div>
          <div style={cs.miniEye}></div>
        </div>
        <div style={cs.miniMouth}></div>
      </div>
    </div>
  );
}

// ── KPI Card Component ───────────────────────────────────────────

function KPICard({
  label,
  value,
  change,
  changeType,
  badge,
  highlight,
  isLoading,
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "muted";
  badge?: string;
  highlight?: boolean;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div style={cs.kpiCard}>
        <span style={cs.kpiLabel}>{label}</span>
        <div style={{ ...cs.loadingSkeleton, height: "32px", width: "120px", marginTop: "4px" }} />
        <div style={{ ...cs.loadingSkeleton, height: "14px", width: "80px", marginTop: "12px" }} />
      </div>
    );
  }

  return (
    <div style={highlight ? cs.kpiCardHighlight : cs.kpiCard}>
      <span style={cs.kpiLabel}>{label}</span>
      <div style={highlight ? cs.kpiValueGreen : cs.kpiValue}>{value}</div>
      {changeType === "up" && (
        <div style={{ ...cs.kpiChange, ...cs.changeUp }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          {change}
        </div>
      )}
      {changeType === "muted" && (
        <div style={{ ...cs.kpiChange, color: "#968a84" }}>{change}</div>
      )}
      {badge && <div style={cs.statusBadge}>{badge}</div>}
    </div>
  );
}

// ── Spending Chart Component ─────────────────────────────────────

function SpendingChart({
  items,
}: {
  items: { label: string; width: string; value: string; opacity?: number }[];
}) {
  return (
    <div style={cs.spendingChart}>
      {items.map((item, index) => (
        <div key={index} style={cs.chartRow}>
          <span style={cs.rowLabel}>{item.label}</span>
          <div style={cs.barContainer}>
            <div
              style={{
                ...cs.barFill,
                width: item.width,
                opacity: item.opacity || 1,
              }}
            ></div>
          </div>
          <span style={cs.rowValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Automation Item Component ────────────────────────────────────

function AutomationItem({
  title,
  badge,
  description,
}: {
  title: string;
  badge: string;
  description: string;
}) {
  return (
    <div style={cs.automationItem}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: 600, color: "#ffffff" }}>{title}</span>
        <span
          style={{
            color: "#ffb347",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
          }}
        >
          {badge}
        </span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#968a84", margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAuthenticated } = useConvexAuth();
  const { startDate, endDate } = useMemo(() => getCurrentMonthRange(), []);

  // ── Convex queries ─────────────────────────────────────────────
  const spendingSummary = useQuery(
    api.transactions.getSpendingSummary,
    isAuthenticated ? { startDate, endDate } : "skip",
  );
  const netWorth = useQuery(
    api.allMyMoney.getNetWorth,
    isAuthenticated ? {} : "skip",
  );
  const categoryBreakdown = useQuery(
    api.transactions.getTransactionsByCategory,
    isAuthenticated ? { startDate, endDate } : "skip",
  );

  // ── Loading states ─────────────────────────────────────────────
  const isLoadingSpending = spendingSummary === undefined;
  const isLoadingNetWorth = netWorth === undefined;
  const isLoadingCategories = categoryBreakdown === undefined;

  // ── Derived data ───────────────────────────────────────────────
  const currency: CurrencyCode =
    (spendingSummary?.currency as CurrencyCode) ??
    (netWorth?.primaryCurrency as CurrencyCode) ??
    "NGN";

  const totalBalance = netWorth?.totalNetWorth ?? 0;
  const totalIncome = spendingSummary?.totalIncome ?? 0;
  const totalSpending = spendingSummary?.totalSpending ?? 0;
  const savingsRate = spendingSummary?.savingsRate ?? 0;

  // ── Build spending data ────────────────────────────────────────
  const spendingItems = useMemo(() => {
    if (!categoryBreakdown || categoryBreakdown.length === 0) {
      // Fallback spending
      return [
        { label: "Housing", width: "85%", value: formatCurrency(120000, currency), opacity: 1 },
        { label: "Food", width: "45%", value: formatCurrency(48200, currency), opacity: 0.8 },
        { label: "Transport", width: "35%", value: formatCurrency(22100, currency), opacity: 0.7 },
        { label: "Data & Airtime", width: "20%", value: formatCurrency(18400, currency), opacity: 0.6 },
        { label: "Family", width: "15%", value: formatCurrency(45000, currency), opacity: 0.5 },
      ];
    }

    const debitCategories = categoryBreakdown.filter((c) =>
      c.transactions.some((t) => t.type === "debit"),
    );
    const totalDebit = debitCategories.reduce((sum, c) => {
      const debitTotal = c.transactions
        .filter((t) => t.type === "debit")
        .reduce((s, t) => s + t.amount, 0);
      return sum + debitTotal;
    }, 0);

    return debitCategories
      .map((c) => {
        const amount = c.transactions
          .filter((t) => t.type === "debit")
          .reduce((s, t) => s + t.amount, 0);
        const pct = totalDebit > 0 ? (amount / totalDebit) * 100 : 0;
        return {
          label: c.category,
          width: `${Math.min(pct, 100)}%`,
          value: formatCurrency(amount, currency),
          opacity: Math.max(0.3, pct / 100),
        };
      })
      .sort((a, b) => parseFloat(b.width) - parseFloat(a.width))
      .slice(0, 5);
  }, [categoryBreakdown, currency]);

  const [addFlowClicked, setAddFlowClicked] = useState(false);

  // Inject font import
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={cs.wrapper}>
      {/* Ambient glows */}
      <div style={cs.ambientGlow1} />
      <div style={cs.ambientGlow2} />

      <main style={cs.main}>
        {/* Dashboard Header */}
        <header style={cs.dashboardHeader}>
          <div>
            <span style={cs.sectionLabel}>Good morning</span>
            <h1 style={cs.h1}>
              Your <span style={{ color: "#ffb347" }}>flow</span> is looking
              steady.
            </h1>
          </div>
          <MascotMini />
        </header>

        {/* KPI Grid */}
        <section style={cs.kpiGrid}>
          <KPICard
            label="Total Balance"
            value={formatCurrency(totalBalance, currency)}
            change="Across all accounts"
            changeType="up"
            isLoading={isLoadingNetWorth}
          />
          <KPICard
            label="Total Income"
            value={formatCurrency(totalIncome, currency)}
            change="This month"
            changeType="up"
            isLoading={isLoadingSpending}
          />
          <KPICard
            label="Total Spent"
            value={formatCurrency(totalSpending, currency)}
            change="Within budget"
            changeType="muted"
            isLoading={isLoadingSpending}
          />
          <KPICard
            label="Savings Rate"
            value={`${savingsRate.toFixed(0)}%`}
            badge={savingsRate > 50 ? "Top Saver" : savingsRate > 20 ? "On Track" : "Getting There"}
            highlight={true}
            isLoading={isLoadingSpending}
          />
        </section>

        {/* Dashboard Content: Spending + Automations */}
        <section style={cs.dashboardContent}>
          {/* Spending Card */}
          <div style={cs.contentCard}>
            <div style={cs.cardTitle}>
              Spending by Category
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#968a84",
                }}
              >
                {getCurrentMonthName()}
              </span>
            </div>
            {isLoadingCategories ? (
              <div style={cs.spendingChart}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={cs.chartRow}>
                    <div style={{ ...cs.loadingSkeleton, height: "14px", width: "80px" }} />
                    <div style={cs.barContainer}>
                      <div style={{ ...cs.barFill, width: `${60 - i * 10}%`, opacity: 0.2 }} />
                    </div>
                    <div style={{ ...cs.loadingSkeleton, height: "14px", width: "50px" }} />
                  </div>
                ))}
              </div>
            ) : (
              <SpendingChart items={spendingItems} />
            )}
          </div>

          {/* Automations Card */}
          <div style={cs.contentCardGradient}>
            <div style={cs.cardTitle}>Active Automations</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <AutomationItem
                title="Round-ups"
                badge="2x active"
                description="Stashed money last week from 14 transactions."
              />
              <AutomationItem
                title="Weekly Cushion"
                badge={formatCurrency(5000, currency) + "/wk"}
                description="Next deposit scheduled for Monday, 8:00 AM."
              />
            </div>
            <button
              style={{
                ...cs.addFlowButton,
                background: addFlowClicked
                  ? "rgba(255, 179, 71, 0.1)"
                  : "transparent",
              }}
              onClick={() => setAddFlowClicked(!addFlowClicked)}
            >
              {addFlowClicked ? "&#10003; Flow Added!" : "+ Add New Flow"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
