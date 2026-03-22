"use client";

import { useState, useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { MOCK_BUDGET, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import type { Budget, Transaction, BudgetCategory } from "@/lib/mock-data";
import { WmCreateBudgetDialog } from "@/components/wm/wm-create-budget-dialog";

/* ── Inline CSS animations (injected once) ─────────────────────────── */
const BUDGET_KEYFRAMES = `
@keyframes budgetBounceSlow {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.02) translateY(-10px); }
}
@keyframes budgetFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes budgetPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes budgetFillBar {
  0% { width: 0%; }
}
@keyframes budgetDrawLine {
  0% { stroke-dasharray: 0, 2000; }
  100% { stroke-dasharray: 2000, 0; }
}
`;

/* ── Shared glass style objects ─────────────────────────────────────── */
const glassCard = {
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "24px",
  transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
} as React.CSSProperties;

const glassPanel = {
  ...glassCard,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
} as React.CSSProperties;

/* ── Tiny Mascot ────────────────────────────────────────────────────── */
function MascotMini() {
  return (
    <div style={{ width: "64px", height: "64px", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffb347",
          borderRadius: "50%",
          boxShadow:
            "inset 8px 8px 12px rgba(255,255,255,0.6), inset -10px -10px 16px rgba(0,0,0,0.4), 0 10px 20px rgba(255,179,71,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", gap: "12px", transform: "translateY(-4px)" }}>
          <div style={{ width: "10px", height: "6px", border: "3px solid #1a1614", borderRadius: "10px 10px 0 0", borderBottom: 0 }} />
          <div style={{ width: "10px", height: "6px", border: "3px solid #1a1614", borderRadius: "10px 10px 0 0", borderBottom: 0 }} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            width: "16px",
            height: "8px",
            background: "#1a1614",
            borderRadius: "0 0 16px 16px",
          }}
        />
      </div>
    </div>
  );
}

/* ── Animated progress bar ──────────────────────────────────────────── */
function AnimatedBar({ percent, color, glow, height = 12 }: { percent: number; color: string; glow?: string; height?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 120);
    return () => clearTimeout(t);
  }, [percent]);
  return (
    <div
      className="w-full rounded-full overflow-hidden relative"
      style={{ height, background: "rgba(255,255,255,0.08)" }}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{
          width: `${width}%`,
          background: color,
          boxShadow: glow ? `0 0 8px ${glow}` : undefined,
          transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

/* ── Category card (best of templates 9+10+11) ─────────────────────── */
function CategoryCard({
  icon,
  name,
  spent,
  total,
  percent,
  color,
  alert,
}: {
  icon: React.ReactNode;
  name: string;
  spent: string;
  total: string;
  percent: number;
  color: string;
  alert?: boolean;
}) {
  return (
    <div
      className="p-6 relative overflow-hidden group cursor-default"
      style={glassCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,179,71,0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* soft glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
        style={{ background: `${color}1a` }}
      />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}
          >
            {icon}
          </div>
          <h4 className="text-lg tracking-wide" style={{ fontFamily: "DynaPuff, cursive" }}>{name}</h4>
        </div>
        {alert && (
          <span
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1"
            style={{
              background: "rgba(255,71,87,0.2)",
              color: "#ff4757",
              border: "1px solid rgba(255,71,87,0.3)",
              animation: "budgetPulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          >
            Alert
          </span>
        )}
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-2">
          <div className="text-xl" style={{ fontFamily: "JetBrains Mono, monospace", color: alert ? color : "#ffffff" }}>{spent}</div>
          <div className="text-xs mb-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>of {total}</div>
        </div>
        <AnimatedBar percent={percent} color={color} glow={color} />
        <div className="mt-2 text-right text-[10px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color }}>{percent}% Used</div>
      </div>
    </div>
  );
}

/* ── Transaction row (template 11 style with initial badge) ────────── */
function TransactionRow({
  initial,
  name,
  category,
  amount,
  date,
  color,
}: {
  initial: string;
  name: string;
  category: string;
  amount: string;
  date: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl transition cursor-pointer"
      style={{ background: hovered ? "rgba(255,255,255,0.05)" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition"
          style={{
            fontFamily: "DynaPuff, cursive",
            background: hovered ? color : `${color}1a`,
            color: hovered ? "#000" : color,
          }}
        >
          {initial}
        </div>
        <div>
          <div className="font-medium text-sm text-white">{name}</div>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "10px",
              color: "#968a84",
            }}
          >
            {category}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{amount}</p>
        <p className="text-xs mt-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>{date}</p>
      </div>
    </div>
  );
}

/* ── Add Category Modal (from template 10) ─────────────────────────── */
function AddCategoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div className="p-8 w-full max-w-md mx-4" style={glassCard} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl mb-6" style={{ fontFamily: "DynaPuff, cursive" }}>Add New Category</h3>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>Budget Limit (N)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "JetBrains Mono, monospace" }}
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#968a84" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold transition-colors"
              style={{ background: "#ffb347", color: "#0d0b0a" }}
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Adapt Convex shapes ────────────────────────────────────────────── */
function adaptBudget(convexBudget: any): Budget {
  return {
    month: convexBudget.month,
    mode: convexBudget.mode as "flex" | "strict",
    totalIncome: convexBudget.totalIncome,
    currency: convexBudget.currency,
    categories: (convexBudget.categories ?? []).map((cat: any) => ({
      id: cat._id ?? cat.name?.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: cat.name,
      allocated: cat.allocated,
      spent: cat.spent,
      color: cat.color ?? "#8B6B5A",
      icon: cat.icon ?? "home",
    })),
    totalAllocated: convexBudget.totalAllocated ?? 0,
    totalSpent: convexBudget.totalSpent ?? 0,
  };
}

function adaptTransactions(convexTransactions: any[]): Transaction[] {
  return convexTransactions.map((tx: any) => ({
    id: tx._id ?? tx.monoTransactionId ?? String(Math.random()),
    narration: tx.narration,
    amount: tx.type === "debit" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
    type: tx.type as "debit" | "credit",
    date: tx.date,
    category: tx.effectiveCategory ?? tx.userCategory ?? tx.ruleCategory ?? "other",
    merchant: tx.merchant ?? "",
  }));
}

/* ── Format helpers ─────────────────────────────────────────────────── */
function fmtNaira(n: number): string {
  if (Math.abs(n) >= 1000) return `\u20A6${Math.round(Math.abs(n) / 1000).toLocaleString()}K`;
  return `\u20A6${Math.abs(n).toLocaleString()}`;
}
function fmtFull(n: number): string {
  return `\u20A6${Math.abs(n).toLocaleString()}`;
}

/* ── Default category configs ───────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  food: "#ffb347",
  data_airtime: "#ff4757",
  owambe: "#2ed573",
  transport: "#60a5fa",
  rent: "#c084fc",
  church_tithes: "#f59e0b",
  family_support: "#f59e0b",
  utilities: "#34d399",
  entertainment: "#ec4899",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  food: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  data_airtime: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  owambe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
};

/* ════════════════════════════════════════════════════════════════════
   Budget Page (main)
   ════════════════════════════════════════════════════════════════════ */
export default function BudgetPage() {
  const { isAuthenticated } = useConvexAuth();
  const convexBudget = useQuery(api.budgets.getCurrentBudget, isAuthenticated ? {} : "skip");
  const convexTransactions = useQuery(api.transactions.getTransactions, isAuthenticated ? {} : "skip");

  const isLoading = convexBudget === undefined || convexTransactions === undefined;
  const [showAll, setShowAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState("Dec");

  /* inject keyframes once */
  useEffect(() => {
    const id = "budget-keyframes";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = BUDGET_KEYFRAMES;
    document.head.appendChild(tag);
    return () => { tag.remove(); };
  }, []);

  /* ── Loading skeleton ───────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div style={{ backgroundColor: "#0d0b0a", minHeight: "100vh", color: "#fff", padding: "40px" }}>
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)", height: i === 1 ? 200 : 120 }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty state: no budget exists for this month ────────────────── */
  const hasNoBudget = convexBudget === null;

  if (hasNoBudget) {
    const monthDisplay = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div
        style={{
          backgroundColor: "#0d0b0a",
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(255,179,71,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%)" }} />

        <main className="relative z-10 w-full flex flex-col items-center justify-center gap-8 px-6 md:px-12 lg:px-16 pb-20 min-h-screen" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Mascot */}
          <div className="relative" style={{ width: "120px", height: "120px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#ffb347",
                borderRadius: "50%",
                boxShadow: "inset 15px 15px 25px rgba(255,255,255,0.7), inset -20px -20px 30px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.5), 0 0 60px rgba(255,179,71,0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "budgetBounceSlow 3s ease-in-out infinite",
              }}
            >
              <div className="flex gap-4 transform -translate-y-2">
                <div style={{ width: "18px", height: "9px", border: "4px solid #1a1614", borderRadius: "18px 18px 0 0", borderBottom: 0 }} />
                <div style={{ width: "18px", height: "9px", border: "4px solid #1a1614", borderRadius: "18px 18px 0 0", borderBottom: 0 }} />
              </div>
              <div className="absolute bottom-8" style={{ width: "36px", height: "18px", background: "#1a1614", borderRadius: "0 0 36px 36px" }} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center max-w-lg">
            <h1
              className="text-4xl md:text-5xl leading-tight text-white mb-4"
              style={{ fontFamily: "DynaPuff, cursive", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
            >
              No Budget <span style={{ color: "#ffb347" }}>Yet.</span>
            </h1>
            <p className="text-lg mb-2" style={{ color: "#968a84" }}>
              You have not set up a budget for {monthDisplay}.
            </p>
            <p className="text-sm" style={{ color: "#968a84" }}>
              Create one now and we will pre-fill categories relevant to your lifestyle.
              You can adjust everything after.
            </p>
          </div>

          {/* Create Budget CTA */}
          <WmCreateBudgetDialog
            trigger={
              <button
                className="group relative px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer"
                style={{
                  background: "#ffb347",
                  color: "#0d0b0a",
                  boxShadow: "0 10px 30px rgba(255,179,71,0.3)",
                  fontFamily: "DynaPuff, cursive",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(255,179,71,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,179,71,0.3)";
                }}
              >
                Create Your {monthDisplay} Budget
              </button>
            }
          />

          {/* Secondary info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
            {[
              { title: "Set Your Income", desc: "Tell us what you earn this month" },
              { title: "Auto Categories", desc: "We pre-fill Nigerian lifestyle categories" },
              { title: "Track Spending", desc: "See how your money flows in real time" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs" style={{ color: "#968a84" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  /* ── Resolve data ───────────────────────────────────────────────── */
  let budget: Budget;
  let transactions: Transaction[];
  try {
    budget = convexBudget ? adaptBudget(convexBudget) : MOCK_BUDGET;
    if (budget.categories.length === 0 && budget.totalAllocated === 0) {
      budget = { ...budget, totalAllocated: budget.totalIncome };
    }
  } catch {
    budget = MOCK_BUDGET;
  }
  try {
    const raw = convexTransactions?.transactions ?? [];
    transactions = raw.length > 0 ? adaptTransactions(raw) : MOCK_TRANSACTIONS;
  } catch {
    transactions = MOCK_TRANSACTIONS;
  }

  const spentPercent = budget.totalIncome > 0 ? Math.round((budget.totalSpent / budget.totalIncome) * 100) : 0;
  const remaining = budget.totalIncome - budget.totalSpent;

  /* pick top 3 categories for cards */
  const topCats = [...budget.categories]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  /* recent transactions */
  const recentTx = [...transactions]
    .filter((t) => t.type === "debit")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, showAll ? 10 : 5);

  /* mascot message */
  const mascotMsg = spentPercent < 50 ? "Great discipline!" : spentPercent < 80 ? "You're on track!" : "Watch your spending!";

  return (
    <div
      style={{
        backgroundColor: "#0d0b0a",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(255,179,71,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "fixed", borderRadius: "50%", filter: "blur(120px)", zIndex: 0, pointerEvents: "none", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%)" }} />

      {/* Noise overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      <main
        className="relative z-10 w-full flex flex-col gap-8 px-6 md:px-12 lg:px-16 pb-20"
        style={{ maxWidth: "1400px", margin: "0 auto" }}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <header
          className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col gap-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider w-max mb-2"
              style={{
                background: "rgba(255,179,71,0.1)",
                border: "1px solid rgba(255,179,71,0.2)",
                color: "#ffb347",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Monthly Tracker
            </div>
            <h1
              className="text-5xl md:text-6xl leading-tight text-white"
              style={{ fontFamily: "DynaPuff, cursive", textShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
            >
              Monthly <span style={{ color: "#ffb347" }}>Budget.</span>
            </h1>
            <p className="text-lg" style={{ color: "#968a84" }}>Track your spending against limits.</p>
          </div>

          <div style={glassPanel} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 px-6 py-4 rounded-3xl">
            <div className="flex items-center gap-3 pr-6" style={{ borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", color: "#ffb347" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div className="text-xs uppercase" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>Current Period</div>
                <div className="font-bold flex items-center gap-2 text-lg">
                  {budget.month ? new Date(budget.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "March 2026"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#968a84" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs uppercase mb-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>Total Budget</div>
              <div className="text-3xl font-bold text-white flex items-baseline gap-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                <span className="text-xl" style={{ color: "#ffb347" }}>{"\u20A6"}</span>{budget.totalIncome.toLocaleString()}
              </div>
            </div>
          </div>
        </header>

        {/* ── Grid layout ───────────────────────────────────────────── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left column: Overview + Chart */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Overview Card */}
            <div style={glassPanel} className="p-8 md:p-10 relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"
                style={{ background: "rgba(255,179,71,0.1)", filter: "blur(80px)", marginRight: "-5rem", marginTop: "-5rem" }}
              />
              <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex-1 w-full">
                  <h2 className="text-4xl md:text-5xl mb-6 leading-tight" style={{ fontFamily: "DynaPuff, cursive" }}>
                    You&apos;ve spent <br />
                    <span className="text-white" style={{ textShadow: "0 0 15px rgba(255,179,71,0.3)" }}>{fmtNaira(budget.totalSpent)}</span>{" "}
                    <span style={{ color: "#968a84", fontSize: "1.5rem" }}>of {fmtNaira(budget.totalIncome)}</span>
                  </h2>
                  <div className="mb-4">
                    <div
                      className="w-full h-6 rounded-full p-1 border border-white/10 overflow-hidden relative"
                      style={{ background: "rgba(0,0,0,0.4)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }}
                    >
                      <div
                        className="h-full rounded-full relative"
                        style={{ width: `${spentPercent}%`, background: "linear-gradient(to right, #e67e22, #ffb347)", boxShadow: "0 0 15px rgba(255,179,71,0.6)", transition: "width 1.5s ease" }}
                      >
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className="font-bold px-3 py-1 rounded-lg border"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "#ffb347", background: "rgba(255,179,71,0.1)", borderColor: "rgba(255,179,71,0.2)" }}
                    >
                      {spentPercent}% Used
                    </div>
                    <div className="text-sm flex items-center gap-2" style={{ fontFamily: "JetBrains Mono, monospace", color: "#2ed573" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      {fmtFull(remaining)} left this month
                    </div>
                  </div>
                </div>

                {/* Mascot */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <div
                    className="absolute w-full h-full rounded-full flex flex-col items-center justify-center z-10"
                    style={{
                      background: "#ffb347",
                      boxShadow: "inset 15px 15px 25px rgba(255,255,255,0.7), inset -20px -20px 30px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.5), 0 0 60px rgba(255,179,71,0.2)",
                      animation: "budgetBounceSlow 3s ease-in-out infinite",
                    }}
                  >
                    <div className="flex gap-4 transform -translate-y-2">
                      <div style={{ width: "18px", height: "9px", border: "4px solid #1a1614", borderRadius: "18px 18px 0 0", borderBottom: 0 }} />
                      <div style={{ width: "18px", height: "9px", border: "4px solid #1a1614", borderRadius: "18px 18px 0 0", borderBottom: 0 }} />
                    </div>
                    <div className="absolute bottom-8" style={{ width: "36px", height: "18px", background: "#1a1614", borderRadius: "0 0 36px 36px" }} />
                  </div>
                  <div
                    className="absolute -top-4 -left-12 z-20 px-4 py-3 shadow-2xl"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "16px 16px 16px 4px",
                      transform: "rotate(-6deg)",
                      animation: "budgetFloat 6s ease-in-out infinite",
                    }}
                  >
                    <p className="text-sm m-0" style={{ fontFamily: "DynaPuff, cursive", color: "#ffb347" }}>{mascotMsg}</p>
                  </div>
                  <div className="absolute top-4 right-0 w-3 h-3 rounded-full animate-pulse" style={{ background: "#2ed573", boxShadow: "0 0 10px #2ed573" }} />
                </div>
              </div>
            </div>

            {/* Spending Chart (template 11 style with month toggle) */}
            <div style={glassPanel} className="p-8 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl text-white" style={{ fontFamily: "DynaPuff, cursive" }}>Daily spending trend</h3>
                  <p className="text-sm mt-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>
                    {budget.month ? new Date(budget.month + "-01").toLocaleDateString("en-US", { month: "long" }) : "March"} 1 - 30
                  </p>
                </div>
                <div className="flex gap-2 p-1 rounded-xl border border-white/5" style={{ background: "rgba(0,0,0,0.3)" }}>
                  {["Dec", "Nov"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveMonth(m)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: activeMonth === m ? "#ffffff" : "#968a84",
                        background: activeMonth === m ? "rgba(255,255,255,0.1)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex-1 w-full mt-4">
                <svg viewBox="0 0 1000 300" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="budgetAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb347" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ffb347" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="budgetGlow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M 0,50 L 1000,50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="6 6" />
                  <path d="M 0,150 L 1000,150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="6 6" />
                  <path d="M 0,250 L 1000,250" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M 0,250 L 0,220 C 80,220 120,140 200,160 C 280,180 320,80 400,90 C 480,100 520,190 600,170 C 680,150 720,60 800,80 C 880,100 950,40 1000,50 L 1000,250 Z" fill="url(#budgetAreaGrad)" />
                  <path d="M 0,220 C 80,220 120,140 200,160 C 280,180 320,80 400,90 C 480,100 520,190 600,170 C 680,150 720,60 800,80 C 880,100 950,40 1000,50" fill="none" stroke="#ffb347" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#budgetGlow)" />
                  {[[200, 160], [400, 90], [600, 170], [800, 80], [1000, 50]].map(([cx, cy]) => (
                    <circle key={cx} cx={cx} cy={cy} r="6" fill="#0d0b0a" stroke="#ffb347" strokeWidth="3" style={{ cursor: "pointer" }} />
                  ))}
                  <g transform="translate(800, 30)">
                    <rect x="-45" y="-35" width="90" height="28" rx="14" fill="rgba(255,179,71,0.15)" stroke="#ffb347" strokeWidth="1" />
                    <text x="0" y="-16" fill="#ffffff" fontFamily="JetBrains Mono, monospace" fontSize="13" textAnchor="middle" fontWeight="bold">{fmtNaira(budget.totalSpent / 7)}</text>
                  </g>
                </svg>
                <div className="flex justify-between items-center mt-4 px-2 text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>
                  <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={{ ...glassPanel, padding: 0 }} className="flex flex-col overflow-hidden">
              <div className="p-6 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="text-xl" style={{ fontFamily: "DynaPuff, cursive" }}>Recent Transactions</h3>
                <button
                  className="text-xs hover:text-white transition-colors"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "#ffb347", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : "View All \u2192"}
                </button>
              </div>
              <div className="flex flex-col p-2">
                {recentTx.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    initial={tx.merchant ? tx.merchant[0]!.toUpperCase() : tx.narration[0]!.toUpperCase()}
                    name={tx.merchant || tx.narration}
                    category={tx.category.replace(/_/g, " ")}
                    amount={`${tx.amount < 0 ? "-" : ""}${fmtFull(tx.amount)}`}
                    date={new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    color={CATEGORY_COLORS[tx.category] ?? "#ffb347"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Categories */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-2xl text-white mb-2 ml-2" style={{ fontFamily: "DynaPuff, cursive" }}>Budget Categories</h3>

            {topCats.map((cat) => {
              const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
              return (
                <CategoryCard
                  key={cat.id}
                  icon={CATEGORY_ICONS[cat.id] || CATEGORY_ICONS.food}
                  name={cat.name}
                  spent={fmtFull(cat.spent)}
                  total={fmtNaira(cat.allocated)}
                  percent={pct}
                  color={CATEGORY_COLORS[cat.id] ?? cat.color}
                  alert={pct >= 90}
                />
              );
            })}

            {/* remaining categories as smaller rows */}
            {budget.categories.slice(3).map((cat) => {
              const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl p-5 border border-white/5 hover:border-white/10 transition group cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-white">{cat.name}</div>
                    <div className="text-right">
                      <div className="font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: pct >= 90 ? "#ff4757" : "#ffffff" }}>{fmtFull(cat.spent)}</div>
                      <div className="text-xs" style={{ fontFamily: "JetBrains Mono, monospace", color: "#968a84" }}>of {fmtNaira(cat.allocated)}</div>
                    </div>
                  </div>
                  <AnimatedBar percent={pct} color={CATEGORY_COLORS[cat.id] ?? cat.color} glow={CATEGORY_COLORS[cat.id] ?? cat.color} height={10} />
                </div>
              );
            })}

            {/* Add new category button */}
            <button
              className="p-4 flex items-center justify-center gap-2 group transition-colors"
              style={{ ...glassCard, border: "2px dashed rgba(255,255,255,0.08)", color: "#968a84", cursor: "pointer", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffb347"; e.currentTarget.style.color = "#ffb347"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#968a84"; }}
              onClick={() => setModalOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="font-medium">Add New Category</span>
            </button>
          </div>
        </div>
      </main>

      <AddCategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
