"use client";

import { useState, useMemo, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
import { Plus, Confetti } from "@phosphor-icons/react";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/lib/constants";
import { toast } from "sonner";

// ── Investment platforms ──────────────────────────────────────────────
const PLATFORMS = [
  "Trading 212",
  "Cowrywise",
  "Bamboo",
  "eToro",
  "Risevest",
  "Binance",
  "Interactive Brokers",
  "Charles Schwab",
  "Robinhood",
  "Fidelity",
  "Other",
] as const;

// ── Common stocks/ETFs for autocomplete ──────────────────────────────
const COMMON_INVESTMENTS = [
  { name: "Vanguard S&P 500 ETF", ticker: "VOO" },
  { name: "Vanguard Total Stock Market ETF", ticker: "VTI" },
  { name: "Invesco QQQ Trust", ticker: "QQQ" },
  { name: "Vanguard FTSE All-World UCITS ETF", ticker: "VWRL" },
  { name: "Vanguard S&P 500 UCITS ETF", ticker: "VUAG" },
  { name: "iShares MSCI World UCITS ETF", ticker: "SWDA" },
  { name: "iShares Core S&P 500 UCITS ETF", ticker: "CSPX" },
  { name: "VanEck Semiconductor ETF", ticker: "SMH" },
  { name: "Technology Select Sector SPDR Fund", ticker: "XLK" },
  { name: "SPDR S&P 500 ETF Trust", ticker: "SPY" },
  { name: "Schwab US Dividend Equity ETF", ticker: "SCHD" },
  { name: "Apple Inc.", ticker: "AAPL" },
  { name: "Microsoft Corporation", ticker: "MSFT" },
  { name: "NVIDIA Corporation", ticker: "NVDA" },
  { name: "Amazon.com Inc.", ticker: "AMZN" },
  { name: "Alphabet Inc.", ticker: "GOOGL" },
  { name: "Tesla Inc.", ticker: "TSLA" },
  { name: "Meta Platforms Inc.", ticker: "META" },
  { name: "Dangote Cement", ticker: "DANGCEM" },
  { name: "MTN Nigeria", ticker: "MTNN" },
  { name: "Airtel Africa", ticker: "AAF" },
  { name: "Cowrywise Dollar Fund", ticker: "" },
  { name: "Cowrywise Regular Plan", ticker: "" },
  { name: "Risevest Fixed Income", ticker: "" },
  { name: "Risevest Dollar Stocks", ticker: "" },
];

// ── Component ────────────────────────────────────────────────────────
interface WmQuickAddInvestmentProps {
  trigger?: React.ReactNode;
  onComplete?: () => void;
  defaultOpen?: boolean;
}

function WmQuickAddInvestment({
  trigger,
  onComplete,
  defaultOpen = false,
}: WmQuickAddInvestmentProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [platform, setPlatform] = useState("");
  const [stockName, setStockName] = useState("");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0] ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addManualAsset = useMutation(api.allMyMoney.addManualAsset);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!stockName || stockName.length < 1) return [];
    const lower = stockName.toLowerCase();
    return COMMON_INVESTMENTS.filter(
      (inv) =>
        inv.name.toLowerCase().includes(lower) ||
        inv.ticker.toLowerCase().includes(lower)
    ).slice(0, 6);
  }, [stockName]);

  const selectSuggestion = useCallback(
    (inv: { name: string; ticker: string }) => {
      setStockName(inv.name);
      setTicker(inv.ticker);
      setShowSuggestions(false);
    },
    []
  );

  const resetForm = useCallback(() => {
    setPlatform("");
    setStockName("");
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setCurrency("USD");
    setPurchaseDate(new Date().toISOString().split("T")[0] ?? "");
    setShowSuggestions(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const qty = parseFloat(quantity);
      const price = parseFloat(purchasePrice);

      if (!stockName.trim()) {
        toast.error("Please enter the stock or ETF name");
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        toast.error("Please enter a valid quantity");
        return;
      }
      if (isNaN(price) || price <= 0) {
        toast.error("Please enter a valid purchase price");
        return;
      }

      setIsSubmitting(true);

      try {
        const totalValue = qty * price;

        await addManualAsset({
          name: platform ? `${platform} - ${stockName}` : stockName,
          type: "investment",
          platform: platform || undefined,
          value: totalValue,
          currency,
          holdings: [
            {
              ticker: ticker || undefined,
              name: stockName,
              quantity: qty,
              value: totalValue,
              currency,
            },
          ],
          notes: purchaseDate
            ? `Purchased on ${purchaseDate}`
            : undefined,
        });

        toast.success(
          `Added ${qty} share${qty !== 1 ? "s" : ""} of ${stockName} -- net worth updated!`
        );
        resetForm();
        setOpen(false);
        onComplete?.();
      } catch (error: any) {
        toast.error(error.message || "Failed to add investment. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      stockName,
      ticker,
      quantity,
      purchasePrice,
      currency,
      platform,
      purchaseDate,
      addManualAsset,
      onComplete,
      resetForm,
    ]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="mr-1 size-4" />
            Quick Add Stock
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Confetti className="size-5 text-secondary" />
              Quick Add Investment
            </DialogTitle>
            <DialogDescription>
              Add a stock, ETF, or fund to your portfolio. Your net worth
              updates instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-4">
            {/* Platform */}
            <div className="grid gap-1.5">
              <Label htmlFor="qa-platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="qa-platform" className="w-full">
                  <SelectValue placeholder="Select platform..." />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock/ETF Name with autocomplete */}
            <div className="relative grid gap-1.5">
              <Label htmlFor="qa-stock">Stock / ETF Name</Label>
              <Input
                id="qa-stock"
                placeholder="e.g. VOO, Apple, Cowrywise Dollar Fund"
                value={stockName}
                onChange={(e) => {
                  setStockName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                required
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-popover p-1 shadow-lg">
                  {suggestions.map((inv) => (
                    <button
                      key={`${inv.ticker}-${inv.name}`}
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(inv);
                      }}
                    >
                      <span className="font-medium">{inv.name}</span>
                      {inv.ticker && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {inv.ticker}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ticker */}
            <div className="grid gap-1.5">
              <Label htmlFor="qa-ticker">
                Ticker Symbol{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="qa-ticker"
                placeholder="e.g. AAPL, VOO, VUSA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
              />
            </div>

            {/* Quantity + Price row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="qa-quantity">Quantity / Shares</Label>
                <Input
                  id="qa-quantity"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="qa-price">Price per Share</Label>
                <Input
                  id="qa-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Total value display */}
            {quantity && purchasePrice && (
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="font-heading text-lg font-bold text-secondary">
                  {(() => {
                    const total =
                      parseFloat(quantity) * parseFloat(purchasePrice);
                    return isNaN(total)
                      ? "--"
                      : new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency,
                        }).format(total);
                  })()}
                </p>
              </div>
            )}

            {/* Currency + Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
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
              <div className="grid gap-1.5">
                <Label htmlFor="qa-date">Date of Purchase</Label>
                <Input
                  id="qa-date"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
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
              {isSubmitting ? "Adding..." : "Add Investment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { WmQuickAddInvestment };
