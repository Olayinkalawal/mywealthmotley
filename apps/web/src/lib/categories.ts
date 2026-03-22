export const SPENDING_CATEGORIES = [
  { id: "food", name: "Jollof & Chops", icon: "ForkKnife", color: "#E8614D" },
  {
    id: "transport",
    name: "Transport & Bolt",
    icon: "Car",
    color: "#5B9A6D",
  },
  {
    id: "data_airtime",
    name: "Data & Airtime",
    icon: "WifiHigh",
    color: "#2563EB",
  },
  {
    id: "church_tithes",
    name: "Tithes & Offerings",
    icon: "Heart",
    color: "#8B5CF6",
  },
  {
    id: "family_support",
    name: "Family Support",
    icon: "UsersThree",
    color: "#D4A843",
  },
  {
    id: "owambe",
    name: "Owambe & Aso Ebi",
    icon: "Confetti",
    color: "#EC4899",
  },
  { id: "rent", name: "Rent & Housing", icon: "House", color: "#8B6B5A" },
  {
    id: "utilities",
    name: "Utilities & Bills",
    icon: "Lightning",
    color: "#F59E0B",
  },
  {
    id: "school_fees",
    name: "School Fees",
    icon: "GraduationCap",
    color: "#0EA5E9",
  },
  {
    id: "generator",
    name: "Generator & Fuel",
    icon: "GasPump",
    color: "#6B7280",
  },
  {
    id: "market",
    name: "Market & Provisions",
    icon: "ShoppingBag",
    color: "#10B981",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Television",
    color: "#A855F7",
  },
  {
    id: "health",
    name: "Health & Medical",
    icon: "Heartbeat",
    color: "#EF4444",
  },
  {
    id: "savings",
    name: "Savings & Investments",
    icon: "PiggyBank",
    color: "#14B8A6",
  },
  { id: "other", name: "Other", icon: "DotsThree", color: "#94A3B8" },
] as const;

export type SpendingCategoryId = (typeof SPENDING_CATEGORIES)[number]["id"];

/**
 * Look up a category by its ID.
 */
export function getCategoryById(id: string) {
  return SPENDING_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get the display name for a category ID.
 * Returns "Other" for unknown categories.
 */
export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name ?? "Other";
}

/**
 * Get the color for a category ID.
 * Returns the "other" color for unknown categories.
 */
export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color ?? "#94A3B8";
}
