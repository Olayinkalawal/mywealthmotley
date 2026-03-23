"use client";

import * as React from "react";
import {
  Check,
  Crown,
  CreditCard,
  Sparkle,
  Star,
  Lightning,
  SpinnerGap,
  XCircle,
  CalendarBlank,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useQuery, useAction, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/use-currency";
import type { CurrencyCode } from "@/lib/constants";

// ── Currency-aware pricing ──────────────────────────────────────────

type PricingMap = Record<string, { pro: string; premium: string; free: string }>;

const PRICING: PricingMap = {
  NGN: { free: "\u20A60", pro: "\u20A62,500", premium: "\u20A65,000" },
  GBP: { free: "\u00A30", pro: "\u00A39.99", premium: "\u00A319.99" },
  USD: { free: "$0", pro: "$12.99", premium: "$24.99" },
  EUR: { free: "\u20AC0", pro: "\u20AC11.99", premium: "\u20AC22.99" },
  CAD: { free: "CA$0", pro: "CA$16.99", premium: "CA$32.99" },
  AED: { free: "AED 0", pro: "AED 47.99", premium: "AED 91.99" },
  ZAR: { free: "R0", pro: "R229.99", premium: "R449.99" },
  GHS: { free: "\u20B50", pro: "\u20B5149.99", premium: "\u20B5299.99" },
  KES: { free: "KSh 0", pro: "KSh 1,999", premium: "KSh 3,899" },
};

function getPriceForCurrency(
  planName: string,
  currency: CurrencyCode
): string {
  const key = planName.toLowerCase() as "free" | "pro" | "premium";
  const currencyPricing = PRICING[currency] ?? PRICING["NGN"]!;
  return currencyPricing?.[key] ?? PRICING["NGN"]![key];
}

// ── Plan features ───────────────────────────────────────────────────

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: "free" | "pro" | "premium";
  name: string;
  period: string;
  description: string;
  features: PlanFeature[];
  icon: React.ElementType;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    period: "forever",
    description: "Get started with essential money tracking",
    icon: Star,
    features: [
      { text: "Manual transaction entry", included: true },
      { text: "Basic budget tracking (3 categories)", included: true },
      { text: "1 savings goal", included: true },
      { text: "Basic spending insights", included: true },
      { text: "Learn module (5 free lessons)", included: true },
      { text: "Mo (10 messages/month)", included: true },
      { text: "Bank connection", included: false },
      { text: "Unlimited categories", included: false },
      { text: "Portfolio tracker", included: false },
      { text: "Japa planner", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    period: "month",
    description: "Everything you need to take control of your money",
    icon: Lightning,
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Connect up to 3 bank accounts", included: true },
      { text: "Unlimited budget categories", included: true },
      { text: "Unlimited savings goals", included: true },
      { text: "Mo (100 messages/month)", included: true },
      { text: "Screenshot import", included: true },
      { text: "Weekly spending reports", included: true },
      { text: "Black Tax tracker", included: true },
      { text: "Money Story", included: true },
      { text: "Portfolio tracker", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    period: "month",
    description: "For serious wealth builders planning their future",
    icon: Crown,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited bank connections", included: true },
      { text: "Mo (unlimited)", included: true },
      { text: "Portfolio tracker & insights", included: true },
      { text: "Japa relocation planner", included: true },
      { text: "What-If simulator", included: true },
      { text: "Money DNA quiz & share card", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new features", included: true },
      { text: "Custom spending categories", included: true },
    ],
  },
];

// ── Status badge helper ─────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: {
      label: "Active",
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    trialing: {
      label: "Trial",
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    past_due: {
      label: "Past Due",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
    canceled: {
      label: "Cancelled",
      className:
        "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
  };

  const c = config[status] ?? config.active!;
  return (
    <Badge variant="outline" className={c?.className}>
      {c?.label}
    </Badge>
  );
}

// ── Main component ──────────────────────────────────────────────────

export function WmSettingsSubscription() {
  const { isAuthenticated } = useConvexAuth();
  const { currency } = useCurrency();

  // Convex data
  const subscriptionData = useQuery(
    api.billing.getSubscription,
    isAuthenticated ? {} : "skip"
  );
  const user = useQuery(
    api.users.getUser,
    isAuthenticated ? {} : "skip"
  );

  // Convex actions
  const initPaystack = useAction(api.billing.initializePaystackPayment);
  const initStripe = useAction(api.billing.initializeStripeCheckout);
  const cancelSub = useAction(api.billing.cancelUserSubscription);

  // Loading state per plan
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);

  // Derive current plan from actual subscription data
  const currentTier = subscriptionData?.tier ?? "free";
  const subStatus = subscriptionData?.status ?? "active";
  const hasActiveSub =
    currentTier !== "free" &&
    (subStatus === "active" || subStatus === "trialing");
  const isCancelledButActive =
    subStatus === "canceled" &&
    subscriptionData?.subscription?.cancelAtPeriodEnd &&
    subscriptionData?.subscription?.currentPeriodEnd &&
    subscriptionData.subscription.currentPeriodEnd > Date.now();

  // ── Handle upgrade ──────────────────────────────────────────────
  const handleUpgrade = async (planId: "pro" | "premium") => {
    if (!user?._id) {
      toast.error("Please sign in to upgrade your plan.");
      return;
    }

    setLoadingPlan(planId);

    try {
      if (currency === "NGN") {
        // Paystack for Nigerian users
        const result = await initPaystack({
          planId,
          userId: user._id,
        });
        window.location.href = result.authorization_url;
      } else {
        // Stripe for international users
        const result = await initStripe({
          planId,
          userId: user._id,
        });
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout", {
        description:
          error?.message ?? "Something went wrong. Please try again.",
      });
      setLoadingPlan(null);
    }
  };

  // ── Handle cancel ───────────────────────────────────────────────
  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelSub({});
      toast.success("Subscription cancelled", {
        description:
          "You'll retain access until the end of your current billing period.",
      });
    } catch (error: any) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel subscription", {
        description:
          error?.message ?? "Something went wrong. Please try again.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Format the next billing date
  const nextBillingDate = subscriptionData?.subscription?.currentPeriodEnd
    ? new Date(
        subscriptionData.subscription.currentPeriodEnd
      ).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Current plan banner */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Subscription & Billing
          </CardTitle>
          <CardDescription>
            Manage your plan and payment methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active subscription info */}
          {(hasActiveSub || isCancelledButActive) && (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/10">
                  {currentTier === "premium" ? (
                    <Crown className="size-5 text-secondary" />
                  ) : (
                    <Lightning className="size-5 text-secondary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-semibold capitalize">
                      {currentTier} Plan
                    </p>
                    <StatusBadge status={subStatus} />
                    {subscriptionData?.subscription?.cancelAtPeriodEnd && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/20 bg-amber-500/10 text-amber-400"
                      >
                        Cancels at period end
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {subscriptionData?.provider && (
                      <span className="capitalize">
                        via {subscriptionData.provider}
                      </span>
                    )}
                    {nextBillingDate && (
                      <span className="flex items-center gap-1">
                        <CalendarBlank className="size-3.5" />
                        {subscriptionData?.subscription?.cancelAtPeriodEnd
                          ? `Access until ${nextBillingDate}`
                          : `Next billing: ${nextBillingDate}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!subscriptionData?.subscription?.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <SpinnerGap className="size-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="size-4" />
                      Cancel Subscription
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Free plan banner */}
          {!hasActiveSub && !isCancelledButActive && (
            <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="size-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-semibold">Free Plan</p>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Basic features for getting started
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleUpgrade("pro")}
                disabled={loadingPlan !== null}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {loadingPlan === "pro" ? (
                  <>
                    <SpinnerGap className="size-4 animate-spin text-amber-500" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkle className="size-4" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan comparison grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentTier;
          const price = getPriceForCurrency(plan.name, currency);
          const isLoading = loadingPlan === plan.id;
          const canUpgrade =
            !isCurrentPlan &&
            plan.id !== "free" &&
            !hasActiveSub;
          // Allow upgrading from pro to premium even with active sub
          const canUpgradeToPremium =
            plan.id === "premium" &&
            currentTier === "pro" &&
            hasActiveSub;

          return (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "relative border-secondary shadow-md"
                  : isCurrentPlan
                    ? "relative border-primary/30"
                    : ""
              }
            >
              {plan.popular && !isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Your Plan
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      isCurrentPlan
                        ? "bg-primary/10"
                        : plan.popular
                          ? "bg-secondary/10"
                          : "bg-accent/10"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${
                        isCurrentPlan
                          ? "text-primary"
                          : plan.popular
                            ? "text-secondary"
                            : "text-accent"
                      }`}
                    />
                  </div>
                  <CardTitle className="font-heading text-base">
                    {plan.name}
                  </CardTitle>
                </div>
                <div className="pt-2">
                  <span className="font-heading text-2xl font-bold">
                    {price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
                <CardDescription className="text-xs">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-start gap-2 text-xs ${
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground/50 line-through"
                      }`}
                    >
                      <Check
                        className={`mt-0.5 size-3 shrink-0 ${
                          feature.included
                            ? "text-success"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      {feature.text}
                    </li>
                  ))}
                </ul>
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : canUpgrade || canUpgradeToPremium ? (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : ""
                    }`}
                    onClick={() =>
                      handleUpgrade(plan.id as "pro" | "premium")
                    }
                    disabled={loadingPlan !== null}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <SpinnerGap className="size-4 animate-spin text-amber-500" />
                        <span className="animate-pulse">Processing...</span>
                      </span>
                    ) : (
                      <>Upgrade to {plan.name}</>
                    )}
                  </Button>
                ) : plan.id === "free" ? (
                  <Button variant="outline" className="w-full" disabled>
                    {currentTier === "free" ? "Current Plan" : "Free Tier"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    {currentTier === "premium"
                      ? "Included"
                      : "Upgrade to unlock"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cooling-off / cancellation disclosure */}
      <div
        className="rounded-lg px-4 py-3 text-xs leading-relaxed"
        style={{
          background: "rgba(30, 25, 22, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(150, 138, 132, 0.15)",
          color: "#968a84",
        }}
      >
        <p>
          <strong className="text-[#b8ada7]">UK users:</strong> Under Consumer
          Contracts Regulations 2013, you have a 14-day cooling-off period. By
          accessing premium features during this period, you consent to begin
          delivery and acknowledge loss of withdrawal rights.
        </p>
        <p className="mt-1.5">
          <strong className="text-[#b8ada7]">Nigerian users:</strong> Under
          FCCPA 2018 Section 120, you have a right to cancel with a 7-day refund
          window.
        </p>
        <p className="mt-1.5">
          You may cancel your subscription at any time &mdash; access continues
          until the end of your billing period.
        </p>
      </div>

      {/* Billing history and payment method */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <p className="text-sm text-muted-foreground">
                No billing history yet
              </p>
              <p className="text-xs text-muted-foreground">
                Your invoices will appear here after your first payment
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <CreditCard className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {hasActiveSub
                    ? `Managed by ${subscriptionData?.provider === "paystack" ? "Paystack" : "Stripe"}`
                    : "No payment method added"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hasActiveSub
                    ? "Payment details are securely stored with your payment provider"
                    : "Add a card or bank account to upgrade your plan"}
                </p>
              </div>
              {!hasActiveSub && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpgrade("pro")}
                  disabled={loadingPlan !== null}
                >
                  <CreditCard className="size-3.5" />
                  Add Payment Method
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
