"use client";

/**
 * Lightweight client-side error reporter.
 * Logs unhandled errors to console with structured format.
 * Can be extended to send to Sentry/LogRocket when ready.
 */
export function initErrorReporter() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    console.error("[myWealthMotley] Unhandled error:", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: new Date().toISOString(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("[myWealthMotley] Unhandled promise rejection:", {
      reason: event.reason?.message || String(event.reason),
      timestamp: new Date().toISOString(),
    });
  });
}
