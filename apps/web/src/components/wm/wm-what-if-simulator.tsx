"use client";

import { useState, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendUp, Calculator, Coins } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatCompactCurrency, getCurrencySymbol } from "@/lib/currencies";
import { WmDisclaimer } from "./wm-disclaimer";

// ── Types ───────────────────────────────────────────────────────────
type SimCurrency = "NGN" | "USD";

interface ProjectionPoint {
  year: number;
  label: string;
  contributions: number;
  projected: number;
  optimistic: number;
  pessimistic: number;
}

// ── Helpers ─────────────────────────────────────────────────────────
const NGN_TO_USD = 1 / 1550;
const USD_TO_NGN = 1550;

function computeProjections(
  monthlyInvestment: number,
  years: number,
  annualReturn: number,
  currency: SimCurrency,
): ProjectionPoint[] {
  const monthlyRate = annualReturn / 100 / 12;
  const optimisticRate = (annualReturn + 3) / 100 / 12;
  const pessimisticRate = Math.max(0, annualReturn - 3) / 100 / 12;
  const points: ProjectionPoint[] = [];

  // Always include year 0
  points.push({
    year: 0,
    label: "Now",
    contributions: 0,
    projected: 0,
    optimistic: 0,
    pessimistic: 0,
  });

  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const totalContributions = monthlyInvestment * months;

    // Future value of annuity: P * ((1+r)^n - 1) / r
    const fvBase =
      monthlyRate > 0
        ? monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : totalContributions;
    const fvOpt =
      optimisticRate > 0
        ? monthlyInvestment * ((Math.pow(1 + optimisticRate, months) - 1) / optimisticRate)
        : totalContributions;
    const fvPess =
      pessimisticRate > 0
        ? monthlyInvestment * ((Math.pow(1 + pessimisticRate, months) - 1) / pessimisticRate)
        : totalContributions;

    const convert = currency === "USD" ? NGN_TO_USD : 1;

    points.push({
      year: y,
      label: `Year ${y}`,
      contributions: Math.round(totalContributions * convert),
      projected: Math.round(fvBase * convert),
      optimistic: Math.round(fvOpt * convert),
      pessimistic: Math.round(fvPess * convert),
    });
  }
  return points;
}

function getRelatableContext(amountNGN: number): string {
  if (amountNGN >= 10_000_000) return "a solid house deposit in Lagos";
  if (amountNGN >= 5_000_000) return "a brand new Toyota Corolla";
  if (amountNGN >= 2_000_000) return "a year of rent in a nice Lagos apartment";
  if (amountNGN >= 1_000_000) return "a full Master's degree tuition";
  return "a great start to building your financial future";
}

function formatSliderValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

// ── Custom Tooltip ──────────────────────────────────────────────────
interface SimTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
  currency: SimCurrency;
}

function SimTooltip({ active, payload, label, currency }: SimTooltipProps) {
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
          {entry.dataKey === "contributions"
            ? "Your Contributions"
            : entry.dataKey === "projected"
              ? "Projected Growth"
              : entry.dataKey === "optimistic"
                ? "Optimistic"
                : "Pessimistic"}
          : {formatCurrency(entry.value, currency)}
        </p>
      ))}
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────
function WmWhatIfSimulatorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

// ── Main Component ──────────────────────────────────────────────────
interface WmWhatIfSimulatorProps {
  isLoading?: boolean;
  className?: string;
}

function WmWhatIfSimulator({ isLoading = false, className }: WmWhatIfSimulatorProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(50_000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [currency, setCurrency] = useState<SimCurrency>("NGN");

  const projections = useMemo(
    () => computeProjections(monthlyInvestment, years, annualReturn, currency),
    [monthlyInvestment, years, annualReturn, currency],
  );

  const finalPoint = projections[projections.length - 1];
  const finalProjected = finalPoint?.projected ?? 0;
  const finalContributions = finalPoint?.contributions ?? 0;
  const growthAmount = finalProjected - finalContributions;

  // For relatable context, always compute in NGN
  const amountInNGN =
    currency === "USD" ? finalProjected * USD_TO_NGN : finalProjected;
  const relatableContext = getRelatableContext(amountInNGN);

  const handleCurrencyToggle = useCallback(() => {
    setCurrency((prev) => (prev === "NGN" ? "USD" : "NGN"));
  }, []);

  if (isLoading) {
    return <WmWhatIfSimulatorSkeleton />;
  }

  // Chart colors
  const projectedColor = "hsl(7.7, 77.1%, 60.6%)"; // Coral
  const contributionsColor = "hsl(19.6, 33.3%, 27.1%)"; // Cocoa
  const bandColor = "hsl(41.8, 62.8%, 54.7%)"; // Gold

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="size-5 text-secondary" />
              What-If Investment Simulator
            </CardTitle>
            <CardDescription>
              Explore how consistent investing could grow your money over time
            </CardDescription>
          </div>
          <button
            onClick={handleCurrencyToggle}
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Coins className="size-3.5" />
            {currency === "NGN" ? "Switch to USD" : "Switch to NGN"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sliders */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Monthly Investment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Monthly Investment</label>
              <Badge variant="outline" className="font-mono text-xs">
                {getCurrencySymbol(currency)}
                {formatSliderValue(
                  currency === "NGN"
                    ? monthlyInvestment
                    : Math.round(monthlyInvestment * NGN_TO_USD),
                )}
              </Badge>
            </div>
            <Slider
              value={[monthlyInvestment]}
              onValueChange={(v) => setMonthlyInvestment(v[0]!)}
              min={10_000}
              max={500_000}
              step={5_000}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatCompactCurrency(currency === "NGN" ? 10000 : 6, currency)}</span>
              <span>{formatCompactCurrency(currency === "NGN" ? 500000 : 323, currency)}</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Time Horizon</label>
              <Badge variant="outline" className="font-mono text-xs">
                {years} {years === 1 ? "year" : "years"}
              </Badge>
            </div>
            <Slider
              value={[years]}
              onValueChange={(v) => setYears(v[0]!)}
              min={1}
              max={30}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Expected Return</label>
              <Badge variant="outline" className="font-mono text-xs">
                {annualReturn}% p.a.
              </Badge>
            </div>
            <Slider
              value={[annualReturn]}
              onValueChange={(v) => setAnnualReturn(v[0]!)}
              min={1}
              max={20}
              step={0.5}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <motion.div
          key={`${monthlyInvestment}-${years}-${annualReturn}-${currency}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-72 w-full sm:h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={projections}
              margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
            >
              <defs>
                <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={projectedColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={projectedColor} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={bandColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={bandColor} stopOpacity={0.02} />
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
                width={75}
              />
              <Tooltip
                content={<SimTooltip currency={currency} />}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    contributions: "Your Contributions",
                    projected: "Projected Growth",
                    optimistic: "Optimistic (+3%)",
                    pessimistic: "Pessimistic (-3%)",
                  };
                  return labels[value] ?? value;
                }}
              />
              {/* Confidence band - optimistic */}
              <Area
                type="monotone"
                dataKey="optimistic"
                stroke={bandColor}
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="url(#bandGrad)"
                dot={false}
                activeDot={false}
              />
              {/* Confidence band - pessimistic */}
              <Area
                type="monotone"
                dataKey="pessimistic"
                stroke={bandColor}
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="transparent"
                dot={false}
                activeDot={false}
              />
              {/* Projected growth */}
              <Area
                type="monotone"
                dataKey="projected"
                stroke={projectedColor}
                strokeWidth={2.5}
                fill="url(#projectedGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: projectedColor,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
              {/* Contributions (straight line) */}
              <Area
                type="monotone"
                dataKey="contributions"
                stroke={contributionsColor}
                strokeWidth={2}
                fill="transparent"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: contributionsColor,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`result-${monthlyInvestment}-${years}-${annualReturn}-${currency}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-accent/5 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <TrendUp className="size-5 text-secondary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    After{" "}
                    <span className="font-semibold text-foreground">
                      {years} {years === 1 ? "year" : "years"}
                    </span>
                    , your{" "}
                    <span className="font-semibold text-foreground">
                      {formatCurrency(
                        currency === "NGN"
                          ? monthlyInvestment
                          : Math.round(monthlyInvestment * NGN_TO_USD),
                        currency,
                      )}
                      /month
                    </span>{" "}
                    could grow to:
                  </p>
                  <p className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    {formatCurrency(finalProjected, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total contributed:{" "}
                    {formatCurrency(finalContributions, currency)} | Growth:{" "}
                    {formatCurrency(growthAmount, currency)}
                  </p>
                  <div className="mt-2 rounded-md bg-accent/10 px-3 py-2">
                    <p className="text-sm font-medium text-accent-foreground">
                      That&apos;s about {formatCompactCurrency(amountInNGN, "NGN")}{" "}
                      &mdash; enough for {relatableContext}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Disclaimer */}
        <WmDisclaimer variant="calculator" />
      </CardContent>
    </Card>
  );
}

export { WmWhatIfSimulator, WmWhatIfSimulatorSkeleton };
