"use client";

import { useState, useMemo } from "react";
import { TrendUp } from "@phosphor-icons/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatCompactCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";
import type { NetWorthSnapshot } from "@/lib/mock-data";

type Period = "3M" | "6M" | "1Y" | "ALL";

interface WmNetWorthTrendProps {
  data: NetWorthSnapshot[];
  currency: CurrencyCode;
  isLoading?: boolean;
}

function WmNetWorthTrendSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: NetWorthSnapshot;
  }>;
  currency: CurrencyCode;
}

function CustomTooltip({ active, payload, currency }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0]!;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{data.payload.label}</p>
      <p className="text-muted-foreground">
        {formatCurrency(data.value, currency)}
      </p>
    </div>
  );
}

function WmNetWorthTrendEmpty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Net Worth Over Time</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <TrendUp className="size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Your net worth trend will appear here over time as you track your assets.
        </p>
      </CardContent>
    </Card>
  );
}

function WmNetWorthTrend({
  data,
  currency,
  isLoading = false,
}: WmNetWorthTrendProps) {
  const [period, setPeriod] = useState<Period>("1Y");

  const filteredData = useMemo(() => {
    const months: Record<Period, number> = {
      "3M": 3,
      "6M": 6,
      "1Y": 12,
      ALL: data.length,
    };
    const count = months[period];
    return data.slice(-count);
  }, [data, period]);

  if (isLoading) {
    return <WmNetWorthTrendSkeleton />;
  }

  if (!data.length) {
    return <WmNetWorthTrendEmpty />;
  }

  // Coral color for the line
  const strokeColor = "hsl(7.7, 77.1%, 60.6%)";
  const gradientId = "netWorthGradient";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Net Worth Over Time</CardTitle>
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as Period)}
          >
            <TabsList>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="6M">6M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="ALL">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop
                    offset="95%"
                    stopColor={strokeColor}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v: number) =>
                  formatCompactCurrency(v, currency)
                }
                width={70}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    currency={currency}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: strokeColor,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmNetWorthTrend, WmNetWorthTrendSkeleton };
