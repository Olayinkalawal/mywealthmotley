"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartBar } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { MOCK_ETFS, type ETF } from "@/lib/mock-data";
import { WmDisclaimer } from "./wm-disclaimer";

// ── Chart Colors ────────────────────────────────────────────────────
const ETF_COLORS = [
  "hsl(7.7, 77.1%, 60.6%)",   // Coral
  "hsl(19.6, 33.3%, 27.1%)",  // Cocoa
  "hsl(41.8, 62.8%, 54.7%)",  // Gold
];

// ── Risk Level Bars ─────────────────────────────────────────────────
function RiskBars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-1.5 rounded-sm transition-colors",
            i < level
              ? level <= 2
                ? "bg-success"
                : level <= 3
                  ? "bg-warning"
                  : "bg-destructive"
              : "bg-muted",
          )}
        />
      ))}
      <span className="ml-1.5 text-xs text-muted-foreground">{level}/5</span>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────────────
interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-muted-foreground">
          <span
            className="mr-1.5 inline-block size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value > 0 ? "+" : ""}
          {entry.value}%
        </p>
      ))}
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────
function WmEtfComparisonSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-36" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

// ── Main Component ──────────────────────────────────────────────────
interface WmEtfComparisonProps {
  isLoading?: boolean;
  className?: string;
}

function WmEtfComparison({ isLoading = false, className }: WmEtfComparisonProps) {
  const [selectedTickers, setSelectedTickers] = useState<[string, string, string]>([
    "VOO",
    "VTI",
    "QQQ",
  ]);

  const selectedEtfs = useMemo(
    () =>
      selectedTickers
        .map((ticker) => MOCK_ETFS.find((e) => e.ticker === ticker))
        .filter(Boolean) as ETF[],
    [selectedTickers],
  );

  // Prepare bar chart data
  const chartData = useMemo(() => {
    const periods = [
      { key: "1y", label: "1 Year" },
      { key: "3y", label: "3 Year" },
      { key: "5y", label: "5 Year" },
      { key: "10y", label: "10 Year" },
    ] as const;

    return periods.map((period) => {
      const point: Record<string, string | number> = { period: period.label };
      for (const etf of selectedEtfs) {
        point[etf.ticker] = etf.returns[period.key];
      }
      return point;
    });
  }, [selectedEtfs]);

  const handleTickerChange = (index: number, value: string) => {
    setSelectedTickers((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  if (isLoading) {
    return <WmEtfComparisonSkeleton />;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChartBar className="size-5 text-secondary" />
          ETF Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare ETF facts and historical returns side by side. For educational purposes only.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ETF Selectors */}
        <div className="flex flex-wrap gap-3">
          {selectedTickers.map((ticker, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: ETF_COLORS[index] }}
              />
              <Select
                value={ticker}
                onValueChange={(v) => handleTickerChange(index, v)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ETFS.map((etf) => (
                    <SelectItem key={etf.ticker} value={etf.ticker}>
                      {etf.ticker} - {etf.name.split(" ").slice(0, 3).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {index < selectedTickers.length - 1 && (
                <span className="text-xs text-muted-foreground">vs</span>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          key={selectedTickers.join("-")}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[140px]">Metric</TableHead>
                  {selectedEtfs.map((etf, i) => (
                    <TableHead key={etf.ticker}>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: ETF_COLORS[i] }}
                        />
                        <span className="font-semibold">{etf.ticker}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Name */}
                <TableRow>
                  <TableCell className="font-medium">Full Name</TableCell>
                  {selectedEtfs.map((etf) => (
                    <TableCell key={etf.ticker} className="text-xs">
                      {etf.name}
                    </TableCell>
                  ))}
                </TableRow>
                {/* Expense Ratio */}
                <TableRow>
                  <TableCell className="font-medium">Expense Ratio</TableCell>
                  {selectedEtfs.map((etf) => (
                    <TableCell key={etf.ticker}>
                      {etf.expenseRatio.toFixed(2)}%
                    </TableCell>
                  ))}
                </TableRow>
                {/* Returns */}
                {(["1y", "3y", "5y", "10y"] as const).map((period) => (
                  <TableRow key={period}>
                    <TableCell className="font-medium">
                      {period.toUpperCase()} Return
                    </TableCell>
                    {selectedEtfs.map((etf) => {
                      const val = etf.returns[period];
                      return (
                        <TableCell key={etf.ticker}>
                          <span
                            className={cn(
                              "font-medium",
                              val > 0
                                ? "text-success"
                                : val < 0
                                  ? "text-destructive"
                                  : "text-muted-foreground",
                            )}
                          >
                            {val > 0 ? "+" : ""}
                            {val}%
                          </span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                {/* Dividend Yield */}
                <TableRow>
                  <TableCell className="font-medium">Dividend Yield</TableCell>
                  {selectedEtfs.map((etf) => (
                    <TableCell key={etf.ticker}>{etf.dividendYield}%</TableCell>
                  ))}
                </TableRow>
                {/* Risk Level */}
                <TableRow>
                  <TableCell className="font-medium">Risk Level</TableCell>
                  {selectedEtfs.map((etf) => (
                    <TableCell key={etf.ticker}>
                      <RiskBars level={etf.riskLevel} />
                    </TableCell>
                  ))}
                </TableRow>
                {/* Top Holdings */}
                <TableRow>
                  <TableCell className="font-medium">Top 5 Holdings</TableCell>
                  {selectedEtfs.map((etf) => (
                    <TableCell key={etf.ticker}>
                      <div className="flex flex-wrap gap-1">
                        {etf.topHoldings.map((holding) => (
                          <Badge
                            key={holding}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {holding}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Returns Comparison</h3>
          <motion.div
            key={`chart-${selectedTickers.join("-")}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-56 w-full sm:h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => `${v}%`}
                  width={45}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                />
                {selectedEtfs.map((etf, i) => (
                  <Bar
                    key={etf.ticker}
                    dataKey={etf.ticker}
                    name={etf.ticker}
                    fill={ETF_COLORS[i]}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <WmDisclaimer variant="comparison" />
      </CardContent>
    </Card>
  );
}

export { WmEtfComparison, WmEtfComparisonSkeleton };
