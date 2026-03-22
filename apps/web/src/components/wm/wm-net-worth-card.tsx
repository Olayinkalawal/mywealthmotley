"use client";

import { ArrowUpRight, ArrowDownRight, TrendUp, Wallet } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCompactCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";

interface WmNetWorthCardProps {
  totalNetWorth: number;
  primaryCurrency: CurrencyCode;
  secondaryAmount?: number;
  secondaryCurrency?: CurrencyCode;
  exchangeRate?: number;
  changePercent?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
}

function WmNetWorthCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(19.6,33.3%,27.1%)] to-[hsl(19.6,33.3%,20%)] dark:from-[hsl(7.7,77.1%,60.6%)] dark:to-[hsl(7.7,60%,45%)]">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 bg-white/20" />
          <Skeleton className="h-12 w-64 bg-white/20" />
          <Skeleton className="h-5 w-48 bg-white/20" />
          <Skeleton className="h-5 w-40 bg-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}

function WmNetWorthCardEmpty({ primaryCurrency }: { primaryCurrency: CurrencyCode }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(19.6,33.3%,27.1%)] to-[hsl(19.6,33.3%,20%)] dark:from-[hsl(7.7,77.1%,60.6%)] dark:to-[hsl(7.7,60%,45%)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white" />
        <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-white" />
      </div>
      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Wallet className="size-10 text-white/40" />
          <p className="text-sm font-medium text-white/70">Total Net Worth</p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {formatCurrency(0, primaryCurrency)}
          </h1>
          <p className="max-w-xs text-sm text-white/50">
            Add your first asset or connect a bank account to see your net worth here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function WmNetWorthCard({
  totalNetWorth,
  primaryCurrency,
  secondaryAmount,
  secondaryCurrency,
  exchangeRate,
  changePercent,
  isLoading = false,
  isEmpty = false,
}: WmNetWorthCardProps) {
  if (isLoading) {
    return <WmNetWorthCardSkeleton />;
  }

  if (isEmpty || totalNetWorth === 0) {
    return <WmNetWorthCardEmpty primaryCurrency={primaryCurrency} />;
  }

  const effectiveChangePercent = changePercent ?? 0;
  const isPositive = effectiveChangePercent >= 0;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[hsl(19.6,33.3%,27.1%)] to-[hsl(19.6,33.3%,20%)] dark:from-[hsl(7.7,77.1%,60.6%)] dark:to-[hsl(7.7,60%,45%)]">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white" />
        <div className="absolute -left-4 bottom-0 h-32 w-32 rounded-full bg-white" />
      </div>

      <CardContent className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          {/* Label */}
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <TrendUp className="size-4" />
            Total Net Worth
          </p>

          {/* Main number */}
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {formatCurrency(totalNetWorth, primaryCurrency)}
          </h1>

          {/* Secondary currency (only if available) */}
          {secondaryAmount !== undefined && secondaryCurrency && exchangeRate ? (
            <p className="mt-1 text-sm text-white/60 sm:text-base">
              ~{formatCompactCurrency(secondaryAmount, secondaryCurrency)} {secondaryCurrency}{" "}
              <span className="text-xs text-white/40">
                (1 {secondaryCurrency} = {formatCurrency(exchangeRate, primaryCurrency)})
              </span>
            </p>
          ) : null}

          {/* Trend indicator */}
          {changePercent !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isPositive
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                <ChangeIcon className="size-3.5" />
                {Math.abs(effectiveChangePercent).toFixed(1)}%
              </span>
              <span className="text-xs text-white/50">this month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { WmNetWorthCard, WmNetWorthCardSkeleton };
