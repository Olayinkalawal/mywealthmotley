"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlackTaxSummary } from "@/lib/mock-data";

const RELATIONSHIP_LABELS: Record<string, string> = {
  mother: "Mother",
  father: "Father",
  sibling: "Siblings",
  extended_family: "Extended Family",
};

const CATEGORY_LABELS: Record<string, string> = {
  general_support: "General Support",
  school_fees: "School Fees",
  medical: "Medical",
  rent: "Rent",
  food: "Food",
};

const CHART_COLORS_LIGHT = [
  "hsl(19.6, 33.3%, 27.1%)", // Cocoa
  "hsl(7.7, 77.1%, 60.6%)",  // Coral
  "hsl(41.8, 62.8%, 54.7%)", // Gold
  "hsl(137.1, 25.7%, 48%)",  // Sage green
  "hsl(37.3, 90%, 47.3%)",   // Amber
  "hsl(210, 40%, 55%)",      // Blue
];

const CHART_COLORS_DARK = [
  "hsl(7.7, 77.1%, 60.6%)",  // Coral (promoted in dark)
  "hsl(19.6, 33.3%, 45%)",   // Lighter cocoa (visible on dark bg)
  "hsl(41.8, 62.8%, 58%)",   // Gold (slightly brighter)
  "hsl(137.1, 30%, 55%)",    // Sage green (brighter)
  "hsl(37.3, 90%, 55%)",     // Amber (brighter)
  "hsl(210, 45%, 65%)",      // Blue (brighter)
];

interface WmBlackTaxBreakdownProps {
  summary: BlackTaxSummary;
  totalAmount: number;
  isLoading?: boolean;
}

function WmBlackTaxBreakdownSkeleton() {
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

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0]!.payload;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{data.name}</p>
      <p className="text-muted-foreground">{data.value}%</p>
    </div>
  );
}

function WmBlackTaxBreakdown({
  summary,
  totalAmount,
  isLoading = false,
}: WmBlackTaxBreakdownProps) {
  const [view, setView] = useState<"relationship" | "category">("relationship");
  const { resolvedTheme } = useTheme();

  if (isLoading) {
    return <WmBlackTaxBreakdownSkeleton />;
  }

  const colors = resolvedTheme === "dark" ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  const dataMap = view === "relationship" ? summary.byRelationship : summary.byCategory;
  const labels = view === "relationship" ? RELATIONSHIP_LABELS : CATEGORY_LABELS;

  const chartData: ChartDataItem[] = Object.entries(dataMap)
    .map(([key, value], index) => ({
      name: labels[key] ?? key,
      value,
      color: colors[index % colors.length]!,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Breakdown</CardTitle>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "relationship" | "category")}
          className="w-auto"
        >
          <TabsList className="h-8">
            <TabsTrigger value="relationship" className="text-xs px-2">
              By Relationship
            </TabsTrigger>
            <TabsTrigger value="category" className="text-xs px-2">
              By Category
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        {/* Donut chart */}
        <div className="relative h-48 w-48 sm:h-56 sm:w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">
              {view === "relationship" ? "People" : "Categories"}
            </p>
            <p className="font-heading text-sm font-bold sm:text-base">
              {Object.keys(dataMap).length}
            </p>
          </div>
        </div>

        {/* Legend with amounts */}
        <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-xs font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { WmBlackTaxBreakdown, WmBlackTaxBreakdownSkeleton };
