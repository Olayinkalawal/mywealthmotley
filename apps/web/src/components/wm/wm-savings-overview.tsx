"use client";

import { PiggyBank } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCompactCurrency } from "@/lib/currencies";
import type { SavingsGoal } from "@/lib/mock-data";

// ── Skeleton ─────────────────────────────────────────────────────────

function WmSavingsOverviewSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="flex gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main component ──────────────────────────────────────────────────

interface WmSavingsOverviewProps {
  goals: SavingsGoal[];
  currency?: string;
  isLoading?: boolean;
}

function WmSavingsOverview({
  goals,
  currency = "NGN",
  isLoading = false,
}: WmSavingsOverviewProps) {
  if (isLoading) {
    return <WmSavingsOverviewSkeleton />;
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completedCount = goals.filter(
    (g) => g.currentAmount >= g.targetAmount
  ).length;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <PiggyBank className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold">
                Saving toward {goals.length} goal{goals.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(totalSaved, currency)} of{" "}
                {formatCompactCurrency(totalTarget, currency)}
                {completedCount > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {" "}
                    &middot; {completedCount} completed
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(overallProgress, 100)}%`,
                  background:
                    "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 60%, hsl(var(--accent)) 100%)",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(overallProgress)}% overall progress</span>
              <span>
                {formatCompactCurrency(totalTarget - totalSaved, currency)}{" "}
                remaining
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 border-t pt-3 sm:gap-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Target
              </p>
              <p className="font-heading text-sm font-bold">
                {formatCurrency(totalTarget, currency)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Saved
              </p>
              <p className="font-heading text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalSaved, currency)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Active Goals
              </p>
              <p className="font-heading text-sm font-bold">
                {goals.length - completedCount}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmSavingsOverview, WmSavingsOverviewSkeleton };
