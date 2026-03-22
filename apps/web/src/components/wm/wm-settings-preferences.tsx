"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "@phosphor-icons/react";
import { CircleFlag } from "react-circle-flags";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SUPPORTED_COUNTRIES, type CurrencyCode } from "@/lib/constants";

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

const CURRENCY_STORAGE_KEY = "wm-preferred-currency";
const TONE_STORAGE_KEY = "wm-sholz-tone";
const LANGUAGE_STORAGE_KEY = "wm-language";

type SholzTone = "warm" | "formal";

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

function getStoredTone(): SholzTone {
  if (typeof window === "undefined") return "warm";
  try {
    const stored = localStorage.getItem(TONE_STORAGE_KEY);
    if (stored === "warm" || stored === "formal") return stored;
  } catch {
    // localStorage not available
  }
  return "warm";
}

function getStoredLanguage(): string {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  } catch {
    return "en";
  }
}

export function WmSettingsPreferences() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currency, setCurrency] = React.useState<CurrencyCode>("NGN");
  const [tone, setTone] = React.useState<SholzTone>("warm");
  const [language, setLanguage] = React.useState("en");

  React.useEffect(() => {
    setCurrency(getStoredCurrency());
    setTone(getStoredTone());
    setLanguage(getStoredLanguage());
    setMounted(true);
  }, []);

  const handleCurrencyChange = (value: string) => {
    const newCurrency = value as CurrencyCode;
    setCurrency(newCurrency);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
    } catch {
      // localStorage not available
    }
    toast.success(`Primary currency changed to ${newCurrency}`);
  };

  const handleToneChange = (newTone: SholzTone) => {
    setTone(newTone);
    try {
      localStorage.setItem(TONE_STORAGE_KEY, newTone);
    } catch {
      // localStorage not available
    }
    toast.success(
      `Sholz tone set to ${newTone === "warm" ? "Warm & Friendly" : "Professional & Formal"}`
    );
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(
      `Theme changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`
    );
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
    } catch {
      // localStorage not available
    }
    toast.success("Language preference saved");
  };

  const selectedCountry = SUPPORTED_COUNTRIES.find(
    (c) => c.currency === currency
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Preferences</CardTitle>
        <CardDescription>
          Customize your WealthMotley experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primary currency */}
        <div className="space-y-2">
          <Label htmlFor="currency-select">Primary Currency</Label>
          <Select
            value={mounted ? currency : "NGN"}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger id="currency-select" className="w-full sm:w-[280px]">
              <SelectValue>
                {selectedCountry && mounted ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-flex size-4 shrink-0 overflow-hidden rounded-full"><CircleFlag countryCode={selectedCountry.code.toLowerCase()} height={16} width={16} /></span>
                    <span className="font-medium">{currency}</span>
                    <span className="text-muted-foreground">
                      {CURRENCY_SYMBOLS[currency]}
                    </span>
                  </span>
                ) : (
                  <span className="opacity-50">NGN</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
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
          <p className="text-xs text-muted-foreground">
            All amounts will be displayed in this currency
          </p>
        </div>

        {/* AI Sholz tone */}
        <div className="space-y-3">
          <div>
            <Label>AI Sholz Tone</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose how Sholz communicates with you
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={tone === "warm" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneChange("warm")}
              className="flex-1 sm:flex-none"
            >
              Warm & Friendly
            </Button>
            <Button
              variant={tone === "formal" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneChange("formal")}
              className="flex-1 sm:flex-none"
            >
              Professional & Formal
            </Button>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <div>
            <Label>Theme</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose your preferred appearance
            </p>
          </div>
          {mounted ? (
            <div className="flex gap-2">
              {[
                { value: "system", label: "System", icon: Monitor },
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange(value)}
                  className="flex-1 sm:flex-none"
                >
                  <Icon className="size-3.5" />
                  {label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex h-8 w-full items-center sm:w-auto">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language-select">Language</Label>
          <Select
            value={mounted ? language : "en"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger
              id="language-select"
              className="w-full sm:w-[280px]"
            >
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pcm" disabled>
                <span className="flex items-center gap-2">
                  <span>Pidgin English</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    Coming soon
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="yo" disabled>
                <span className="flex items-center gap-2">
                  <span>Yoruba</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    Coming soon
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="ig" disabled>
                <span className="flex items-center gap-2">
                  <span>Igbo</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    Coming soon
                  </span>
                </span>
              </SelectItem>
              <SelectItem value="ha" disabled>
                <span className="flex items-center gap-2">
                  <span>Hausa</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    Coming soon
                  </span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            More languages are on the way
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
