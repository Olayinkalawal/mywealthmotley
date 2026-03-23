"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[myWealthMotley] Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(255,179,71,0.1)",
          border: "1px solid rgba(255,179,71,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffb347"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "8px",
          fontFamily: "DynaPuff, cursive",
        }}
      >
        Oops! Something broke
      </h2>
      <p
        style={{
          color: "#968a84",
          maxWidth: "360px",
          lineHeight: 1.6,
          fontSize: "0.9rem",
          marginBottom: "20px",
        }}
      >
        This page encountered an error. Your data is safe &mdash; try refreshing or
        head back to the dashboard.
      </p>
      {error.digest && (
        <p
          style={{
            color: "#968a84",
            fontSize: "0.7rem",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: "12px",
          }}
        >
          Reference: {error.digest}
        </p>
      )}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            background: "#ffb347",
            color: "#0d0b0a",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <a
          href="/dashboard"
          style={{
            padding: "10px 24px",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            fontWeight: "500",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
