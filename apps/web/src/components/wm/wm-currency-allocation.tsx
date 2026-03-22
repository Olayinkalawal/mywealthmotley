"use client";

import { GlobeHemisphereWest } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";
import type { CurrencyAllocation } from "@/lib/mock-data";

interface WmCurrencyAllocationProps {
  allocations: CurrencyAllocation[];
  primaryCurrency: CurrencyCode;
  isLoading?: boolean;
}

function WmCurrencyAllocationSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-full rounded-full" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-28" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WmCurrencyAllocationEmpty() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Currency Allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <GlobeHemisphereWest className="size-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Your currency spread will appear here once you add assets
        </p>
      </CardContent>
    </Card>
  );
}

function WmCurrencyAllocation({
  allocations,
  primaryCurrency,
  isLoading = false,
}: WmCurrencyAllocationProps) {
  if (isLoading) {
    return <WmCurrencyAllocationSkeleton />;
  }

  if (!allocations.length) {
    return <WmCurrencyAllocationEmpty />;
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Currency Allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-5">
        {/* Stacked bar */}
        <TooltipProvider>
          <div className="flex h-7 w-full overflow-hidden rounded-full">
            {allocations.map((alloc) => (
              <Tooltip key={alloc.currency}>
                <TooltipTrigger asChild>
                  <div
                    className="relative flex h-full cursor-pointer items-center justify-center transition-opacity hover:opacity-90"
                    style={{
                      width: `${Math.max(alloc.percentage, 2)}%`,
                      backgroundColor: alloc.color,
                    }}
                  >
                    {alloc.percentage >= 12 && (
                      <span className="text-[10px] font-bold text-white sm:text-xs">
                        {alloc.currency}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-center">
                    <p className="font-semibold">
                      {alloc.currency} &mdash; {alloc.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs opacity-70">
                      {formatCurrency(alloc.value, alloc.currency)}
                    </p>
                    <p className="text-xs opacity-50">
                      = {formatCurrency(alloc.convertedValue, primaryCurrency)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {allocations.map((alloc) => (
            <div key={alloc.currency} className="flex items-center gap-1.5">
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: alloc.color }}
              />
              <span className="text-xs font-semibold">
                {alloc.currency}
              </span>
              <span className="text-xs text-muted-foreground">
                {alloc.percentage.toFixed(0)}%
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                ({formatCurrency(alloc.value, alloc.currency)})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { WmCurrencyAllocation, WmCurrencyAllocationSkeleton };
