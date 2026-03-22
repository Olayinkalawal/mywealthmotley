"use client";

import { Heart, TrendDown } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";
import type { BlackTaxSummary } from "@/lib/mock-data";

interface WmBlackTaxSummaryProps {
  summary: BlackTaxSummary;
  currency: string;
  isLoading?: boolean;
}

function WmBlackTaxSummarySkeleton() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(19.6,33.3%,27.1%)] to-[hsl(19.6,33.3%,20%)] dark:from-[hsl(7.7,77.1%,60.6%)] dark:to-[hsl(7.7,60%,45%)]">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40 bg-white/20" />
          <Skeleton className="h-12 w-72 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-36 bg-white/20" />
            <Skeleton className="h-5 w-32 bg-white/20" />
          </div>
          <Skeleton className="h-5 w-48 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}

function getSustainabilityLevel(percentage: number) {
  if (percentage < 15) {
    return {
      label: "Sustainable",
      bgClass: "bg-emerald-500/20",
      textClass: "text-emerald-200",
    };
  }
  if (percentage <= 25) {
    return {
      label: "Watch It",
      bgClass: "bg-amber-500/20",
      textClass: "text-amber-200",
    };
  }
  return {
    label: "Unsustainable",
    bgClass: "bg-red-500/20",
    textClass: "text-red-200",
  };
}

function WmBlackTaxSummary({
  summary,
  currency,
  isLoading = false,
}: WmBlackTaxSummaryProps) {
  if (isLoading) {
    return <WmBlackTaxSummarySkeleton />;
  }

  const sustainability = getSustainabilityLevel(summary.percentageOfIncome);

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(19.6,33.3%,27.1%)] to-[hsl(19.6,33.3%,20%)] dark:from-[hsl(7.7,77.1%,60.6%)] dark:to-[hsl(7.7,60%,45%)]">
      {/* Pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white" />
        <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-white" />
      </div>

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          {/* Label */}
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Heart className="size-4" />
            Family Support This Year
          </p>

          {/* Main number */}
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {formatCurrency(summary.totalThisYear, currency)}
          </h1>

          {/* Stats row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <TrendDown className="size-3.5 text-white/60" />
              <span className="text-sm text-white/70">
                {summary.percentageOfIncome}% of your income
              </span>
            </div>
            <span className="text-sm text-white/50">
              {formatCurrency(summary.monthlyAverage, currency)}/month
            </span>
          </div>

          {/* This month + sustainability */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              {formatCurrency(summary.totalThisMonth, currency)} this month
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${sustainability.bgClass} ${sustainability.textClass}`}
            >
              {sustainability.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmBlackTaxSummary, WmBlackTaxSummarySkeleton };
