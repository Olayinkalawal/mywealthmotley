"use client";

import { motion } from "framer-motion";
import { Check, Clock, Lock } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCompactCurrency } from "@/lib/currencies";
import type { JapaMilestone } from "@/lib/mock-data";

interface WmJapaMilestonesProps {
  milestones: JapaMilestone[];
  isLoading?: boolean;
}

function WmJapaMilestonesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

function WmJapaMilestones({
  milestones,
  isLoading = false,
}: WmJapaMilestonesProps) {
  if (isLoading) {
    return <WmJapaMilestonesSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {milestones.map((milestone, index) => {
            const percentage = milestone.targetAmount > 0
              ? Math.round((milestone.currentAmount / milestone.targetAmount) * 100)
              : 0;

            return (
              <motion.div key={milestone.name} variants={itemVariants}>
                <div className="flex gap-4 p-3 rounded-lg">
                  {/* Timeline connector + icon */}
                  <div className="flex flex-col items-center">
                    {/* Status icon */}
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                        milestone.isCompleted
                          ? "bg-success text-success-foreground"
                          : milestone.isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-secondary/15 text-secondary"
                      }`}
                    >
                      {milestone.isCompleted ? (
                        <Check className="size-4" />
                      ) : milestone.isLocked ? (
                        <Lock className="size-3.5" />
                      ) : (
                        <Clock className="size-3.5" />
                      )}
                    </div>
                    {/* Connector line */}
                    {index < milestones.length - 1 && (
                      <div
                        className={`mt-1 w-0.5 flex-1 min-h-4 ${
                          milestone.isCompleted
                            ? "bg-success/30"
                            : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-medium ${
                          milestone.isCompleted
                            ? "text-muted-foreground line-through"
                            : milestone.isLocked
                              ? "text-muted-foreground"
                              : ""
                        }`}
                      >
                        {milestone.name}
                      </h4>
                      {!milestone.isLocked && (
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          {milestone.isCompleted ? "Done" : `${percentage}%`}
                        </span>
                      )}
                    </div>

                    {/* Progress bar for non-locked milestones */}
                    {!milestone.isLocked && (
                      <div className="mt-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                          <motion.div
                            className={`h-full rounded-full ${
                              milestone.isCompleted
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.3 + index * 0.1 }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCompactCurrency(milestone.currentAmount, milestone.currency)} / {formatCompactCurrency(milestone.targetAmount, milestone.currency)}
                        </p>
                      </div>
                    )}

                    {/* Locked message */}
                    {milestone.isLocked && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Complete previous milestones first
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}

export { WmJapaMilestones, WmJapaMilestonesSkeleton };
