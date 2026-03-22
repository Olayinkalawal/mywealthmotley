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
