"use client";

import { CalendarBlank, Wallet } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";
import type { Budget } from "@/lib/mock-data";

interface WmBudgetOverviewCardProps {
  budget: Budget;
  userName?: string;
  isLoading?: boolean;
}

function WmBudgetOverviewCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#5C3D2E] to-[#3E2A1F] dark:from-[#E8614D] dark:to-[#C44A3A]">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-48 bg-white/20" />
          <Skeleton className="h-8 w-72 bg-white/20" />
          <Skeleton className="h-4 w-full max-w-md bg-white/20" />
          <Skeleton className="h-5 w-64 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}

function WmBudgetOverviewCard({
  budget,
  userName,
  isLoading = false,
}: WmBudgetOverviewCardProps) {
  if (isLoading) {
    return <WmBudgetOverviewCardSkeleton />;
  }

  const spentPercent = Math.min(
    (budget.totalSpent / budget.totalAllocated) * 100,
    100
  );
  const remaining = budget.totalAllocated - budget.totalSpent;

  // Calculate days remaining in the month
  const [year, month] = budget.month.split("-").map(Number);
  const lastDay = new Date(year!, month!, 0).getDate();
  const today = new Date();
  const currentDay = today.getDate();
  const daysRemaining = Math.max(lastDay - currentDay, 0);

  const monthName = new Date(year!, (month ?? 1) - 1, 1).toLocaleString(
    "en-US",
    {
      month: "long",
    }
  );

  const greeting = userName ? `Hey ${userName}` : "Hey there";

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#5C3D2E] to-[#3E2A1F] dark:from-[#E8614D] dark:to-[#C44A3A]">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white" />
        <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-white" />
      </div>

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          {/* Greeting */}
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-white/70" />
            <p className="text-sm font-medium text-white/70">
              Monthly Budget
            </p>
          </div>

          {/* Main headline */}
          <h2 className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
            {greeting}, you&apos;ve spent{" "}
            {formatCurrency(budget.totalSpent, budget.currency)} of{" "}
            {formatCurrency(budget.totalAllocated, budget.currency)}
          </h2>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 sm:h-4">
              <div
                className="h-full rounded-full bg-white/90 transition-all duration-700 ease-out"
                style={{ width: `${spentPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 sm:text-sm">
              <span>{spentPercent.toFixed(0)}% spent</span>
              <span>
                {formatCurrency(budget.totalAllocated, budget.currency)}
              </span>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-sm font-semibold text-secondary dark:text-white sm:text-base">
              {formatCurrency(remaining, budget.currency)} left this month
            </span>
            <span className="flex items-center gap-1 text-xs text-white/50 sm:text-sm">
              <CalendarBlank className="size-3.5" />
              {daysRemaining} days left in {monthName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmBudgetOverviewCard, WmBudgetOverviewCardSkeleton };
