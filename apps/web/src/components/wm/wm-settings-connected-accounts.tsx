"use client";

import * as React from "react";
import {
  Buildings,
  LinkSimple,
  ArrowsClockwise,
  LinkBreak,
  Plus,
  Wallet,
  ArrowSquareOut,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useQuery, useMutation, useAction, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMono } from "@/hooks/use-mono";

type AccountStatus = "connected" | "syncing" | "error" | "inactive";

const STATUS_CONFIG: Record<
  AccountStatus,
  { label: string; className: string }
> = {
  connected: {
    label: "Connected",
    className: "bg-success/10 text-success border-success/20",
  },
  syncing: {
    label: "Syncing",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  error: {
    label: "Error",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  inactive: {
    label: "Disconnected",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

function getRelativeTimeString(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function WmSettingsConnectedAccounts() {
  const { isAuthenticated } = useConvexAuth();
  const accounts = useQuery(api.mono.getConnectedAccounts, isAuthenticated ? {} : "skip");
  const disconnectAccountMutation = useMutation(api.mono.disconnectAccount);
  const syncAccountAction = useAction(api.mono.syncAccount);
  const [syncingIds, setSyncingIds] = React.useState<Set<string>>(new Set());

  const { openMono, isLoading: isMonoLoading } = useMono({
    onSuccess: () => {
      toast.success("Bank account connected! Syncing your data...");
    },
  });

  const activeAccounts = React.useMemo(
    () => (accounts ?? []).filter((a) => a.isActive),
    [accounts]
  );

  const handleDisconnect = async (accountId: Id<"monoAccounts">, bankName: string) => {
    try {
      await disconnectAccountMutation({ accountId });
      toast.success(`${bankName} disconnected`);
    } catch (error) {
      console.error("Failed to disconnect account:", error);
      toast.error("Failed to disconnect account. Please try again.");
    }
  };

  const handleSync = async (accountId: Id<"monoAccounts">, bankName: string) => {
    setSyncingIds((prev) => new Set(prev).add(accountId));
    toast.info(`Syncing ${bankName}...`);

    try {
      await syncAccountAction({ accountId });
      toast.success(`${bankName} synced successfully`);
    } catch (error) {
      console.error("Failed to sync account:", error);
      toast.error(`Failed to sync ${bankName}. Please try again.`);
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(accountId);
        return next;
      });
    }
  };

  const getAccountStatus = (
    account: { isActive: boolean; _id: string; lastSynced: number }
  ): AccountStatus => {
    if (!account.isActive) return "inactive";
    if (syncingIds.has(account._id)) return "syncing";
    // If last synced more than 24 hours ago, show as needing attention
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    if (account.lastSynced < dayAgo) return "connected"; // Still connected, just stale
    return "connected";
  };

  // Loading state
  if (accounts === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage your linked bank accounts and data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <SpinnerGap className="size-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">
          Connected Accounts
        </CardTitle>
        <CardDescription>
          Manage your linked bank accounts and data sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected banks */}
        {activeAccounts.length > 0 ? (
          <div className="space-y-3">
            {activeAccounts.map((account) => {
              const status = getAccountStatus(account);
              const statusConfig = STATUS_CONFIG[status];
              const isSyncing = syncingIds.has(account._id);

              return (
                <div
                  key={account._id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Buildings className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{account.institution}</p>
                        <Badge
                          variant="outline"
                          className={statusConfig.className}
                        >
                          {status === "syncing" && (
                            <ArrowsClockwise className="mr-1 size-2.5 animate-spin" />
                          )}
                          {status === "connected" && (
                            <LinkSimple className="mr-1 size-2.5" />
                          )}
                          {status === "error" && (
                            <WarningCircle className="mr-1 size-2.5" />
                          )}
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {account.accountName}
                        {account.accountNumber
                          ? ` (****${account.accountNumber})`
                          : ""}
                        {" "}&middot;{" "}
                        {account.type === "current"
                          ? "Current Account"
                          : "Savings Account"}
                        {" "}&middot; Last synced{" "}
                        {getRelativeTimeString(account.lastSynced)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSync(
                          account._id as Id<"monoAccounts">,
                          account.institution
                        )
                      }
                      disabled={isSyncing}
                    >
                      <ArrowsClockwise
                        className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`}
                      />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDisconnect(
                          account._id as Id<"monoAccounts">,
                          account.institution
                        )
                      }
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LinkBreak className="size-3.5" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Buildings className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No banks connected</p>
              <p className="text-sm text-muted-foreground">
                Link your bank account to automatically track transactions
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={openMono}
          disabled={isMonoLoading}
          className="w-full sm:w-auto"
        >
          {isMonoLoading ? (
            <>
              <SpinnerGap className="size-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Connect New Bank
            </>
          )}
        </Button>

        <Separator />

        {/* Manual assets summary */}
        <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Wallet className="size-5 text-accent" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Manual Assets</p>
              <p className="text-xs text-muted-foreground">
                Track investments, property, crypto, and more
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/all-my-money">
              <ArrowSquareOut className="size-3.5" />
              View All Assets
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
