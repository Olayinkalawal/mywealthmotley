"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { formatCurrency } from "@/lib/currencies";
import { useUserCurrency } from "@/hooks/use-currency";
import {
  ASSET_TYPE_COLORS,
  ASSET_TYPE_LABELS,
} from "@/lib/mock-data";
import type { AssetBreakdown, AssetType } from "@/lib/mock-data";
import type { CurrencyCode } from "@/lib/constants";
import { WmQuickAddInvestment } from "@/components/wm/wm-quick-add-investment";
import { WmScreenshotImport } from "@/components/wm/wm-screenshot-import";
import { WmAddAssetDialog } from "@/components/wm/wm-add-asset-dialog";

// ── Styles (faithful port of react-app-6.js) ──────────────────────

const s = {
  wrapper: {
    backgroundColor: "#0d0b0a",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    position: "relative" as const,
    overflowX: "hidden" as const,
    WebkitFontSmoothing: "antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
  },
  ambientGlow: {
    position: "fixed" as const,
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
  },
  glow1: {
    top: "-10%",
    left: "-10%",
    width: "50vw",
    height: "50vw",
    background:
      "radial-gradient(circle, rgba(255, 179, 71, 0.12) 0%, transparent 70%)",
  },
  glow2: {
    bottom: "-10%",
    right: "-10%",
    width: "50vw",
    height: "50vw",
    background:
      "radial-gradient(circle, rgba(230, 126, 34, 0.05) 0%, transparent 70%)",
  },
  main: {
    position: "relative" as const,
    zIndex: 10,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px 5% 80px",
    width: "100%",
  },
  quickActions: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexWrap: "wrap" as const,
  },
  quickActionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition:
      "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, background 0.2s",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
    marginBottom: "48px",
  },
  netWorthCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "32px",
    padding: "40px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    position: "relative" as const,
    overflow: "hidden",
  },
  netWorthCardStar: {
    position: "absolute" as const,
    top: "20px",
    right: "30px",
    fontSize: "2rem",
    color: "#ffb347",
    opacity: 0.3,
  },
  label: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "0.75rem",
    color: "#968a84",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "8px",
    display: "block",
  },
  totalValue: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "4.5rem",
    color: "#ffffff",
    marginBottom: "24px",
    lineHeight: 1,
  },
  trendChartMini: {
    height: "120px",
    width: "100%",
    marginTop: "20px",
    position: "relative" as const,
  },
  allocationCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "32px",
    padding: "32px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  donutViz: {
    position: "relative" as const,
    width: "180px",
    height: "180px",
    marginBottom: "24px",
  },
  donutSvg: {
    transform: "rotate(-90deg)",
  },
  allocationLegend: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.75rem",
    color: "#968a84",
    fontFamily: "'JetBrains Mono', monospace",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  accountsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  accountCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    transition:
      "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s",
    cursor: "pointer",
  },
  accountHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  accountIcon: {
    width: "40px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffb347",
  },
  accountName: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#ffffff",
  },
  accountType: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    color: "#968a84",
    textTransform: "uppercase" as const,
  },
  accountBalance: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "1.5rem",
    marginTop: "8px",
  },
  changePillGreen: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: "6px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    background: "rgba(46, 213, 115, 0.1)",
    color: "#2ed573",
    marginTop: "12px",
  },
  changePillRed: {
    display: "inline-flex",
    padding: "4px 8px",
    borderRadius: "6px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    background: "rgba(255, 71, 87, 0.1)",
    color: "#ff4757",
    marginTop: "12px",
  },
  sectionTitle: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "2rem",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    color: "#ffffff",
  },
  sectionTitleLine: {
    height: "1px",
    flexGrow: 1,
    background: "rgba(255, 255, 255, 0.08)",
  },
  platformBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    background: "rgba(255, 179, 71, 0.1)",
    border: "1px solid rgba(255, 179, 71, 0.2)",
    borderRadius: "8px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.65rem",
    color: "#ffb347",
    marginTop: "8px",
  },
  holdingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
    fontSize: "0.8rem",
  },
  holdingName: {
    color: "#ffffff",
    fontWeight: 500,
  },
  holdingTicker: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.65rem",
    color: "#968a84",
    marginLeft: "8px",
  },
  holdingValue: {
    fontFamily: "'JetBrains Mono', monospace",
    color: "#ffb347",
  },
  holdingQty: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    color: "#968a84",
  },
  connectCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px dashed rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
    gap: "12px",
    opacity: 0.6,
    transition:
      "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s",
  },
  loadingSkeleton: {
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "12px",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  },
  screenshotModal: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 1000,
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    overflowY: "auto" as const,
    padding: "40px 20px",
  },
  screenshotModalInner: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  modalCloseBtn: {
    position: "absolute" as const,
    top: "20px",
    right: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "1.25rem",
  },
  fab: {
    position: "fixed" as const,
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "#ffb347",
    border: "none",
    color: "#0d0b0a",
    fontSize: "1.5rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(255, 179, 71, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    zIndex: 50,
  },
};

// ── Icon components for account types ─────────────────────────────

function BankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M3 10h18M5 10V21M9 10V21M13 10V21M17 10V21M12 3l8 7H4l8-7z" />
    </svg>
  );
}

function StocksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function PensionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PropertyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CryptoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M2 8h2M20 8h2M2 16h2M20 16h2" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

const ASSET_ICON_MAP: Record<string, () => React.ReactElement> = {
  bank: BankIcon,
  investment: StocksIcon,
  pension: PensionIcon,
  property: PropertyIcon,
  crypto: CryptoIcon,
  cash: CashIcon,
  other: WalletIcon,
};

// ── Account Card Component (with holdings) ────────────────────────

function AccountCard({
  icon,
  type,
  name,
  balance,
  change,
  changeType,
  note,
  platform,
  holdings,
}: {
  icon: React.ReactElement;
  type: string;
  name: string;
  balance: string;
  change?: string;
  changeType?: "green" | "red";
  note?: string;
  platform?: string;
  holdings?: {
    ticker?: string;
    name: string;
    quantity?: number;
    value: number;
    currency: string;
  }[];
}) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        ...s.accountCard,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        borderColor: hovered
          ? "rgba(255, 179, 71, 0.15)"
          : "rgba(255, 255, 255, 0.08)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => holdings && holdings.length > 0 && setExpanded(!expanded)}
    >
      <div style={s.accountHeader}>
        <div style={s.accountIcon}>{icon}</div>
        <div style={s.accountType}>{type}</div>
      </div>
      <div style={s.accountName}>{name}</div>
      <div style={s.accountBalance}>{balance}</div>
      {platform && <div style={s.platformBadge}>{platform}</div>}
      {change && changeType === "green" && (
        <div style={s.changePillGreen}>{change}</div>
      )}
      {change && changeType === "red" && (
        <div style={s.changePillRed}>{change}</div>
      )}
      {note && (
        <div style={{ color: "#968a84", fontSize: "0.7rem", marginTop: "12px" }}>
          {note}
        </div>
      )}
      {/* Expandable holdings list */}
      {expanded && holdings && holdings.length > 0 && (
        <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
          {holdings.map((h, i) => (
            <div key={i} style={s.holdingRow}>
              <div>
                <span style={s.holdingName}>{h.name}</span>
                {h.ticker && <span style={s.holdingTicker}>{h.ticker}</span>}
                {h.quantity && (
                  <span style={s.holdingQty}> x{h.quantity}</span>
                )}
              </div>
              <span style={s.holdingValue}>
                {formatCurrency(h.value, h.currency)}
              </span>
            </div>
          ))}
        </div>
      )}
      {holdings && holdings.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "0.65rem",
            color: "#968a84",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {expanded ? "Click to collapse" : `${holdings.length} holding${holdings.length !== 1 ? "s" : ""} - click to expand`}
        </div>
      )}
    </div>
  );
}

// ── Quick Action Button ──────────────────────────────────────────

function QuickActionButton({
  label,
  emoji,
  onClick,
}: {
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        ...s.quickActionBtn,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: hovered
          ? "rgba(255, 179, 71, 0.3)"
          : "rgba(255, 255, 255, 0.08)",
        background: hovered
          ? "rgba(255, 179, 71, 0.08)"
          : "rgba(255, 255, 255, 0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
      {label}
    </button>
  );
}

// ── Net Worth Card Component ──────────────────────────────────────

function NetWorthCardDisplay({
  totalNetWorth,
  currency,
  monthlyChange,
  isLoading,
}: {
  totalNetWorth: number;
  currency: CurrencyCode;
  monthlyChange?: string;
  isLoading: boolean;
}) {
  return (
    <div style={s.netWorthCard}>
      <span style={s.netWorthCardStar}>&#10022;</span>
      <div>
        <span style={s.label}>Total Net Worth</span>
        {isLoading ? (
          <div
            style={{ ...s.loadingSkeleton, height: "72px", width: "300px", marginBottom: "24px" }}
          />
        ) : (
          <h1 style={s.totalValue}>
            {formatCurrency(totalNetWorth, currency)}
          </h1>
        )}
        {!isLoading && monthlyChange && (
          <div style={s.changePillGreen}>{monthlyChange}</div>
        )}
      </div>
      <div style={s.trendChartMini}>
        <svg width="100%" height="100%" viewBox="0 0 600 120">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb347" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ffb347" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            fill="none"
            stroke="#ffb347"
            strokeWidth="4"
            strokeLinecap="round"
            d="M0,100 C50,90 100,110 150,80 C200,50 250,70 300,40 C350,10 400,60 450,30 C500,0 550,20 600,10"
          />
          <path
            d="M0,100 C50,90 100,110 150,80 C200,50 250,70 300,40 C350,10 400,60 450,30 C500,0 550,20 600,10 V120 H0 Z"
            fill="url(#lineGrad)"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Allocation Card Component ─────────────────────────────────────

function AllocationCardDisplay({
  breakdownData,
  isLoading,
}: {
  breakdownData: AssetBreakdown[];
  isLoading: boolean;
}) {
  const colorMap = [
    "#ffb347",
    "#ffffff",
    "rgba(255,255,255,0.4)",
    "rgba(255,255,255,0.15)",
    "#e67e22",
    "#968a84",
  ];
  const totalClasses = breakdownData.length || 6;

  const circumference = 2 * Math.PI * 70;
  let offset = 0;
  const segments = breakdownData.map((item, i) => {
    const dashLen = (item.percentage / 100) * circumference;
    const seg = {
      dashLen,
      dashOffset: -offset,
      color: colorMap[i % colorMap.length],
    };
    offset += dashLen + 5;
    return seg;
  });

  const fallbackSegments = [
    { dashLen: 110, dashOffset: 0, color: "#ffb347" },
    { dashLen: 180, dashOffset: -115, color: "#ffffff" },
    { dashLen: 150, dashOffset: -300, color: "rgba(255,255,255,0.2)" },
  ];

  const displaySegments = segments.length > 0 ? segments : fallbackSegments;
  const legendItems =
    breakdownData.length > 0
      ? breakdownData.map((item, i) => ({
          label: `${item.label} (${Math.round(item.percentage)}%)`,
          color: colorMap[i % colorMap.length],
        }))
      : [
          { label: "Cash (25%)", color: "#ffb347" },
          { label: "Stocks (40%)", color: "#ffffff" },
          { label: "Property (30%)", color: "rgba(255,255,255,0.4)" },
          { label: "Other (5%)", color: "rgba(255,255,255,0.1)" },
        ];

  return (
    <div style={s.allocationCard}>
      <span style={s.label}>Asset Allocation</span>
      <div style={s.donutViz}>
        <svg
          style={s.donutSvg}
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          {displaySegments.map((seg, i) => (
            <circle
              key={i}
              fill="none"
              strokeWidth="20"
              cx="90"
              cy="90"
              r="70"
              stroke={seg.color}
              strokeDasharray={`${seg.dashLen} ${circumference}`}
              strokeDashoffset={seg.dashOffset}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: "1.5rem",
              color: "#ffffff",
            }}
          >
            {isLoading ? "-" : totalClasses}
          </span>
          <div
            style={{
              fontSize: "0.6rem",
              color: "#968a84",
              textTransform: "uppercase",
            }}
          >
            Asset Classes
          </div>
        </div>
      </div>
      <div style={s.allocationLegend}>
        {legendItems.map((item, i) => (
          <div key={i} style={s.legendItem}>
            <div style={{ ...s.dot, background: item.color! }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function AllMyMoneyPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const preferredCurrency = useUserCurrency();

  // Modal states
  const [showScreenshotImport, setShowScreenshotImport] = useState(false);
  const [showFab, setShowFab] = useState(false);

  // Convex queries (reactive - auto-update when data changes)
  const netWorth = useQuery(
    api.allMyMoney.getNetWorth,
    isAuthenticated ? {} : "skip"
  );
  const assetBreakdown = useQuery(
    api.allMyMoney.getAssetBreakdown,
    isAuthenticated ? {} : "skip"
  );

  // Convex mutations
  const addAsset = useMutation(api.allMyMoney.addManualAsset);

  // Loading states
  const isLoadingNetWorth = netWorth === undefined;
  const isLoadingBreakdown = assetBreakdown === undefined;

  // Derived data
  const primaryCurrency: CurrencyCode =
    (netWorth?.primaryCurrency as CurrencyCode) ?? preferredCurrency;

  const breakdownData: AssetBreakdown[] =
    assetBreakdown?.breakdown.map((b) => ({
      type: b.type as AssetType,
      label: ASSET_TYPE_LABELS[b.type as AssetType] ?? b.type,
      value: b.value,
      percentage: b.percentage,
      items: b.items,
      color:
        ASSET_TYPE_COLORS[b.type as AssetType] ?? "hsl(280, 30%, 55%)",
    })) ?? [];

  // Group accounts by platform
  const accountsByPlatform = useMemo(() => {
    const accounts = netWorth?.accounts ?? [];
    const groups: Record<
      string,
      Array<{
        id: string;
        name: string;
        type: string;
        value: number;
        currency: string;
        convertedValue: number;
        platform?: string;
        holdings?: {
          ticker?: string;
          name: string;
          quantity?: number;
          value: number;
          currency: string;
        }[];
      }>
    > = {};

    for (const acc of accounts) {
      // We need to extract platform info from the name or use a default
      const platformKey =
        acc.type === "bank" ? "Banks" : (acc as any).platform || "Other";
      if (!groups[platformKey]) {
        groups[platformKey] = [];
      }
      groups[platformKey]!.push(acc as any);
    }

    return groups;
  }, [netWorth]);

  // Transform accounts into card data
  const accountCards = useMemo(() => {
    return (netWorth?.accounts ?? []).map((acc: any) => {
      const IconComp = ASSET_ICON_MAP[acc.type] ?? WalletIcon;
      return {
        icon: <IconComp />,
        type: ASSET_TYPE_LABELS[acc.type as AssetType] ?? acc.type,
        name: acc.name,
        balance: formatCurrency(acc.value, acc.currency),
        change: undefined as string | undefined,
        changeType: "green" as "green" | "red",
        note: undefined as string | undefined,
        platform: acc.platform as string | undefined,
        holdings: acc.holdings as
          | {
              ticker?: string;
              name: string;
              quantity?: number;
              value: number;
              currency: string;
            }[]
          | undefined,
      };
    });
  }, [netWorth]);

  // Fallback mock accounts
  const fallbackAccounts = useMemo(
    () => [
      {
        icon: <BankIcon />,
        type: "Checking",
        name: "High-Yield Savings",
        balance: formatCurrency(2500000, primaryCurrency),
        change: "+4.25% APY",
        changeType: "green" as const,
      },
      {
        icon: <StocksIcon />,
        type: "Investments",
        name: "Global ETF Portfolio",
        balance: formatCurrency(4960000, primaryCurrency),
        change: "+3.2% This Month",
        changeType: "green" as const,
      },
      {
        icon: <PensionIcon />,
        type: "Pension",
        name: "Retirement Plan",
        balance: formatCurrency(1500000, primaryCurrency),
        change: "Vested",
        changeType: "green" as const,
      },
      {
        icon: <PropertyIcon />,
        type: "Real Estate",
        name: "Main Residence",
        balance: formatCurrency(15000000, primaryCurrency),
        note: "Less mortgage balance",
      },
      {
        icon: <CryptoIcon />,
        type: "Crypto",
        name: "Cold Storage",
        balance: formatCurrency(775000, primaryCurrency),
        change: "-2.4% Today",
        changeType: "red" as const,
      },
    ],
    [primaryCurrency]
  );

  const displayAccounts =
    !isLoadingNetWorth && accountCards.length > 0
      ? accountCards
      : !isLoadingNetWorth
        ? fallbackAccounts
        : [];

  // Inject fonts
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
    <div style={s.wrapper}>
      {/* Ambient glow */}
      <div style={{ ...s.ambientGlow, ...s.glow1 }} />
      <div style={{ ...s.ambientGlow, ...s.glow2 }} />

      <main style={s.main}>
        {/* Quick Action Buttons */}
        <div style={s.quickActions}>
          <QuickActionButton
            emoji={"\uD83D\uDCF8"}
            label="Import Screenshot"
            onClick={() => setShowScreenshotImport(true)}
          />
          <WmQuickAddInvestment
            trigger={
              <QuickActionButton
                emoji={"\u2795"}
                label="Quick Add Stock"
                onClick={() => {}}
              />
            }
          />
          <WmAddAssetDialog
            trigger={
              <QuickActionButton
                emoji={"\uD83C\uDFE6"}
                label="Add Asset"
                onClick={() => {}}
              />
            }
            onSubmit={async (data) => {
              await addAsset({
                name: data.name,
                type: data.type,
                platform: data.platform || undefined,
                value: data.value,
                currency: data.currency,
                holdings: data.holdings,
                notes: data.notes || undefined,
              });
            }}
          />
        </div>

        {/* Hero: Net Worth + Allocation */}
        <div style={s.heroSection}>
          <NetWorthCardDisplay
            totalNetWorth={netWorth?.totalNetWorth ?? 0}
            currency={primaryCurrency}
            monthlyChange={
              netWorth
                ? `+${formatCurrency(netWorth.totalNetWorth * 0.032, primaryCurrency)} this month`
                : undefined
            }
            isLoading={isLoadingNetWorth}
          />
          <AllocationCardDisplay
            breakdownData={breakdownData}
            isLoading={isLoadingBreakdown}
          />
        </div>

        {/* Section title */}
        <h2 style={s.sectionTitle}>
          My Accounts
          <span style={s.sectionTitleLine}></span>
        </h2>

        {/* Loading skeletons */}
        {isLoadingNetWorth && (
          <div style={s.accountsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...s.accountCard,
                  minHeight: "180px",
                }}
              >
                <div
                  style={{
                    ...s.loadingSkeleton,
                    height: "40px",
                    width: "40px",
                    marginBottom: "24px",
                  }}
                />
                <div
                  style={{
                    ...s.loadingSkeleton,
                    height: "16px",
                    width: "120px",
                    marginBottom: "8px",
                  }}
                />
                <div
                  style={{
                    ...s.loadingSkeleton,
                    height: "28px",
                    width: "160px",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Account cards */}
        {!isLoadingNetWorth && (
          <div style={s.accountsGrid}>
            {displayAccounts.map((account, index) => (
              <AccountCard key={index} {...account} />
            ))}
          </div>
        )}
      </main>

      {/* Screenshot Import Modal */}
      {showScreenshotImport && (
        <div style={s.screenshotModal}>
          <button
            style={s.modalCloseBtn}
            onClick={() => setShowScreenshotImport(false)}
          >
            x
          </button>
          <div style={s.screenshotModalInner}>
            <WmScreenshotImport
              onComplete={() => {
                // Modal stays open showing success state
                // Dashboard will auto-update via reactive queries
              }}
            />
          </div>
        </div>
      )}

      {/* FAB for mobile - Quick Add */}
      <WmQuickAddInvestment
        trigger={
          <button
            style={s.fab}
            className="sm:hidden"
          >
            +
          </button>
        }
      />
    </div>
  );
}
