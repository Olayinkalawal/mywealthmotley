"use client";

import { useState } from "react";
import { Info, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  GENERAL_DISCLAIMER,
  PORTFOLIO_DISCLAIMER,
  MARKET_DATA_DISCLAIMER,
  SCREENSHOT_IMPORT_DISCLAIMER,
  NIGERIAN_REGULATORY_NOTICE,
} from "@/lib/disclaimers";
import { Skeleton } from "@/components/ui/skeleton";

type DisclaimerVariant =
  | "general"
  | "calculator"
  | "model"
  | "comparison"
  | "analysis";

interface WmDisclaimerProps {
  variant: DisclaimerVariant;
  className?: string;
  isLoading?: boolean;
}

const DISCLAIMER_TEXT: Record<DisclaimerVariant, string> = {
  general: GENERAL_DISCLAIMER,
  calculator:
    "This calculator is for educational purposes only. " +
    "Projected returns are hypothetical and based on the parameters you set. " +
    "Actual investment returns fluctuate and are never guaranteed. " +
    "Past performance does not predict future results. " +
    "This is not financial advice. Consult a licensed financial adviser before making any investment decisions.",
  model:
    "These model portfolios are fictional examples created for educational purposes. " +
    "They do not constitute investment advice or a recommendation to buy or sell any security. " +
    "Real portfolio construction should account for your personal circumstances, risk tolerance, " +
    "and financial goals. Consult a licensed financial adviser before investing.",
  comparison:
    MARKET_DATA_DISCLAIMER +
    " " +
    "The data shown may be delayed or based on historical averages. " +
    "No ETF or fund is ranked, rated, or presented as superior to another. " +
    "This comparison is purely factual and educational.",
  analysis:
    PORTFOLIO_DISCLAIMER +
    " " +
    NIGERIAN_REGULATORY_NOTICE,
};

function WmDisclaimerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-amber-200/60 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20", className)}>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 shrink-0" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
    </div>
  );
}

function WmDisclaimer({ variant, className, isLoading = false }: WmDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = DISCLAIMER_TEXT[variant];

  if (isLoading) {
    return <WmDisclaimerSkeleton className={className} />;
  }

  // Split into first sentence and the rest
  const firstSentenceEnd = text.indexOf(". ");
  const firstLine =
    firstSentenceEnd > 0 ? text.slice(0, firstSentenceEnd + 1) : text;
  const restOfText =
    firstSentenceEnd > 0 ? text.slice(firstSentenceEnd + 2) : "";

  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200/60 bg-amber-50/50 p-3 transition-all dark:border-amber-900/40 dark:bg-amber-950/20",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <span>{firstLine}</span>
          {restOfText && (
            <>
              {isExpanded && (
                <span className="mt-1 block">{restOfText}</span>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 inline-flex items-center gap-0.5 font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
              >
                {isExpanded ? "Show less" : "Read more"}
                <CaretDown
                  className={cn(
                    "size-3 transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { WmDisclaimer, WmDisclaimerSkeleton };
export type { DisclaimerVariant };
