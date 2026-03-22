"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowsDownUp, MagnifyingGlass, CaretLeft, CaretRight } from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currencies";
import { getCategoryName, getCategoryColor } from "@/lib/categories";
import type { Transaction } from "@/lib/mock-data";

interface WmTransactionTableProps {
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

function WmTransactionTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-48 flex-1" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile transaction card
function MobileTransactionCard({
  transaction,
  currency,
}: {
  transaction: Transaction;
  currency: string;
}) {
  const isCredit = transaction.type === "credit";
  const categoryColor = getCategoryColor(transaction.category);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.narration}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <Badge
            variant="outline"
            className="border-0 px-1.5 py-0 text-[10px]"
            style={{
              backgroundColor: `${categoryColor}18`,
              color: categoryColor,
            }}
          >
            {getCategoryName(transaction.category)}
          </Badge>
        </div>
      </div>
      <span
        className={`shrink-0 font-heading text-sm font-bold ${
          isCredit
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {isCredit ? "+" : ""}
        {formatCurrency(Math.abs(transaction.amount), currency)}
      </span>
    </div>
  );
}

function WmTransactionTable({
  transactions,
  currency,
  isLoading = false,
}: WmTransactionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories from transactions
  const uniqueCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  // Pre-filter by category
  const filteredData = useMemo(() => {
    if (categoryFilter === "all") return transactions;
    return transactions.filter((t) => t.category === categoryFilter);
  }, [transactions, categoryFilter]);

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Date
            <ArrowsDownUp className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) =>
          new Date(row.getValue("date") as string).toLocaleDateString(
            "en-NG",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          ),
      },
      {
        accessorKey: "narration",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[280px]">
            <p className="truncate text-sm font-medium">
              {row.getValue("narration") as string}
            </p>
            {row.original.merchant && (
              <p className="truncate text-xs text-muted-foreground">
                {row.original.merchant}
              </p>
            )}
          </div>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const cat = row.getValue("category") as string;
          const color = getCategoryColor(cat);
          return (
            <Badge
              variant="outline"
              className="border-0 text-[11px]"
              style={{
                backgroundColor: `${color}18`,
                color,
              }}
            >
              {getCategoryName(cat)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 text-xs"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Amount
            <ArrowsDownUp className="ml-1 size-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = row.getValue("amount") as number;
          const isCredit = amount > 0;
          return (
            <span
              className={`font-heading text-sm font-bold ${
                isCredit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isCredit ? "+" : ""}
              {formatCurrency(Math.abs(amount), currency)}
            </span>
          );
        },
      },
    ],
    [currency]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: "includesString",
  });

  if (isLoading) {
    return <WmTransactionTableSkeleton />;
  }

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {uniqueCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {getCategoryName(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile card layout */}
        <div className="space-y-2 sm:hidden">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <MobileTransactionCard
                key={row.id}
                transaction={row.original}
                currency={currency}
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No transactions found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Page {pageIndex + 1} of {pageCount}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <CaretLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <CaretRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { WmTransactionTable, WmTransactionTableSkeleton };
