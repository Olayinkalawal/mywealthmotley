"use client";

import { useState } from "react";
import {
  House,
  ForkKnife,
  Car,
  WifiHigh,
  UsersThree,
  Confetti,
  Heart,
  Lightning,
  Television,
  CaretDown,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currencies";
import type { BudgetCategory, Transaction } from "@/lib/mock-data";

const ICON_MAP: Record<string, React.ElementType> = {
  home: House,
  utensils: ForkKnife,
  car: Car,
  wifi: WifiHigh,
  users: UsersThree,
  "party-popper": Confetti,
  heart: Heart,
  zap: Lightning,
  tv: Television,
};

interface WmCategoryProgressProps {
  categories: BudgetCategory[];
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

function WmCategoryProgressSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getProgressColor(percent: number): string {
  if (percent > 90) return "#EF4444"; // red
  if (percent > 75) return "#F59E0B"; // amber
  return "#5B9A6D"; // green
}

function CategoryRow({
  category,
  currency,
  transactions,
  index,
}: {
  category: BudgetCategory;
  currency: string;
  transactions: Transaction[];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const percent = Math.min(
    (category.spent / category.allocated) * 100,
    100
  );
  const progressColor = getProgressColor(percent);
  const Icon = ICON_MAP[category.icon] ?? House;
  const categoryTxns = transactions.filter(
    (t) => t.category === category.id
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-2 rounded-lg p-2 transition-colors hover:bg-muted/50">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex size-6 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: `${category.color}18` }}
              >
                <Icon
                  className="size-3.5"
                  style={{ color: category.color }}
                />
              </div>
              <span className="truncate text-sm font-medium">
                {category.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {formatCurrency(category.spent, currency)}{" "}
                <span className="text-muted-foreground/60">
                  / {formatCurrency(category.allocated, currency)}
                </span>
              </span>
              <Badge
                variant="outline"
                className="min-w-[40px] justify-center border-0 px-1.5 py-0 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${progressColor}18`,
                  color: progressColor,
                }}
              >
                {percent.toFixed(0)}%
              </Badge>
              <CaretDown
                className={`size-3.5 text-muted-foreground transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{
                delay: index * 0.06 + 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              style={{ backgroundColor: progressColor }}
            />
          </div>
        </div>
      </button>

      {/* Expanded transactions */}
      <AnimatePresence>
        {expanded && categoryTxns.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-8 space-y-1 pb-2 pt-1">
              {categoryTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between rounded px-2 py-1.5 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-muted-foreground">
                      {txn.narration}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(txn.date).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="ml-2 shrink-0 font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(Math.abs(txn.amount), currency)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WmCategoryProgress({
  categories,
  transactions,
  currency,
  isLoading = false,
}: WmCategoryProgressProps) {
  if (isLoading) {
    return <WmCategoryProgressSkeleton />;
  }

  // Sort by most spent first
  const sorted = [...categories].sort((a, b) => b.spent - a.spent);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Category Budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {sorted.map((cat, i) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              currency={currency}
              transactions={transactions}
              index={i}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { WmCategoryProgress, WmCategoryProgressSkeleton };
