"use client";

import * as React from "react";
import {
  BellSimple,
  ChatCircle,
  TrendDown,
  BookOpen,
  AirplaneTilt,
  ChartBar,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NOTIFICATIONS_STORAGE_KEY = "wm-notification-preferences";

interface NotificationPreferences {
  spendingAlerts: boolean;
  budgetWarnings: boolean;
  weeklySummary: boolean;
  newContent: boolean;
  japaMilestones: boolean;
  whatsapp: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  spendingAlerts: true,
  budgetWarnings: true,
  weeklySummary: true,
  newContent: false,
  japaMilestones: true,
  whatsapp: false,
};

function getStoredPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch {
    // localStorage not available or invalid JSON
  }
  return DEFAULT_PREFERENCES;
}

interface NotificationRowProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

function NotificationRow({
  id,
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  badge,
}: NotificationRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <Label
            htmlFor={id}
            className="cursor-pointer text-sm font-medium leading-normal"
          >
            {title}
          </Label>
          {badge && (
            <Badge
              variant="outline"
              className="text-[10px] font-normal text-muted-foreground"
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
}

export function WmSettingsNotifications() {
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(
    DEFAULT_PREFERENCES
  );
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setPrefs(getStoredPreferences());
    setMounted(true);
  }, []);

  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
    toast.success(
      value ? "Notification enabled" : "Notification disabled"
    );
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Notifications</CardTitle>
          <CardDescription>Loading preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Notifications</CardTitle>
        <CardDescription>
          Choose what updates you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* Push notifications */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            Push Notifications
          </h4>

          <NotificationRow
            id="spending-alerts"
            icon={TrendDown}
            title="Spending alerts"
            description="Get notified when a transaction exceeds your set threshold"
            checked={prefs.spendingAlerts}
            onCheckedChange={(checked) =>
              updatePreference("spendingAlerts", checked)
            }
          />

          <NotificationRow
            id="budget-warnings"
            icon={ChartBar}
            title="Budget warnings"
            description="Alerts when you're approaching a category spending limit"
            checked={prefs.budgetWarnings}
            onCheckedChange={(checked) =>
              updatePreference("budgetWarnings", checked)
            }
          />

          <NotificationRow
            id="weekly-summary"
            icon={BellSimple}
            title="Weekly spending summary"
            description="A weekly overview of your income, spending, and savings"
            checked={prefs.weeklySummary}
            onCheckedChange={(checked) =>
              updatePreference("weeklySummary", checked)
            }
          />

          <NotificationRow
            id="new-content"
            icon={BookOpen}
            title="New educational content"
            description="Be the first to know about new lessons and learning paths"
            checked={prefs.newContent}
            onCheckedChange={(checked) =>
              updatePreference("newContent", checked)
            }
          />

          <NotificationRow
            id="japa-milestones"
            icon={AirplaneTilt}
            title="Japa milestone updates"
            description="Progress updates on your relocation savings and timeline"
            checked={prefs.japaMilestones}
            onCheckedChange={(checked) =>
              updatePreference("japaMilestones", checked)
            }
          />
        </div>

        <Separator className="my-4" />

        {/* WhatsApp */}
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">
            Messaging
          </h4>

          <NotificationRow
            id="whatsapp-notifications"
            icon={ChatCircle}
            title="WhatsApp notifications"
            description="Receive spending alerts and summaries via WhatsApp"
            checked={prefs.whatsapp}
            onCheckedChange={() =>
              toast.info("WhatsApp notifications coming soon!")
            }
            disabled
            badge="Coming soon"
          />
        </div>
      </CardContent>
    </Card>
  );
}
