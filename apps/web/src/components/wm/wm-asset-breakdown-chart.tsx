"use client";

import { ChartPie as PieChartIcon } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCompactCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";
import type { AssetBreakdown } from "@/lib/mock-data";

interface WmAssetBreakdownChartProps {
  breakdown: AssetBreakdown[];
  totalNetWorth: number;
  currency: CurrencyCode;
  isLoading?: boolean;
}

function WmAssetBreakdownChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="flex w-full flex-wrap justify-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: AssetBreakdown & { currency: CurrencyCode };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0]!.payload;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{data.label}</p>
      <p className="text-muted-foreground">
        {formatCurrency(data.value, data.currency)} ({data.percentage.toFixed(1)}%)
      </p>
      <p className="text-xs text-muted-foreground">
        {data.items} {data.items === 1 ? "account" : "accounts"}
      </p>
    </div>
  );
}

function WmAssetBreakdownChartEmpty() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Asset Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <PieChartIcon className="size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Add assets to see your portfolio breakdown
        </p>
      </CardContent>
    </Card>
  );
}

function WmAssetBreakdownChart({
  breakdown,
  totalNetWorth,
  currency,
  isLoading = false,
}: WmAssetBreakdownChartProps) {
  if (isLoading) {
    return <WmAssetBreakdownChartSkeleton />;
  }

  if (!breakdown.length) {
    return <WmAssetBreakdownChartEmpty />;
  }

  // Add currency to each item for tooltip
  const dataWithCurrency = breakdown.map((item) => ({
    ...item,
    currency,
  }));

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Asset Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        {/* Donut chart */}
        <div className="relative h-48 w-48 sm:h-56 sm:w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithCurrency}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                nameKey="label"
                strokeWidth={0}
              >
                {dataWithCurrency.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-heading text-sm font-bold sm:text-base">
              {formatCompactCurrency(totalNetWorth, currency)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2">
          {breakdown.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span className="text-xs font-medium">
                {formatCompactCurrency(item.value, currency)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { WmAssetBreakdownChart, WmAssetBreakdownChartSkeleton };
