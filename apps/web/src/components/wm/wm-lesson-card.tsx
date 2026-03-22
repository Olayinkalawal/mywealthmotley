"use client";

import * as React from "react";
import { Lock, CheckCircle, Clock, FileText, VideoCamera } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/education-content";

// ── Lesson Card ─────────────────────────────────────────────────────

interface WmLessonCardProps {
  lesson: Lesson;
  index?: number;
  isCompleted?: boolean;
  pathColor: string;
  onClick?: (lessonId: string) => void;
}

function WmLessonCard({
  lesson,
  index = 0,
  isCompleted = false,
  pathColor,
  onClick,
}: WmLessonCardProps) {
  const isAccessible = !lesson.isLocked;

  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={() => isAccessible && onClick?.(lesson.id)}
      disabled={!isAccessible}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
        isAccessible
          ? "cursor-pointer border-border bg-card hover:border-border/80 hover:shadow-sm"
          : "cursor-not-allowed border-border/50 bg-muted/30 opacity-70",
      )}
    >
      {/* Status indicator */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: isCompleted
            ? "#5B9A6D18"
            : lesson.isLocked
              ? undefined
              : `${pathColor}18`,
        }}
      >
        {isCompleted ? (
          <CheckCircle className="size-4 text-[#5B9A6D]" />
        ) : lesson.isLocked ? (
          <Lock className="size-3.5 text-muted-foreground" />
        ) : (
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: pathColor }}
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            lesson.isLocked && "text-muted-foreground",
          )}
        >
          {lesson.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            {lesson.duration}
          </span>
          <Badge
            variant="outline"
            className="h-4 gap-0.5 px-1.5 text-[10px]"
          >
            {lesson.type === "video" ? (
              <VideoCamera className="size-2.5" />
            ) : (
              <FileText className="size-2.5" />
            )}
            {lesson.type === "video" ? "Video" : "Article"}
          </Badge>
        </div>
      </div>

      {/* Lock / Premium badge */}
      {lesson.isLocked && (
        <Badge
          variant="outline"
          className="shrink-0 gap-1 border-[#D4A843]/30 bg-[#D4A843]/10 text-[10px] text-[#D4A843]"
        >
          <Lock className="size-2.5" />
          Premium
        </Badge>
      )}
    </motion.button>
  );
}

export { WmLessonCard };
