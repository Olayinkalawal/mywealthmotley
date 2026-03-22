"use client";

import { useCallback, useMemo, useState } from "react";
import {
  formatCurrency,
  formatCompactCurrency,
  getCurrencySymbol,
} from "@/lib/currencies";
import type { CurrencyCode } from "@/lib/constants";

/**
 * Hook for currency formatting and preference management.
 *
 * @example
 * const { format, formatCompact, symbol, currency, setCurrency } = useCurrency();
 * format(15000) // "₦15,000.00"
 * formatCompact(1500000) // "₦1.5M"
 */
export function useCurrency(defaultCurrency: CurrencyCode = "NGN") {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);

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
