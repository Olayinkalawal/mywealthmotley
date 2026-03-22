"use client";

import * as React from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
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

// ── Smart Savings Recommendations (consumer product comparisons) ────

interface SavingsRecommendation {
  id: string;
  title: string;
  description: string;
  monthlySavings: number;
  currency: string;
  category: "streaming" | "data" | "carrier_deal";
  color: string;
}

const MOCK_RECOMMENDATIONS: SavingsRecommendation[] = [
  {
    id: "rec-1",
    title: "Switch Netflix to Showmax",
    description: "Showmax offers similar content library with local African originals. Netflix Basic is \u20A64,900/mo vs Showmax Mobile at \u20A62,900/mo.",
    monthlySavings: 2000,
    currency: "NGN",
    category: "streaming",
    color: "#4ade80",
  },
  {
    id: "rec-2",
    title: "Optimise your MTN data plan",
    description: "MTN offers 1.5GB for \u20A6500 on the XtraData plan, compared to your current \u20A63,000 bundle. Stack multiple 1.5GB plans for better value.",
    monthlySavings: 1500,
    currency: "NGN",
    category: "data",
    color: "#FFD700",
  },
  {
    id: "rec-3",
    title: "Get Netflix through EE (UK users)",
    description: "EE Smart Plans include Netflix Basic at no extra cost. If you\u2019re on EE, you could get Netflix for effectively \u00A31/month as an add-on.",
    monthlySavings: 3900,
    currency: "NGN",
    category: "carrier_deal",
    color: "#60a5fa",
  },
];

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

      {/* ── Smart Savings Tips ──────────────────────────────── */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {MOCK_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
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
                  Save {formatCurrency(rec.monthlySavings, rec.currency)}/mo
                </span>
              </div>

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
                {rec.title}
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
                {rec.description}
              </p>

              {/* Learn More link */}
              <button
                style={{
                  alignSelf: "flex-start",
                  background: "rgba(255, 179, 71, 0.05)",
                  border: "1px solid rgba(255, 179, 71, 0.2)",
                  borderRadius: "9999px",
                  padding: "8px 18px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#ffb347",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Learn More
              </button>
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
