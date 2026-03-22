"use client";

import * as React from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { toast } from "sonner";
import { Trash, Plus } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/hooks/use-currency";
import { getCurrencySymbol } from "@/lib/currencies";
import { api } from "../../../convex/_generated/api";

/* ── Default category presets ──────────────────────────────────────── */
const DEFAULT_CATEGORIES = [
  { name: "Food & Groceries", color: "#ffb347", icon: "food" },
  { name: "Data & Airtime", color: "#ff4757", icon: "phone" },
  { name: "Transport", color: "#60a5fa", icon: "transport" },
  { name: "Rent & Housing", color: "#c084fc", icon: "rent" },
  { name: "Utilities", color: "#34d399", icon: "utilities" },
  { name: "Entertainment", color: "#ec4899", icon: "entertainment" },
  { name: "Family Support", color: "#f59e0b", icon: "family" },
  { name: "Savings & Investments", color: "#2ed573", icon: "savings" },
];

type CategoryRow = {
  id: string;
  name: string;
  allocated: number;
  color: string;
  icon: string;
};

interface WmCreateBudgetDialogProps {
  trigger?: React.ReactNode;
}

function WmCreateBudgetDialog({ trigger }: WmCreateBudgetDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [income, setIncome] = React.useState("");
  const [mode, setMode] = React.useState<"flex" | "zero_based">("flex");
  const [categories, setCategories] = React.useState<CategoryRow[]>([]);
  const [newCatName, setNewCatName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const { isAuthenticated } = useConvexAuth();
  const createBudget = useMutation(api.budgets.createBudget);
  const { currency } = useCurrency();
  const sym = getCurrencySymbol(currency);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthDisplay = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Seed default categories when dialog opens
  React.useEffect(() => {
    if (open && categories.length === 0) {
      setCategories(
        DEFAULT_CATEGORIES.map((c, i) => ({
          id: `cat-${i}`,
          name: c.name,
          allocated: 0,
          color: c.color,
          icon: c.icon,
        }))
      );
    }
  }, [open, categories.length]);

  const totalAllocated = categories.reduce((s, c) => s + c.allocated, 0);
  const incomeNum = parseFloat(income) || 0;
  const remaining = incomeNum - totalAllocated;

  const handleAllocationChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, allocated: num } : c))
    );
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        name,
        allocated: 0,
        color: "#968a84",
        icon: "other",
      },
    ]);
    setNewCatName("");
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in first");
      return;
    }
    if (incomeNum <= 0) {
      toast.error("Please enter a valid income amount");
      return;
    }
    const activeCats = categories.filter((c) => c.allocated > 0);
    if (activeCats.length === 0) {
      toast.error("Allocate money to at least one category");
      return;
    }

    setSubmitting(true);
    try {
      await createBudget({
        month: currentMonth,
        mode,
        totalIncome: incomeNum,
        currency,
        categories: activeCats.map((c) => ({
          name: c.name,
          allocated: c.allocated,
          color: c.color,
          icon: c.icon,
        })),
      });
      toast.success(`${monthDisplay} budget created!`);
      setOpen(false);
      reset();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create budget");
    } finally {
      setSubmitting(false);
    }
  };

  function reset() {
    setStep(1);
    setIncome("");
    setMode("flex");
    setCategories([]);
    setNewCatName("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            size="lg"
            className="rounded-2xl font-bold"
            style={{
              background: "#ffb347",
              color: "#0d0b0a",
              fontFamily: "DynaPuff, cursive",
            }}
          >
            Create Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-lg border-white/10 sm:max-w-xl"
        style={{ background: "#141210", color: "#fff" }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "DynaPuff, cursive", color: "#fff" }}
          >
            {step === 1 ? (
              <>
                Create <span style={{ color: "#ffb347" }}>{monthDisplay}</span>{" "}
                Budget
              </>
            ) : (
              <>
                Allocate Your{" "}
                <span style={{ color: "#ffb347" }}>Categories</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription style={{ color: "#968a84" }}>
            {step === 1
              ? "Start by setting your total income for the month."
              : `Distribute your ${sym}${incomeNum.toLocaleString()} across categories.`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          /* ── Step 1: Income & Mode ──────────────────────────────────── */
          <div className="flex flex-col gap-6 pt-2">
            <div className="space-y-2">
              <Label style={{ color: "#fff" }}>Monthly Income</Label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold"
                  style={{ color: "#ffb347" }}
                >
                  {sym}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 300000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded-xl py-4 pl-12 pr-4 text-xl font-bold outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#fff",
                  }}
                  autoFocus
                />
              </div>
              <p className="text-xs" style={{ color: "#968a84" }}>
                Total take-home pay for {monthDisplay}
              </p>
            </div>

            <div className="space-y-3">
              <Label style={{ color: "#fff" }}>Budget Mode</Label>
              <div className="flex gap-3">
                {(
                  [
                    {
                      value: "flex" as const,
                      label: "Flex",
                      desc: "Allocate key categories, keep the rest flexible",
                    },
                    {
                      value: "zero_based" as const,
                      label: "Zero-Based",
                      desc: "Every unit has a job — allocate 100%",
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMode(opt.value)}
                    className="flex-1 rounded-xl p-4 text-left transition-all"
                    style={{
                      background:
                        mode === opt.value
                          ? "rgba(255,179,71,0.15)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${mode === opt.value ? "rgba(255,179,71,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div
                      className="text-sm font-bold"
                      style={{
                        color: mode === opt.value ? "#ffb347" : "#fff",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "#968a84" }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (incomeNum <= 0) {
                  toast.error("Enter your income first");
                  return;
                }
                setStep(2);
              }}
              className="w-full rounded-xl py-3 text-base font-bold transition-all"
              style={{
                background: "#ffb347",
                color: "#0d0b0a",
                fontFamily: "DynaPuff, cursive",
                border: "none",
                cursor: "pointer",
              }}
            >
              Next: Set Categories
            </button>
          </div>
        ) : (
          /* ── Step 2: Category Allocation ────────────────────────────── */
          <div className="flex flex-col gap-4 pt-2">
            {/* Summary bar */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="text-xs uppercase tracking-wider"
                style={{ color: "#968a84" }}
              >
                Allocated
              </div>
              <div
                className="flex items-center gap-3 text-sm font-bold"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                <span
                  style={{
                    color:
                      totalAllocated > incomeNum ? "#ff4757" : "#ffb347",
                  }}
                >
                  {sym}
                  {totalAllocated.toLocaleString()}
                </span>
                <span style={{ color: "#968a84" }}>/</span>
                <span style={{ color: "#fff" }}>
                  {sym}
                  {incomeNum.toLocaleString()}
                </span>
                <span
                  className="ml-2 rounded-md px-2 py-0.5 text-xs"
                  style={{
                    background:
                      remaining < 0
                        ? "rgba(255,71,87,0.2)"
                        : remaining === 0
                          ? "rgba(46,213,115,0.2)"
                          : "rgba(255,179,71,0.15)",
                    color:
                      remaining < 0
                        ? "#ff4757"
                        : remaining === 0
                          ? "#2ed573"
                          : "#ffb347",
                  }}
                >
                  {remaining < 0
                    ? `${sym}${Math.abs(remaining).toLocaleString()} over`
                    : remaining === 0
                      ? "Balanced"
                      : `${sym}${remaining.toLocaleString()} left`}
                </span>
              </div>
            </div>

            {/* Category list */}
            <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="min-w-0 flex-1 truncate text-sm"
                    style={{ color: "#fff" }}
                  >
                    {cat.name}
                  </span>
                  <div className="relative w-32 shrink-0">
                    <span
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: "#968a84" }}
                    >
                      {sym}
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={cat.allocated || ""}
                      onChange={(e) =>
                        handleAllocationChange(cat.id, e.target.value)
                      }
                      placeholder="0"
                      className="w-full rounded-lg py-2 pl-8 pr-3 text-right text-sm outline-none"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCategory(cat.id)}
                    className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/5"
                    style={{ color: "#968a84", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add custom category */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Add custom category..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addCategory();
                }}
              />
              <button
                type="button"
                onClick={addCategory}
                className="rounded-xl px-3 py-2 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl py-3 font-medium transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || totalAllocated === 0}
                className="flex-1 rounded-xl py-3 text-base font-bold transition-all disabled:opacity-50"
                style={{
                  background: "#ffb347",
                  color: "#0d0b0a",
                  fontFamily: "DynaPuff, cursive",
                  border: "none",
                  cursor: submitting || totalAllocated === 0 ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { WmCreateBudgetDialog };
