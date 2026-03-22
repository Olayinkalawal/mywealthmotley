"use client";

import { ArrowUpRight, ArrowDownRight, CurrencyDollar, CreditCard, PiggyBank, Percent } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";

interface KpiItem {
  label: string;
  value: number;
  currency: string;
  icon: React.ElementType;
  trend?: number; // percentage change vs last month
  isRate?: boolean; // if true, display as percentage instead of currency
  iconColor: string;
  iconBgColor: string;
}

interface WmBudgetKpiRowProps {
  income: number;
  spent: number;
  saved: number;
  savingsRate: number;
  currency: string;
  spentTrend?: number;
  savingsRateTrend?: number;
  isLoading?: boolean;
}

function WmBudgetKpiRowSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4 sm:pb-0">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="min-w-[160px] flex-1">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KpiCard({ item }: { item: KpiItem }) {
  const Icon = item.icon;
  const hasTrend = item.trend !== undefined && item.trend !== 0;
  const isPositiveTrend = (item.trend ?? 0) > 0;

  return (
    <Card className="min-w-[155px] flex-1">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          {/* Icon + Label */}
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: item.iconBgColor }}
            >
              <Icon className="size-4" style={{ color: item.iconColor }} />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {item.label}
            </span>
          </div>

          {/* Value */}
          <p className="font-heading text-lg font-bold sm:text-xl">
            {item.isRate
              ? `${item.value.toFixed(1)}%`
              : formatCurrency(item.value, item.currency)}
          </p>

          {/* Trend */}
          {hasTrend && (
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  isPositiveTrend
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {isPositiveTrend ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {Math.abs(item.trend!).toFixed(1)}%
              </span>
              <span className="text-[10px] text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WmBudgetKpiRow({
  income,
  spent,
  saved,
  savingsRate,
  currency,
  spentTrend,
  savingsRateTrend,
  isLoading = false,
}: WmBudgetKpiRowProps) {
  if (isLoading) {
    return <WmBudgetKpiRowSkeleton />;
  }

  const items: KpiItem[] = [
    {
      label: "Income",
      value: income,
      currency,
      icon: CurrencyDollar,
      iconColor: "#5B9A6D",
      iconBgColor: "rgba(91, 154, 109, 0.12)",
    },
    {
      label: "Spent",
      value: spent,
      currency,
      icon: CreditCard,
      trend: spentTrend,
      iconColor: "#E8614D",
      iconBgColor: "rgba(232, 97, 77, 0.12)",
    },
    {
      label: "Saved",
      value: saved,
      currency,
      icon: PiggyBank,
      iconColor: "#D4A843",
      iconBgColor: "rgba(212, 168, 67, 0.12)",
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      currency,
      icon: Percent,
      trend: savingsRateTrend,
      isRate: true,
      iconColor: "#8B6B5A",
      iconBgColor: "rgba(139, 107, 90, 0.12)",
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}

export { WmBudgetKpiRow, WmBudgetKpiRowSkeleton };
