"use client";

import { useEffect, useRef, useCallback } from "react";
import { useClerk } from "@clerk/nextjs";

const INACTIVITY_WARNING_MS = 15 * 60 * 1000; // 15 minutes
const INACTIVITY_SIGNOUT_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Tracks user activity and signs out after prolonged inactivity.
 *
 * - After 15 minutes of no mouse/key/click/scroll: shows a warning toast.
 * - After 20 minutes total: calls clerk.signOut() and redirects to sign-in.
 * - Any activity resets both timers.
 * - Uses refs exclusively to avoid re-renders.
 */
export function useSessionTimeout() {
  const { signOut } = useClerk();

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);

  // ── Show the inactivity warning toast ─────────────────────────────
  const showWarning = useCallback(() => {
    // Avoid duplicate toasts
    if (toastRef.current) return;

    const toast = document.createElement("div");
    toast.id = "wm-session-timeout-toast";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: "9999",
      padding: "16px 20px",
      borderRadius: "12px",
      background: "rgba(13, 11, 10, 0.92)",
      border: "1px solid rgba(255, 179, 71, 0.3)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      color: "#968a84",
      fontSize: "14px",
      fontFamily: "inherit",
      maxWidth: "380px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    });

    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <svg width="20" height="20" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm56-88a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8V80a8 8 0 0 1 16 0v40h40a8 8 0 0 1 8 8Z" fill="#ffb347"/>
        </svg>
        <div>
          <div style="font-weight:600;color:#ffb347;margin-bottom:2px;">Session expiring soon</div>
          <div>Your session will expire in 5 minutes due to inactivity.</div>
        </div>
      </div>
    `;

    document.body.appendChild(toast);
    toastRef.current = toast;
  }, []);

  // ── Remove the warning toast ──────────────────────────────────────
  const hideWarning = useCallback(() => {
    if (toastRef.current) {
      toastRef.current.remove();
      toastRef.current = null;
    }
  }, []);

  // ── Handle sign-out due to inactivity ─────────────────────────────
  const handleSignOut = useCallback(async () => {
    hideWarning();
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } catch {
      // Fallback in case signOut fails
      window.location.href = "/sign-in";
    }
  }, [signOut, hideWarning]);

  // ── Reset both timers on any activity ─────────────────────────────
  const resetTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (signOutTimerRef.current) clearTimeout(signOutTimerRef.current);
    hideWarning();

    warningTimerRef.current = setTimeout(showWarning, INACTIVITY_WARNING_MS);
    signOutTimerRef.current = setTimeout(handleSignOut, INACTIVITY_SIGNOUT_MS);
  }, [showWarning, handleSignOut, hideWarning]);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    // Throttle: only reset timers once per second to avoid performance issues
    let lastReset = 0;
    const throttledReset = () => {
      const now = Date.now();
      if (now - lastReset > 1000) {
        lastReset = now;
        resetTimers();
      }
    };

    // Start the initial timers
    resetTimers();

    for (const event of events) {
      window.addEventListener(event, throttledReset, { passive: true });
    }

    return () => {
      for (const event of events) {
        window.removeEventListener(event, throttledReset);
      }
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (signOutTimerRef.current) clearTimeout(signOutTimerRef.current);
      hideWarning();
    };
  }, [resetTimers, hideWarning]);
}
