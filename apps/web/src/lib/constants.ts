export const APP_NAME = "myWealthMotley";
export const APP_DESCRIPTION =
  "The first AI-powered financial education companion built for Africans";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const SUPPORTED_COUNTRIES = [
  { code: "NG", name: "Nigeria", currency: "NGN", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "GB", name: "United Kingdom", currency: "GBP", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "US", name: "United States", currency: "USD", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "CA", name: "Canada", currency: "CAD", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "DE", name: "Germany", currency: "EUR", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "AE", name: "UAE", currency: "AED", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "GH", name: "Ghana", currency: "GHS", flag: "\u{1F1EC}\u{1F1ED}" },
  { code: "KE", name: "Kenya", currency: "KES", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", currency: "ZAR", flag: "\u{1F1FF}\u{1F1E6}" },
] as const;

export const SUPPORTED_CURRENCIES = [
  "NGN",
  "GBP",
  "USD",
  "CAD",
  "EUR",
  "AED",
  "ZAR",
  "GHS",
  "KES",
] as const;

export type CountryCode = (typeof SUPPORTED_COUNTRIES)[number]["code"];
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const API_URLS = {
  convex: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
  },
} as const;

export const ROUTES = {
  home: "/",
  waitlist: "/waitlist",
  signIn: "/sign-in",
  signUp: "/sign-up",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  allMyMoney: "/all-my-money",
  transactions: "/transactions",
  budget: "/budget",
  savings: "/savings",
  blackTax: "/black-tax",
  japa: "/japa",
  portfolio: "/portfolio",
  portfolioImport: "/portfolio/import",
  learn: "/learn",
  moneyStory: "/money-story",
  sholz: "/sholz",
  settings: "/settings",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminAnalytics: "/admin/analytics",
  adminContent: "/admin/content",
  adminBilling: "/admin/billing",
} as const;

export const SUPPORT_EMAIL = "hello@wealthmotley.com";
