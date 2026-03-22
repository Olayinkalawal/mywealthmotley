"use client";

import * as React from "react";
import {
  Shield,
  AirplaneTilt,
  Laptop,
  Confetti,
  Heart,
  Lock,
  DotsThreeOutline,
  PencilSimple,
  Trash,
  CheckCircle,
  GraduationCap,
  DeviceMobile,
  House,
  Wallet,
  Target,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { differenceInDays, parseISO, format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currencies";
import type { SavingsGoal } from "@/lib/mock-data";

// ── Icon mapping ─────────────────────────────────────────────────────

const GOAL_ICONS: Record<string, React.ElementType> = {
  shield: Shield,
  plane: AirplaneTilt,
  laptop: Laptop,
  "party-popper": Confetti,
  heart: Heart,
  "graduation-cap": GraduationCap,
  smartphone: DeviceMobile,
  home: House,
  wallet: Wallet,
  target: Target,
};

// ── Circular progress ring ──────────────────────────────────────────

function CircularProgress({
  percentage,
  color,
  size = 72,
  strokeWidth = 5,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-sm font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────

function WmSavingsGoalCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="size-[72px] rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main component ──────────────────────────────────────────────────

interface WmSavingsGoalCardProps {
  goal: SavingsGoal;
  index?: number;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
}

function WmSavingsGoalCard({
  goal,
  index = 0,
  onEdit,
  onDelete,
}: WmSavingsGoalCardProps) {
  const percentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );
  const isCompleted = percentage >= 100;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const daysRemaining = differenceInDays(
    parseISO(goal.targetDate),
    new Date()
  );
  const Icon = GOAL_ICONS[goal.icon] ?? Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card
        className={`group relative transition-shadow hover:shadow-md ${
          isCompleted
            ? "border-emerald-300 dark:border-emerald-700"
            : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Progress ring */}
            <CircularProgress
              percentage={percentage}
              color={isCompleted ? "#5B9A6D" : goal.color}
            />

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Top: Name + actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${goal.color}18` }}
                  >
                    <Icon
                      className="size-3.5"
                      style={{ color: goal.color }}
                    />
                  </div>
                  <h3 className="truncate text-sm font-semibold">
                    {goal.name}
                  </h3>
                  {isCompleted && (
                    <CheckCircle className="size-4 shrink-0 text-emerald-500" />
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                    >
                      <DotsThreeOutline className="size-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit?.(goal.id)}>
                      <PencilSimple />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete?.(goal.id)}
                    >
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Amounts */}
              <div className="mt-2 space-y-0.5">
                <p className="text-sm">
                  <span className="font-heading font-bold">
                    {formatCurrency(goal.currentAmount, goal.currency)}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    of {formatCurrency(goal.targetAmount, goal.currency)}
                  </span>
                </p>
                {!isCompleted && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(remaining, goal.currency)} remaining
                  </p>
                )}
              </div>

              {/* Target date + lock status */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {!isCompleted && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      daysRemaining <= 30
                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                        : ""
                    }`}
                  >
                    {daysRemaining > 0
                      ? `${daysRemaining} days left`
                      : "Overdue"}
                  </Badge>
                )}
                {isCompleted && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    Goal reached!
                  </Badge>
                )}
                {goal.isLocked && goal.lockUntil && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-amber-200 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                  >
                    <Lock className="size-2.5" />
                    Locked until{" "}
                    {format(parseISO(goal.lockUntil), "MMM d, yyyy")}
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground">
                  Target: {format(parseISO(goal.targetDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { WmSavingsGoalCard, WmSavingsGoalCardSkeleton, CircularProgress };
