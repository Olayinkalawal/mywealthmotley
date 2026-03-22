"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        minHeight: "300px",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffb347"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ animation: "sso-spin 1s linear infinite" }}
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      <style>{`@keyframes sso-spin { to { transform: rotate(360deg); } }`}</style>
      <p
        style={{
          fontSize: "0.925rem",
          fontWeight: 500,
          color: "#968a84",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Completing sign in...
      </p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
