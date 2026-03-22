"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/lib/constants";

// Nigerian-relevant default budget categories
const DEFAULT_CATEGORIES = [
  { name: "Rent & Housing", color: "#8B6B5A", icon: "home" },
  { name: "Jollof & Chops", color: "#E8614D", icon: "utensils" },
  { name: "Transport & Bolt", color: "#5B9A6D", icon: "car" },
  { name: "Data & Airtime", color: "#2563EB", icon: "wifi" },
  { name: "Family Support", color: "#D4A843", icon: "users" },
  { name: "Owambe & Aso Ebi", color: "#EC4899", icon: "party-popper" },
  { name: "Tithes & Offerings", color: "#8B5CF6", icon: "heart" },
  { name: "Utilities & Bills", color: "#F59E0B", icon: "zap" },
  { name: "Entertainment", color: "#A855F7", icon: "tv" },
] as const;

interface WmCreateBudgetDialogProps {
  trigger?: React.ReactNode;
}

function WmCreateBudgetDialog({ trigger }: WmCreateBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState("");
  const [mode, setMode] = useState<"flex" | "zero_based">("flex");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBudget = useMutation(api.budgets.createBudget);

  // Current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Friendly display for the current month
  const monthDisplay = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function resetForm() {
    setTotalIncome("");
    setMode("flex");
    setCurrency("NGN");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedIncome = parseFloat(totalIncome);
    if (isNaN(parsedIncome) || parsedIncome <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Distribute income evenly across categories as a starting point
      const perCategory = Math.floor(parsedIncome / DEFAULT_CATEGORIES.length);
      const remainder = parsedIncome - perCategory * DEFAULT_CATEGORIES.length;

      const categories = DEFAULT_CATEGORIES.map((cat, index) => ({
        name: cat.name,
        allocated: index === 0 ? perCategory + remainder : perCategory,
        color: cat.color,
        icon: cat.icon,
      }));

      await createBudget({
        month: currentMonth,
        mode,
        totalIncome: parsedIncome,
        currency,
        categories,
      });

      toast.success("Budget created! You can now adjust category allocations.");
      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to create budget. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Create Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Budget for {monthDisplay}</DialogTitle>
            <DialogDescription>
              Set up your monthly budget. We will pre-fill Nigerian categories you
              can adjust later.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            {/* Month (read-only) */}
            <div className="grid gap-2">
              <Label>Month</Label>
              <Input value={monthDisplay} disabled />
            </div>

            {/* Total Income */}
            <div className="grid gap-2">
              <Label htmlFor="budget-income">Total Income</Label>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Input
                  id="budget-income"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 450000"
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(e.target.value)}
                  required
                />
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Mode */}
            <div className="grid gap-2">
              <Label>Budget Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as "flex" | "zero_based")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex">
                    Flex - Flexible allocations
                  </SelectItem>
                  <SelectItem value="zero_based">
                    Zero-Based - Every naira has a job
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pre-filled categories preview */}
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Pre-filled categories</Label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_CATEGORIES.map((cat) => (
                  <span
                    key={cat.name}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    <span
                      className="mr-1.5 inline-block size-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Income will be split evenly. You can adjust allocations after
                creation.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { WmCreateBudgetDialog };
