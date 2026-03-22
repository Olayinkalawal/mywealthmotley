"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Plus,
  MagnifyingGlass,
  ArrowsDownUp,
  FileText,
  Lightbulb,
  Megaphone,
  Eye,
} from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "tip" | "announcement";
  status: "published" | "draft" | "archived";
  author: string;
  date: string;
  excerpt: string;
  body: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_CONTENT: ContentItem[] = [
  {
    id: "1",
    title: "Budgeting 101: Give Every Naira a Job",
    type: "article",
    status: "published",
    author: "Sholz",
    date: "2026-03-10",
    excerpt:
      "Learn the zero-based budgeting method and how to apply it to your Nigerian salary.",
    body: "Zero-based budgeting means every single naira in your paycheck gets assigned a purpose before the month starts. No money is left unaccounted for. This article walks you through a step-by-step approach to implementing this method, from listing your income sources to categorising expenses and tracking progress with WealthMotley's budget tool.",
  },
  {
    id: "2",
    title: "What is an ETF? The Jollof Rice Explanation",
    type: "article",
    status: "published",
    author: "Sholz",
    date: "2026-03-05",
    excerpt:
      "ETFs explained in a way that actually makes sense, using the language of Nigerian food.",
    body: "Imagine you want to try every jollof rice recipe at a party, but you can only buy one plate. An ETF is like a sampler plate -- it gives you a taste of many different investments in one purchase. This article breaks down what ETFs are, how they work, and why they may be a good option for beginner investors in Nigeria and the diaspora.",
  },
  {
    id: "3",
    title: "New Feature: Mo is here!",
    type: "announcement",
    status: "draft",
    author: "Product Team",
    date: "2026-03-15",
    excerpt:
      "Introducing Mo, your personal AI financial assistant powered by cutting-edge LLMs.",
    body: "We are thrilled to announce Mo -- your new AI-powered financial companion. Ask questions about budgeting, saving, investing, and more. Mo understands the Nigerian financial context and can help with everything from planning your salary to understanding pension contributions. Currently in beta for Premium users.",
  },
  {
    id: "4",
    title: "Today's Tip: The 24-hour rule",
    type: "tip",
    status: "published",
    author: "Sholz",
    date: "2026-03-12",
    excerpt:
      "Before making any non-essential purchase over N5,000, wait 24 hours.",
    body: "The 24-hour rule is simple: when you feel the urge to buy something non-essential that costs more than N5,000, wait a full day before making the purchase. You will be surprised how often the urge passes. This single habit can save you tens of thousands of naira each month.",
  },
  {
    id: "5",
    title: "Understanding Your Japa Score",
    type: "article",
    status: "published",
    author: "Sholz",
    date: "2026-02-28",
    excerpt:
      "What your Japa Score means and how to improve your financial readiness for relocation.",
    body: "Your Japa Score is a proprietary metric that measures how financially prepared you are for international relocation. It considers your savings rate, emergency fund status, debt-to-income ratio, and target country cost-of-living. This guide explains each factor and gives actionable tips to improve your score.",
  },
  {
    id: "6",
    title: "Savings Challenge: March Edition",
    type: "announcement",
    status: "published",
    author: "Community",
    date: "2026-03-01",
    excerpt:
      "Join our community savings challenge and save N100,000 by the end of March.",
    body: "The March Savings Challenge is here! Set a goal to save N100,000 this month using WealthMotley's savings tool. Track your progress, earn badges, and compete with other WealthMotley members. Top savers get featured in our newsletter. Sign up now in the app.",
  },
  {
    id: "7",
    title: "How to Read Your Bank Statement Like a Pro",
    type: "article",
    status: "draft",
    author: "Sholz",
    date: "2026-03-14",
    excerpt:
      "Most people never look at their bank statements. Here is why you should and how to do it.",
    body: "Your bank statement tells a story about your financial habits. This article teaches you how to spot recurring charges you forgot about, identify spending patterns, catch errors, and use the information to make better financial decisions. We also show how WealthMotley's transaction categorisation makes this even easier.",
  },
  {
    id: "8",
    title: "Weekend Tip: Automate Your Savings",
    type: "tip",
    status: "archived",
    author: "Sholz",
    date: "2026-01-20",
    excerpt:
      "Set up automatic transfers on payday so you save before you spend.",
    body: "The pay-yourself-first principle works best when automated. Set up a standing order from your salary account to your savings account for the day after payday. Even N10,000 per month adds up to N120,000 per year. WealthMotley can help you track and optimize these automatic savings.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const typeIcons: Record<string, React.ElementType> = {
  article: FileText,
  tip: Lightbulb,
  announcement: Megaphone,
};

const typeColors: Record<string, string> = {
  article: "bg-primary/10 text-primary",
  tip: "bg-accent/15 text-accent-foreground",
  announcement: "bg-secondary/15 text-secondary",
};

const statusColors: Record<string, string> = {
  published: "bg-success/15 text-success",
  draft: "bg-warning/15 text-warning",
  archived: "bg-muted text-muted-foreground",
};

// ---------------------------------------------------------------------------
// Table Columns
// ---------------------------------------------------------------------------

const columns: ColumnDef<ContentItem>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowsDownUp className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="truncate text-sm font-medium">{row.original.title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {row.original.excerpt}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const Icon = typeIcons[row.original.type] as React.ElementType;
      return (
        <Badge variant="outline" className={typeColors[row.original.type]}>
          <Icon className="mr-1 size-3" />
          {row.original.type.charAt(0).toUpperCase() +
            row.original.type.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "all") return true;
      return row.original.type === filterValue;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={statusColors[row.original.status]}>
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "all") return true;
      return row.original.status === filterValue;
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.author}</span>
    ),
  },
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
        <ArrowsDownUp className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.date)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon-sm" title="Preview">
        <Eye className="size-4" />
      </Button>
    ),
  },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-1 h-4 w-72" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content preview sheet
// ---------------------------------------------------------------------------

function ContentPreviewSheet({
  item,
  open,
  onOpenChange,
}: {
  item: ContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;
  const Icon = typeIcons[item.type] as React.ElementType;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={typeColors[item.type]}>
              <Icon className="mr-1 size-3" />
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
            <Badge variant="outline" className={statusColors[item.status]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
          <SheetTitle className="text-lg">{item.title}</SheetTitle>
          <SheetDescription>
            By {item.author} &middot; {formatDate(item.date)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <Separator />
          <div>
            <h4 className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Excerpt
            </h4>
            <p className="text-sm leading-relaxed">{item.excerpt}</p>
          </div>
          <Separator />
          <div>
            <h4 className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Full Content
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {item.body}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminContentPage() {
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<ContentItem | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const table = useReactTable({
    data: MOCK_CONTENT,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      return (
        row.original.title.toLowerCase().includes(search) ||
        row.original.author.toLowerCase().includes(search)
      );
    },
  });

  if (loading) return <ContentSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Content
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage articles, tips, and announcements.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" />
          Create New
        </Button>
      </div>

      {/* MagnifyingGlass + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="MagnifyingGlass by title or author..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("type")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("type")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="tip">Tip</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_CONTENT.filter((c) => c.status === "published").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_CONTENT.filter((c) => c.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Archived</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_CONTENT.filter((c) => c.status === "archived").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedItem(row.original);
                      setSheetOpen(true);
                    }}
                  >
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
                    No content found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Content Preview Sheet */}
      <ContentPreviewSheet
        item={selectedItem}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
