// ── Archetype & Quiz Icon Mapping ──────────────────────────────────
// Maps iconName strings from money-dna.ts to Phosphor icon components.

import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  Heart,
  CloudMoon,
  Confetti,
  Wrench,
  Shield,
  Rocket,
  ClipboardText,
  Bank,
  UsersThree,
  CurrencyCircleDollar,
  ChartBar,
  SmileyNervous,
  HandPalm,
  Warning,
  TrendUp,
  Question,
  Hourglass,
  ShoppingBag,
  Notepad,
  PiggyBank,
  ChartLineUp,
  Lock,
  Champagne,
  Sunglasses,
  EyeSlash,
  SmileyWink,
  ChatDots,
  ArrowsClockwise,
  Scales,
  HandHeart,
  GameController,
  PenNib,
  MagnifyingGlass,
  PersonSimpleRun,
  Megaphone,
} from "@phosphor-icons/react";

const ICON_MAP: Record<string, PhosphorIcon> = {
  // Archetype icons
  Heart,
  CloudMoon,
  Confetti,
  Wrench,
  Shield,
  Rocket,
  // Quiz option icons
  ClipboardText,
  Bank,
  UsersThree,
  CurrencyCircleDollar,
  ChartBar,
  SmileyNervous,
  HandPalm,
  Warning,
  TrendUp,
  Question,
  Hourglass,
  ShoppingBag,
  Notepad,
  PiggyBank,
  ChartLineUp,
  Lock,
  Champagne,
  Sunglasses,
  EyeSlash,
  SmileyWink,
  ChatDots,
  ArrowsClockwise,
  Scales,
  HandHeart,
  GameController,
  PenNib,
  MagnifyingGlass,
  PersonSimpleRun,
  Megaphone,
};

/**
 * Resolves an `iconName` string to its Phosphor icon component.
 * Falls back to `Question` if the name is not found.
 */
export function getIconComponent(iconName: string): PhosphorIcon {
  return ICON_MAP[iconName] ?? Question;
}
