"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrency } from "@/hooks/use-currency";

// ── Mock Data ────────────────────────────────────────────────────────

const PROJECTION_DATA = [
  { year: 0, current: 500000, wm: 500000, label: "Now" },
  { year: 1, current: 520000, wm: 980000, label: "1 yr" },
  { year: 2, current: 490000, wm: 1600000, label: "2 yr" },
  { year: 3, current: 510000, wm: 2400000, label: "3 yr" },
  { year: 4, current: 480000, wm: 3200000, label: "4 yr" },
  { year: 5, current: 500000, wm: 4200000, label: "5 yr" },
  { year: 6, current: 470000, wm: 5400000, label: "6 yr" },
  { year: 7, current: 520000, wm: 6800000, label: "7 yr" },
  { year: 8, current: 490000, wm: 8500000, label: "8 yr" },
  { year: 9, current: 510000, wm: 10500000, label: "9 yr" },
  { year: 10, current: 500000, wm: 13000000, label: "10 yr" },
];

function getComparisonStats(fmtCompact: (n: number) => string) {
  return [
    {
      label: "Net Worth in 5 Years",
      current: fmtCompact(500000),
      wm: fmtCompact(4200000),
      currentColor: "#ef4444",
      wmColor: "#34d399",
    },
    {
      label: "Monthly Passive Income",
      current: fmtCompact(0),
      wm: fmtCompact(35000),
      currentColor: "#ef4444",
      wmColor: "#34d399",
    },
    {
      label: "Emergency Fund",
      current: "0 months",
      wm: "6 months",
      currentColor: "#ef4444",
      wmColor: "#34d399",
    },
    {
      label: "Retirement Readiness",
      current: "2%",
      wm: "34%",
      currentColor: "#ef4444",
      wmColor: "#34d399",
    },
  ];
}

function getMilestones(fmtCompact: (n: number) => string) {
  return [
    { year: 1, current: "Still living paycheck to paycheck", wm: "Emergency fund complete, investing started" },
    { year: 5, current: "No investments, no growth", wm: `${fmtCompact(4200000)} net worth, passive income flowing` },
    { year: 10, current: "Same spot, inflation eating your savings", wm: `${fmtCompact(13000000)} net worth, financially free trajectory` },
  ];
}

// ── Animated Chart ───────────────────────────────────────────────────

function DivergingChart({ fmtCompact }: { fmtCompact: (n: number) => string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    const padding = { top: 30, right: 20, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = 13000000;
    const points = PROJECTION_DATA.length;

    function getX(i: number) {
      return padding.left + (i / (points - 1)) * chartW;
    }
    function getY(val: number) {
      return padding.top + chartH - (val / maxVal) * chartH;
    }

    let progress = 0;
    const duration = 1500;
    let startTime: number | null = null;

    function draw(timestamp: number) {
      if (!startTime) startTime = timestamp;
      progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      ctx!.clearRect(0, 0, w, h);

      // Grid lines
      ctx!.strokeStyle = "rgba(255,255,255,0.04)";
      ctx!.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (i / 5) * chartH;
        ctx!.beginPath();
        ctx!.moveTo(padding.left, y);
        ctx!.lineTo(w - padding.right, y);
        ctx!.stroke();

        // Y-axis labels
        const val = maxVal - (i / 5) * maxVal;
        ctx!.fillStyle = "#968a84";
        ctx!.font = "10px monospace";
        ctx!.textAlign = "right";
        ctx!.fillText(fmtCompact(val), padding.left - 8, y + 3);
      }

      // X-axis labels
      ctx!.fillStyle = "#968a84";
      ctx!.font = "10px monospace";
      ctx!.textAlign = "center";
      PROJECTION_DATA.forEach((d, i) => {
        if (i % 2 === 0 || i === points - 1) {
          ctx!.fillText(d.label, getX(i), h - padding.bottom + 20);
        }
      });

      const drawCount = Math.floor(eased * (points - 1)) + 1;

      // WM path (draw first so it's behind)
      // Area fill
      ctx!.beginPath();
      ctx!.moveTo(getX(0), getY(PROJECTION_DATA[0]!.wm));
      for (let i = 1; i < drawCount; i++) {
        const cp1x = getX(i - 1) + (getX(i) - getX(i - 1)) / 2;
        const cp2x = cp1x;
        ctx!.bezierCurveTo(cp1x, getY(PROJECTION_DATA[i - 1]!.wm), cp2x, getY(PROJECTION_DATA[i]!.wm), getX(i), getY(PROJECTION_DATA[i]!.wm));
      }
      ctx!.lineTo(getX(drawCount - 1), getY(0));
      ctx!.lineTo(getX(0), getY(0));
      ctx!.closePath();
      const wmGrad = ctx!.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      wmGrad.addColorStop(0, "rgba(52,211,153,0.15)");
      wmGrad.addColorStop(1, "rgba(52,211,153,0.01)");
      ctx!.fillStyle = wmGrad;
      ctx!.fill();

      // WM line
      ctx!.beginPath();
      ctx!.moveTo(getX(0), getY(PROJECTION_DATA[0]!.wm));
      for (let i = 1; i < drawCount; i++) {
        const cp1x = getX(i - 1) + (getX(i) - getX(i - 1)) / 2;
        const cp2x = cp1x;
        ctx!.bezierCurveTo(cp1x, getY(PROJECTION_DATA[i - 1]!.wm), cp2x, getY(PROJECTION_DATA[i]!.wm), getX(i), getY(PROJECTION_DATA[i]!.wm));
      }
      ctx!.strokeStyle = "#34d399";
      ctx!.lineWidth = 2.5;
      ctx!.shadowColor = "rgba(52,211,153,0.4)";
      ctx!.shadowBlur = 8;
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // Current path area
      ctx!.beginPath();
      ctx!.moveTo(getX(0), getY(PROJECTION_DATA[0]!.current));
      for (let i = 1; i < drawCount; i++) {
        const cp1x = getX(i - 1) + (getX(i) - getX(i - 1)) / 2;
        const cp2x = cp1x;
        ctx!.bezierCurveTo(cp1x, getY(PROJECTION_DATA[i - 1]!.current), cp2x, getY(PROJECTION_DATA[i]!.current), getX(i), getY(PROJECTION_DATA[i]!.current));
      }
      ctx!.lineTo(getX(drawCount - 1), getY(0));
      ctx!.lineTo(getX(0), getY(0));
      ctx!.closePath();
      const currentGrad = ctx!.createLinearGradient(0, padding.top, 0, h - padding.bottom);
      currentGrad.addColorStop(0, "rgba(239,68,68,0.1)");
      currentGrad.addColorStop(1, "rgba(239,68,68,0.01)");
      ctx!.fillStyle = currentGrad;
      ctx!.fill();

      // Current path line
      ctx!.beginPath();
      ctx!.moveTo(getX(0), getY(PROJECTION_DATA[0]!.current));
      for (let i = 1; i < drawCount; i++) {
        const cp1x = getX(i - 1) + (getX(i) - getX(i - 1)) / 2;
        const cp2x = cp1x;
        ctx!.bezierCurveTo(cp1x, getY(PROJECTION_DATA[i - 1]!.current), cp2x, getY(PROJECTION_DATA[i]!.current), getX(i), getY(PROJECTION_DATA[i]!.current));
      }
      ctx!.strokeStyle = "#ef4444";
      ctx!.lineWidth = 2;
      ctx!.setLineDash([6, 4]);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Endpoint dots
      if (drawCount > 1) {
        const lastIdx = drawCount - 1;
        // WM dot
        ctx!.beginPath();
        ctx!.arc(getX(lastIdx), getY(PROJECTION_DATA[lastIdx]!.wm), 5, 0, Math.PI * 2);
        ctx!.fillStyle = "#34d399";
        ctx!.shadowColor = "rgba(52,211,153,0.5)";
        ctx!.shadowBlur = 10;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        // Current dot
        ctx!.beginPath();
        ctx!.arc(getX(lastIdx), getY(PROJECTION_DATA[lastIdx]!.current), 4, 0, Math.PI * 2);
        ctx!.fillStyle = "#ef4444";
        ctx!.fill();
      }

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        setAnimated(true);
      }
    }

    // Intersection observer to trigger animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          requestAnimationFrame(draw);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full" style={{ height: "320px" }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
      {/* Legend */}
      <div className="absolute top-2 right-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#34d399] rounded" />
          <span className="wm-mono text-[10px] text-[#34d399] uppercase tracking-wider">myWealthMotley Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#ef4444] rounded" style={{ borderTop: "2px dashed #ef4444", height: 0 }} />
          <span className="wm-mono text-[10px] text-[#ef4444]/70 uppercase tracking-wider">Current Path</span>
        </div>
      </div>
    </div>
  );
}

// ── Letter to Future Self ────────────────────────────────────────────

function LetterToFutureSelf() {
  const [letter, setLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (letter.trim().length > 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="wm-heading text-xl text-white mb-2">Letter Saved</h3>
        <p className="text-sm text-[#968a84] max-w-sm mx-auto">
          Your letter to Future You has been sealed. We will deliver it back to you in 12 months.
          Keep building your wealth -- Future You is counting on it.
        </p>
        <button
          onClick={() => { setSubmitted(false); setLetter(""); }}
          className="mt-6 px-5 py-2 wm-mono text-xs uppercase tracking-wider text-[#968a84] border border-white/10 rounded-xl hover:text-white hover:border-white/20 transition-colors"
        >
          Write Another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#ffb347]/10 border border-[#ffb347]/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <h3 className="wm-heading text-lg text-white">Letter to Future You</h3>
          <p className="text-xs text-[#968a84]">Write your financial goals. We will deliver this back in 12 months.</p>
        </div>
      </div>
      <textarea
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        placeholder="Dear Future Me, by this time next year I want to have..."
        rows={5}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#ffb347]/50 focus:outline-none focus:bg-black/40 transition-all text-sm resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="wm-mono text-[10px] text-[#968a84]">
          {letter.length}/500
        </span>
        <button
          onClick={handleSubmit}
          disabled={letter.trim().length === 0}
          className="px-6 py-2.5 bg-[#ffb347] hover:bg-[#e67e22] disabled:opacity-40 disabled:cursor-not-allowed text-[#0d0b0a] wm-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,179,71,0.15)]"
        >
          Seal &amp; Send to Future Me
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function FutureYouPage() {
  const { formatCompact: fmtCompact } = useCurrency();
  const [activeTab, setActiveTab] = useState<"5" | "10">("5");
  const COMPARISON_STATS = getComparisonStats(fmtCompact);
  const MILESTONES = getMilestones(fmtCompact);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1
            className="wm-heading leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}
          >
            Future <span className="text-[#ffb347]">You</span>
          </h1>
          <div
            className="w-3 h-3 rounded-full bg-[#ffb347] mt-2"
            style={{ boxShadow: "0 0 20px rgba(255,179,71,0.3)" }}
          />
        </div>
        <p className="wm-mono text-sm uppercase tracking-widest text-[#968a84]">
          See where your money takes you
        </p>
      </header>

      {/* Mo Commentary */}
      <div
        className="rounded-[24px] p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,179,71,0.08), rgba(13,11,10,0.6))",
          border: "1px solid rgba(255,179,71,0.2)",
          boxShadow: "0 4px 30px rgba(255,179,71,0.05)",
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#ffb347]/10 blur-[40px] pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border overflow-hidden"
            style={{ backgroundColor: "#ffb347", borderColor: "#0d0b0a" }}
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-6 h-6">
              <rect x="20" y="20" width="60" height="60" rx="16" fill="#0d0b0a" />
              <circle cx="35" cy="45" r="5" fill="#ffb347" />
              <circle cx="65" cy="45" r="5" fill="#ffb347" />
              <path d="M 35 65 Q 50 75 65 65" stroke="#ffb347" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="wm-mono text-[10px] text-[#ffb347] uppercase tracking-widest font-bold">Mo says</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            </div>
            <p className="text-white/90 text-[15px] leading-relaxed">
              &ldquo;This tool shows hypothetical scenarios to help you think about your financial future.
              The numbers below are <span className="text-[#ffb347] font-semibold">illustrations, not predictions</span> &mdash;
              your actual results will depend on many factors. Let&apos;s explore what&apos;s possible.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Diverging Path Visualization */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="wm-heading text-2xl text-white">Two Paths, One Choice</h2>
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-full">
            <button
              onClick={() => setActiveTab("5")}
              className={`px-4 py-1.5 rounded-full wm-mono text-xs uppercase tracking-wide transition-all ${
                activeTab === "5"
                  ? "bg-[#ffb347] text-[#0d0b0a] font-bold shadow-[0_0_10px_rgba(255,179,71,0.3)]"
                  : "text-[#968a84]"
              }`}
            >
              5 Years
            </button>
            <button
              onClick={() => setActiveTab("10")}
              className={`px-4 py-1.5 rounded-full wm-mono text-xs uppercase tracking-wide transition-all ${
                activeTab === "10"
                  ? "bg-[#ffb347] text-[#0d0b0a] font-bold shadow-[0_0_10px_rgba(255,179,71,0.3)]"
                  : "text-[#968a84]"
              }`}
            >
              10 Years
            </button>
          </div>
        </div>

        {/* Chart */}
        <div
          className="rounded-[24px] p-6 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <DivergingChart fmtCompact={fmtCompact} />
        </div>

        {/* Path Labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Path */}
          <div
            className="rounded-[20px] p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.05), rgba(13,11,10,0.5))",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#ef4444]/10 blur-[32px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/40 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div>
                <h3 className="wm-heading text-lg text-[#ef4444]/80">Current Path</h3>
                <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-wider">If nothing changes</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              {MILESTONES.map((m) => (
                <div key={`current-${m.year}`} className="flex items-start gap-3 pl-1">
                  <span className="wm-mono text-[10px] text-[#ef4444]/60 uppercase tracking-wider mt-0.5 w-10 shrink-0">{m.year}yr</span>
                  <p className="text-sm text-white/60">{m.current}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WM Path */}
          <div
            className="rounded-[20px] p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(13,11,10,0.5))",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#34d399]/10 blur-[32px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
              <div>
                <h3 className="wm-heading text-lg text-[#34d399]">myWealthMotley Path</h3>
                <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-wider">With your savings &amp; investment plan</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              {MILESTONES.map((m) => (
                <div key={`wm-${m.year}`} className="flex items-start gap-3 pl-1">
                  <span className="wm-mono text-[10px] text-[#34d399]/70 uppercase tracking-wider mt-0.5 w-10 shrink-0">{m.year}yr</span>
                  <p className="text-sm text-white/90">{m.wm}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Stats */}
      <section className="flex flex-col gap-6">
        <h2 className="wm-heading text-2xl text-white">Hypothetical Comparison</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPARISON_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] p-5 flex flex-col gap-4 relative overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,179,71,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="wm-mono text-[9px] text-[#ef4444]/60 uppercase tracking-wider mb-1">Current</p>
                  <p className="wm-mono text-xl font-bold" style={{ color: stat.currentColor + "99" }}>{stat.current}</p>
                </div>
                <div className="flex flex-col items-center pb-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="wm-mono text-[9px] text-[#34d399]/70 uppercase tracking-wider mb-1">WM Path</p>
                  <p className="wm-mono text-xl font-bold" style={{ color: stat.wmColor }}>{stat.wm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Letter to Future Self */}
      <section>
        <div
          className="rounded-[24px] p-8 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#ffb347]/5 blur-[48px] pointer-events-none" />
          <LetterToFutureSelf />
        </div>
      </section>

      {/* Bottom Motivation */}
      <section
        className="rounded-[24px] p-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(255,179,71,0.05))",
          border: "1px solid rgba(255,179,71,0.15)",
        }}
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#ffb347]/5 blur-[60px] pointer-events-none" />
        <div className="relative z-10">
          <h3 className="wm-heading text-2xl text-white mb-3">
            Start Building Your Plan
          </h3>
          <p className="text-sm text-[#968a84] max-w-lg mx-auto mb-6">
            Small, consistent steps can make a meaningful difference over time.
            Explore tools and resources to help you on your journey.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/budget"
              className="px-6 py-3 bg-[#ffb347] hover:bg-[#e67e22] text-[#0d0b0a] wm-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,179,71,0.15)]"
            >
              Create a Budget
            </a>
            <a
              href="/sholz"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#ffb347]/30 wm-mono text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Talk to Mo
            </a>
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section
        className="rounded-[20px] p-6"
        style={{
          background: "rgba(255,179,71,0.04)",
          border: "1px solid rgba(255,179,71,0.15)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffb347]/10 border border-[#ffb347]/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#ffb347] mb-1 uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace" }}>Important Notice</p>
            <p className="text-xs text-[#968a84] leading-relaxed">
              These figures are hypothetical illustrations only, not predictions. The value of investments can go down as well as up. You may get back less than you invest. Past performance is not a reliable indicator of future results. This is not financial advice &mdash; consult a qualified financial adviser before making investment decisions. myWealthMotley is not authorised by the FCA or licensed by the Nigerian SEC as investment advisers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
