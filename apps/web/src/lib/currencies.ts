import type { CurrencyCode } from "./constants";

/**
 * Maps currency codes to their display locale and symbol.
 * Uses Intl.NumberFormat under the hood for proper formatting.
 */
const CURRENCY_LOCALE_MAP: Record<string, string> = {
  NGN: "en-NG",
  GBP: "en-GB",
  USD: "en-US",
  CAD: "en-CA",
  EUR: "de-DE",
  AED: "ar-AE",
  ZAR: "en-ZA",
  GHS: "en-GH",
  KES: "en-KE",
};

/**
 * Formats a numeric amount into a human-readable currency string.
 *
 * @example
 * formatCurrency(1500, "NGN") // "\u20A61,500.00"
 * formatCurrency(25.5, "GBP") // "\u00A325.50"
 * formatCurrency(1000, "USD") // "$1,000.00"
 */
export function formatCurrency(amount: number, currency: string): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unknown currency codes
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Returns the symbol for a given currency code.
 *
 * @example
 * getCurrencySymbol("NGN") // "\u20A6"
 * getCurrencySymbol("USD") // "$"
 * getCurrencySymbol("GBP") // "\u00A3"
 */
export function getCurrencySymbol(currency: string): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || "en-US";
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).formatToParts(0);
    const symbolPart = parts.find((part) => part.type === "currency");
    return symbolPart?.value ?? currency;
  } catch {
    return currency;
  }
}

/**
 * Converts an amount from one currency to another using a provided rate map.
 *
 * The rate map should contain exchange rates relative to a common base currency.
 * For example, if the base is USD:
 *   rates = { USD: 1, NGN: 1550, GBP: 0.79, EUR: 0.92 }
 *
 * @example
 * const rates = new Map([["USD", 1], ["NGN", 1550], ["GBP", 0.79]]);
 * convertAmount(100, "USD", "NGN", rates) // 155000
 * convertAmount(1550, "NGN", "USD", rates) // 1
 */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Map<string, number>,
): number {
  if (from === to) return amount;

  const fromRate = rates.get(from);
  const toRate = rates.get(to);

  if (fromRate === undefined || toRate === undefined) {
    throw new Error(
      `Missing exchange rate for ${fromRate === undefined ? from : to}`,
    );
  }

  if (fromRate === 0) {
    throw new Error(`Exchange rate for ${from} cannot be zero`);
  }

  // Convert to base currency, then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

/**
 * Formats a compact currency amount (e.g., 1.5M, 200K).
 * Useful for displaying large portfolio values.
 *
 * @example
 * formatCompactCurrency(1500000, "NGN") // "\u20A61.5M"
 * formatCompactCurrency(250000, "USD")  // "$250K"
 */
export function formatCompactCurrency(
  amount: number,
  currency: string,
): string {
  const locale = CURRENCY_LOCALE_MAP[currency] || "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}
