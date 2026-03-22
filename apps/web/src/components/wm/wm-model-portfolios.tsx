"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CaretDown, BookOpen, ShieldCheck, Scales, Rocket, GlobeHemisphereWest } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { WmDisclaimer } from "./wm-disclaimer";

// ── Types ───────────────────────────────────────────────────────────
interface Allocation {
  name: string;
  percentage: number;
  color: string;
}

interface ModelPortfolio {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  riskLabel: string;
  allocations: Allocation[];
}

// ── Data ────────────────────────────────────────────────────────────
const PORTFOLIO_COLORS = {
  bonds: "hsl(19.6, 33.3%, 27.1%)",      // Cocoa
  moneyMarket: "hsl(41.8, 62.8%, 54.7%)", // Gold
  blueChips: "hsl(137.1, 25.7%, 48%)",    // Sage green
  usEtfs: "hsl(7.7, 77.1%, 60.6%)",       // Coral
  emerging: "hsl(37.3, 90%, 47.3%)",       // Amber
  crypto: "hsl(280, 50%, 55%)",            // Purple
  ukUsEtfs: "hsl(210, 50%, 55%)",          // Blue
  ngnFixed: "hsl(19.6, 33.3%, 35%)",       // Cocoa light
  reits: "hsl(160, 40%, 50%)",             // Teal
};

const MODEL_PORTFOLIOS: ModelPortfolio[] = [
  {
    id: "conservative",
    name: "The Conservative Saver",
    description: "For learning about low-risk strategies",
    icon: <ShieldCheck className="size-5" />,
    riskLabel: "Low Risk",
    allocations: [
      { name: "Fixed income / bonds", percentage: 70, color: PORTFOLIO_COLORS.bonds },
      { name: "Money market instruments", percentage: 20, color: PORTFOLIO_COLORS.moneyMarket },
      { name: "Large-cap equities", percentage: 10, color: PORTFOLIO_COLORS.blueChips },
    ],
  },
  {
    id: "balanced",
    name: "The Balanced Builder",
    description: "For understanding diversification",
    icon: <Scales className="size-5" />,
    riskLabel: "Medium Risk",
    allocations: [
      { name: "Fixed income / bonds", percentage: 40, color: PORTFOLIO_COLORS.bonds },
      { name: "US large-cap equities", percentage: 30, color: PORTFOLIO_COLORS.usEtfs },
      { name: "Emerging market equities", percentage: 20, color: PORTFOLIO_COLORS.emerging },
      { name: "Digital assets", percentage: 10, color: PORTFOLIO_COLORS.crypto },
    ],
  },
  {
    id: "growth",
    name: "The Growth Explorer",
    description: "For studying growth-oriented strategies",
    icon: <Rocket className="size-5" />,
    riskLabel: "Higher Risk",
    allocations: [
      { name: "US large-cap equities", percentage: 60, color: PORTFOLIO_COLORS.usEtfs },
      { name: "Emerging market equities", percentage: 25, color: PORTFOLIO_COLORS.emerging },
      { name: "Digital assets", percentage: 15, color: PORTFOLIO_COLORS.crypto },
    ],
  },
  {
    id: "diaspora",
    name: "The Diaspora Portfolio",
    description: "For exploring cross-border allocation",
    icon: <GlobeHemisphereWest className="size-5" />,
    riskLabel: "Medium Risk",
    allocations: [
      { name: "International developed equities", percentage: 50, color: PORTFOLIO_COLORS.ukUsEtfs },
      { name: "Nigerian fixed income", percentage: 30, color: PORTFOLIO_COLORS.ngnFixed },
      { name: "Real estate investment trusts", percentage: 20, color: PORTFOLIO_COLORS.reits },
    ],
  },
];

// ── Donut Tooltip ───────────────────────────────────────────────────
interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Allocation;
  }>;
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0]!.payload;
  return (
    <div className="rounded-lg border bg-background px-3 py-1.5 text-xs shadow-lg">
      <p className="font-medium">{data.name}</p>
      <p className="text-muted-foreground">{data.percentage}%</p>
    </div>
  );
}

// ── Single Portfolio Card ───────────────────────────────────────────
function PortfolioCard({ portfolio }: { portfolio: ModelPortfolio }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
            {portfolio.icon}
          </div>
          <Badge variant="outline" className="text-[10px]">
            {portfolio.riskLabel}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-base">{portfolio.name}</CardTitle>
        <CardDescription className="text-xs">
          {portfolio.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {/* Donut chart */}
        <div className="relative mx-auto h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolio.allocations}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="percentage"
                nameKey="name"
                strokeWidth={0}
              >
                {portfolio.allocations.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation legend */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
          {portfolio.allocations.map((alloc) => (
            <div key={alloc.name} className="flex items-center gap-1">
              <div
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: alloc.color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {alloc.name} ({alloc.percentage}%)
              </span>
            </div>
          ))}
        </div>

        {/* Learn More expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-auto flex w-full items-center justify-center gap-1 rounded-md border border-border bg-muted/30 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <BookOpen className="size-3.5" />
          Learn More
          <CaretDown
            className={cn(
              "size-3.5 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 rounded-lg bg-muted/30 p-3 text-xs">
                <p className="font-medium">Allocation Breakdown:</p>
                {portfolio.allocations.map((alloc) => (
                  <div key={alloc.name} className="flex items-center gap-2">
                    <div
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <span className="flex-1">{alloc.name}</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${alloc.percentage}%`,
                          backgroundColor: alloc.color,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium">
                      {alloc.percentage}%
                    </span>
                  </div>
                ))}
                <WmDisclaimer variant="model" className="mt-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always-visible mini disclaimer */}
        {!isExpanded && (
          <p className="text-center text-[10px] text-muted-foreground">
            Educational example only. Not a recommendation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────
function WmModelPortfoliosSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="space-y-4">
            <CardHeader>
              <Skeleton className="size-9 rounded-lg" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <Skeleton className="size-36 rounded-full" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-8 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────
interface WmModelPortfoliosProps {
  isLoading?: boolean;
  className?: string;
}

function WmModelPortfolios({ isLoading = false, className }: WmModelPortfoliosProps) {
  if (isLoading) {
    return <WmModelPortfoliosSkeleton />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h2 className="font-heading text-lg font-semibold">
          Educational Model Portfolios
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore how different allocation strategies work. These are educational examples of how portfolios can be structured, not recommendations.
        </p>
      </div>

      <WmDisclaimer variant="model" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODEL_PORTFOLIOS.map((portfolio) => (
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        ))}
      </div>
    </div>
  );
}

export { WmModelPortfolios, WmModelPortfoliosSkeleton };
