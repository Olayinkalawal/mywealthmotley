"use client";

import * as React from "react";
import {
  TrendUp,
  TrendDown,
  GlobeHemisphereWest,
  ChartBar,
} from "@phosphor-icons/react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MRR_DATA = [
  { month: "Oct", mrr: 50000 },
  { month: "Nov", mrr: 98000 },
  { month: "Dec", mrr: 165000 },
  { month: "Jan", mrr: 248000 },
  { month: "Feb", mrr: 335000 },
  { month: "Mar", mrr: 444111 },
];

const mrrChartConfig = {
  mrr: {
    label: "MRR (\u20A6)",
    color: "hsl(7.7 77.1% 60.6%)",
  },
} satisfies ChartConfig;

const USER_GROWTH_DATA = [
  { month: "Oct", users: 420 },
  { month: "Nov", users: 780 },
  { month: "Dec", users: 1250 },
  { month: "Jan", users: 1680 },
  { month: "Feb", users: 2200 },
  { month: "Mar", users: 2847 },
];

const userGrowthConfig = {
  users: {
    label: "Total Users",
    color: "hsl(19.6 33.3% 27.1%)",
  },
} satisfies ChartConfig;

const FEATURE_ADOPTION = [
  { feature: "All My Money", pct: 82 },
  { feature: "Budget", pct: 65 },
  { feature: "Money DNA", pct: 52 },
  { feature: "AI Sholz", pct: 45 },
  { feature: "Japa Score", pct: 38 },
  { feature: "Learn", pct: 30 },
];

const featureConfig = {
  pct: {
    label: "Adoption %",
    color: "hsl(41.8 62.8% 54.7%)",
  },
} satisfies ChartConfig;

const RETENTION_COHORTS = [
  { cohort: "W1 (Feb 24)", week1: 100, week2: 72, week3: 58, week4: 49 },
  { cohort: "W2 (Mar 3)", week1: 100, week2: 68, week3: 55, week4: 44 },
  { cohort: "W3 (Mar 10)", week1: 100, week2: 74, week3: 61, week4: null },
  { cohort: "W4 (Mar 17)", week1: 100, week2: 70, week3: null, week4: null },
];

const TOP_COUNTRIES = [
  {
    country: "Nigeria",
    flag: "\u{1F1F3}\u{1F1EC}",
    users: 1936,
    revenue: "\u20A6319,760",
    pct: 68,
  },
  {
    country: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    users: 512,
    revenue: "\u00A31,890",
    pct: 18,
  },
  {
    country: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    users: 228,
    revenue: "$680",
    pct: 8,
  },
  {
    country: "Ghana",
    flag: "\u{1F1EC}\u{1F1ED}",
    users: 85,
    revenue: "GH\u20B5420",
    pct: 3,
  },
  {
    country: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    users: 57,
    revenue: "CA$310",
    pct: 2,
  },
  {
    country: "Other",
    flag: "\u{1F30D}",
    users: 29,
    revenue: "\u20A612,500",
    pct: 1,
  },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-1 h-4 w-72" />
      </div>
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Retention heatmap cell
// ---------------------------------------------------------------------------

function RetentionCell({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <td className="p-2 text-center text-sm text-muted-foreground/40">
        &mdash;
      </td>
    );
  }
  const intensity =
    value >= 70
      ? "bg-success/30 text-success"
      : value >= 50
        ? "bg-success/15 text-success"
        : value >= 30
          ? "bg-warning/20 text-warning"
          : "bg-destructive/15 text-destructive";

  return (
    <td className="p-2 text-center">
      <span
        className={`inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ${intensity}`}
      >
        {value}%
      </span>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [period, setPeriod] = React.useState("30d");

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Deep-dive into WealthMotley performance and user behaviour.
        </p>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="7d">7d</TabsTrigger>
          <TabsTrigger value="30d">30d</TabsTrigger>
          <TabsTrigger value="90d">90d</TabsTrigger>
          <TabsTrigger value="ytd">YTD</TabsTrigger>
        </TabsList>

        {/* All periods show the same mock data for now */}
        {["7d", "30d", "90d", "ytd"].map((p) => (
          <TabsContent key={p} value={p}>
            <div className="space-y-6">
              {/* Revenue + User Growth Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* MRR Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Recurring Revenue</CardTitle>
                    <CardDescription>
                      MRR growth over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={mrrChartConfig}
                      className="h-[260px] w-full"
                    >
                      <LineChart data={MRR_DATA} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(v) =>
                            `\u20A6${(v / 1000).toFixed(0)}K`
                          }
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Line
                          dataKey="mrr"
                          type="monotone"
                          stroke="var(--color-mrr)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* User Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      Cumulative registered users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={userGrowthConfig}
                      className="h-[260px] w-full"
                    >
                      <AreaChart data={USER_GROWTH_DATA} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <defs>
                          <linearGradient
                            id="usersFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-users)"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-users)"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          dataKey="users"
                          type="monotone"
                          stroke="var(--color-users)"
                          fill="url(#usersFill)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Feature Adoption + Churn */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Feature Adoption */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ChartBar className="size-4 text-muted-foreground" />
                      <CardTitle>Feature Adoption</CardTitle>
                    </div>
                    <CardDescription>
                      % of users who used each feature
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={featureConfig}
                      className="h-[260px] w-full"
                    >
                      <BarChart
                        data={FEATURE_ADOPTION}
                        layout="vertical"
                        accessibilityLayer
                      >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                          type="number"
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <YAxis
                          dataKey="feature"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={100}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Bar
                          dataKey="pct"
                          fill="var(--color-pct)"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Churn + Retention Cohort */}
                <Card>
                  <CardHeader>
                    <CardTitle>Churn Rate</CardTitle>
                    <CardDescription>
                      Monthly churn and retention overview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Churn KPI */}
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-3xl font-bold">4.2%</div>
                        <div className="text-sm text-muted-foreground">
                          Monthly churn rate
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendDown className="size-3 text-success" />
                        <span className="text-success">-0.8%</span>
                        <span className="text-muted-foreground">
                          vs last month
                        </span>
                      </div>
                    </div>

                    {/* Retention Cohort Heatmap */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Retention Cohorts
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-muted-foreground">
                              <th className="p-2 text-left font-medium">
                                Cohort
                              </th>
                              <th className="p-2 text-center font-medium">
                                Week 1
                              </th>
                              <th className="p-2 text-center font-medium">
                                Week 2
                              </th>
                              <th className="p-2 text-center font-medium">
                                Week 3
                              </th>
                              <th className="p-2 text-center font-medium">
                                Week 4
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {RETENTION_COHORTS.map((cohort) => (
                              <tr key={cohort.cohort} className="border-b">
                                <td className="p-2 text-sm font-medium whitespace-nowrap">
                                  {cohort.cohort}
                                </td>
                                <RetentionCell value={cohort.week1} />
                                <RetentionCell value={cohort.week2} />
                                <RetentionCell value={cohort.week3} />
                                <RetentionCell value={cohort.week4} />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GlobeHemisphereWest className="size-4 text-muted-foreground" />
                    <CardTitle>Top Countries</CardTitle>
                  </div>
                  <CardDescription>
                    Users and revenue by country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="p-2 text-left font-medium">
                            Country
                          </th>
                          <th className="p-2 text-right font-medium">
                            Users
                          </th>
                          <th className="p-2 text-right font-medium">
                            Revenue
                          </th>
                          <th className="p-2 text-right font-medium">
                            Share
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {TOP_COUNTRIES.map((row) => (
                          <tr
                            key={row.country}
                            className="border-b last:border-0"
                          >
                            <td className="p-2 font-medium">
                              <span className="mr-2">{row.flag}</span>
                              {row.country}
                            </td>
                            <td className="p-2 text-right tabular-nums">
                              {row.users.toLocaleString()}
                            </td>
                            <td className="p-2 text-right tabular-nums">
                              {row.revenue}
                            </td>
                            <td className="p-2 text-right">
                              <Badge variant="outline">{row.pct}%</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
