"use client";

import { format, parseISO } from "date-fns";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";
import type { BlackTaxEntry } from "@/lib/mock-data";

const CATEGORY_LABELS: Record<string, string> = {
  general_support: "Support",
  school_fees: "School Fees",
  medical: "Medical",
  rent: "Rent",
  food: "Food",
};

const CATEGORY_COLORS: Record<string, string> = {
  general_support: "bg-[hsl(19.6,33.3%,27.1%)]/10 text-[hsl(19.6,33.3%,27.1%)] dark:bg-[hsl(7.7,77.1%,60.6%)]/15 dark:text-[hsl(7.7,77.1%,70%)]",
  school_fees: "bg-[hsl(41.8,62.8%,54.7%)]/15 text-[hsl(41.8,62.8%,40%)] dark:text-[hsl(41.8,62.8%,64.7%)]",
  medical: "bg-[hsl(137.1,25.7%,48%)]/15 text-[hsl(137.1,25.7%,35%)] dark:text-[hsl(137.1,25.7%,58%)]",
  rent: "bg-[hsl(7.7,77.1%,60.6%)]/15 text-[hsl(7.7,77.1%,45%)] dark:text-[hsl(7.7,77.1%,70%)]",
  food: "bg-[hsl(37.3,90%,47.3%)]/15 text-[hsl(37.3,90%,35%)] dark:text-[hsl(37.3,90%,57.3%)]",
};

interface WmBlackTaxTimelineProps {
  entries: BlackTaxEntry[];
  currency: string;
  isLoading?: boolean;
  onEdit?: (entry: BlackTaxEntry) => void;
  onDelete?: (entryId: string) => void;
}

function WmBlackTaxTimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function groupByMonth(entries: BlackTaxEntry[]): Map<string, BlackTaxEntry[]> {
  const groups = new Map<string, BlackTaxEntry[]>();
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const entry of sorted) {
    const monthKey = entry.date.slice(0, 7); // "2026-03"
    const existing = groups.get(monthKey);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(monthKey, [entry]);
    }
  }

  return groups;
}

function formatMonthLabel(monthKey: string): string {
  try {
    const date = parseISO(`${monthKey}-01`);
    return format(date, "MMMM yyyy");
  } catch {
    return monthKey;
  }
}

function WmBlackTaxTimeline({
  entries,
  currency,
  isLoading = false,
  onEdit,
  onDelete,
}: WmBlackTaxTimelineProps) {
  if (isLoading) {
    return <WmBlackTaxTimelineSkeleton />;
  }

  const grouped = groupByMonth(entries);

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No entries yet.</p>
          <p className="text-sm text-muted-foreground">
            Start tracking your family support to see the full picture.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from(grouped.entries()).map(([monthKey, monthEntries]) => (
          <div key={monthKey}>
            {/* Month header */}
            <p className="mb-3 text-sm font-semibold text-muted-foreground">
              {formatMonthLabel(monthKey)}
            </p>

            {/* Entries for this month */}
            <div className="space-y-3">
              {monthEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar circle */}
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {entry.recipientName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {entry.recipientName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] border-0 ${
                            CATEGORY_COLORS[entry.category] ?? ""
                          }`}
                        >
                          {CATEGORY_LABELS[entry.category] ?? entry.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(entry.date), "d MMM yyyy")}
                        {entry.note ? ` -- ${entry.note}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    <span className="text-sm font-semibold">
                      {formatCurrency(entry.amount, currency)}
                    </span>

                    {/* Actions - visible on hover */}
                    <div className="hidden items-center gap-0.5 group-hover:flex">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEdit(entry)}
                          aria-label={`Edit ${entry.recipientName}`}
                        >
                          <PencilSimple className="size-3" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onDelete(entry.id)}
                          aria-label={`Delete ${entry.recipientName}`}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { WmBlackTaxTimeline, WmBlackTaxTimelineSkeleton };
