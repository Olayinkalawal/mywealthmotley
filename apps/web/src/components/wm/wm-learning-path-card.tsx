"use client";

import * as React from "react";
import { useState } from "react";
import {
  BookOpen,
  TrendUp,
  GlobeHemisphereWest,
  AirplaneTilt,
  CaretDown,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LearningPath } from "@/lib/education-content";
import { WmLessonCard } from "@/components/wm/wm-lesson-card";

// ── Icon mapping ────────────────────────────────────────────────────

const PATH_ICONS: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "trending-up": TrendUp,
  globe: GlobeHemisphereWest,
  plane: AirplaneTilt,
};

// ── Circular progress ring (reused pattern) ─────────────────────────

function ProgressRing({
  percentage,
  color,
  size = 48,
  strokeWidth = 4,
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-[11px] font-bold">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// ── Learning Path Card ──────────────────────────────────────────────

interface WmLearningPathCardProps {
  path: LearningPath;
  index?: number;
  /** Map of lesson IDs that are completed */
  completedLessons?: Set<string>;
  onLessonClick?: (lessonId: string) => void;
}

function WmLearningPathCard({
  path,
  index = 0,
  completedLessons = new Set<string>(),
  onLessonClick,
}: WmLearningPathCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = PATH_ICONS[path.icon] ?? BookOpen;
  const totalLessons = path.lessons.length;
  const completedCount = path.lessons.filter((l) =>
    completedLessons.has(l.id),
  ).length;
  const progressPercent =
    totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const freeLessons = path.lessons.filter((l) => !l.isLocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="group transition-shadow hover:shadow-md">
        {/* Header - clickable to expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-4">
              {/* Progress ring */}
              <ProgressRing percentage={progressPercent} color={path.color} />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-6 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${path.color}18` }}
                  >
                    <Icon
                      className="size-3.5"
                      style={{ color: path.color }}
                    />
                  </div>
                  <h3 className="truncate font-heading text-sm font-semibold sm:text-base">
                    {path.title}
                  </h3>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                  {path.description}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {completedCount}/{totalLessons} lessons
                  {freeLessons < totalLessons && (
                    <span className="ml-1 text-[#D4A843]">
                      &middot; {freeLessons} free
                    </span>
                  )}
                </p>
              </div>

              {/* Expand chevron */}
              <CaretDown
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-180",
                )}
              />
            </div>
          </CardContent>
        </button>

        {/* Expanded lessons list */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 border-t px-4 pt-4 pb-4 sm:px-5">
                {path.lessons.map((lesson, i) => (
                  <WmLessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={i}
                    isCompleted={completedLessons.has(lesson.id)}
                    pathColor={path.color}
                    onClick={onLessonClick}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export { WmLearningPathCard };
