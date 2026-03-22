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
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

function getStoredCurrency(): CurrencyCode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && SUPPORTED_COUNTRIES.some((c) => c.currency === stored)) {
      return stored as CurrencyCode;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

export function WmCurrencySelector() {
  const [currency, setCurrency] = React.useState<CurrencyCode>("NGN");
  const [mounted, setMounted] = React.useState(false);

  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getUser, isAuthenticated ? {} : "skip");
  const updatePrefs = useMutation(api.users.updateUserPreferences);

  // On mount: prefer localStorage, then fall back to the Convex user currency
  React.useEffect(() => {
    const stored = getStoredCurrency();
    if (stored) {
      setCurrency(stored);
    } else if (user?.currency) {
      const userCurrency = user.currency as CurrencyCode;
      setCurrency(userCurrency);
      // Seed localStorage from Convex so all hooks pick it up
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, userCurrency);
        window.dispatchEvent(new Event("wm-currency-changed"));
      } catch {
        // localStorage not available
      }
    }
    setMounted(true);
  }, [user?.currency]);

  const handleChange = (value: string) => {
    const newCurrency = value as CurrencyCode;
    setCurrency(newCurrency);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    } catch {
      // localStorage not available
    }
    // Dispatch custom event so useCurrency hooks in the same tab update
    window.dispatchEvent(new Event("wm-currency-changed"));

    // Also persist to Convex user profile (fire-and-forget)
    if (isAuthenticated) {
      const matchingCountry = SUPPORTED_COUNTRIES.find(
        (c) => c.currency === newCurrency,
      );
      updatePrefs({
        currency: newCurrency,
        ...(matchingCountry ? { country: matchingCountry.code } : {}),
      }).catch(() => {
        // Convex update failed silently
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-9 w-[110px] items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm">
        <span className="opacity-50">...</span>
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
