"use client";

import { cn } from "@/lib/utils";

interface WmProgressBarProps {
  value: number;
  className?: string;
}

export function WmProgressBar({ value, className }: WmProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {Math.round(value)}% complete
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/20">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${value}%`,
            background:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 60%, hsl(var(--accent)) 100%)",
          }}
        />
      </div>
    </div>
  );
}
