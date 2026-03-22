"use client";

import * as React from "react";
import {
  Check,
  Crown,
  CreditCard,
  Sparkle,
  Star,
  Lightning,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  icon: React.ElementType;
  popular?: boolean;
  current?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "\u20A60",
    period: "forever",
    description: "Get started with essential money tracking",
    icon: Star,
    current: true,
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
    name: "Pro",
    price: "\u20A62,500",
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
    name: "Premium",
    price: "\u20A65,000",
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

export function WmSettingsSubscription() {
  const handleUpgrade = (planName: string) => {
    toast.info(`Upgrade to ${planName} coming soon!`, {
      description: "Payment integration is being set up. Stay tuned!",
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Current plan */}
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
              onClick={() => handleUpgrade("Pro")}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Sparkle className="size-4" />
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "relative border-secondary shadow-md"
                  : ""
              }
            >
              {plan.popular && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-secondary text-secondary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${
                      plan.popular
                        ? "bg-secondary/10"
                        : plan.current
                          ? "bg-primary/10"
                          : "bg-accent/10"
                    }`}
                  >
                    <Icon
                      className={`size-4 ${
                        plan.popular
                          ? "text-secondary"
                          : plan.current
                            ? "text-primary"
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
                    {plan.price}
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
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : ""
                    }`}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
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
                  No payment method added
                </p>
                <p className="text-xs text-muted-foreground">
                  Add a card or bank account to upgrade your plan
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Payment setup coming soon!")
                }
              >
                <CreditCard className="size-3.5" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
