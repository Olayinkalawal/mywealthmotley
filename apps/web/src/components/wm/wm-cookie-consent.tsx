"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cookie,
  ShieldCheck,
  Gear,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

// ── Types ───────────────────────────────────────────────────────────
interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  timestamp: number;
}

const STORAGE_KEY = "wm-cookie-consent";

function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

// ── Component ───────────────────────────────────────────────────────
function WmCookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [functional, setFunctional] = useState(true);

  const { isAuthenticated } = useConvexAuth();
  const updateConsent = useMutation(api.users.updateConsent);

  // Only show the banner if no consent has been stored yet
  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const saveConsent = useCallback(
    (consent: CookieConsent) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      setVisible(false);

      // Fire-and-forget: persist analytics consent to Convex if authenticated
      if (isAuthenticated) {
        updateConsent({
          consentType: "analytics",
          granted: consent.analytics,
        }).catch(() => {
          // silently fail — fire-and-forget
        });
      }
    },
    [isAuthenticated, updateConsent]
  );

  const handleAcceptEssential = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: false,
      functional: false,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const handleAcceptAll = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: true,
      functional: true,
      timestamp: Date.now(),
    });
  }, [saveConsent]);

  const handleSaveCustom = useCallback(() => {
    saveConsent({
      essential: true,
      analytics,
      functional,
      timestamp: Date.now(),
    });
  }, [saveConsent, analytics, functional]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#1a1a1e]/90 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffb347]/15">
                <Cookie className="size-5 text-[#ffb347]" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">
                  We value your privacy
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#968a84]">
                  We use cookies to keep you signed in and remember your
                  preferences. Analytics cookies help us improve the app but are
                  entirely optional.
                </p>
              </div>
            </div>

            {/* Customize panel */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 rounded-xl border border-white/5 bg-white/5 p-4">
                    {/* Essential */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck
                          className="size-4 text-[#34d399]"
                          weight="fill"
                        />
                        <div>
                          <p className="text-xs font-medium text-white">
                            Essential
                          </p>
                          <p className="text-[10px] text-[#968a84]">
                            Authentication &amp; session — always on
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-flex h-5 w-9 cursor-not-allowed items-center rounded-full bg-[#34d399]/30">
                        <span className="absolute left-[18px] size-3.5 rounded-full bg-[#34d399] shadow-sm transition-all" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gear className="size-4 text-[#968a84]" />
                        <div>
                          <p className="text-xs font-medium text-white">
                            Analytics
                          </p>
                          <p className="text-[10px] text-[#968a84]">
                            Usage patterns — helps us improve
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={analytics}
                        onClick={() => setAnalytics((v) => !v)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          analytics ? "bg-[#ffb347]/30" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute size-3.5 rounded-full shadow-sm transition-all ${
                            analytics
                              ? "left-[18px] bg-[#ffb347]"
                              : "left-[3px] bg-[#968a84]"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Functional */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gear className="size-4 text-[#968a84]" />
                        <div>
                          <p className="text-xs font-medium text-white">
                            Functional
                          </p>
                          <p className="text-[10px] text-[#968a84]">
                            Preferences &amp; currency settings
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={functional}
                        onClick={() => setFunctional((v) => !v)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          functional ? "bg-[#ffb347]/30" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute size-3.5 rounded-full shadow-sm transition-all ${
                            functional
                              ? "left-[18px] bg-[#ffb347]"
                              : "left-[3px] bg-[#968a84]"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {expanded ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="rounded-lg bg-[#ffb347] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#ffb347]/90"
                >
                  Save Preferences
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="rounded-lg bg-[#ffb347] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#ffb347]/90"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptEssential}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-[#968a84] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Essential Only
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-auto flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-[#968a84] transition-colors hover:text-white"
              >
                Customize
                {expanded ? (
                  <CaretUp className="size-3" />
                ) : (
                  <CaretDown className="size-3" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { WmCookieConsent };
