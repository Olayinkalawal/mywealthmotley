"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/lib/constants";

const RELATIONSHIPS = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "sibling", label: "Sibling" },
  { value: "extended_family", label: "Extended Family" },
  { value: "friend", label: "Friend" },
  { value: "community", label: "Community" },
] as const;

const CATEGORIES = [
  { value: "general_support", label: "General Support" },
  { value: "school_fees", label: "School Fees" },
  { value: "medical", label: "Medical" },
  { value: "rent", label: "Rent" },
  { value: "food", label: "Food" },
] as const;

interface BlackTaxFormData {
  recipientName: string;
  relationship: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  date: string;
  note: string;
  isRecurring: boolean;
}

interface WmBlackTaxEntryFormProps {
  trigger?: React.ReactNode;
  onSubmit?: (data: BlackTaxFormData) => void;
}

function WmBlackTaxEntryForm({ trigger, onSubmit }: WmBlackTaxEntryFormProps) {
  const [open, setOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0] ?? "");
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  function resetForm() {
    setRecipientName("");
    setRelationship("");
    setAmount("");
    setCurrency("NGN");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0] ?? "");
    setNote("");
    setIsRecurring(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!recipientName || !relationship || !category || isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onSubmit?.({
      recipientName,
      relationship,
      amount: parsedAmount,
      currency,
      category,
      date,
      note,
      isRecurring,
    });

    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            Add Family Support
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Family Support</DialogTitle>
            <DialogDescription>
              Track money sent to family members. Every entry helps you
              understand your true financial picture.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            {/* Recipient Name */}
            <div className="grid gap-2">
              <Label htmlFor="bt-recipient">Recipient Name</Label>
              <Input
                id="bt-recipient"
                placeholder="e.g. Mum, Uncle Bayo"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>

            {/* Relationship + Category row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Relationship</Label>
                <Select value={relationship} onValueChange={setRelationship}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount + Currency row */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="grid gap-2">
                <Label htmlFor="bt-amount">Amount</Label>
                <Input
                  id="bt-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger className="w-full">
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

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="bt-date">Date</Label>
              <Input
                id="bt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Note */}
            <div className="grid gap-2">
              <Label htmlFor="bt-note">
                Note{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="bt-note"
                placeholder="What was this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>

            {/* Is Recurring toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={isRecurring}
                onClick={() => setIsRecurring(!isRecurring)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  isRecurring ? "bg-primary" : "bg-input"
                }`}
              >
                <span
                  className={`pointer-events-none block size-4 rounded-full bg-white shadow-lg transition-transform ${
                    isRecurring ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <Label className="cursor-pointer" onClick={() => setIsRecurring(!isRecurring)}>
                This is a recurring payment
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { WmBlackTaxEntryForm };
