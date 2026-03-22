"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/currencies";
import type { Transaction } from "@/lib/mock-data";

interface WmSpendingChartProps {
  transactions: Transaction[];
  totalAllocated: number;
  currency: string;
  isLoading?: boolean;
}

type Period = "this_month" | "last_month" | "3_months";

interface DailyData {
  date: string;
  label: string;
  spending: number;
}

function WmSpendingChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-64 mb-4" />
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

const chartConfig = {
  spending: {
    label: "Daily Spending",
    color: "#E8614D",
  },
} satisfies ChartConfig;

function generateDailyData(
  transactions: Transaction[],
  year: number,
  month: number
): DailyData[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const upToDay = isCurrentMonth
    ? Math.min(today.getDate(), daysInMonth)
    : daysInMonth;

  const dailyMap: Record<string, number> = {};

  for (const txn of transactions) {
    if (txn.type !== "debit") continue;
    const txnDate = new Date(txn.date);
    if (txnDate.getFullYear() !== year || txnDate.getMonth() + 1 !== month)
      continue;
    const day = txnDate.getDate();
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dailyMap[key] = (dailyMap[key] ?? 0) + Math.abs(txn.amount);
  }

  const result: DailyData[] = [];
  for (let d = 1; d <= upToDay; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    result.push({
      date: key,
      label: `${new Date(year, month - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
      spending: dailyMap[key] ?? 0,
    });
  }

  return result;
}

// Generate simulated data for past months
function generateSimulatedData(
  year: number,
  month: number
): DailyData[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: DailyData[] = [];
  const baseAmounts = [
    2000, 5500, 8000, 3200, 15000, 4500, 6700, 12000, 3000, 9500, 2200,
    7800, 4100, 11000, 5600, 3400, 8200, 6900, 4300, 7600, 2800, 9100,
    5200, 14000, 3700, 6100, 4800, 8500, 5300, 10200, 3600,
  ];

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    result.push({
      date: key,
      label: `${new Date(year, month - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
      spending: baseAmounts[(d - 1) % baseAmounts.length]!,
    });
  }

  return result;
}

function WmSpendingChart({
  transactions,
  totalAllocated,
  currency,
  isLoading = false,
}: WmSpendingChartProps) {
  const [period, setPeriod] = useState<Period>("this_month");

  const { data, dailyBudget } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    let chartData: DailyData[];
    let budgetLine: number;

    switch (period) {
      case "last_month": {
        const lmMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lmYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const daysInLm = new Date(lmYear, lmMonth, 0).getDate();
        chartData = generateSimulatedData(lmYear, lmMonth);
        budgetLine = totalAllocated / daysInLm;
        break;
      }
      case "3_months": {
        const allData: DailyData[] = [];
        for (let offset = 2; offset >= 0; offset--) {
          let m = currentMonth - offset;
          let y = currentYear;
          if (m <= 0) {
            m += 12;
            y -= 1;
          }
          if (offset === 0) {
            allData.push(...generateDailyData(transactions, y, m));
          } else {
            allData.push(...generateSimulatedData(y, m));
          }
        }
        chartData = allData;
        budgetLine = totalAllocated / 30;
        break;
      }
      default: {
        const daysInMonth = new Date(
          currentYear,
          currentMonth,
          0
        ).getDate();
        chartData = generateDailyData(
          transactions,
          currentYear,
          currentMonth
        );
        budgetLine = totalAllocated / daysInMonth;
        break;
      }
    }

    return { data: chartData, dailyBudget: budgetLine };
  }, [period, transactions, totalAllocated]);

  if (isLoading) {
    return <WmSpendingChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Spending Trend</CardTitle>
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as Period)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="this_month" className="text-xs px-2.5">
                This Month
              </TabsTrigger>
              <TabsTrigger value="last_month" className="text-xs px-2.5">
                Last Month
              </TabsTrigger>
              <TabsTrigger value="3_months" className="text-xs px-2.5">
                3 Months
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="spendingGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#E8614D"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#E8614D"
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
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
              width={44}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    formatCurrency(value as number, currency)
                  }
                />
              }
            />
            <ReferenceLine
              y={dailyBudget}
              stroke="#D4A843"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `Daily budget: ${formatCurrency(Math.round(dailyBudget), currency)}`,
                position: "insideTopRight",
                fill: "#D4A843",
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#E8614D"
              strokeWidth={2}
              fill="url(#spendingGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#E8614D",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { WmSpendingChart, WmSpendingChartSkeleton };
