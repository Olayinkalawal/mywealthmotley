"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatCurrency,
  formatCompactCurrency,
  getCurrencySymbol,
} from "@/lib/currencies";
import { SUPPORTED_COUNTRIES, type CurrencyCode } from "@/lib/constants";

const CURRENCY_STORAGE_KEY = "wm-preferred-currency";

/**
 * Reads the user's preferred currency from localStorage.
 * Falls back to the provided default (or "NGN") if nothing is stored.
 */
function getStoredCurrency(fallback: CurrencyCode = "NGN"): CurrencyCode {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && SUPPORTED_COUNTRIES.some((c) => c.currency === stored)) {
      return stored as CurrencyCode;
    }
  } catch {
    // localStorage not available
  }
  return fallback;
}

/**
 * Hook for currency formatting and preference management.
 * Reads the user's preference from localStorage (set by the header
 * currency selector) so every page displays the correct currency.
 *
 * @example
 * const { format, formatCompact, symbol, currency, setCurrency } = useCurrency();
 * format(15000) // "£15,000.00" (if user chose GBP)
 * formatCompact(1500000) // "£1.5M"
 */
export function useCurrency(defaultCurrency: CurrencyCode = "NGN") {
  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultCurrency);

  // On mount, read from localStorage so we pick up the header selector value
  useEffect(() => {
    setCurrencyState(getStoredCurrency(defaultCurrency));
  }, [defaultCurrency]);

  // Listen for storage events so if the header selector changes,
  // all components using this hook re-render with the new currency.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CURRENCY_STORAGE_KEY && e.newValue) {
        const valid = SUPPORTED_COUNTRIES.some(
          (c) => c.currency === e.newValue,
        );
        if (valid) {
          setCurrencyState(e.newValue as CurrencyCode);
        }
      }
    }
    window.addEventListener("storage", onStorage);

    // Also listen for a custom event dispatched by the currency selector
    // (storage events don't fire in the same tab)
    function onCustom() {
      setCurrencyState(getStoredCurrency(defaultCurrency));
    }
    window.addEventListener("wm-currency-changed", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wm-currency-changed", onCustom);
    };
  }, [defaultCurrency]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // localStorage not available
    }
    // Dispatch a custom event so other hooks in the same tab pick it up
    window.dispatchEvent(new Event("wm-currency-changed"));
  }, []);

  const format = useCallback(
    (amount: number) => formatCurrency(amount, currency),
    [currency],
  );

  const formatCompact = useCallback(
    (amount: number) => formatCompactCurrency(amount, currency),
    [currency],
  );

  const symbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  return {
    currency,
    setCurrency,
    format,
    formatCompact,
    symbol,
  } as const;
}

/**
 * Convenience alias: returns just the user's preferred currency code.
 * Use this in pages that only need the code, not the full formatting API.
 */
export function useUserCurrency(): CurrencyCode {
  const { currency } = useCurrency();
  return currency;
}
