"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// ── Stat Card ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  growth,
  color,
  glowColor,
}: {
  label: string;
  value: string;
  growth?: string;
  color?: string;
  glowColor: string;
}) {
  return (
    <div className="wm-glass rounded-[24px] p-6 relative overflow-hidden group">
      <div
        className="absolute -right-6 -top-6 w-24 h-24 blur-2xl rounded-full transition-all"
        style={{ background: glowColor }}
      />
      <p className="wm-mono text-[11px] text-[#968a84] uppercase tracking-widest mb-3">
        {label}
      </p>
      <p
        className="wm-mono text-3xl font-bold tracking-tight"
        style={{ color: color || "#ffffff" }}
      >
        {value}
      </p>
      {growth && (
        <div className="mt-4 flex items-center gap-2 text-xs wm-mono">
          <span className="text-[#34d399] flex items-center bg-[#34d399]/10 px-1.5 py-0.5 rounded">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            {growth}
          </span>
          <span className="text-[#968a84]">vs last month</span>
        </div>
      )}
    </div>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-[24px] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-[300px] bg-white/5 rounded-[24px] animate-pulse lg:col-span-2" />
        <div className="h-[300px] bg-white/5 rounded-[24px] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white/5 rounded-[24px] animate-pulse" />
        <div className="h-64 bg-white/5 rounded-[24px] animate-pulse" />
      </div>
    </div>
  );
}

// ── Helper: format large numbers ────────────────────────────────────────

function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

// ── Country code to full name map ───────────────────────────────────────

const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GB: "United Kingdom",
  US: "United States",
  CA: "Canada",
  GH: "Ghana",
  KE: "Kenya",
  ZA: "South Africa",
  DE: "Germany",
  AE: "UAE",
};

const COUNTRY_COLORS: Record<string, string> = {
  NG: "#34d399",
  GB: "#00247d",
  US: "#3c3b6e",
  CA: "#ef4444",
  GH: "#ffb347",
  KE: "#a855f7",
  ZA: "#3b82f6",
};

// ── Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const stats = useQuery(api.admin.getDashboardStats);
  const recentActivity = useQuery(api.admin.getRecentActivity);

  if (stats === undefined) {
    return <DashboardSkeleton />;
  }

  // Derive premium user count from tier breakdown
  const premiumCount = (stats.usersByTier["pro"] ?? 0) + (stats.usersByTier["premium"] ?? 0);

  // Build sorted country list for the geography donut
  const countryEntries = Object.entries(stats.usersByCountry)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const topCountry = countryEntries[0]?.[0] ?? "NG";

  // Calculate percentages for country donut
  const countryPercentages = countryEntries.map(([code, count]) => ({
    code,
    name: COUNTRY_NAMES[code] ?? code,
    pct: stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0,
    color: COUNTRY_COLORS[code] ?? "#968a84",
  }));

  // Build donut SVG arcs from country percentages
  const donutSegments = (() => {
    const total = countryPercentages.reduce((sum, c) => sum + c.pct, 0);
    const circumference = 2 * Math.PI * 40; // r=40
    let offset = 0;
    return countryPercentages.map((c) => {
      const fraction = total > 0 ? c.pct / total : 0;
      const dash = fraction * circumference;
      const gap = circumference - dash;
      const segment = { ...c, dasharray: `${dash} ${gap}`, offset: -offset };
      offset += dash;
      return segment;
    });
  })();

  // Build activity feed items from real notifications
  const activityItems = (recentActivity?.notifications ?? []).slice(0, 4).map((n: any) => {
    const ageMs = Date.now() - (n.createdAt ?? 0);
    const ageMins = Math.floor(ageMs / 60000);
    let timeLabel = "Just now";
    if (ageMins > 60 * 24) timeLabel = `${Math.floor(ageMins / (60 * 24))}d ago`;
    else if (ageMins > 60) timeLabel = `${Math.floor(ageMins / 60)}h ago`;
    else if (ageMins > 0) timeLabel = `${ageMins} mins ago`;

    // Map notification type to icon + color
    const typeMap: Record<string, { icon: string; color: string }> = {
      system: { icon: "check", color: "#34d399" },
      tip: { icon: "star", color: "#a855f7" },
      spending_alert: { icon: "alert", color: "#ef4444" },
      budget_warning: { icon: "alert", color: "#ffb347" },
      savings_milestone: { icon: "dollar", color: "#34d399" },
      japa_update: { icon: "star", color: "#3b82f6" },
    };
    const { icon, color } = typeMap[n.type] ?? { icon: "check", color: "#968a84" };

    return { icon, color, text: n.title, time: timeLabel };
  });

  return (
    <div className="flex flex-col gap-6" style={{ animation: "wm-fade-in 0.3s ease-out" }}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="wm-heading text-3xl text-white">Dashboard Overview</h1>
          <p className="wm-mono text-sm text-[#968a84] mt-1 tracking-wide">
            Welcome back. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <button className="px-4 py-2 wm-mono text-xs uppercase tracking-widest bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={fmtNumber(stats.totalUsers)}
          glowColor="rgba(59,130,246,0.1)"
        />
        <StatCard
          label="Active (30d)"
          value={fmtNumber(stats.activeUsers)}
          glowColor="rgba(255,179,71,0.1)"
        />
        <StatCard
          label="Premium Subs"
          value={fmtNumber(premiumCount)}
          glowColor="rgba(168,85,247,0.1)"
        />
        <StatCard
          label="AI Conversations"
          value={fmtNumber(stats.totalConversations)}
          color="#34d399"
          glowColor="rgba(52,211,153,0.1)"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signup Growth — keeping mock SVG chart (no time-series data yet) */}
        <div className="wm-glass rounded-[24px] p-6 lg:col-span-2 flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="wm-heading text-lg text-white">Signup Growth (30 Days)</h2>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-[10px] wm-mono text-[#ffb347] bg-[#ffb347]/10 rounded uppercase">30D</button>
              <button className="px-2 py-1 text-[10px] wm-mono text-[#968a84] hover:text-white rounded uppercase transition-colors">90D</button>
              <button className="px-2 py-1 text-[10px] wm-mono text-[#968a84] hover:text-white rounded uppercase transition-colors">1Y</button>
            </div>
          </div>
          <div className="flex-1 w-full relative pt-4">
            <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb347" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <path d="M0 180 Q 100 150 200 160 T 400 120 T 600 80 T 800 40 L 800 200 L 0 200 Z" fill="url(#chartGrad)" />
              <path d="M0 180 Q 100 150 200 160 T 400 120 T 600 80 T 800 40" fill="none" stroke="#ffb347" strokeWidth="3" />
              <circle cx="400" cy="120" r="4" fill="#0d0b0a" stroke="#ffb347" strokeWidth="2" />
              <circle cx="600" cy="80" r="4" fill="#0d0b0a" stroke="#ffb347" strokeWidth="2" />
              <circle cx="800" cy="40" r="6" fill="#ffb347" stroke="#0d0b0a" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* User Geography — real data */}
        <div className="wm-glass rounded-[24px] p-6 flex flex-col">
          <h2 className="wm-heading text-lg text-white mb-6">User Geography</h2>
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
              {donutSegments.reverse().map((seg, i) => (
                <circle
                  key={seg.code}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="wm-mono text-xs text-[#968a84] uppercase tracking-widest">Top</span>
              <span className="wm-mono text-2xl font-bold text-white">{topCountry}</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 wm-mono text-xs">
            {countryPercentages.map((c) => (
              <div key={c.code} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-white">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel — keeping mock data (no funnel events tracked yet) */}
        <div className="wm-glass rounded-[24px] p-6">
          <h2 className="wm-heading text-lg text-white mb-6">Engagement Funnel</h2>
          <div className="space-y-4">
            {[
              { label: "Registered", pct: "100%", val: fmtNumber(stats.totalUsers), width: "100%", bg: "bg-[#ffb347]/40" },
              { label: "Onboarding Complete", pct: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) + "%" : "0%", val: fmtNumber(stats.activeUsers), width: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) + "%" : "0%", bg: "bg-[#ffb347]/60" },
              { label: "Created Budget", pct: stats.totalUsers > 0 ? Math.round((stats.totalBudgets / stats.totalUsers) * 100) + "%" : "0%", val: fmtNumber(stats.totalBudgets), width: stats.totalUsers > 0 ? Math.round((stats.totalBudgets / stats.totalUsers) * 100) + "%" : "0%", bg: "bg-[#ffb347]/80" },
              { label: "Used AI Sholz", pct: stats.totalUsers > 0 ? Math.round((stats.totalConversations / stats.totalUsers) * 100) + "%" : "0%", val: fmtNumber(stats.totalConversations), width: stats.totalUsers > 0 ? Math.round((stats.totalConversations / stats.totalUsers) * 100) + "%" : "0%", bg: "bg-[#ffb347]", glow: true },
            ].map((item) => (
              <div key={item.label} className="relative">
                <div className="flex justify-between wm-mono text-xs mb-1 px-2">
                  <span className="text-white/80">{item.label}</span>
                  <span className={cn("font-bold", item.glow ? "text-[#ffb347]" : "text-white")}>{item.pct} ({item.val})</span>
                </div>
                <div className="w-full bg-white/5 h-8 rounded-lg overflow-hidden border border-white/5">
                  <div className={cn("h-full rounded-r-lg", item.bg, item.glow && "shadow-[0_0_10px_#ffb347]")} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed — real notification data */}
        <div className="wm-glass rounded-[24px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="wm-heading text-lg text-white">Live Activity Feed</h2>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34d399]" />
            </span>
          </div>
          <div className="space-y-4 text-sm">
            {activityItems.length === 0 && (
              <p className="text-[#968a84] wm-mono text-xs">No recent activity yet.</p>
            )}
            {activityItems.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                    borderColor: `${item.color}30`,
                  }}
                >
                  {item.icon === "check" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
                  {item.icon === "dollar" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                  {item.icon === "star" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                  {item.icon === "alert" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
                </div>
                <div>
                  <p className="text-white">{item.text}</p>
                  <p className="text-[11px] wm-mono text-[#968a84] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
