"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BellSimple,
  CurrencyCircleDollar,
  ChartPieSlice,
  PiggyBank,
  Airplane,
  Gear,
  Lightbulb,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ── Notification type icon mapping ──────────────────────────────────
function NotificationIcon({ type }: { type: string }) {
  const iconClass = "size-4 shrink-0";

  switch (type) {
    case "spending_alert":
      return <Warning className={iconClass} weight="fill" />;
    case "budget_warning":
      return <ChartPieSlice className={iconClass} weight="fill" />;
    case "savings_milestone":
      return <PiggyBank className={iconClass} weight="fill" />;
    case "japa_update":
      return <Airplane className={iconClass} weight="fill" />;
    case "system":
      return <Gear className={iconClass} weight="fill" />;
    case "tip":
      return <Lightbulb className={iconClass} weight="fill" />;
    default:
      return <CurrencyCircleDollar className={iconClass} weight="fill" />;
  }
}

// ── Relative time formatter ─────────────────────────────────────────
function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Main component ──────────────────────────────────────────────────
export function WmNotifications() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const [open, setOpen] = React.useState(false);

  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated ? {} : "skip"
  );
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    isAuthenticated ? {} : "skip"
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleNotificationClick = async (
    notificationId: Id<"notifications">,
    link: string | undefined,
    isRead: boolean
  ) => {
    if (!isRead) {
      await markAsRead({ notificationId });
    }
    if (link) {
      setOpen(false);
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead({});
  };

  const displayCount = unreadCount ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <BellSimple className="size-4" weight="bold" />
          {displayCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex size-4 items-center justify-center p-0 text-[10px]"
            >
              {displayCount > 9 ? "9+" : displayCount}
            </Badge>
          )}
          <span className="sr-only">
            {displayCount > 0
              ? `${displayCount} notifications`
              : "Notifications"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {displayCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[300px] overflow-y-auto">
          {notifications === undefined ? (
            // Loading state
            <div className="flex items-center justify-center py-8">
              <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BellSimple
                className="size-8 text-muted-foreground/50"
                weight="light"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            // Notification items
            notifications.map((notification) => (
              <button
                key={notification._id}
                onClick={() =>
                  handleNotificationClick(
                    notification._id,
                    notification.link,
                    notification.isRead
                  )
                }
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                  !notification.isRead && "bg-accent/30"
                )}
              >
                {/* Unread indicator + icon */}
                <div className="relative mt-0.5">
                  <NotificationIcon type={notification.type} />
                  {!notification.isRead && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[hsl(var(--chart-1))]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm leading-tight",
                      !notification.isRead
                        ? "font-semibold"
                        : "font-medium text-muted-foreground"
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    {relativeTime(notification.createdAt)}
                  </p>
                </div>

                {/* Read checkmark for read items */}
                {notification.isRead && (
                  <CheckCircle
                    className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5"
                    weight="fill"
                  />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
