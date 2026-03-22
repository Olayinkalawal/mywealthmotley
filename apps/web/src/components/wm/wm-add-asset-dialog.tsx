"use client";

import { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
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
import { Separator } from "@/components/ui/separator";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/lib/constants";
import type { AssetType } from "@/lib/mock-data";

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: "investment", label: "Investment" },
  { value: "pension", label: "Pension" },
  { value: "property", label: "Property" },
  { value: "crypto", label: "Crypto" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
];

interface Holding {
  ticker: string;
  name: string;
  quantity: string;
  value: string;
}

interface WmAddAssetDialogProps {
  trigger?: React.ReactNode;
  onSubmit?: (data: {
    name: string;
    type: AssetType;
    platform: string;
    value: number;
    currency: CurrencyCode;
    notes: string;
    holdings?: {
      ticker?: string;
      name: string;
      quantity?: number;
      value: number;
      currency: CurrencyCode;
    }[];
  }) => void;
}

function WmAddAssetDialog({ trigger, onSubmit }: WmAddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("investment");
  const [platform, setPlatform] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [notes, setNotes] = useState("");
  const [holdings, setHoldings] = useState<Holding[]>([]);

  const showHoldings = type === "investment";

  function addHolding() {
    setHoldings((prev) => [
      ...prev,
      { ticker: "", name: "", quantity: "", value: "" },
    ]);
  }

  function removeHolding(index: number) {
    setHoldings((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHolding(index: number, field: keyof Holding, val: string) {
    setHoldings((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: val } : h)),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedValue = parseFloat(value);
    if (!name || isNaN(parsedValue) || parsedValue <= 0) return;

    onSubmit?.({
      name,
      type,
      platform,
      value: parsedValue,
      currency,
      notes,
      holdings: showHoldings
        ? holdings
            .filter((h) => h.name && h.value)
            .map((h) => ({
              ticker: h.ticker || undefined,
              name: h.name,
              quantity: h.quantity ? parseFloat(h.quantity) : undefined,
              value: parseFloat(h.value) || 0,
              currency,
            }))
        : undefined,
    });

    // Reset form
    setName("");
    setType("investment");
    setPlatform("");
    setValue("");
    setCurrency("NGN");
    setNotes("");
    setHoldings([]);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            Add Asset
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
            <DialogDescription>
              Manually add an investment, pension, property, or other asset to
              track your complete net worth.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="asset-name">Asset Name</Label>
              <Input
                id="asset-name"
                placeholder="e.g. Cowrywise Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Type + Currency row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as AssetType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Platform */}
            <div className="grid gap-2">
              <Label htmlFor="asset-platform">
                Platform{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="asset-platform"
                placeholder="e.g. Trading 212, ARM Pensions"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>

            {/* Value */}
            <div className="grid gap-2">
              <Label htmlFor="asset-value">Value</Label>
              <Input
                id="asset-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>

            {/* Holdings sub-form (investment type only) */}
            {showHoldings && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>
                      Holdings{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHolding}
                    >
                      <Plus className="size-3" />
                      Add
                    </Button>
                  </div>

                  {holdings.map((holding, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2"
                    >
                      <Input
                        placeholder="Ticker"
                        value={holding.ticker}
                        onChange={(e) =>
                          updateHolding(idx, "ticker", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Name"
                        value={holding.name}
                        onChange={(e) =>
                          updateHolding(idx, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Qty"
                        type="number"
                        value={holding.quantity}
                        onChange={(e) =>
                          updateHolding(idx, "quantity", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        type="number"
                        value={holding.value}
                        onChange={(e) =>
                          updateHolding(idx, "value", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeHolding(idx)}
                      >
                        <Trash className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="asset-notes">
                Notes{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="asset-notes"
                placeholder="Any additional notes about this asset..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { WmAddAssetDialog };
