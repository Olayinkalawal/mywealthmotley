"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";
import { useUserCurrency } from "@/hooks/use-currency";

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

// ── Asset Allocation Donut Chart ──────────────────────────────────

const ALLOCATION_DATA = [
  { label: "Stocks/ETFs", pct: 45, color: "#ffb347" },
  { label: "Cash/Savings", pct: 25, color: "#34d399" },
  { label: "Property", pct: 15, color: "#c084fc" },
  { label: "Pension", pct: 10, color: "#60a5fa" },
  { label: "Crypto", pct: 5, color: "#ec4899" },
];

function DonutChart({
  data,
  size = 200,
  strokeWidth = 28,
}: {
  data: { label: string; pct: number; color: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
      />
      {data.map((segment, i) => {
        const segmentLength = (segment.pct / 100) * circumference;
        const gapSize = 4;
        const dashLength = Math.max(0, segmentLength - gapSize);
        const offset = cumulativeOffset;
        cumulativeOffset += segmentLength;

        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dasharray 0.8s ease",
            }}
          />
        );
      })}
      {/* Center text */}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "'DynaPuff', cursive",
          fontSize: "1.6rem",
          fill: "#ffffff",
        }}
      >
        100%
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.55rem",
          fill: "#968a84",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
        }}
      >
        Allocated
      </text>
    </svg>
  );
}

function AssetAllocationCard({
  totalBalance,
  currency,
  isLoading,
}: {
  totalBalance: number;
  currency: CurrencyCode;
  isLoading: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "32px",
        padding: "32px",
      }}
    >
      <div
        style={{
          fontFamily: "'DynaPuff', cursive",
          fontSize: "1.5rem",
          marginBottom: "28px",
          color: "#ffffff",
        }}
      >
        Asset Allocation
      </div>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ ...cs.loadingSkeleton, width: "200px", height: "200px", borderRadius: "50%" }} />
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ ...cs.loadingSkeleton, height: "16px", width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <DonutChart data={ALLOCATION_DATA} size={200} strokeWidth={28} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ALLOCATION_DATA.map((item) => {
              const amount = totalBalance > 0
                ? (item.pct / 100) * totalBalance
                : 0;
              return (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#c4bbaf", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.8rem",
                        color: "#ffffff",
                      }}
                    >
                      {totalBalance > 0 ? formatCurrency(amount, currency) : "--"}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        color: item.color,
                        minWidth: "36px",
                        textAlign: "right",
                      }}
                    >
                      {item.pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Multi-Currency Net Worth Breakdown ────────────────────────────

const CURRENCY_BREAKDOWN = [
  { code: "NGN" as CurrencyCode, symbol: "\u20A6", flag: "\uD83C\uDDF3\uD83C\uDDEC", amount: 2500000, label: "Nigerian Naira" },
  { code: "GBP" as CurrencyCode, symbol: "\u00A3", flag: "\uD83C\uDDEC\uD83C\uDDE7", amount: 15000, label: "British Pound" },
  { code: "USD" as CurrencyCode, symbol: "$", flag: "\uD83C\uDDFA\uD83C\uDDF8", amount: 3200, label: "US Dollar" },
];

function CurrencyBreakdown() {
  const total = CURRENCY_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginTop: "16px",
      }}
    >
      {CURRENCY_BREAKDOWN.map((cur) => {
        const pct = total > 0 ? ((cur.amount / total) * 100).toFixed(1) : "0";
        return (
          <div
            key={cur.code}
            style={{
              flex: "1 1 0",
              minWidth: "140px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem" }}>{cur.flag}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#968a84",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {cur.code}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1rem",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              {cur.symbol}
              {cur.amount.toLocaleString()}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "#ffb347",
                    borderRadius: "2px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#968a84",
                }}
              >
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Market Snapshot (Economic Indicators) ──────────────────────────

interface EconomicIndicator {
  indicator: string;
  value: number;
  unit: string;
  label: string;
  source: string;
  date: string;
  trend: "up" | "down" | "flat";
}

const MOCK_INDICATORS: EconomicIndicator[] = [
  {
    indicator: "US_10Y_YIELD",
    value: 4.25,
    unit: "%",
    label: "US 10Y Treasury",
    source: "FRED",
    date: "2026-03-20",
    trend: "up",
  },
  {
    indicator: "UK_BASE_RATE",
    value: 4.5,
    unit: "%",
    label: "UK Base Rate",
    source: "Bank of England",
    date: "2026-03-01",
    trend: "flat",
  },
  {
    indicator: "NG_INFLATION",
    value: 33.2,
    unit: "%",
    label: "NG Inflation",
    source: "CBN",
    date: "2026-02-01",
    trend: "down",
  },
  {
    indicator: "FED_RATE",
    value: 5.25,
    unit: "%",
    label: "Fed Funds Rate",
    source: "FRED",
    date: "2026-03-01",
    trend: "flat",
  },
];

function TrendArrow({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2ecc71"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#e74c3c"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#968a84"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MarketSnapshotSection({
  indicators,
}: {
  indicators: EconomicIndicator[];
}) {
  return (
    <section style={{ marginBottom: "48px" }}>
      {/* Section heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'DynaPuff', cursive",
            fontSize: "1.25rem",
            color: "#ffb347",
          }}
        >
          Market Snapshot
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "#968a84",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Updated daily
        </span>
      </div>

      {/* Indicator cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {indicators.map((ind) => (
          <div
            key={ind.indicator}
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Subtle glass highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,179,71,0.2) 50%, transparent 100%)",
              }}
            />

            {/* Indicator name */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "#968a84",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ind.label}
            </div>

            {/* Value + trend */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {ind.value.toFixed(ind.unit === "index" ? 1 : 2)}
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 400,
                    color: "#968a84",
                    marginLeft: "2px",
                  }}
                >
                  {ind.unit}
                </span>
              </span>
              <TrendArrow trend={ind.trend} />
            </div>

            {/* Source */}
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                color: "#5a524d",
                marginTop: "10px",
              }}
            >
              {ind.source}
            </div>
          </div>
        ))}
      </div>

      {/* Attribution */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          color: "#5a524d",
          textAlign: "right",
          marginTop: "10px",
        }}
      >
        Data from FRED/CBN/BoE. Updated daily.
      </div>
    </section>
  );
}

// ── Financial News Types & Data ────────────────────────────────────

type NewsCategory = "bonds" | "markets" | "policy" | "savings" | "crypto";

const CATEGORY_COLORS: Record<NewsCategory, { bg: string; text: string }> = {
  bonds: { bg: "rgba(96, 165, 250, 0.15)", text: "#60a5fa" },
  markets: { bg: "rgba(52, 211, 153, 0.15)", text: "#34d399" },
  policy: { bg: "rgba(251, 191, 36, 0.15)", text: "#fbbf24" },
  savings: { bg: "rgba(192, 132, 252, 0.15)", text: "#c084fc" },
  crypto: { bg: "rgba(244, 114, 182, 0.15)", text: "#f472b6" },
};

interface NewsItem {
  title: string;
  summary: string;
  category: NewsCategory;
  region: string;
  source: string;
  hoursAgo: number;
}

const MOCK_NEWS: NewsItem[] = [
  {
    title: "FGN Bonds Currently Yielding 18.5%",
    summary:
      "The Nigerian government is offering savings bonds at 18.5% annual yield. This is a fixed-income option where the government borrows money from you and pays it back with interest. Think of it like lending money to the government.",
    category: "bonds",
    region: "NG",
    source: "DMO",
    hoursAgo: 0,
  },
  {
    title: "Bank of England Holds Interest Rate at 4.5%",
    summary:
      "The UK central bank kept interest rates steady. This means savings accounts and mortgage rates stay roughly the same for now. If you have a variable rate mortgage, no change to your payments.",
    category: "policy",
    region: "GB",
    source: "Bank of England",
    hoursAgo: 1,
  },
  {
    title: "S&P 500 Up 12% Year-to-Date",
    summary:
      "The 500 biggest US companies have grown 12% in value this year on average. If you hold a global equity index fund, this is part of what\u2019s driving your returns.",
    category: "markets",
    region: "global",
    source: "Market Data",
    hoursAgo: 2,
  },
  {
    title: "CBN Lifts Restrictions on Crypto Trading",
    summary:
      "The Central Bank of Nigeria has eased restrictions on cryptocurrency trading through licensed exchanges. This means Nigerians can now more easily buy and sell crypto through regulated platforms.",
    category: "crypto",
    region: "NG",
    source: "CBN",
    hoursAgo: 3,
  },
  {
    title: "UK ISA Allowance Remains \u00A320,000",
    summary:
      "You can still invest up to \u00A320,000 per year in your ISA tax-free. Any gains, dividends, or interest earned inside your ISA are completely tax-free. If you haven\u2019t maxed yours out, consider it.",
    category: "savings",
    region: "GB",
    source: "HMRC",
    hoursAgo: 4,
  },
];

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function FinancialNewsSection({ userCountry }: { userCountry?: string }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Filter news by user's country (show their region + global), or show all
  const filteredNews = useMemo(() => {
    let items = MOCK_NEWS;

    // Region filter: show user's region + global
    if (userCountry) {
      items = items.filter(
        (n) => n.region === userCountry || n.region === "global"
      );
    }

    // Category filter
    if (activeFilter !== "all") {
      items = items.filter((n) => n.category === activeFilter);
    }

    return items;
  }, [userCountry, activeFilter]);

  const filters = ["all", "bonds", "markets", "policy", "savings", "crypto"];

  return (
    <section style={{ marginTop: "48px" }}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          padding: "32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: "1.5rem",
              color: "#ffffff",
            }}
          >
            Financial News
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  border:
                    activeFilter === f
                      ? "1px solid rgba(255, 179, 71, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  background:
                    activeFilter === f
                      ? "rgba(255, 179, 71, 0.15)"
                      : "rgba(255, 255, 255, 0.04)",
                  color: activeFilter === f ? "#ffb347" : "#968a84",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  textTransform: "capitalize" as const,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* News cards - scrollable list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {filteredNews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#968a84",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
              }}
            >
              No news items for this filter.
            </div>
          ) : (
            filteredNews.map((item, idx) => {
              const catColor =
                CATEGORY_COLORS[item.category] || CATEGORY_COLORS.markets;
              return (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "20px",
                    padding: "24px",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  {/* Category badge + region */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        background: catColor.bg,
                        color: catColor.text,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        color: "#968a84",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.region === "global"
                        ? "Global"
                        : item.region}
                    </span>
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      marginBottom: "8px",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </div>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#c4bbaf",
                      lineHeight: 1.6,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {item.summary}
                  </p>

                  {/* Source + time */}
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#968a84",
                    }}
                  >
                    {item.source} &middot; {item.hoursAgo === 0 ? "Just now" : `${item.hoursAgo}h ago`}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Compliance disclaimer */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            color: "#968a84",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          This information is provided for educational purposes only and does
          not constitute investment advice or a recommendation to buy, sell, or
          hold any investment.
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAuthenticated } = useConvexAuth();
  const preferredCurrency = useUserCurrency();
  const { startDate, endDate } = useMemo(() => getCurrentMonthRange(), []);

  // ── Convex queries ─────────────────────────────────────────────
  const spendingSummary = useQuery(
    api.transactions.getSpendingSummary,
    isAuthenticated ? { startDate, endDate } : "skip",
  );
  const currentUser = useQuery(
    api.users.getUser,
    isAuthenticated ? {} : "skip",
  );
  const netWorth = useQuery(
    api.allMyMoney.getNetWorth,
    isAuthenticated ? {} : "skip",
  );
  const categoryBreakdown = useQuery(
    api.transactions.getTransactionsByCategory,
    isAuthenticated ? { startDate, endDate } : "skip",
  );
  const economicIndicators = useQuery(
    api.economicData.getIndicators,
    isAuthenticated ? {} : "skip",
  );

  // ── Loading states ─────────────────────────────────────────────
  const isLoadingSpending = spendingSummary === undefined;
  const isLoadingNetWorth = netWorth === undefined;
  const isLoadingCategories = categoryBreakdown === undefined;

  // ── Derived data ───────────────────────────────────────────────
  const currency: CurrencyCode =
    (spendingSummary?.currency as CurrencyCode) ??
    (netWorth?.primaryCurrency as CurrencyCode) ??
    preferredCurrency;

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

  // ── Build market snapshot indicators ──────────────────────────
  const marketIndicators = useMemo<EconomicIndicator[]>(() => {
    if (!economicIndicators || economicIndicators.length === 0) {
      return MOCK_INDICATORS;
    }

    // Map DB records to our display type, preserving mock trend for now
    const trendMap: Record<string, "up" | "down" | "flat"> = {
      US_10Y_YIELD: "up",
      UK_BASE_RATE: "flat",
      NG_INFLATION: "down",
      FED_RATE: "flat",
    };

    // Short label map for compact display
    const shortLabelMap: Record<string, string> = {
      US_10Y_YIELD: "US 10Y Treasury",
      UK_BASE_RATE: "UK Base Rate",
      NG_INFLATION: "NG Inflation",
      FED_RATE: "Fed Funds Rate",
      US_CPI: "US CPI",
    };

    // Filter to the 4 we want to display, in order
    const displayOrder = ["US_10Y_YIELD", "UK_BASE_RATE", "NG_INFLATION", "FED_RATE"];

    return displayOrder
      .map((key) => {
        const dbRecord = economicIndicators.find(
          (r: { indicator: string }) => r.indicator === key
        );
        const mock = MOCK_INDICATORS.find((m) => m.indicator === key);

        if (dbRecord) {
          return {
            indicator: dbRecord.indicator,
            value: dbRecord.value,
            unit: dbRecord.unit,
            label: shortLabelMap[dbRecord.indicator] || dbRecord.label,
            source: dbRecord.source,
            date: dbRecord.date,
            trend: trendMap[dbRecord.indicator] || ("flat" as const),
          };
        }

        // Fallback to mock if somehow missing from DB
        return mock || MOCK_INDICATORS[0];
      })
      .filter(Boolean) as EconomicIndicator[];
  }, [economicIndicators]);

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

        {/* Your Net Worth Card */}
        <section style={{ marginBottom: "48px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(255, 179, 71, 0.08) 0%, rgba(255, 179, 71, 0) 60%), rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 179, 71, 0.15)",
              borderRadius: "32px",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative star */}
            <span
              style={{
                position: "absolute",
                top: "20px",
                right: "30px",
                fontSize: "2rem",
                color: "#ffb347",
                opacity: 0.3,
              }}
            >
              &#10022;
            </span>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: "#968a84",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  All Your Money - Total Net Worth
                </span>
                {isLoadingNetWorth ? (
                  <div style={{ ...cs.loadingSkeleton, height: "56px", width: "280px" }} />
                ) : (
                  <div
                    style={{
                      fontFamily: "'DynaPuff', cursive",
                      fontSize: "3.5rem",
                      color: "#ffffff",
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(totalBalance, currency)}
                  </div>
                )}
                {!isLoadingNetWorth && (
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "4px 12px",
                      background: "rgba(46, 213, 115, 0.1)",
                      borderRadius: "999px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#2ed573",
                      marginTop: "12px",
                    }}
                  >
                    Across all accounts
                  </div>
                )}
              </div>

              {/* Mini trend chart */}
              <div style={{ width: "240px", height: "80px", flexShrink: 0 }}>
                <svg width="100%" height="100%" viewBox="0 0 240 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb347" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ffb347" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C20,55 40,65 60,50 C80,35 100,45 120,30 C140,15 160,35 180,20 C200,5 220,15 240,8"
                    fill="none"
                    stroke="#ffb347"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,60 C20,55 40,65 60,50 C80,35 100,45 120,30 C140,15 160,35 180,20 C200,5 220,15 240,8 V80 H0 Z"
                    fill="url(#nwGrad)"
                  />
                </svg>
              </div>
            </div>

            {/* Multi-Currency Breakdown */}
            {!isLoadingNetWorth && (
              <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: "#968a84",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Holdings by Currency
                </span>
                <CurrencyBreakdown />
              </div>
            )}

            {/* Quick link to All My Money */}
            <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
              <a
                href="/all-my-money"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  color: "#ffb347",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                View All Accounts &amp; Assets &#8594;
              </a>
            </div>
          </div>
        </section>

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

        {/* Market Snapshot - Economic Indicators */}
        <MarketSnapshotSection indicators={marketIndicators} />

        {/* Dashboard Content: Spending + Asset Allocation + Automations */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
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

          {/* Asset Allocation Donut Chart */}
          <AssetAllocationCard
            totalBalance={totalBalance}
            currency={currency}
            isLoading={isLoadingNetWorth}
          />

          {/* Automations Card — spans full width */}
          <div style={{ ...cs.contentCardGradient, gridColumn: "1 / -1" }}>
            <div style={cs.cardTitle}>Active Automations</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
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

        {/* Financial News */}
        <FinancialNewsSection userCountry={currentUser?.country} />
      </main>
    </div>
  );
}
