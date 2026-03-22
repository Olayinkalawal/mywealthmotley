"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { WmDisclaimer } from "@/components/wm/wm-disclaimer";
import { useCurrency } from "@/hooks/use-currency";
import Link from "next/link";

const calculateProjection = (
  initial: number,
  monthly: number,
  years: number,
  rate = 0.12,
) => {
  let total = initial;
  for (let i = 0; i < years * 12; i++) {
    total = total * (1 + rate / 12) + monthly;
  }
  return Math.round(total);
};

// ── Investment Growth Simulator ─────────────────────────────────────
function SimulatorSection() {
  const { format: fmtCurr, formatCompact: fmtCompactCurr } = useCurrency();
  const [initial, setInitial] = useState(500000);
  const [monthly, setMonthly] = useState(50000);
  const [years, setYears] = useState(10);

  const projected = calculateProjection(initial, monthly, years);
  const totalInvested = initial + monthly * years * 12;
  const returns = projected - totalInvested;
  const returnsPercent = Math.round((returns / totalInvested) * 100);

  const getTrackWidth = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const sliders = [
    {
      label: "Initial Investment",
      value: initial,
      setValue: setInitial,
      min: 100000,
      max: 5000000,
      minLabel: fmtCompactCurr(100000),
      maxLabel: fmtCompactCurr(5000000),
      display: fmtCurr(initial),
    },
    {
      label: "Monthly Contribution",
      value: monthly,
      setValue: setMonthly,
      min: 10000,
      max: 500000,
      minLabel: fmtCompactCurr(10000),
      maxLabel: fmtCompactCurr(500000),
      display: fmtCurr(monthly),
    },
    {
      label: "Time Horizon",
      value: years,
      setValue: setYears,
      min: 1,
      max: 30,
      minLabel: "1 Yr",
      maxLabel: "30 Yrs",
      display: `${years} Years`,
    },
  ];

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h2
        className="font-display"
        style={{
          fontSize: "1.875rem",
          color: "#ffffff",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        Investment Growth Simulator
      </h2>

      <div
        className="glass-card"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "32px",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow accent */}
        <div
          style={{
            position: "absolute",
            right: "-160px",
            top: "-160px",
            width: "384px",
            height: "384px",
            background: "rgba(255, 179, 71, 0.12)",
            borderRadius: "50%",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />

        {/* Sliders column */}
        <div
          style={{
            gridColumn: "span 5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "32px",
            zIndex: 10,
          }}
        >
          {sliders.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <label
                  style={{
                    fontSize: "0.875rem",
                    color: "#968a84",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </label>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "1.125rem",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  {item.display}
                </span>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 0,
                    height: "4px",
                    background: "#ffb347",
                    borderRadius: "2px 0 0 2px",
                    width: `${getTrackWidth(item.value, item.min, item.max)}%`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  value={item.value}
                  onChange={(e) => item.setValue(Number(e.target.value))}
                  style={{
                    width: "100%",
                    position: "relative",
                    zIndex: 10,
                  }}
                />
              </div>
              <div
                className="font-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "rgba(150, 138, 132, 0.5)",
                  marginTop: "4px",
                }}
              >
                <span>{item.minLabel}</span>
                <span>{item.maxLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results column */}
        <div
          style={{
            gridColumn: "span 7",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            zIndex: 10,
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            paddingLeft: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "0.75rem",
                color: "#968a84",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Projected Value
            </span>
            <h3
              className="font-display"
              style={{
                fontSize: "3.5rem",
                color: "#ffb347",
                lineHeight: 1,
              }}
            >
              {fmtCurr(projected)}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "24px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#968a84" }}>
                  Total Invested
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.875rem",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  {fmtCurr(totalInvested)}
                </span>
              </div>
              <div
                style={{
                  width: "1px",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "#968a84" }}>
                  Estimated Returns
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.875rem",
                    color: "#34d399",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  {fmtCurr(returns)} (+{returnsPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              marginTop: "auto",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Y-axis labels */}
            <div
              className="font-mono"
              style={{
                position: "absolute",
                left: "-40px",
                top: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "rgba(150,138,132,0.5)",
                paddingBottom: "24px",
              }}
            >
              <span>15M</span>
              <span>10M</span>
              <span>5M</span>
              <span>0</span>
            </div>
            {/* X-axis labels */}
            <div
              className="font-mono"
              style={{
                position: "absolute",
                bottom: "-24px",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "rgba(150,138,132,0.5)",
              }}
            >
              <span>Yr 0</span>
              <span>Yr {Math.round(years * 0.3)}</span>
              <span>Yr {Math.round(years * 0.6)}</span>
              <span>Yr {years}</span>
            </div>
            {/* Grid lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                />
              ))}
            </div>
            {/* SVG chart */}
            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient
                  id="chartGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffb347" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffb347" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                className="chart-area"
                d="M0,200 L0,180 L100,160 L200,140 L300,120 L400,100 L500,80 L500,200 Z"
                fill="rgba(255,255,255,0.03)"
              />
              <path
                className="chart-area"
                d="M0,200 L0,180 Q100,175 200,150 T400,80 T500,20 L500,80 L400,100 L300,120 L200,140 L100,160 L0,180 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,180 L100,160 L200,140 L300,120 L400,100 L500,80"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                className="chart-line"
                d="M0,180 Q100,175 200,150 T400,80 T500,20"
                fill="none"
                stroke="#ffb347"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="500"
                cy="20"
                r="4"
                fill="#0d0b0a"
                stroke="#ffb347"
                strokeWidth="2"
                className="chart-area"
              />
            </svg>
          </div>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              marginTop: "16px",
            }}
          >
            Projections are estimates based on 12% average annual return. Actual
            returns may vary.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Strategy Card ────────────────────────────────────────────────────
interface AssetMixBar {
  color: string;
  width: string;
}

interface Strategy {
  id: string;
  riskLabel: string;
  riskColor: string;
  riskBg: string;
  riskBorder: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  titleColor?: string;
  description: string;
  assetMixBars: AssetMixBar[];
  assetMixStr: string;
  expectedReturn: string;
  returnSize?: string;
  bestFor: string;
}

function StrategyCard({
  strategy,
  isActive,
  onSelect,
}: {
  strategy: Strategy;
  isActive: boolean;
  onSelect: () => void;
}) {
  const activeCardStyle = {
    borderColor: "#ffb347",
    background:
      "linear-gradient(180deg, rgba(255, 179, 71, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
    boxShadow: "0 0 24px rgba(255, 179, 71, 0.15)",
    transform: "translateY(-4px)",
  };

  return (
    <div
      className={`glass-card ${isActive ? "active-card" : ""}`}
      style={{
        background: isActive ? undefined : "rgba(255,255,255,0.04)",
        border: isActive ? undefined : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        transition:
          "border-color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
        ...(isActive ? activeCardStyle : {}),
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "128px",
            height: "4px",
            background: "#ffb347",
            borderRadius: "0 0 9999px 9999px",
            boxShadow: "0 0 10px #ffb347",
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: strategy.iconBg,
            border: `1px solid ${strategy.iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: strategy.iconColor,
            transition: "transform 0.2s",
          }}
        >
          {strategy.icon}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isActive && (
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#ffb347",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "rgba(255,179,71,0.1)",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,179,71,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                className="animate-pulse"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#ffb347",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
              Selected
            </span>
          )}
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: strategy.riskColor,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: strategy.riskBg,
              padding: "4px 10px",
              borderRadius: "6px",
              border: `1px solid ${strategy.riskBorder}`,
            }}
          >
            {strategy.riskLabel}
          </span>
        </div>
      </div>

      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: strategy.titleColor || "#ffffff",
          marginBottom: "4px",
        }}
      >
        {strategy.title}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#968a84",
          marginBottom: "24px",
          height: "40px",
        }}
      >
        {strategy.description}
      </p>

      {/* Details */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "32px",
          flexGrow: 1,
        }}
      >
        {/* Asset Mix */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Asset Mix
          </span>
          <div
            style={{
              display: "flex",
              height: "8px",
              width: "100%",
              borderRadius: "9999px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {strategy.assetMixBars.map((bar, i) => (
              <div
                key={i}
                style={{
                  background: bar.color,
                  height: "100%",
                  width: bar.width,
                }}
              />
            ))}
          </div>
          <span
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#ffffff",
              marginTop: "4px",
            }}
          >
            {strategy.assetMixStr}
          </span>
        </div>

        {/* Expected Return */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Expected Return
          </span>
          <span
            className="font-mono"
            style={{
              fontWeight: 700,
              color: "#ffffff",
              fontSize: strategy.returnSize || "0.875rem",
            }}
          >
            {strategy.expectedReturn}{" "}
            <span
              style={{
                color: "#968a84",
                fontWeight: 400,
                fontSize: "0.75rem",
              }}
            >
              /yr
            </span>
          </span>
        </div>

        {/* Best For */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "0.75rem",
            color: "#968a84",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isActive ? "#ffb347" : "currentColor"}
            strokeWidth="2"
            style={{ marginTop: "2px", flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p style={{ color: isActive ? "#ffffff" : "#968a84" }}>
            {strategy.bestFor}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onSelect}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: "9999px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          cursor: "pointer",
          marginTop: "auto",
          transition: "all 0.2s",
          fontWeight: isActive ? 700 : 400,
          ...(isActive
            ? {
                background: "#ffb347",
                color: "#0d0b0a",
                border: "none",
                boxShadow: "0 0 15px rgba(255,179,71,0.3)",
              }
            : {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }),
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.05)";
        }}
      >
        {isActive ? "Active Strategy" : "Select Strategy"}
      </button>
    </div>
  );
}

// ── Strategies Data ──────────────────────────────────────────────────
const strategies: Strategy[] = [
  {
    id: "conservative",
    riskLabel: "Low Risk",
    riskColor: "#34d399",
    riskBg: "rgba(52,211,153,0.1)",
    riskBorder: "rgba(52,211,153,0.2)",
    iconBg: "rgba(52,211,153,0.1)",
    iconBorder: "rgba(52,211,153,0.2)",
    iconColor: "#34d399",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Conservative",
    description: "Capital preservation focused",
    assetMixBars: [
      { color: "#60a5fa", width: "70%" },
      { color: "#c084fc", width: "20%" },
      { color: "#34d399", width: "10%" },
    ],
    assetMixStr: "70% BND \u00B7 20% STK \u00B7 10% CSH",
    expectedReturn: "6-8%",
    bestFor: "Best for: Short-term goals, emergency funds",
  },
  {
    id: "balanced",
    riskLabel: "Med Risk",
    riskColor: "#fbbf24",
    riskBg: "rgba(251,191,36,0.1)",
    riskBorder: "rgba(251,191,36,0.2)",
    iconBg: "rgba(255,179,71,0.1)",
    iconBorder: "rgba(255,179,71,0.2)",
    iconColor: "#ffb347",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 14h18" />
        <path d="M3 7h18" />
        <path d="M12 3v18" />
      </svg>
    ),
    title: "Balanced",
    titleColor: "#ffb347",
    description: "Growth with stability",
    assetMixBars: [
      { color: "#c084fc", width: "50%" },
      { color: "#60a5fa", width: "40%" },
      { color: "#ffb347", width: "10%" },
    ],
    assetMixStr: "50% STK \u00B7 40% BND \u00B7 10% ALT",
    expectedReturn: "10-12%",
    returnSize: "1.125rem",
    bestFor: "Best for: Medium-term goals, wealth building",
  },
  {
    id: "growth",
    riskLabel: "High Risk",
    riskColor: "#a855f7",
    riskBg: "rgba(168,85,247,0.1)",
    riskBorder: "rgba(168,85,247,0.2)",
    iconBg: "rgba(168,85,247,0.1)",
    iconBorder: "rgba(168,85,247,0.2)",
    iconColor: "#a855f7",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    title: "Growth",
    description: "Maximum growth potential",
    assetMixBars: [
      { color: "#c084fc", width: "70%" },
      { color: "#60a5fa", width: "20%" },
      { color: "#f472b6", width: "10%" },
    ],
    assetMixStr: "70% STK \u00B7 20% BND \u00B7 10% REI",
    expectedReturn: "14-18%",
    bestFor: "Best for: Long-term goals, retirement",
  },
  {
    id: "diaspora",
    riskLabel: "Med-High",
    riskColor: "#3b82f6",
    riskBg: "rgba(59,130,246,0.1)",
    riskBorder: "rgba(59,130,246,0.2)",
    iconBg: "rgba(59,130,246,0.1)",
    iconBorder: "rgba(59,130,246,0.2)",
    iconColor: "#3b82f6",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Diaspora",
    description: "International diversification",
    assetMixBars: [
      { color: "#818cf8", width: "40%" },
      { color: "#60a5fa", width: "30%" },
      { color: "#2dd4bf", width: "20%" },
      { color: "#34d399", width: "10%" },
    ],
    assetMixStr: "40% US \u00B7 30% EU \u00B7 20% EM \u00B7 10% NG",
    expectedReturn: "12-15%",
    bestFor: "Best for: Hedging Naira risk, global exposure",
  },
];

// ── Strategy Section ─────────────────────────────────────────────────
function StrategySection() {
  const [selectedStrategy, setSelectedStrategy] = useState("balanced");

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h2
        className="font-display"
        style={{
          fontSize: "1.875rem",
          color: "#ffffff",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        Choose Your Strategy
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isActive={selectedStrategy === strategy.id}
            onSelect={() => setSelectedStrategy(strategy.id)}
          />
        ))}
      </div>
    </section>
  );
}

// ── ETF Data ─────────────────────────────────────────────────────────
const etfs = [
  { ticker: "VOO", name: "Vanguard S&P 500", category: "Large Blend", assetClass: "Stocks", assetClassColor: "#c084fc", assetClassBg: "rgba(168,85,247,0.1)", assetClassBorder: "rgba(168,85,247,0.2)", expRatio: "0.03%", expRatioColor: undefined as string | undefined, fiveYReturn: "+85.4%", returnPos: true, riskLabel: "Med", riskColor: "#fbbf24" },
  { ticker: "VTI", name: "Vanguard Total Stock", category: "Large Blend", assetClass: "Stocks", assetClassColor: "#c084fc", assetClassBg: "rgba(168,85,247,0.1)", assetClassBorder: "rgba(168,85,247,0.2)", expRatio: "0.03%", expRatioColor: undefined as string | undefined, fiveYReturn: "+81.2%", returnPos: true, riskLabel: "Med", riskColor: "#fbbf24" },
  { ticker: "VTIAX", name: "Vanguard Total Intl", category: "Foreign Large Blend", assetClass: "Intl", assetClassColor: "#3b82f6", assetClassBg: "rgba(59,130,246,0.1)", assetClassBorder: "rgba(59,130,246,0.2)", expRatio: "0.11%", expRatioColor: undefined as string | undefined, fiveYReturn: "+24.5%", returnPos: true, riskLabel: "High", riskColor: "#a855f7" },
  { ticker: "FZROX", name: "Fidelity ZERO Total Mkt", category: "Large Blend", assetClass: "Stocks", assetClassColor: "#c084fc", assetClassBg: "rgba(168,85,247,0.1)", assetClassBorder: "rgba(168,85,247,0.2)", expRatio: "0.00%", expRatioColor: "#34d399", fiveYReturn: "+82.1%", returnPos: true, riskLabel: "Med", riskColor: "#fbbf24" },
  { ticker: "VNQI", name: "Vanguard Global ex-US Real Estate", category: "Global Real Estate", assetClass: "REITs", assetClassColor: "#f472b6", assetClassBg: "rgba(244,114,182,0.1)", assetClassBorder: "rgba(244,114,182,0.2)", expRatio: "0.12%", expRatioColor: undefined as string | undefined, fiveYReturn: "-8.4%", returnPos: false, riskLabel: "High", riskColor: "#a855f7" },
  { ticker: "VWOB", name: "Vanguard EM Govt Bond", category: "Emerging Markets Bond", assetClass: "Bonds", assetClassColor: "#60a5fa", assetClassBg: "rgba(59,130,246,0.1)", assetClassBorder: "rgba(59,130,246,0.2)", expRatio: "0.20%", expRatioColor: undefined as string | undefined, fiveYReturn: "+5.2%", returnPos: true, riskLabel: "Med", riskColor: "#fbbf24" },
  { ticker: "BND", name: "Vanguard Total Bond Market", category: "Intermediate Core Bond", assetClass: "Bonds", assetClassColor: "#60a5fa", assetClassBg: "rgba(59,130,246,0.1)", assetClassBorder: "rgba(59,130,246,0.2)", expRatio: "0.03%", expRatioColor: undefined as string | undefined, fiveYReturn: "+1.8%", returnPos: true, riskLabel: "Low", riskColor: "#34d399" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", category: "Large Growth", assetClass: "Stocks", assetClassColor: "#c084fc", assetClassBg: "rgba(168,85,247,0.1)", assetClassBorder: "rgba(168,85,247,0.2)", expRatio: "0.20%", expRatioColor: undefined as string | undefined, fiveYReturn: "+145.2%", returnPos: true, riskLabel: "High", riskColor: "#a855f7" },
];

// ── ETF Table ────────────────────────────────────────────────────────
function ETFTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        <h2
          className="font-display"
          style={{ fontSize: "1.875rem", color: "#ffffff" }}
        >
          Compare ETFs
        </h2>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#968a84",
            cursor: "help",
          }}
          title="Exchange Traded Funds available in WealthMotley models"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <div
          className="table-container"
          style={{
            width: "100%",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          <table
            style={{
              width: "100%",
              textAlign: "left",
              minWidth: "800px",
              whiteSpace: "nowrap",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {[
                  "ETF Name",
                  "Asset Class",
                  "Exp. Ratio",
                  "5Y Return",
                  "Risk Level",
                  "Action",
                ].map((header, i) => (
                  <th
                    key={header}
                    className="font-mono"
                    style={{
                      padding: "16px 24px",
                      fontSize: "0.75rem",
                      color: "#968a84",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      cursor: i < 5 ? "pointer" : "default",
                      textAlign: i === 5 ? "right" : "left",
                      transition: "color 0.2s",
                      fontWeight: "normal",
                    }}
                    onMouseEnter={(e) => {
                      if (i < 5) e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      if (i < 5) e.currentTarget.style.color = "#968a84";
                    }}
                  >
                    {header}
                    {i === 0 && (
                      <svg
                        width="12"
                        height="12"
                        style={{ display: "inline", marginLeft: "4px" }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="7 14 12 19 17 14" />
                        <polyline points="7 10 12 5 17 10" />
                      </svg>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {etfs.map((etf, idx) => (
                <tr
                  key={etf.ticker}
                  style={{
                    borderBottom:
                      idx < etfs.length - 1
                        ? "1px solid rgba(255,255,255,0.03)"
                        : "none",
                    background:
                      hoveredRow === idx
                        ? "rgba(255,255,255,0.02)"
                        : "transparent",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: "16px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        className="font-mono"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize:
                            etf.ticker.length > 4 ? "10px" : "0.75rem",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        {etf.ticker}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            color: "#ffffff",
                            fontSize: "0.875rem",
                          }}
                        >
                          {etf.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#968a84",
                          }}
                        >
                          {etf.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span
                      className="font-mono"
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: etf.assetClassBg,
                        color: etf.assetClassColor,
                        fontSize: "0.75rem",
                        border: `1px solid ${etf.assetClassBorder}`,
                      }}
                    >
                      {etf.assetClass}
                    </span>
                  </td>
                  <td
                    className="font-mono"
                    style={{
                      padding: "16px 24px",
                      fontSize: "0.875rem",
                      color: etf.expRatioColor || "#ffffff",
                    }}
                  >
                    {etf.expRatio}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <div
                      className="font-mono"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: etf.returnPos ? "#34d399" : "#ff0000",
                        fontSize: "0.875rem",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        {etf.returnPos ? (
                          <polyline points="18 15 12 9 6 15" />
                        ) : (
                          <polyline points="6 9 12 15 18 9" />
                        )}
                      </svg>
                      {etf.fiveYReturn}
                    </div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span
                      className="font-mono"
                      style={{
                        color: etf.riskColor,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {etf.riskLabel}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button
                      className="font-mono"
                      style={{
                        padding: "6px 16px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        background: "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        opacity: hoveredRow === idx ? 1 : 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#ffb347";
                        e.currentTarget.style.color = "#ffb347";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Disclaimer Section ───────────────────────────────────────────────
function DisclaimerSection() {
  return (
    <section style={{ marginTop: "32px", marginBottom: "48px" }}>
      <div
        className="glass-card"
        style={{
          background: "#1a1205",
          border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: "24px",
          padding: "32px",
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fbbf24",
            flexShrink: 0,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h4
            style={{
              color: "#fbbf24",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.875rem",
            }}
          >
            Important Information
          </h4>
          <ul
            style={{
              fontSize: "0.875rem",
              color: "#968a84",
              listStyleType: "disc",
              listStylePosition: "inside",
              margin: 0,
              padding: 0,
              lineHeight: "2",
            }}
          >
            <li>WealthMotley does not provide financial advice.</li>
            <li>
              All projections are hypothetical and for educational purposes only.
            </li>
            <li>
              ETF performance data is historical and not indicative of future
              results.
            </li>
            <li>
              Consult a licensed financial advisor before making investment
              decisions.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Mock Holdings Data ──────────────────────────────────────────────
const MOCK_HOLDINGS = [
  { name: "Vanguard S&P 500 ETF", ticker: "VOO", quantity: 12, baseValue: 5280000 },
  { name: "Apple Inc.", ticker: "AAPL", quantity: 25, baseValue: 1875000 },
  { name: "Microsoft Corp.", ticker: "MSFT", quantity: 18, baseValue: 1620000 },
  { name: "Vanguard Total Bond Market", ticker: "BND", quantity: 40, baseValue: 960000 },
  { name: "Invesco QQQ Trust", ticker: "QQQ", quantity: 8, baseValue: 720000 },
  { name: "Tesla Inc.", ticker: "TSLA", quantity: 10, baseValue: 450000 },
  { name: "Bitcoin (BTC)", ticker: "BTC", quantity: 0.15, baseValue: 375000 },
  { name: "Ethereum (ETH)", ticker: "ETH", quantity: 2.5, baseValue: 225000 },
];

function generateDailyChanges() {
  return MOCK_HOLDINGS.map((h) => {
    const changePercent = -3 + Math.random() * 8; // -3% to +5%
    const changeAmount = Math.round(h.baseValue * (changePercent / 100));
    return {
      ...h,
      currentValue: h.baseValue + changeAmount,
      changeAmount,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  });
}

function generateGrowthData(currentTotal: number) {
  const days = 30;
  const startValue = currentTotal * 0.8;
  const points: number[] = [];
  for (let i = 0; i < days; i++) {
    const progress = i / (days - 1);
    const target = startValue + (currentTotal - startValue) * progress;
    const noise = (Math.random() - 0.45) * currentTotal * 0.015;
    points.push(Math.round(target + noise));
  }
  points[days - 1] = currentTotal;
  return points;
}

// ── Portfolio Value Header ──────────────────────────────────────────
function PortfolioValueHeader({
  totalValue,
  dailyChangeAmount,
  dailyChangePercent,
  lastUpdated,
  onRefresh,
  formatAmount,
}: {
  totalValue: number;
  dailyChangeAmount: number;
  dailyChangePercent: number;
  lastUpdated: string;
  onRefresh: () => void;
  formatAmount: (n: number) => string;
}) {
  const isPositive = dailyChangeAmount >= 0;
  const [refreshHovered, setRefreshHovered] = useState(false);

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "32px",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: "absolute",
          right: "-120px",
          top: "-120px",
          width: "320px",
          height: "320px",
          background: isPositive
            ? "rgba(52, 211, 153, 0.08)"
            : "rgba(239, 68, 68, 0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <span
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Total Portfolio Value
          </span>
          <button
            onClick={onRefresh}
            onMouseEnter={() => setRefreshHovered(true)}
            onMouseLeave={() => setRefreshHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: refreshHovered ? "rgba(255, 179, 71, 0.12)" : "rgba(255, 255, 255, 0.06)",
              border: `1px solid ${refreshHovered ? "rgba(255, 179, 71, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
              borderRadius: "12px",
              color: refreshHovered ? "#ffb347" : "#968a84",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>

        <h1
          className="font-mono"
          style={{
            fontSize: "3.5rem",
            color: "#ffffff",
            lineHeight: 1,
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          {formatAmount(totalValue)}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: isPositive ? "rgba(52, 211, 153, 0.1)" : "rgba(239, 68, 68, 0.1)",
              color: isPositive ? "#34d399" : "#ef4444",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isPositive ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
            {isPositive ? "+" : ""}{formatAmount(dailyChangeAmount)}
          </div>
          <span
            className="font-mono"
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: isPositive ? "#34d399" : "#ef4444",
            }}
          >
            ({isPositive ? "+" : ""}{dailyChangePercent.toFixed(2)}%) today
          </span>
        </div>

        <span style={{ fontSize: "0.75rem", color: "#968a84" }}>
          Last updated: {lastUpdated}
        </span>
      </div>
    </div>
  );
}

// ── Holdings Table ──────────────────────────────────────────────────
function HoldingsTable({
  holdings,
  formatAmount,
}: {
  holdings: ReturnType<typeof generateDailyChanges>;
  formatAmount: (n: number) => string;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "24px 24px 16px" }}>
        <h3 className="font-display" style={{ fontSize: "1.25rem", color: "#ffffff", marginBottom: "4px" }}>
          Holdings
        </h3>
        <p style={{ fontSize: "0.75rem", color: "#968a84" }}>
          Values are based on your last screenshot import. For real-time prices, re-upload a current screenshot.
        </p>
      </div>
      <div style={{ width: "100%", overflowX: "auto", paddingBottom: "8px" }} className="table-container">
        <table style={{ width: "100%", textAlign: "left", minWidth: "720px", whiteSpace: "nowrap", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              {["Name", "Qty", "Current Value", "Daily Change", "Trend"].map((header, i) => (
                <th
                  key={header}
                  className="font-mono"
                  style={{
                    padding: "12px 24px",
                    fontSize: "0.7rem",
                    color: "#968a84",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: "normal",
                    textAlign: i >= 2 ? "right" : "left",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, idx) => {
              const isPos = h.changePercent >= 0;
              return (
                <tr
                  key={h.ticker}
                  style={{
                    borderBottom: idx < holdings.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    background: hoveredRow === idx ? "rgba(255,255,255,0.02)" : "transparent",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        className="font-mono"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: "rgba(255,179,71,0.08)",
                          border: "1px solid rgba(255,179,71,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: h.ticker.length > 4 ? "9px" : "0.65rem",
                          fontWeight: 700,
                          color: "#ffb347",
                        }}
                      >
                        {h.ticker}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: "#ffffff", fontSize: "0.875rem" }}>{h.name}</p>
                        <p className="font-mono" style={{ fontSize: "0.7rem", color: "#968a84" }}>{h.ticker}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono" style={{ padding: "14px 24px", fontSize: "0.875rem", color: "#ffffff" }}>
                    {h.quantity % 1 === 0 ? h.quantity : h.quantity.toFixed(4)}
                  </td>
                  <td className="font-mono" style={{ padding: "14px 24px", fontSize: "0.875rem", color: "#ffb347", fontWeight: 600, textAlign: "right" }}>
                    {formatAmount(h.currentValue)}
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: isPos ? "#34d399" : "#ef4444",
                        }}
                      >
                        {isPos ? "+" : ""}{formatAmount(h.changeAmount)}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "0.7rem",
                          color: isPos ? "rgba(52,211,153,0.7)" : "rgba(239,68,68,0.7)",
                        }}
                      >
                        {isPos ? "+" : ""}{h.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: isPos ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPos ? "#34d399" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {isPos ? (
                          <polyline points="18 15 12 9 6 15" />
                        ) : (
                          <polyline points="6 9 12 15 18 9" />
                        )}
                      </svg>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Growth Chart (SVG, 30-day) ──────────────────────────────────────
function GrowthChart({
  data,
  formatAmount,
}: {
  data: number[];
  formatAmount: (n: number) => string;
}) {
  if (data.length < 2) return null;

  const minVal = Math.min(...data) * 0.98;
  const maxVal = Math.max(...data) * 1.02;
  const range = maxVal - minVal || 1;
  const chartW = 600;
  const chartH = 180;
  const padT = 10;
  const padB = 10;
  const drawH = chartH - padT - padB;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * chartW;
    const y = padT + drawH - ((v - minVal) / range) * drawH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`;

  const overallChange = data[data.length - 1]! - data[0]!;
  const isPositive = overallChange >= 0;

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "24px",
        padding: "24px 24px 20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 className="font-display" style={{ fontSize: "1.25rem", color: "#ffffff" }}>
          30-Day Growth
        </h3>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "8px",
            background: isPositive ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: isPositive ? "#34d399" : "#ef4444",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isPositive ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="6 9 12 15 18 9" />
            )}
          </svg>
          {isPositive ? "+" : ""}{formatAmount(overallChange)}
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "180px" }}>
        {/* Y-axis labels */}
        <div
          className="font-mono"
          style={{
            position: "absolute",
            left: "-4px",
            top: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontSize: "9px",
            color: "rgba(150,138,132,0.5)",
            paddingBottom: "4px",
            paddingTop: "4px",
            textAlign: "right",
            width: "0",
          }}
        >
          <span style={{ transform: "translateX(-100%)", paddingRight: "8px", whiteSpace: "nowrap" }}>{formatAmount(Math.round(maxVal))}</span>
          <span style={{ transform: "translateX(-100%)", paddingRight: "8px", whiteSpace: "nowrap" }}>{formatAmount(Math.round((maxVal + minVal) / 2))}</span>
          <span style={{ transform: "translateX(-100%)", paddingRight: "8px", whiteSpace: "nowrap" }}>{formatAmount(Math.round(minVal))}</span>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#34d399" : "#ef4444"} stopOpacity={0.2} />
              <stop offset="100%" stopColor={isPositive ? "#34d399" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1="0"
              y1={padT + drawH * (1 - frac)}
              x2={chartW}
              y2={padT + drawH * (1 - frac)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          <path d={areaPath} fill="url(#growthGrad)" />
          <path d={linePath} fill="none" stroke={isPositive ? "#34d399" : "#ef4444"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* End dot */}
          <circle
            cx={points[points.length - 1]!.x}
            cy={points[points.length - 1]!.y}
            r="4"
            fill="#0d0b0a"
            stroke={isPositive ? "#34d399" : "#ef4444"}
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* X-axis labels */}
      <div
        className="font-mono"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: "rgba(150,138,132,0.5)",
          marginTop: "8px",
        }}
      >
        <span>30d ago</span>
        <span>20d ago</span>
        <span>10d ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

// ── Crypto Prices Section ───────────────────────────────────────────
// Displays live crypto prices from CoinGecko via priceCache.
const CRYPTO_TICKERS = [
  { ticker: "BTC", name: "Bitcoin", icon: "B" },
  { ticker: "ETH", name: "Ethereum", icon: "E" },
  { ticker: "SOL", name: "Solana", icon: "S" },
  { ticker: "ADA", name: "Cardano", icon: "A" },
  { ticker: "XRP", name: "Ripple", icon: "X" },
  { ticker: "DOGE", name: "Dogecoin", icon: "D" },
  { ticker: "BNB", name: "BNB", icon: "B" },
  { ticker: "DOT", name: "Polkadot", icon: "P" },
];

// Mock crypto prices for initial display (replaced by live data when available)
const MOCK_CRYPTO_PRICES: Record<
  string,
  { price: number; changePercent: number }
> = {
  BTC: { price: 87250.42, changePercent: 2.14 },
  ETH: { price: 2035.18, changePercent: -1.35 },
  SOL: { price: 142.67, changePercent: 4.82 },
  ADA: { price: 0.72, changePercent: -0.45 },
  XRP: { price: 2.34, changePercent: 1.28 },
  DOGE: { price: 0.178, changePercent: 5.67 },
  BNB: { price: 612.35, changePercent: 0.93 },
  DOT: { price: 7.45, changePercent: -2.11 },
};

function CryptoPricesSection({
  formatAmount,
}: {
  formatAmount: (n: number) => string;
}) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Use mock prices (in production, these would come from Convex priceCache query)
  const cryptoData = CRYPTO_TICKERS.map((c) => {
    const mock = MOCK_CRYPTO_PRICES[c.ticker];
    return {
      ...c,
      price: mock?.price ?? 0,
      changePercent: mock?.changePercent ?? 0,
    };
  });

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "24px",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h3
            className="font-display"
            style={{ fontSize: "1.25rem", color: "#ffffff" }}
          >
            Crypto Prices
          </h3>
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#a855f7",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: "rgba(168,85,247,0.1)",
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            Live
          </span>
        </div>
        <span
          className="font-mono"
          style={{ fontSize: "0.65rem", color: "#968a84" }}
        >
          USD prices
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {cryptoData.map((crypto) => {
          const isPos = crypto.changePercent >= 0;
          const isHovered = hoveredCard === crypto.ticker;

          return (
            <div
              key={crypto.ticker}
              onMouseEnter={() => setHoveredCard(crypto.ticker)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: isHovered
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)"}`,
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "default",
              }}
            >
              {/* Coin icon */}
              <div
                className="font-mono"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#a855f7",
                  flexShrink: 0,
                }}
              >
                {crypto.ticker}
              </div>

              {/* Name + ticker */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {crypto.name}
                </p>
                <p
                  className="font-mono"
                  style={{ fontSize: "0.65rem", color: "#968a84" }}
                >
                  {crypto.ticker}
                </p>
              </div>

              {/* Price + change */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "2px",
                  flexShrink: 0,
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  $
                  {crypto.price >= 1
                    ? crypto.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : crypto.price.toFixed(4)}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isPos ? "#34d399" : "#ef4444"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isPos ? (
                      <polyline points="18 15 12 9 6 15" />
                    ) : (
                      <polyline points="6 9 12 15 18 9" />
                    )}
                  </svg>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: isPos ? "#34d399" : "#ef4444",
                    }}
                  >
                    {isPos ? "+" : ""}
                    {crypto.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attribution */}
      <p
        className="font-mono"
        style={{
          fontSize: "0.6rem",
          color: "rgba(150, 138, 132, 0.5)",
          marginTop: "16px",
          textAlign: "center",
        }}
      >
        Prices from CoinGecko, updated every 30 minutes
      </p>
    </div>
  );
}

// ── Update Prompt Card ──────────────────────────────────────────────
function UpdatePromptCard({ daysSinceUpdate }: { daysSinceUpdate: number }) {
  const [hovered, setHovered] = useState(false);

  if (daysSinceUpdate < 7) return null;

  return (
    <div
      className="glass-card"
      style={{
        background: "linear-gradient(135deg, rgba(255, 179, 71, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)",
        border: "1px solid rgba(255, 179, 71, 0.2)",
        borderRadius: "24px",
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {/* Mascot icon */}
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(255, 179, 71, 0.12)",
          border: "1px solid rgba(255, 179, 71, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "1.5rem",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.95rem", color: "#ffffff", fontWeight: 600, marginBottom: "4px" }}>
          Your portfolio was last updated {daysSinceUpdate} days ago
        </p>
        <p style={{ fontSize: "0.8rem", color: "#968a84" }}>
          Upload a fresh screenshot to see your latest values and daily changes.
        </p>
      </div>

      <Link
        href="/portfolio/import"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 24px",
          background: hovered ? "#ffb347" : "rgba(255, 179, 71, 0.15)",
          border: `1px solid ${hovered ? "#ffb347" : "rgba(255, 179, 71, 0.3)"}`,
          borderRadius: "14px",
          color: hovered ? "#0d0b0a" : "#ffb347",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.8rem",
          fontWeight: 700,
          textDecoration: "none",
          cursor: "pointer",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Update Now
      </Link>
    </div>
  );
}

// ── Portfolio Value Section (wraps header, table, chart, prompt) ─────
function PortfolioValueSection() {
  const { format: fmtCurr } = useCurrency();
  const [holdings, setHoldings] = useState(() => generateDailyChanges());
  const [refreshKey, setRefreshKey] = useState(0);

  const totalValue = useMemo(() => holdings.reduce((sum, h) => sum + h.currentValue, 0), [holdings]);
  const totalBaseValue = useMemo(() => holdings.reduce((sum, h) => sum + h.baseValue, 0), [holdings]);
  const dailyChangeAmount = totalValue - totalBaseValue;
  const dailyChangePercent = totalBaseValue > 0 ? (dailyChangeAmount / totalBaseValue) * 100 : 0;

  const growthData = useMemo(() => generateGrowthData(totalValue), [totalValue, refreshKey]);

  const handleRefresh = useCallback(() => {
    setHoldings(generateDailyChanges());
    setRefreshKey((k) => k + 1);
  }, []);

  const now = new Date();
  const lastUpdated = now.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Mock: last import was 14 days ago
  const daysSinceUpdate = 14;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h2
        className="font-display"
        style={{
          fontSize: "1.875rem",
          color: "#ffffff",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        My Portfolio
      </h2>

      <PortfolioValueHeader
        totalValue={totalValue}
        dailyChangeAmount={dailyChangeAmount}
        dailyChangePercent={dailyChangePercent}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        formatAmount={fmtCurr}
      />

      <UpdatePromptCard daysSinceUpdate={daysSinceUpdate} />

      <HoldingsTable holdings={holdings} formatAmount={fmtCurr} />

      <GrowthChart data={growthData} formatAmount={fmtCurr} />

      <CryptoPricesSection formatAmount={fmtCurr} />
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function PortfolioPage() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        margin: "0 auto",
      }}
    >
      {/* Top disclaimer + header */}
      <section
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Risk banner */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,179,71,0.1)",
            border: "1px solid rgba(255,179,71,0.2)",
            borderRadius: "12px",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffb347"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#ffb347",
            }}
          >
            Investing involves risk. Past performance does not guarantee future
            results.
          </p>
        </div>

        {/* Page title */}
        <div>
          <h1
            className="font-display"
            style={{
              fontSize: "3rem",
              lineHeight: 1.2,
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Portfolio
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#968a84",
              fontWeight: 500,
            }}
          >
            Smart Investing, Simple
          </p>
        </div>
      </section>

      <PortfolioValueSection />
      <SimulatorSection />
      <StrategySection />
      <ETFTable />
      <DisclaimerSection />

      <style jsx global>{`
        .glass-card {
          transition: border-color 0.3s ease,
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        .glass-card:hover:not(.active-card) {
          border-color: rgba(255, 255, 255, 0.15);
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffb347;
          cursor: pointer;
          margin-top: -8px;
          box-shadow: 0 0 10px rgba(255, 179, 71, 0.5);
          border: 2px solid #0d0b0a;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.15);
        }

        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }
        .chart-area {
          opacity: 0;
          animation: fadeIn 1s ease-out 1s forwards;
        }
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .table-container::-webkit-scrollbar {
          height: 6px;
        }
        .table-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .font-display {
          font-family: "DynaPuff", cursive;
        }
        .font-mono {
          font-family: "JetBrains Mono", monospace;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Font imports */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
