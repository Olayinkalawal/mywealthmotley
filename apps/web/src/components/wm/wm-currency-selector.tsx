"use client";

import * as React from "react";
import { CircleFlag } from "react-circle-flags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_COUNTRIES, type CurrencyCode } from "@/lib/constants";

const CURRENCY_STORAGE_KEY = "wm-preferred-currency";

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "\u20A6",
  GBP: "\u00A3",
  USD: "$",
  CAD: "C$",
  EUR: "\u20AC",
  AED: "AED",
  GHS: "GH\u20B5",
  KES: "KSh",
  ZAR: "R",
};

function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "NGN";
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && SUPPORTED_COUNTRIES.some((c) => c.currency === stored)) {
      return stored as CurrencyCode;
    }
  } catch {
    // localStorage not available
  }
  return "NGN";
}

export function WmCurrencySelector() {
  const [currency, setCurrency] = React.useState<CurrencyCode>("NGN");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setCurrency(getStoredCurrency());
    setMounted(true);
  }, []);

  const handleChange = (value: string) => {
    const newCurrency = value as CurrencyCode;
    setCurrency(newCurrency);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    } catch {
      // localStorage not available
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-9 w-[110px] items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm">
        <span className="opacity-50">NGN</span>
      </div>
    );
  }

  const selectedCountry = SUPPORTED_COUNTRIES.find(
    (c) => c.currency === currency
  );

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger className="w-[110px] border-sidebar-border bg-transparent">
        <SelectValue>
          {selectedCountry && (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex size-4 shrink-0 overflow-hidden rounded-full"><CircleFlag countryCode={selectedCountry.code.toLowerCase()} height={16} width={16} /></span>
              <span className="text-sm font-medium">{currency}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {SUPPORTED_COUNTRIES.map((country) => (
          <SelectItem key={country.currency} value={country.currency}>
            <span className="flex items-center gap-2">
              <span className="inline-flex size-5 shrink-0 overflow-hidden rounded-full"><CircleFlag countryCode={country.code.toLowerCase()} height={20} width={20} /></span>
              <span className="font-medium">{country.currency}</span>
              <span className="text-muted-foreground">
                {CURRENCY_SYMBOLS[country.currency]}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
