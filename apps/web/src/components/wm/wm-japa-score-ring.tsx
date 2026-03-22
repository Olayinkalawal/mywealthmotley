"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, CalendarBlank } from "@phosphor-icons/react";

interface WmJapaScoreRingProps {
  score: number;
  destination: string;
  visaType: string;
  estimatedReadyDate: string;
  isLoading?: boolean;
}

function WmJapaScoreRingSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6 sm:p-8">
        <Skeleton className="size-48 rounded-full sm:size-56" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

const VISA_TYPE_LABELS: Record<string, string> = {
  skilled_worker: "Skilled Worker",
  canada_pr: "Permanent Residency",
  us_student: "Student Visa",
  germany_blue_card: "Blue Card",
  uae_work: "Work Visa",
  australia_skilled: "Skilled Migration",
  south_africa_work: "Work Permit",
};

function WmJapaScoreRing({
  score,
  destination,
  visaType,
  estimatedReadyDate,
  isLoading = false,
}: WmJapaScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    // Animate from 0 to score
    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score, isLoading]);

  if (isLoading) {
    return <WmJapaScoreRingSkeleton />;
  }

  // SVG ring calculations
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Color based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return "hsl(137.1, 25.7%, 48%)"; // Sage green
    if (s >= 50) return "hsl(41.8, 62.8%, 54.7%)"; // Gold
    return "hsl(7.7, 77.1%, 60.6%)"; // Coral
  };

  const scoreColor = getScoreColor(score);

  // Format estimated date
  const formatEstimatedDate = (dateStr: string) => {
    try {
      const [year, month] = dateStr.split("-");
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      const monthIndex = parseInt(month ?? "1", 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const visaLabel = VISA_TYPE_LABELS[visaType] ?? visaType.replace(/_/g, " ");

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-6 sm:p-8">
        {/* SVG Ring */}
        <div className="relative">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg]"
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={strokeWidth}
              opacity={0.15}
            />
            {/* Fill */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold sm:text-5xl">
              {animatedScore}
              <span className="text-xl text-muted-foreground">%</span>
            </span>
            <span className="text-xs text-muted-foreground">Japa Ready</span>
          </div>
        </div>

        {/* Destination badge */}
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
          <MapPin className="size-3" />
          {destination} {visaLabel}
        </Badge>

        {/* Estimated ready date */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarBlank className="size-3.5" />
          <span>
            Est. ready: <span className="font-medium text-foreground">{formatEstimatedDate(estimatedReadyDate)}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmJapaScoreRing, WmJapaScoreRingSkeleton };
