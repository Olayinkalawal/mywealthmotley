"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  growth: string;
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
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-[24px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

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
        <StatCard label="Total Users" value="142,854" growth="+12.5%" glowColor="rgba(59,130,246,0.1)" />
        <StatCard label="Active MAU" value="89,211" growth="+8.2%" glowColor="rgba(255,179,71,0.1)" />
        <StatCard label="Premium Subs" value="12,450" growth="+4.1%" glowColor="rgba(168,85,247,0.1)" />
        <StatCard label="Monthly Rec. Revenue" value="N48.5M" growth="+18.4%" color="#34d399" glowColor="rgba(52,211,153,0.1)" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signup Growth */}
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

        {/* User Geography */}
        <div className="wm-glass rounded-[24px] p-6 flex flex-col">
          <h2 className="wm-heading text-lg text-white mb-6">User Geography</h2>
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3c3b6e" strokeWidth="12" strokeDasharray="94.2 251.2" strokeDashoffset="-213.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#00247d" strokeWidth="12" strokeDasharray="157 251.2" strokeDashoffset="-56.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" strokeWidth="12" strokeDasharray="376.8 251.2" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="wm-mono text-xs text-[#968a84] uppercase tracking-widest">Top</span>
              <span className="wm-mono text-2xl font-bold text-white">NG</span>
            </div>
          </div>
          <div className="mt-6 space-y-3 wm-mono text-xs">
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#34d399]" />Nigeria</span><span className="text-white">60%</span></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#00247d]" />United Kingdom</span><span className="text-white">25%</span></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#3c3b6e]" />United States</span><span className="text-white">15%</span></div>
          </div>
        </div>
      </div>

      {/* Funnel + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="wm-glass rounded-[24px] p-6">
          <h2 className="wm-heading text-lg text-white mb-6">Conversion Funnel</h2>
          <div className="space-y-4">
            {[
              { label: "App Install", pct: "100%", val: "24,050", width: "100%", bg: "bg-[#ffb347]/40" },
              { label: "Signup Completed", pct: "68%", val: "16,354", width: "68%", bg: "bg-[#ffb347]/60" },
              { label: "KYC Verified", pct: "45%", val: "10,822", width: "45%", bg: "bg-[#ffb347]/80" },
              { label: "First Deposit", pct: "32%", val: "7,696", width: "32%", bg: "bg-[#ffb347]", glow: true },
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

        {/* Live Activity Feed */}
        <div className="wm-glass rounded-[24px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="wm-heading text-lg text-white">Live Activity Feed</h2>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34d399]" />
            </span>
          </div>
          <div className="space-y-4 text-sm">
            {[
              { icon: "check", color: "#34d399", text: <>KYC Approved for <span className="wm-mono text-[#ffb347]">U-9821</span></>, time: "Just now" },
              { icon: "dollar", color: "#ffb347", text: <>Large deposit detected: <span className="wm-mono text-[#34d399] font-bold">N2,500,000</span></>, time: "2 mins ago" },
              { icon: "star", color: "#a855f7", text: <>New Premium Subscription: <span className="wm-mono text-white/80">Sarah J.</span></>, time: "15 mins ago" },
              { icon: "alert", color: "#ef4444", text: "Failed withdrawal attempt (Insufficient Funds)", time: "42 mins ago" },
            ].map((item, i) => (
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
