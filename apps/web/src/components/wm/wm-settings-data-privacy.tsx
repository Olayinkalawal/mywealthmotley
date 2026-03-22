"use client";

import * as React from "react";
import {
  Shield,
  DownloadSimple,
  Trash,
  ArrowSquareOut,
  Warning,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const CONSENT_STORAGE_KEY = "wm-consent-preferences";

interface ConsentPreferences {
  bankDataProcessing: boolean;
  marketingCommunications: boolean;
  analyticsImprovement: boolean;
}

interface ConsentDates {
  bankDataProcessing: string | null;
  marketingCommunications: string | null;
  analyticsImprovement: string | null;
}

const DEFAULT_CONSENT: ConsentPreferences = {
  bankDataProcessing: true,
  marketingCommunications: false,
  analyticsImprovement: true,
};

function formatConsentDate(dateStr: string | null): string {
  if (!dateStr) return "Not yet granted";
  try {
    return `Granted on ${new Date(dateStr).toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  } catch {
    return "Not yet granted";
  }
}

function getStoredConsent(): {
  prefs: ConsentPreferences;
  dates: ConsentDates;
} {
  if (typeof window === "undefined") {
    return {
      prefs: DEFAULT_CONSENT,
      dates: {
        bankDataProcessing: null,
        marketingCommunications: null,
        analyticsImprovement: null,
      },
    };
  }
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        prefs: { ...DEFAULT_CONSENT, ...parsed.prefs },
        dates: parsed.dates || {
          bankDataProcessing: new Date().toISOString(),
          marketingCommunications: null,
          analyticsImprovement: new Date().toISOString(),
        },
      };
    }
  } catch {
    // localStorage not available or invalid JSON
  }
  return {
    prefs: DEFAULT_CONSENT,
    dates: {
      bankDataProcessing: new Date().toISOString(),
      marketingCommunications: null,
      analyticsImprovement: new Date().toISOString(),
    },
  };
}

interface ConsentRowProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  dateGranted: string | null;
  required?: boolean;
}

function ConsentRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
  dateGranted,
  required,
}: ConsentRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Label
            htmlFor={id}
            className="cursor-pointer text-sm font-medium leading-normal"
          >
            {title}
          </Label>
          {required && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              Required
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-[11px] text-muted-foreground/70">
          {formatConsentDate(dateGranted)}
        </p>
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

export function WmSettingsDataPrivacy() {
  const [consent, setConsent] =
    React.useState<ConsentPreferences>(DEFAULT_CONSENT);
  const [dates, setDates] = React.useState<ConsentDates>({
    bankDataProcessing: null,
    marketingCommunications: null,
    analyticsImprovement: null,
  });
  const [mounted, setMounted] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredConsent();
    setConsent(stored.prefs);
    setDates(stored.dates);
    setMounted(true);
  }, []);

  const updateConsent = (
    key: keyof ConsentPreferences,
    value: boolean
  ) => {
    const updatedPrefs = { ...consent, [key]: value };
    const updatedDates = {
      ...dates,
      [key]: value ? new Date().toISOString() : dates[key],
    };
    setConsent(updatedPrefs);
    setDates(updatedDates);
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ prefs: updatedPrefs, dates: updatedDates })
      );
    } catch {
      // localStorage not available
    }
    toast.success(value ? "Consent granted" : "Consent withdrawn");
  };

  const handleExportData = () => {
    toast.info("Preparing your data export...", {
      description: "You will receive a download link via email within 24 hours.",
      duration: 5000,
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") return;
    setIsDeleting(true);

    // Simulate deletion
    setTimeout(() => {
      setIsDeleting(false);
      setDialogOpen(false);
      setDeleteConfirmation("");
      toast.success("Account deletion request submitted", {
        description:
          "Your account and data will be permanently deleted within 30 days.",
        duration: 8000,
      });
    }, 2000);
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Data & Privacy
          </CardTitle>
          <CardDescription>Loading preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Consent Management */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            <span className="flex items-center gap-2">
              <Shield className="size-5" />
              Consent Management
            </span>
          </CardTitle>
          <CardDescription>
            Control how your data is used on WealthMotley
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <ConsentRow
            id="bank-data-processing"
            title="Bank data processing"
            description="Allow WealthMotley to process your bank transaction data for tracking and analysis. This is required while you have a bank account connected."
            checked={consent.bankDataProcessing}
            onCheckedChange={(checked) => {
              if (!checked) {
                toast.error(
                  "Bank data processing cannot be disabled while you have connected bank accounts. Please disconnect all banks first."
                );
                return;
              }
              updateConsent("bankDataProcessing", checked);
            }}
            dateGranted={dates.bankDataProcessing}
            required
            disabled
          />

          <ConsentRow
            id="marketing-communications"
            title="Marketing communications"
            description="Receive product updates, tips, and promotional content from WealthMotley"
            checked={consent.marketingCommunications}
            onCheckedChange={(checked) =>
              updateConsent("marketingCommunications", checked)
            }
            dateGranted={dates.marketingCommunications}
          />

          <ConsentRow
            id="analytics-improvement"
            title="Analytics & improvement"
            description="Help us improve WealthMotley by sharing anonymous usage data and analytics"
            checked={consent.analyticsImprovement}
            onCheckedChange={(checked) =>
              updateConsent("analyticsImprovement", checked)
            }
            dateGranted={dates.analyticsImprovement}
          />
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Your Data</CardTitle>
          <CardDescription>
            Download or manage your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExportData}>
            <DownloadSimple className="size-4" />
            Download My Data
          </Button>
          <p className="text-xs text-muted-foreground">
            We will prepare a zip file with all your data including transactions,
            budgets, savings goals, and preferences. You will receive a download
            link via email.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone - Delete Account */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="font-heading text-lg text-destructive">
            <span className="flex items-center gap-2">
              <Warning className="size-5" />
              Danger Zone
            </span>
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, all your data will be permanently
            removed. This includes your transaction history, budgets, savings
            goals, learning progress, and all connected accounts.
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="size-4" />
                Delete My Account & Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  Delete your account?
                </DialogTitle>
                <DialogDescription className="space-y-3 pt-2">
                  <span className="block">
                    This will permanently delete all your data including:
                  </span>
                  <span className="block space-y-1 text-sm">
                    <span className="block">
                      &bull; Transaction history and categorizations
                    </span>
                    <span className="block">
                      &bull; Budgets and spending insights
                    </span>
                    <span className="block">
                      &bull; Savings goals and progress
                    </span>
                    <span className="block">
                      &bull; Japa planning data
                    </span>
                    <span className="block">
                      &bull; Learning progress and achievements
                    </span>
                    <span className="block">
                      &bull; All connected bank accounts
                    </span>
                  </span>
                  <span className="block font-medium text-destructive">
                    This action cannot be undone.
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="delete-confirmation">
                  Type <span className="font-mono font-bold">DELETE</span> to
                  confirm
                </Label>
                <Input
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE"
                  className="font-mono"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={deleteConfirmation !== "DELETE" || isDeleting}
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Legal links */}
      <div className="flex flex-wrap gap-4 px-1">
        <a
          href="/privacy"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Privacy Policy
          <ArrowSquareOut className="size-3" />
        </a>
        <Separator orientation="vertical" className="h-4" />
        <a
          href="/terms"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Terms of Service
          <ArrowSquareOut className="size-3" />
        </a>
      </div>
    </div>
  );
}
