"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  TrendUp,
  TrendDown,
  CurrencyDollar,
  CreditCard,
  Warning,
  ArrowsClockwise,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import { PieChart, Pie, Cell } from "recharts";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Transaction {
  id: string;
  date: string;
  userName: string;
  amount: number;
  currency: string;
  provider: "paystack" | "stripe";
  status: "success" | "failed" | "pending";
}

interface FailedPayment {
  id: string;
  userName: string;
  amount: string;
  date: string;
  reason: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const REVENUE_KPIS = [
  {
    label: "MRR",
    value: "\u20A6444,111",
    trend: +15.4,
    icon: CurrencyDollar,
    description: "Monthly recurring revenue",
  },
  {
    label: "ARR",
    value: "\u20A65,329,332",
    trend: +18.2,
    icon: TrendUp,
    description: "Annual recurring revenue",
  },
  {
    label: "ARPU",
    value: "\u20A64,999",
    trend: +3.1,
    icon: CreditCard,
    description: "Average revenue per user",
  },
  {
    label: "Churn MRR",
    value: "\u20A624,995",
    trend: -8.5,
    icon: TrendDown,
    description: "Lost monthly revenue",
  },
];

const REVENUE_BY_PLAN = [
  { name: "Pro", value: 80, amount: "\u20A6355,920", fill: "hsl(19.6 33.3% 27.1%)" },
  { name: "Premium", value: 20, amount: "\u20A688,191", fill: "hsl(7.7 77.1% 60.6%)" },
];

const planChartConfig = {
  Pro: { label: "Pro", color: "hsl(19.6 33.3% 27.1%)" },
  Premium: { label: "Premium", color: "hsl(7.7 77.1% 60.6%)" },
} satisfies ChartConfig;

const REVENUE_BY_CURRENCY = [
  { name: "NGN", value: 72, fill: "hsl(19.6 33.3% 27.1%)" },
  { name: "GBP", value: 22, fill: "hsl(7.7 77.1% 60.6%)" },
  { name: "USD", value: 6, fill: "hsl(41.8 62.8% 54.7%)" },
];

const currencyChartConfig = {
  NGN: { label: "NGN", color: "hsl(19.6 33.3% 27.1%)" },
  GBP: { label: "GBP", color: "hsl(7.7 77.1% 60.6%)" },
  USD: { label: "USD", color: "hsl(41.8 62.8% 54.7%)" },
} satisfies ChartConfig;

const PROVIDER_SPLIT = [
  { name: "Paystack", value: 72, fill: "hsl(137.1 25.7% 48%)" },
  { name: "Stripe", value: 28, fill: "hsl(37.3 90% 47.3%)" },
];

const providerChartConfig = {
  Paystack: { label: "Paystack", color: "hsl(137.1 25.7% 48%)" },
  Stripe: { label: "Stripe", color: "hsl(37.3 90% 47.3%)" },
} satisfies ChartConfig;

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    date: "2026-03-18",
    userName: "Fatima Bello",
    amount: 4999,
    currency: "NGN",
    provider: "paystack",
    status: "success",
  },
  {
    id: "txn_002",
    date: "2026-03-18",
    userName: "Sarah Whitfield",
    amount: 9.99,
    currency: "GBP",
    provider: "stripe",
    status: "success",
  },
  {
    id: "txn_003",
    date: "2026-03-17",
    userName: "Tunde Adesanya",
    amount: 9999,
    currency: "NGN",
    provider: "paystack",
    status: "success",
  },
  {
    id: "txn_004",
    date: "2026-03-17",
    userName: "Rachel Morrison",
    amount: 4.99,
    currency: "GBP",
    provider: "stripe",
    status: "success",
  },
  {
    id: "txn_005",
    date: "2026-03-16",
    userName: "Chinedu Eze",
    amount: 4999,
    currency: "NGN",
    provider: "paystack",
    status: "success",
  },
  {
    id: "txn_006",
    date: "2026-03-16",
    userName: "Adaeze Okafor",
    amount: 4999,
    currency: "NGN",
    provider: "paystack",
    status: "failed",
  },
  {
    id: "txn_007",
    date: "2026-03-15",
    userName: "David Osei",
    amount: 25,
    currency: "USD",
    provider: "stripe",
    status: "success",
  },
  {
    id: "txn_008",
    date: "2026-03-14",
    userName: "Olayinka Lawal",
    amount: 9.99,
    currency: "GBP",
    provider: "stripe",
    status: "success",
  },
  {
    id: "txn_009",
    date: "2026-03-14",
    userName: "Grace Adeyemi",
    amount: 4999,
    currency: "NGN",
    provider: "paystack",
    status: "failed",
  },
  {
    id: "txn_010",
    date: "2026-03-13",
    userName: "Kwame Mensah",
    amount: 4999,
    currency: "NGN",
    provider: "paystack",
    status: "pending",
  },
];

const FAILED_PAYMENTS: FailedPayment[] = [
  {
    id: "fp_1",
    userName: "Adaeze Okafor",
    amount: "\u20A64,999",
    date: "2026-03-16",
    reason: "Insufficient funds",
  },
  {
    id: "fp_2",
    userName: "Grace Adeyemi",
    amount: "\u20A64,999",
    date: "2026-03-14",
    reason: "Card expired",
  },
  {
    id: "fp_3",
    userName: "Aisha Mohammed",
    amount: "\u20A64,999",
    date: "2026-03-10",
    reason: "Bank declined",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatAmount(amount: number, currency: string) {
  const symbols: Record<string, string> = {
    NGN: "\u20A6",
    GBP: "\u00A3",
    USD: "$",
    GHS: "GH\u20B5",
  };
  const symbol = symbols[currency] ?? currency + " ";
  return `${symbol}${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const txStatusColors: Record<string, string> = {
  success: "bg-success/15 text-success",
  failed: "bg-destructive/15 text-destructive",
  pending: "bg-warning/15 text-warning",
};

// ---------------------------------------------------------------------------
// Transaction Table Columns
// ---------------------------------------------------------------------------

const txColumns: ColumnDef<Transaction>[] = [
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
      <span className="text-sm">{formatDate(row.original.date)}</span>
    ),
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.userName}</span>
    ),
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
        <ArrowsDownUp className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium tabular-nums">
        {formatAmount(row.original.amount, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.currency}</Badge>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <span className="text-sm capitalize">{row.original.provider}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={txStatusColors[row.original.status]}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
  },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-1 h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini donut chart component
// ---------------------------------------------------------------------------

function MiniDonut({
  data,
  config,
}: {
  data: { name: string; value: number; fill: string }[];
  config: ChartConfig;
}) {
  return (
    <div className="flex items-center gap-4">
      <ChartContainer config={config} className="h-[120px] w-[120px] shrink-0">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={30}
            outerRadius={50}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: d.fill }}
            />
            <span className="font-medium">{d.name}</span>
            <span className="text-muted-foreground">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminBillingPage() {
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true },
  ]);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const table = useReactTable({
    data: MOCK_TRANSACTIONS,
    columns: txColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <BillingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Billing
        </h2>
        <p className="text-sm text-muted-foreground">
          Revenue, payments, and subscription metrics.
        </p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REVENUE_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const isUp = kpi.trend > 0;
          const isChurn = kpi.label === "Churn MRR";
          // For churn, a negative trend is good
          const trendIsGood = isChurn ? !isUp : isUp;
          return (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">
                    {kpi.label}
                  </CardDescription>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {trendIsGood ? (
                    <TrendUp className="size-3 text-success" />
                  ) : (
                    <TrendDown className="size-3 text-destructive" />
                  )}
                  <span
                    className={
                      trendIsGood ? "text-success" : "text-destructive"
                    }
                  >
                    {kpi.trend > 0 ? "+" : ""}
                    {kpi.trend}%
                  </span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue breakdowns */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniDonut data={REVENUE_BY_PLAN} config={planChartConfig} />
            <div className="mt-3 space-y-1">
              {REVENUE_BY_PLAN.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{p.name}</span>
                  <span className="font-medium tabular-nums">{p.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniDonut
              data={REVENUE_BY_CURRENCY}
              config={currencyChartConfig}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Provider Split</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniDonut data={PROVIDER_SPLIT} config={providerChartConfig} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 10 payment events</CardDescription>
        </CardHeader>
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
        </CardContent>
      </Card>

      {/* Failed Payments */}
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Warning className="size-4 text-destructive" />
            <CardTitle className="text-base">Failed Payments</CardTitle>
            <Badge variant="destructive" className="ml-auto">
              {FAILED_PAYMENTS.length} this month
            </Badge>
          </div>
          <CardDescription>
            Payments that need attention or retry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FAILED_PAYMENTS.map((fp) => (
              <div
                key={fp.id}
                className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{fp.userName}</span>
                    <span className="text-sm text-muted-foreground">
                      {fp.amount}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(fp.date)} &middot; {fp.reason}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowsClockwise className="mr-1 size-3" />
                  Retry
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
