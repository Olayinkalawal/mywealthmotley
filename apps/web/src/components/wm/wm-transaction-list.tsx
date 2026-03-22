"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { format, parseISO, isWithinInterval } from "date-fns";
import {
  MagnifyingGlass,
  CalendarBlank,
  CaretLeft,
  CaretRight,
  ArrowsDownUp,
  CaretUpDown,
  X,
  Check,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCurrency } from "@/lib/currencies";
import { getCategoryById, SPENDING_CATEGORIES } from "@/lib/categories";
import { WmEmptyState } from "@/components/wm/wm-empty-state";
import type { Transaction } from "@/lib/mock-data";
import type { DateRange } from "react-day-picker";

// ── Column definitions ────────────────────────────────────────────────

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowsDownUp className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(parseISO(row.getValue("date")), "MMM d, yyyy")}
      </span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "narration",
    header: "Description",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{row.original.narration}</p>
        {row.original.merchant && (
          <p className="truncate text-xs text-muted-foreground">
            {row.original.merchant}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cat = getCategoryById(row.getValue("category"));
      if (!cat) return <Badge variant="outline">Other</Badge>;
      return (
        <Badge
          variant="outline"
          className="gap-1 border-0 text-xs font-medium"
          style={{
            backgroundColor: `${cat.color}18`,
            color: cat.color,
          }}
        >
          {cat.name}
        </Badge>
      );
    },
    filterFn: (row, id, filterValue: string[]) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowsDownUp className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const amount = Math.abs(row.original.amount);
      return (
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            type === "credit"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-500 dark:text-red-400"
          )}
        >
          {type === "credit" ? "+" : "-"}
          {formatCurrency(amount, "NGN")}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      return Math.abs(rowA.original.amount) - Math.abs(rowB.original.amount);
    },
  },
];

// ── Skeleton ──────────────────────────────────────────────────────────

function WmTransactionListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-40" />
      </div>
      {/* Table skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mobile transaction card ──────────────────────────────────────────

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const cat = getCategoryById(transaction.category);
  const isCredit = transaction.type === "credit";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        {/* Category indicator */}
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
          style={{
            backgroundColor: cat ? `${cat.color}18` : "#94A3B818",
            color: cat?.color ?? "#94A3B8",
          }}
        >
          {(cat?.name ?? "?").charAt(0)}
        </div>

        {/* Description */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{transaction.narration}</p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(transaction.date), "MMM d")}
            {transaction.merchant ? ` \u00B7 ${transaction.merchant}` : ""}
          </p>
        </div>

        {/* Amount */}
        <span
          className={cn(
            "shrink-0 text-sm font-semibold tabular-nums",
            isCredit
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-500 dark:text-red-400"
          )}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(Math.abs(transaction.amount), "NGN")}
        </span>
      </div>
    </motion.div>
  );
}

// ── Category multi-select popover ────────────────────────────────────

function CategoryFilter({
  selected,
  onSelectionChange,
}: {
  selected: string[];
  onSelectionChange: (categories: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const allCategories = [
    { id: "income", name: "Income", color: "#5B9A6D" },
    ...SPENDING_CATEGORIES,
  ];

  const toggleCategory = (categoryId: string) => {
    if (selected.includes(categoryId)) {
      onSelectionChange(selected.filter((c) => c !== categoryId));
    } else {
      onSelectionChange([...selected, categoryId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default" className="gap-2">
          <CaretUpDown className="size-3.5" />
          Category
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2" align="start">
        <div className="max-h-64 space-y-0.5 overflow-y-auto">
          {allCategories.map((cat) => {
            const isSelected = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                  isSelected && "bg-accent"
                )}
              >
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 text-left">{cat.name}</span>
                {isSelected && <Check className="size-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-full text-xs"
              onClick={() => onSelectionChange([])}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Date range picker ────────────────────────────────────────────────

function DateRangeFilter({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default" className="gap-2">
          <CalendarBlank className="size-3.5" />
          {dateRange?.from ? (
            <>
              {format(dateRange.from, "MMM d")}
              {dateRange.to ? ` - ${format(dateRange.to, "MMM d")}` : ""}
            </>
          ) : (
            "Date range"
          )}
          {dateRange && (
            <span
              role="button"
              tabIndex={0}
              className="ml-1 rounded-full hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                onDateRangeChange(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onDateRangeChange(undefined);
                }
              }}
            >
              <X className="size-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={(range) => {
            onDateRangeChange(range);
            if (range?.from && range?.to) {
              setOpen(false);
            }
          }}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}

// ── Empty state ──────────────────────────────────────────────────────

function EmptyState() {
  return (
    <WmEmptyState
      imageSrc="/illustrations/empty-transactions.png"
      title="No transactions yet"
      description="Connect your bank to see your spending."
    />
  );
}

// ── Main component ───────────────────────────────────────────────────

interface WmTransactionListProps {
  transactions: Transaction[];
  currency?: string;
  isLoading?: boolean;
  onSummaryChange?: (summary: {
    totalIncome: number;
    totalExpenses: number;
  }) => void;
}

function WmTransactionList({
  transactions,
  currency = "NGN",
  isLoading = false,
  onSummaryChange,
}: WmTransactionListProps) {
  const isMobile = useIsMobile();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [typeFilter, setTypeFilter] = React.useState<"all" | "income" | "expenses">("all");

  // Apply filters
  const filteredData = React.useMemo(() => {
    let data = [...transactions];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.narration.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      data = data.filter((t) => selectedCategories.includes(t.category));
    }

    // Date range filter
    if (dateRange?.from) {
      data = data.filter((t) => {
        const txDate = parseISO(t.date);
        if (dateRange.to) {
          return isWithinInterval(txDate, {
            start: dateRange.from!,
            end: dateRange.to,
          });
        }
        return txDate >= dateRange.from!;
      });
    }

    // Type filter
    if (typeFilter === "income") {
      data = data.filter((t) => t.type === "credit");
    } else if (typeFilter === "expenses") {
      data = data.filter((t) => t.type === "debit");
    }

    return data;
  }, [transactions, searchQuery, selectedCategories, dateRange, typeFilter]);

  // Compute and report summary
  React.useEffect(() => {
    if (onSummaryChange) {
      const totalIncome = filteredData
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = filteredData
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      onSummaryChange({ totalIncome, totalExpenses });
    }
  }, [filteredData, onSummaryChange]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  if (isLoading) {
    return <WmTransactionListSkeleton />;
  }

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category filter */}
        <CategoryFilter
          selected={selectedCategories}
          onSelectionChange={setSelectedCategories}
        />

        {/* Date range */}
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Type tabs */}
        <Tabs
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
        >
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="income" className="text-xs">
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs">
              Expenses
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active filter badges */}
      {(selectedCategories.length > 0 || dateRange || typeFilter !== "all") && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedCategories.map((catId) => {
            const cat = getCategoryById(catId);
            return (
              <Badge
                key={catId}
                variant="outline"
                className="gap-1 pr-1"
              >
                {cat?.name ?? catId}
                <button
                  onClick={() =>
                    setSelectedCategories((prev) => prev.filter((c) => c !== catId))
                  }
                  className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            );
          })}
          {(selectedCategories.length > 0 || dateRange || typeFilter !== "all") && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setSelectedCategories([]);
                setDateRange(undefined);
                setTypeFilter("all");
                setSearchQuery("");
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      {filteredData.length === 0 ? (
        <EmptyState />
      ) : isMobile ? (
        /* Mobile: Card list */
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {table.getRowModel().rows.map((row) => (
              <TransactionCard
                key={row.original.id}
                transaction={row.original}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Desktop: Table */
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredData.length} transaction{filteredData.length !== 1 ? "s" : ""}
            {pageCount > 1 && ` \u00B7 Page ${pageIndex + 1} of ${pageCount}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <CaretLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <CaretRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { WmTransactionList, WmTransactionListSkeleton };
