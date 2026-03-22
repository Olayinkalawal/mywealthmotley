"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { ShieldCheck, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

/**
 * Persistent banner prompting users to enable MFA on their account.
 * Dismissible per session via sessionStorage.
 */
export function WmMfaPrompt() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem("wm_mfa_dismissed");
      if (wasDismissed === "true") {
        setDismissed(true);
      }
    }
  }, []);

  // Don't render until Clerk has loaded user data
  if (!isLoaded || !user) return null;

  // If MFA is already enabled, render nothing
  if (user.twoFactorEnabled) return null;

  // If dismissed this session, render nothing
  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("wm_mfa_dismissed", "true");
    }
  };

  const handleSetup = () => {
    router.push("/settings");
  };

  return (
    <div
      className="relative mx-4 mt-4 rounded-xl border px-4 py-3 md:mx-6 lg:mx-8"
      style={{
        background: "rgba(255, 179, 71, 0.08)",
        borderColor: "rgba(255, 179, 71, 0.25)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Accent bar */}
        <div
          className="hidden h-10 w-1 flex-shrink-0 rounded-full sm:block"
          style={{ background: "#ffb347" }}
        />

        <ShieldCheck
          size={22}
          weight="fill"
          className="flex-shrink-0"
          style={{ color: "#ffb347" }}
        />

        <p
          className="flex-1 text-sm font-medium"
          style={{ color: "#968a84" }}
        >
          Protect your financial data &mdash; enable two-factor authentication
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSetup}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-90"
            style={{
              background: "#ffb347",
              color: "#0d0b0a",
            }}
          >
            Set Up Now
          </button>

          <button
            onClick={handleDismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{
              background: "rgba(150, 138, 132, 0.15)",
              color: "#968a84",
            }}
          >
            <span className="hidden sm:inline">Remind Me Later</span>
            <X size={14} weight="bold" className="sm:hidden" />
          </button>
        </div>
      </div>
    </div>
  );
}
