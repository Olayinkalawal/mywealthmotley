"use client";

import * as React from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { WmSavingsOverview, WmSavingsOverviewSkeleton } from "@/components/wm/wm-savings-overview";
import {
  WmSavingsGoalCard,
  WmSavingsGoalCardSkeleton,
} from "@/components/wm/wm-savings-goal-card";
import { WmAddSavingsGoal } from "@/components/wm/wm-add-savings-goal";
import { WmEmptyState } from "@/components/wm/wm-empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_SAVINGS_GOALS } from "@/lib/mock-data";
import type { SavingsGoal } from "@/lib/mock-data";
import { useUserCurrency } from "@/hooks/use-currency";
import { formatCurrency } from "@/lib/currencies";

// ── Smart Savings Tips Pool ──────────────────────────────────────────

interface SavingsTip {
  id: string;
  title: string;
  description: string;
  monthlySavings: number;
  currency: string;
  color: string;
}

const TIPS_NGN: SavingsTip[] = [
  {
    id: "tip-ngn-1",
    title: "Switch Netflix to Showmax",
    description: "Showmax offers similar content library with local African originals. Netflix Basic is \u20A64,900/mo vs Showmax Mobile at \u20A62,900/mo.",
    monthlySavings: 2000,
    currency: "NGN",
    color: "#4ade80",
  },
  {
    id: "tip-ngn-2",
    title: "Optimise your MTN data plan",
    description: "MTN offers 1.5GB for \u20A6500 on the XtraData plan vs your current \u20A63,000 bundle. Stack multiple 1.5GB plans for better value.",
    monthlySavings: 1500,
    currency: "NGN",
    color: "#FFD700",
  },
  {
    id: "tip-ngn-3",
    title: "Netflix through EE for \u00A31",
    description: "EE Smart Plans include Netflix Basic at no extra cost. If you\u2019re on EE, you could get Netflix for effectively \u00A31/month as an add-on.",
    monthlySavings: 3900,
    currency: "NGN",
    color: "#60a5fa",
  },
  {
    id: "tip-ngn-4",
    title: "Cancel unused gym membership",
    description: "If you haven\u2019t been to the gym in over a month, pause or cancel. You can always re-subscribe when you\u2019re ready.",
    monthlySavings: 5000,
    currency: "NGN",
    color: "#f97316",
  },
  {
    id: "tip-ngn-5",
    title: "Switch to Bolt from Uber",
    description: "Bolt rides are typically 15\u201320% cheaper than Uber for the same routes in Lagos and Abuja. Same convenience, less spend.",
    monthlySavings: 3000,
    currency: "NGN",
    color: "#a78bfa",
  },
  {
    id: "tip-ngn-6",
    title: "Cook at home 3x more per week",
    description: "Replacing 3 Chowdeck/Glovo orders per week with home-cooked meals can save you significantly over the month.",
    monthlySavings: 8000,
    currency: "NGN",
    color: "#fb923c",
  },
  {
    id: "tip-ngn-7",
    title: "Use bank transfer instead of POS",
    description: "POS charges add up. Where possible, pay via bank transfer to avoid the \u20A6100\u2013\u20A6200 per-transaction POS fee.",
    monthlySavings: 500,
    currency: "NGN",
    color: "#38bdf8",
  },
  {
    id: "tip-ngn-8",
    title: "Bundle internet + TV packages",
    description: "Providers like Spectranet and DSTV offer combo deals. Bundling can shave off up to \u20A62,500/mo versus separate plans.",
    monthlySavings: 2500,
    currency: "NGN",
    color: "#34d399",
  },
  {
    id: "tip-ngn-9",
    title: "Review insurance annually for better rates",
    description: "Insurance premiums vary widely. Compare quotes from at least 3 providers each year\u2014you might find the same cover for less.",
    monthlySavings: 0,
    currency: "NGN",
    color: "#e879f9",
  },
  {
    id: "tip-ngn-10",
    title: "Set up automated savings on payday",
    description: "Automate a fixed transfer to your savings account on salary day. What you don\u2019t see, you don\u2019t spend.",
    monthlySavings: 0,
    currency: "NGN",
    color: "#fbbf24",
  },
];

const TIPS_GBP: SavingsTip[] = [
  {
    id: "tip-gbp-1",
    title: "Get Netflix through EE for \u00A31",
    description: "EE Smart Plans include Netflix Basic at no extra cost. If you\u2019re on EE, you could get Netflix for effectively \u00A31/month as an add-on.",
    monthlySavings: 9,
    currency: "GBP",
    color: "#60a5fa",
  },
  {
    id: "tip-gbp-2",
    title: "Switch to a SIM-only mobile plan",
    description: "Once your phone contract ends, switch to SIM-only. You can save \u00A315\u2013\u00A325/mo while keeping the same network.",
    monthlySavings: 20,
    currency: "GBP",
    color: "#4ade80",
  },
  {
    id: "tip-gbp-3",
    title: "Cancel unused gym membership",
    description: "If you haven\u2019t been to the gym in over a month, pause or cancel. You can always re-subscribe when you\u2019re ready.",
    monthlySavings: 30,
    currency: "GBP",
    color: "#f97316",
  },
  {
    id: "tip-gbp-4",
    title: "Cook at home 3x more per week",
    description: "Replacing 3 takeaway orders per week with home cooking can save a significant amount each month.",
    monthlySavings: 50,
    currency: "GBP",
    color: "#fb923c",
  },
  {
    id: "tip-gbp-5",
    title: "Bundle broadband + TV packages",
    description: "Providers like Sky, Virgin, and BT offer combo deals. Bundling can save \u00A310\u2013\u00A320/mo versus separate subscriptions.",
    monthlySavings: 15,
    currency: "GBP",
    color: "#34d399",
  },
  {
    id: "tip-gbp-6",
    title: "Review insurance annually for better rates",
    description: "Car, home, and contents insurance premiums creep up. Compare quotes each year on comparison sites.",
    monthlySavings: 0,
    currency: "GBP",
    color: "#e879f9",
  },
  {
    id: "tip-gbp-7",
    title: "Set up automated savings on payday",
    description: "Set up a standing order to move money into a savings pot on payday. What you don\u2019t see, you don\u2019t spend.",
    monthlySavings: 0,
    currency: "GBP",
    color: "#fbbf24",
  },
  {
    id: "tip-gbp-8",
    title: "Use cashback apps for groceries",
    description: "Apps like Shopmium, GreenJinn, and CheckoutSmart give cashback on everyday items. Small amounts add up over a month.",
    monthlySavings: 8,
    currency: "GBP",
    color: "#a78bfa",
  },
  {
    id: "tip-gbp-9",
    title: "Switch energy provider or fix your tariff",
    description: "Energy prices fluctuate. Check if a fixed tariff or switching provider could lower your monthly bill.",
    monthlySavings: 25,
    currency: "GBP",
    color: "#38bdf8",
  },
  {
    id: "tip-gbp-10",
    title: "Switch to Bolt from Uber",
    description: "Bolt rides are often cheaper than Uber for the same routes. Same convenience, lower spend.",
    monthlySavings: 12,
    currency: "GBP",
    color: "#FFD700",
  },
];

/** Shuffle array using Fisher-Yates and return first `count` items */
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count);
}

/** Hook: returns 3 random tips for the user's currency and a refresh function */
function useRandomTips(currency: string) {
  const pool = currency === "GBP" ? TIPS_GBP : TIPS_NGN;
  const [tips, setTips] = React.useState<SavingsTip[]>([]);

  // Pick initial random tips on mount / when currency changes
  React.useEffect(() => {
    setTips(pickRandom(pool, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const refresh = React.useCallback(() => {
    setTips(pickRandom(pool, 3));
  }, [pool]);

  return { tips, refresh };
}

// ── Adapt Convex savings goal data to component shape ───────────────
function adaptGoals(convexGoals: any[]): SavingsGoal[] {
  return convexGoals.map((goal: any) => ({
    id: goal._id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currency: goal.currency,
    targetDate: goal.targetDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]!,
    icon: goal.icon ?? "target",
    color: goal.color ?? "#5B9A6D",
    isLocked: goal.isLocked,
    lockUntil: goal.lockUntil,
  }));
}

// ── Loading skeleton ────────────────────────────────────────────────
function SavingsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <WmSavingsOverviewSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <WmSavingsGoalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function SavingsPage() {
  const { isAuthenticated } = useConvexAuth();
  const preferredCurrency = useUserCurrency();

  // Fetch real data from Convex
  const convexGoals = useQuery(api.savingsGoals.getGoals, isAuthenticated ? {} : "skip");
  const createGoalMutation = useMutation(api.savingsGoals.createGoal);
  const deleteGoalMutation = useMutation(api.savingsGoals.deleteGoal);

  // Loading state
  const isLoading = convexGoals === undefined;

  // Adapt goals from Convex to component shape
  const goals: SavingsGoal[] = React.useMemo(() => {
    if (isLoading) return [];

    try {
      if (convexGoals && convexGoals.length > 0) {
        return adaptGoals(convexGoals);
      }
      // Fall back to mock data if no real goals exist yet
      // TODO: Remove mock fallback once Convex data is fully seeded
      return MOCK_SAVINGS_GOALS;
    } catch {
      // TODO: Remove mock fallback once Convex data is fully seeded
      return MOCK_SAVINGS_GOALS;
    }
  }, [convexGoals, isLoading]);

  // Determine if using real data or mock
  const isUsingRealData = !isLoading && convexGoals !== null && convexGoals !== undefined && convexGoals.length > 0;
  const isEmpty = !isLoading && isUsingRealData && goals.length === 0;

  // Determine currency from first goal or user preference
  const currency = React.useMemo(() => {
    if (goals.length > 0) {
      return goals[0]!.currency;
    }
    return preferredCurrency;
  }, [goals, preferredCurrency]);

  // Dynamic tips based on user currency
  const { tips: savingsTips, refresh: refreshTips } = useRandomTips(currency);

  // Handle creating a new savings goal via Convex mutation
  const handleAddGoal = React.useCallback(
    async (goalData: {
      name: string;
      targetAmount: number;
      currency: string;
      targetDate: Date;
      icon: string;
      color: string;
      isLocked: boolean;
      lockUntil?: Date;
    }) => {
      try {
        await createGoalMutation({
          name: goalData.name,
          targetAmount: goalData.targetAmount,
          currency: goalData.currency,
          targetDate: goalData.targetDate.toISOString().split("T")[0]!,
          icon: goalData.icon,
          color: goalData.color,
          isLocked: goalData.isLocked,
          lockUntil: goalData.lockUntil
            ? goalData.lockUntil.toISOString().split("T")[0]!
            : undefined,
        });
      } catch (error) {
        console.error("Failed to create savings goal:", error);
        // TODO: Show toast notification on error
      }
    },
    [createGoalMutation]
  );

  // Handle deleting a savings goal via Convex mutation
  const handleDeleteGoal = React.useCallback(
    async (goalId: string) => {
      try {
        // Only call Convex mutation if this looks like a Convex ID
        if (goalId.includes("|") || goalId.length > 10) {
          await deleteGoalMutation({
            goalId: goalId as any,
          });
        }
      } catch (error) {
        console.error("Failed to delete savings goal:", error);
        // TODO: Show toast notification on error
      }
    },
    [deleteGoalMutation]
  );

  if (isLoading) {
    return <SavingsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">
            Track progress toward your financial goals.
          </p>
        </div>
        <WmAddSavingsGoal onAdd={handleAddGoal} />
      </div>

      {/* Overview card */}
      <WmSavingsOverview
        goals={goals}
        currency={currency}
      />

      {/* ── Smart Savings Tips (dynamic, currency-aware) ──── */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 className="font-heading text-lg font-bold">Smart Savings Tips</h2>
          </div>
          <button
            onClick={refreshTips}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6" />
              <path d="M2.5 22v-6h6" />
              <path d="M2.5 11.5a10 10 0 0 1 18-4.5" />
              <path d="M21.5 12.5a10 10 0 0 1-18 4.5" />
            </svg>
            Refresh Tips
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {savingsTips.map((tip) => (
            <div
              key={tip.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Savings badge */}
              {tip.monthlySavings > 0 ? (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(74, 222, 128, 0.1)",
                    border: "1px solid rgba(74, 222, 128, 0.2)",
                    borderRadius: "9999px",
                    padding: "4px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#4ade80",
                    }}
                  >
                    Save {formatCurrency(tip.monthlySavings, tip.currency)}/mo
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: `rgba(255, 179, 71, 0.1)`,
                    border: `1px solid rgba(255, 179, 71, 0.2)`,
                    borderRadius: "9999px",
                    padding: "4px 12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#ffb347",
                    }}
                  >
                    Pro Tip
                  </span>
                </div>
              )}

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  lineHeight: 1.3,
                }}
              >
                {tip.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p
          style={{
            marginTop: "16px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "rgba(255, 255, 255, 0.35)",
            lineHeight: 1.5,
            maxWidth: "640px",
          }}
        >
          Savings estimates are approximate. We may earn a commission from some recommendations &mdash; this doesn&apos;t affect the price you pay.
        </p>
      </div>

      {/* Goal cards grid */}
      {goals.length === 0 ? (
        <WmEmptyState
          imageSrc="/illustrations/empty-savings.png"
          title="No savings goals yet"
          description="Start with your first goal!"
          actionLabel="Create a Goal"
          onAction={() => {
            /* The WmAddSavingsGoal dialog handles creation */
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((goal, index) => (
            <WmSavingsGoalCard
              key={goal.id}
              goal={goal}
              index={index}
              onEdit={(id) => {
                /* TODO: open edit dialog wired to updateGoal mutation */
              }}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Add button (bottom, mobile-friendly) */}
      <div className="flex justify-center pb-4 md:hidden">
        <WmAddSavingsGoal onAdd={handleAddGoal} />
      </div>
    </div>
  );
}
