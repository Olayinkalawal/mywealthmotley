"use client";

import { ArrowUpRight, ArrowDownRight, TrendUp, TrendDown } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";

interface WmTransactionSummaryBarProps {
  totalIncome: number;
  totalExpenses: number;
  currency: string;
  isLoading?: boolean;
}

function WmTransactionSummaryBarSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WmTransactionSummaryBar({
  totalIncome,
  totalExpenses,
  currency,
  isLoading = false,
}: WmTransactionSummaryBarProps) {
  if (isLoading) {
    return <WmTransactionSummaryBarSkeleton />;
  }

  const net = totalIncome - totalExpenses;
  const isPositiveNet = net >= 0;

  const items = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: ArrowUpRight,
      iconColor: "#5B9A6D",
      iconBgColor: "rgba(91, 154, 109, 0.12)",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      icon: ArrowDownRight,
      iconColor: "#E8614D",
      iconBgColor: "rgba(232, 97, 77, 0.12)",
      valueColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Net (this period)",
      value: Math.abs(net),
      prefix: isPositiveNet ? "+" : "-",
      icon: isPositiveNet ? TrendUp : TrendDown,
      iconColor: isPositiveNet ? "#5B9A6D" : "#E8614D",
      iconBgColor: isPositiveNet
        ? "rgba(91, 154, 109, 0.12)"
        : "rgba(232, 97, 77, 0.12)",
      valueColor: isPositiveNet
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: item.iconBgColor }}
                >
                  <Icon className="size-5" style={{ color: item.iconColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className={`font-heading text-lg font-bold ${item.valueColor}`}>
                    {item.prefix ?? ""}
                    {formatCurrency(item.value, currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export { WmTransactionSummaryBar, WmTransactionSummaryBarSkeleton };
