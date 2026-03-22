"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMono } from "@/hooks/use-mono";
import { useEnsureUser } from "@/hooks/use-ensure-user";
import { SUPPORTED_COUNTRIES, ROUTES } from "@/lib/constants";

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const COLORS = {
  bg: "#0d0b0a",
  amber: "#ffb347",
  amberDark: "#e67e22",
  muted: "#968a84",
  glass: "rgba(255, 255, 255, 0.04)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassHighlight: "rgba(255, 179, 71, 0.15)",
  dark: "#1a1614",
} as const;

// =============================================================================
// SHARED INLINE STYLES
// =============================================================================

const S = {
  body: {
    backgroundColor: COLORS.bg,
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden" as const,
    overflowY: "auto" as const,
    minHeight: "100vh",
    width: "100vw",
    display: "flex" as const,
    flexDirection: "column" as const,
    position: "relative" as const,
    WebkitFontSmoothing: "antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
  },
  ambientGlow: {
    position: "absolute" as const,
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    pointerEvents: "none" as const,
  },
  glow1: {
    top: "-10%",
    left: "-10%",
    width: "50vw",
    height: "50vw",
    background:
      "radial-gradient(circle, rgba(255, 179, 71, 0.12) 0%, transparent 70%)",
  },
  glow2: {
    bottom: "-10%",
    right: "-10%",
    width: "50vw",
    height: "50vw",
    background:
      "radial-gradient(circle, rgba(230, 126, 34, 0.05) 0%, transparent 70%)",
  },
  nav: {
    position: "fixed" as const,
    top: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: "12px 32px",
    background: COLORS.glass,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "999px",
    width: "90%",
    maxWidth: "1200px",
    zIndex: 100,
  },
  navLogo: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "1.5rem",
    color: COLORS.amber,
    textDecoration: "none" as const,
    letterSpacing: "-1px",
  },
  stepIndicator: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "12px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.75rem",
    color: COLORS.muted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  },
  stepDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: COLORS.glassBorder,
    display: "inline-block" as const,
  },
  stepDotActive: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: COLORS.amber,
    boxShadow: `0 0 10px ${COLORS.amber}`,
    display: "inline-block" as const,
  },
  main: {
    position: "relative" as const,
    zIndex: 10,
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    minHeight: "100vh",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "100px 5% 60px",
    gap: "60px",
    alignItems: "start" as const,
  },
  setupPanel: {
    maxWidth: "520px",
  },
  onboardingHeader: {
    marginBottom: "40px",
  },
  sectionLabel: {
    display: "inline-block" as const,
    padding: "6px 14px",
    background: "rgba(255, 179, 71, 0.1)",
    border: "1px solid rgba(255, 179, 71, 0.2)",
    borderRadius: "999px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: COLORS.amber,
    marginBottom: "20px",
  },
  h1: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "3.5rem",
    lineHeight: 1.1,
    color: "#ffffff",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: COLORS.muted,
    lineHeight: 1.6,
  },
  inputCard: {
    background: COLORS.glass,
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "24px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  fieldGroupLast: {
    marginBottom: 0,
  },
  fieldLabel: {
    display: "block" as const,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.75rem",
    color: COLORS.amber,
    textTransform: "uppercase" as const,
    marginBottom: "8px",
    letterSpacing: "0.05em",
  },
  formInput: {
    width: "100%",
    background: "rgba(0,0,0,0.2)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "14px 20px",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
  },
  formInputFocus: {
    width: "100%",
    background: "rgba(255, 179, 71, 0.03)",
    border: `1px solid ${COLORS.amber}`,
    borderRadius: "16px",
    padding: "14px 20px",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 0 20px rgba(255, 179, 71, 0.05)",
    boxSizing: "border-box" as const,
  },
  formSelect: {
    width: "100%",
    background: "rgba(0,0,0,0.2)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "14px 20px",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    cursor: "pointer" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23968a84' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
    paddingRight: "44px",
  },
  btnPill: {
    background: COLORS.amber,
    color: COLORS.bg,
    padding: "20px 40px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "1.125rem",
    textDecoration: "none" as const,
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "12px",
    transition:
      "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease",
    border: "none" as const,
    cursor: "pointer" as const,
    width: "100%",
    marginTop: "12px",
    fontFamily: "'Inter', sans-serif",
  },
  visualContainer: {
    position: "sticky" as const,
    top: "120px",
    display: "flex" as const,
    alignItems: "flex-start" as const,
    justifyContent: "center" as const,
    paddingTop: "20px",
  },
  // Step 1 mascot
  mascotContainer: {
    position: "relative" as const,
    width: "450px",
    height: "450px",
  },
  chip: {
    position: "absolute" as const,
    background: COLORS.glass,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "12px 20px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: COLORS.amber,
    zIndex: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  // Step 2 bank
  bankList: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "32px",
  },
  bankOption: {
    background: COLORS.glass,
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "20px",
    padding: "24px",
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: "12px",
    cursor: "pointer" as const,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textDecoration: "none" as const,
  },
  bankOptionHover: {
    border: `1px solid ${COLORS.amber}`,
    background: "rgba(255, 179, 71, 0.05)",
    transform: "translateY(-4px)",
  },
  bankOptionSelected: {
    border: `1px solid ${COLORS.amber}`,
    background: "rgba(255, 179, 71, 0.1)",
    transform: "translateY(-4px)",
    boxShadow: "0 0 20px rgba(255, 179, 71, 0.15)",
  },
  bankIcon: {
    width: "48px",
    height: "48px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: COLORS.amber,
  },
  bankName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: "#ffffff",
    fontWeight: 700,
  },
  securityBadge: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "12px",
    padding: "16px 20px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px dashed rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    marginTop: "24px",
  },
  securityText: {
    fontSize: "0.8125rem",
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  // Step 2 orbit viz
  connectionViz: {
    position: "relative" as const,
    width: "500px",
    height: "500px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  orbitRing: {
    position: "absolute" as const,
    border: `1px dashed ${COLORS.glassBorder}`,
    borderRadius: "50%",
  },
  orbit1: {
    width: "440px",
    height: "440px",
  },
  orbit2: {
    width: "320px",
    height: "320px",
  },
  centralHub: {
    position: "relative" as const,
    zIndex: 20,
    width: "140px",
    height: "140px",
    background: COLORS.amber,
    borderRadius: "50%",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    boxShadow:
      "0 0 60px rgba(255, 179, 71, 0.12), inset 0 0 20px rgba(255,255,255,0.4)",
  },
  floatingCard: {
    position: "absolute" as const,
    background: COLORS.glass,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "12px",
    padding: "12px",
    width: "64px",
    height: "64px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: "#ffffff",
    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
  },
  connectionStatus: {
    position: "absolute" as const,
    bottom: "-60px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "10px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: COLORS.amber,
    background: "rgba(255, 179, 71, 0.1)",
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 179, 71, 0.2)",
    whiteSpace: "nowrap" as const,
  },
  statusPulse: {
    width: "8px",
    height: "8px",
    background: COLORS.amber,
    borderRadius: "50%",
  },
  // Step 3
  goalSetupCard: {
    background: COLORS.glass,
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "32px",
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  cardTitle: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "1.25rem",
    marginBottom: "20px",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "12px",
  },
  goalInputContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: "16px",
  },
  inputRow: {
    display: "flex" as const,
    gap: "12px",
  },
  goalInput: {
    flex: 1,
    background: "rgba(0,0,0,0.2)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "16px",
    color: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    outline: "none",
  },
  amountInputWrap: {
    position: "relative" as const,
    flex: "0 0 160px" as const,
  },
  amountPrefix: {
    position: "absolute" as const,
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: COLORS.amber,
    fontFamily: "'JetBrains Mono', monospace",
    zIndex: 1,
    fontSize: "1.1rem",
    fontWeight: 700,
  },
  amountInput: {
    width: "100%",
    background: "rgba(0,0,0,0.2)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "16px",
    paddingLeft: "36px",
    color: "#ffffff",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "1rem",
    outline: "none",
  },
  celebrationViz: {
    position: "relative" as const,
    width: "500px",
    height: "500px",
  },
  mascotCelebrate: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "360px",
    height: "360px",
    zIndex: 20,
  },
  mascotBody: {
    position: "absolute" as const,
    inset: 0,
    background: COLORS.amber,
    borderRadius: "50%",
    boxShadow:
      "inset 30px 30px 40px rgba(255,255,255,0.7), inset -40px -40px 60px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.6)",
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  mascotEyes: {
    display: "flex" as const,
    gap: "50px",
    transform: "translateY(-10px)",
  },
  eyeWink: {
    width: "34px",
    height: "20px",
    border: `8px solid ${COLORS.dark}`,
    borderRadius: "40px 40px 0 0",
    borderBottom: "0",
  },
  eyeDot: {
    width: "34px",
    height: "34px",
    background: COLORS.dark,
    borderRadius: "50%",
  },
  mascotMouth: {
    position: "absolute" as const,
    bottom: "80px",
    width: "100px",
    height: "50px",
    background: COLORS.dark,
    borderRadius: "0 0 100px 100px",
    overflow: "hidden" as const,
  },
  badgeGrid: {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
  },
  floatingBadge: {
    position: "absolute" as const,
    background: COLORS.glass,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${COLORS.glassBorder}`,
    padding: "12px 20px",
    borderRadius: "20px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.8rem",
    color: COLORS.amber,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  sparkle: {
    position: "absolute" as const,
    color: COLORS.amber,
    fontSize: "2.5rem",
    pointerEvents: "none" as const,
    zIndex: 30,
  },
  confetti: {
    position: "absolute" as const,
    borderRadius: "2px",
  },
} as const;

// =============================================================================
// CONFETTI DATA (from template 5)
// =============================================================================

const confettiData = [
  { left: "6.94%", bg: "rgb(255, 215, 0)", delay: "2.12s", size: "10.4px" },
  {
    left: "35.81%",
    bg: "rgb(230, 126, 34)",
    delay: "1.05s",
    size: "6.82px",
  },
  {
    left: "17.58%",
    bg: "rgb(255, 215, 0)",
    delay: "0.45s",
    size: "6.2px",
  },
  {
    left: "5.8%",
    bg: "rgb(230, 126, 34)",
    delay: "1.84s",
    size: "10.15px",
  },
  {
    left: "77.01%",
    bg: "rgb(255, 215, 0)",
    delay: "1.41s",
    size: "6.33px",
  },
  {
    left: "17.37%",
    bg: "rgb(230, 126, 34)",
    delay: "1.58s",
    size: "8.85px",
  },
  {
    left: "63.66%",
    bg: "rgb(255, 179, 71)",
    delay: "0.77s",
    size: "10.96px",
  },
  {
    left: "31.91%",
    bg: "rgb(255, 215, 0)",
    delay: "0.94s",
    size: "7.91px",
  },
  {
    left: "3.25%",
    bg: "rgb(255, 255, 255)",
    delay: "1.26s",
    size: "13.92px",
  },
  {
    left: "21.1%",
    bg: "rgb(230, 126, 34)",
    delay: "1.49s",
    size: "7.75px",
  },
  {
    left: "81.33%",
    bg: "rgb(230, 126, 34)",
    delay: "1.26s",
    size: "12.34px",
  },
  {
    left: "77.29%",
    bg: "rgb(255, 255, 255)",
    delay: "0.29s",
    size: "13.68px",
  },
  {
    left: "34.05%",
    bg: "rgb(230, 126, 34)",
    delay: "3.86s",
    size: "11.24px",
  },
  {
    left: "54.91%",
    bg: "rgb(255, 255, 255)",
    delay: "3.99s",
    size: "7.63px",
  },
  {
    left: "77.56%",
    bg: "rgb(255, 255, 255)",
    delay: "2.5s",
    size: "11.97px",
  },
  {
    left: "45.31%",
    bg: "rgb(255, 255, 255)",
    delay: "0.3s",
    size: "13.07px",
  },
  {
    left: "17.07%",
    bg: "rgb(255, 255, 255)",
    delay: "2.53s",
    size: "8.44px",
  },
  {
    left: "92.2%",
    bg: "rgb(255, 179, 71)",
    delay: "1.27s",
    size: "11.46px",
  },
  {
    left: "81.25%",
    bg: "rgb(230, 126, 34)",
    delay: "2.19s",
    size: "7.75px",
  },
  {
    left: "95.84%",
    bg: "rgb(255, 255, 255)",
    delay: "0.17s",
    size: "8.87px",
  },
  {
    left: "50.17%",
    bg: "rgb(255, 255, 255)",
    delay: "3.54s",
    size: "13.57px",
  },
  {
    left: "45.42%",
    bg: "rgb(255, 179, 71)",
    delay: "3.43s",
    size: "12.87px",
  },
  {
    left: "74.01%",
    bg: "rgb(230, 126, 34)",
    delay: "3.86s",
    size: "12.22px",
  },
  {
    left: "10.98%",
    bg: "rgb(255, 215, 0)",
    delay: "1.58s",
    size: "13.11px",
  },
  {
    left: "31.07%",
    bg: "rgb(230, 126, 34)",
    delay: "0.23s",
    size: "12.99px",
  },
  {
    left: "77.73%",
    bg: "rgb(255, 179, 71)",
    delay: "1.76s",
    size: "8.76px",
  },
  {
    left: "74.97%",
    bg: "rgb(255, 255, 255)",
    delay: "3.33s",
    size: "9.94px",
  },
  {
    left: "21.08%",
    bg: "rgb(255, 179, 71)",
    delay: "3.66s",
    size: "10.99px",
  },
  {
    left: "60.1%",
    bg: "rgb(255, 255, 255)",
    delay: "1.63s",
    size: "9.39px",
  },
  {
    left: "70.2%",
    bg: "rgb(255, 179, 71)",
    delay: "1.83s",
    size: "10.61px",
  },
];

// =============================================================================
// NIGERIAN BANKS
// =============================================================================

const NIGERIAN_BANKS = [
  {
    id: "gtbank",
    name: "GTBank",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 21h18M3 10h18M5 10V21M9 10V21M13 10V21M17 10V21M12 3l9 7H3l9-7z" />
      </svg>
    ),
  },
  {
    id: "access",
    name: "Access Bank",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    id: "zenith",
    name: "Zenith Bank",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: "firstbank",
    name: "First Bank",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

// =============================================================================
// CSS KEYFRAMES (injected once)
// =============================================================================

const ONBOARDING_KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .ob-noise-overlay::before {
    content: "";
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  }

  input::placeholder, select::placeholder {
    color: rgba(150, 138, 132, 0.6);
  }

  select option {
    background: #1a1614;
    color: #ffffff;
  }

  /* ======== STEP 1 ANIMATIONS ======== */
  @keyframes ob-bounce-gentle {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
  }

  @keyframes ob-blink {
    0%, 45%, 55%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.1); }
  }

  @keyframes ob-float-bubble {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, -10px); }
  }

  @keyframes ob-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  @keyframes ob-pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.3); opacity: 1; }
  }

  .ob-mascot-body {
    position: absolute;
    inset: 50px;
    background: #ffb347;
    border-radius: 50%;
    box-shadow:
      inset 30px 30px 40px rgba(255,255,255,0.7),
      inset -40px -40px 60px rgba(0,0,0,0.5),
      0 40px 60px rgba(0,0,0,0.4);
    animation: ob-bounce-gentle 4s ease-in-out infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .ob-mascot-eyes {
    display: flex;
    gap: 32px;
    transform: translateY(-15px);
  }

  .ob-eye-dot {
    width: 20px;
    height: 20px;
    background: #1a1614;
    border-radius: 50%;
    animation: ob-blink 4s infinite;
  }

  .ob-mascot-smile {
    position: relative;
    top: 10px;
    width: 40px;
    height: 20px;
    border-bottom: 6px solid #1a1614;
    border-radius: 0 0 40px 40px;
  }

  .ob-speech-bubble {
    position: absolute;
    top: 20px;
    right: -20px;
    background: white;
    padding: 16px 24px;
    border-radius: 24px 24px 24px 4px;
    color: #0d0b0a;
    font-family: 'DynaPuff', cursive;
    font-size: 1.5rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    animation: ob-float-bubble 4s ease-in-out infinite;
    white-space: nowrap;
    z-index: 40;
  }

  .ob-chip-1 { animation: ob-float 6s ease-in-out infinite; }
  .ob-chip-2 { animation: ob-float 6s ease-in-out infinite 1s; }

  .ob-sparkle {
    position: absolute;
    color: #ffb347;
    font-size: 2rem;
    animation: ob-pulse 1.5s infinite;
  }

  /* ======== STEP 2 ANIMATIONS ======== */
  @keyframes ob-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes ob-pulse-glow {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 71, 0.7); }
    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 179, 71, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 71, 0); }
  }

  .ob-orbit-1 { animation: ob-spin 60s linear infinite; }
  .ob-orbit-2 { animation: ob-spin 40s linear reverse infinite; }
  .ob-float-card-1 { animation: ob-float 6s ease-in-out infinite; animation-delay: 0s; }
  .ob-float-card-2 { animation: ob-float 6s ease-in-out infinite; animation-delay: 1.5s; }
  .ob-float-card-3 { animation: ob-float 6s ease-in-out infinite; animation-delay: 3s; }
  .ob-pulse-dot { animation: ob-pulse-glow 1.5s infinite; }

  /* ======== STEP 3 ANIMATIONS ======== */
  @keyframes ob-bounce-happy {
    0%, 100% { transform: scale(1) translateY(0); }
    50% { transform: scale(1.08, 0.95) translateY(-40px); }
  }

  @keyframes ob-drop {
    0% { transform: translateY(-600px) rotate(0deg); opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
  }

  @keyframes ob-sparkle-anim {
    0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  }

  @keyframes ob-float-badge {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-10px, -20px); }
  }

  .ob-mascot-celebrate { animation: ob-bounce-happy 1.5s ease-in-out infinite; }
  .ob-confetti { animation: ob-drop 4s linear infinite; }
  .ob-sparkle-spin { animation: ob-sparkle-anim 2s infinite; }
  .ob-badge-0 { animation: ob-float-badge 5s ease-in-out infinite; animation-delay: 0s; }
  .ob-badge-1 { animation: ob-float-badge 5s ease-in-out infinite; animation-delay: 1s; }
  .ob-badge-2 { animation: ob-float-badge 5s ease-in-out infinite; animation-delay: 0.5s; }
  .ob-badge-3 { animation: ob-float-badge 5s ease-in-out infinite; animation-delay: 1.5s; }

  .ob-tongue::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 40px;
    background: #ff7675;
    border-radius: 50%;
  }

  .ob-goal-glow::after {
    content: "";
    position: absolute;
    top: 0; right: 0;
    width: 100px; height: 100px;
    background: radial-gradient(circle at top right, rgba(255, 179, 71, 0.15), transparent 70%);
    pointer-events: none;
  }

  /* ======== STEP TRANSITION ======== */
  @keyframes ob-fadeIn {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .ob-step-enter {
    animation: ob-fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  /* ======== PILL BUTTON HOVER ======== */
  .ob-btn-pill:hover:not(:disabled) {
    background: #ffffff !important;
    transform: scale(1.02);
  }
  .ob-btn-pill:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ======== INPUT FOCUS ======== */
  .ob-input:focus {
    border-color: #ffb347 !important;
    background: rgba(255, 179, 71, 0.03) !important;
    box-shadow: 0 0 20px rgba(255, 179, 71, 0.05);
  }

  /* ======== SKIP LINK ======== */
  .ob-skip-link {
    display: block;
    text-align: center;
    margin-top: 16px;
    font-size: 0.875rem;
    color: #968a84;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s ease;
  }
  .ob-skip-link:hover {
    color: #ffffff;
  }
`;

// =============================================================================
// MAIN ONBOARDING STEPPER
// =============================================================================

export function WmOnboardingStepper() {
  const router = useRouter();
  const { user: clerkUser } = useUser();
  useEnsureUser();

  const updateOnboardingStep = useMutation(api.users.updateOnboardingStep);
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const updateUserPreferences = useMutation(api.users.updateUserPreferences);

  const [currentStep, setCurrentStep] = useState(1);
  const [stepKey, setStepKey] = useState(0); // for re-triggering animation

  // Form state persists across steps
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [bankConnected, setBankConnected] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Pre-fill from Clerk
  useEffect(() => {
    if (clerkUser) {
      const fn = clerkUser.fullName || clerkUser.firstName || "";
      if (fn && !fullName) setFullName(fn);
      const em =
        clerkUser.primaryEmailAddress?.emailAddress || "";
      if (em && !email) setEmail(em);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser]);

  // Inject CSS once
  useEffect(() => {
    const id = "onboarding-template-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = ONBOARDING_KEYFRAMES;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  // Mono hook
  const { openMono, isLoading: monoLoading } = useMono({
    onSuccess: () => {
      setBankConnected(true);
    },
    onClose: () => {
      // user closed without completing
    },
  });

  const goToStep = useCallback(
    async (step: number) => {
      setStepKey((k) => k + 1);
      setCurrentStep(step);
      try {
        await updateOnboardingStep({ step });
      } catch {
        // non-critical
      }
    },
    [updateOnboardingStep]
  );

  const handleStep1Continue = useCallback(async () => {
    if (!fullName.trim() || !email.trim() || !country) return;
    // Save country preference to Convex
    const selectedCountry = SUPPORTED_COUNTRIES.find(
      (c) => c.code === country
    );
    if (selectedCountry) {
      try {
        await updateUserPreferences({
          country: selectedCountry.code,
          currency: selectedCountry.currency,
        });
      } catch {
        // non-critical
      }
    }
    goToStep(2);
  }, [fullName, email, country, updateUserPreferences, goToStep]);

  const handleStep2Connect = useCallback(() => {
    openMono();
  }, [openMono]);

  const handleStep2Skip = useCallback(() => {
    goToStep(2.5);
  }, [goToStep]);

  const handleStep2Continue = useCallback(() => {
    goToStep(2.5);
  }, [goToStep]);

  // Step 2.5: Investment interstitial
  const handleInvestmentSkip = useCallback(() => {
    goToStep(3);
  }, [goToStep]);

  const handleInvestmentComplete = useCallback(() => {
    goToStep(3);
  }, [goToStep]);

  const handleGoToDashboard = useCallback(async () => {
    try {
      await completeOnboarding();
    } catch {
      // non-critical
    }
    router.push(ROUTES.dashboard);
  }, [completeOnboarding, router]);

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="ob-noise-overlay" style={S.body}>
      {/* Ambient Glows */}
      <div style={{ ...S.ambientGlow, ...S.glow1 }} />
      <div style={{ ...S.ambientGlow, ...S.glow2 }} />

      {/* Floating Pill Navbar */}
      {currentStep < 3 ? (
        <nav style={S.nav}>
          <span style={S.navLogo}>WealthMotley</span>
          <div style={S.stepIndicator}>
            <span style={{ color: currentStep >= 1 ? COLORS.amber : COLORS.muted }}>
              Identity
            </span>
            <div style={currentStep >= 1 ? S.stepDotActive : S.stepDot} />
            <span style={{ color: currentStep >= 2 ? COLORS.amber : COLORS.muted }}>
              Connect
            </span>
            <div style={currentStep >= 2 ? S.stepDotActive : S.stepDot} />
            <span style={{ color: currentStep >= 2.5 ? COLORS.amber : COLORS.muted }}>
              Invest
            </span>
            <div style={currentStep >= 2.5 ? S.stepDotActive : S.stepDot} />
            <span style={{ color: currentStep >= 3 ? COLORS.amber : COLORS.muted }}>
              Set Flow
            </span>
            <div style={currentStep >= 3 ? S.stepDotActive : S.stepDot} />
          </div>
          <div style={{ width: "80px" }} />
        </nav>
      ) : (
        <nav style={S.nav}>
          <span style={S.navLogo}>WealthMotley</span>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: COLORS.amber,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Onboarding Complete &bull; Welcome
          </div>
          <div style={{ width: "80px" }} />
        </nav>
      )}

      {/* Step Content */}
      <main style={S.main} key={stepKey}>
        {currentStep === 1 && (
          <Step1Identity
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            country={country}
            setCountry={setCountry}
            onContinue={handleStep1Continue}
          />
        )}
        {currentStep === 2 && (
          <Step2Connect
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            bankConnected={bankConnected}
            monoLoading={monoLoading}
            onConnect={handleStep2Connect}
            onSkip={handleStep2Skip}
            onContinue={handleStep2Continue}
          />
        )}
        {currentStep === 2.5 && (
          <Step25Investments
            onSkip={handleInvestmentSkip}
            onComplete={handleInvestmentComplete}
          />
        )}
        {currentStep === 3 && (
          <Step3Success
            goalName={goalName}
            setGoalName={setGoalName}
            targetAmount={targetAmount}
            setTargetAmount={setTargetAmount}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            bankConnected={bankConnected}
            onGoToDashboard={handleGoToDashboard}
          />
        )}
      </main>
    </div>
  );
}

// =============================================================================
// STEP 1: IDENTITY / PROFILE
// =============================================================================

function Step1Identity({
  fullName,
  setFullName,
  email,
  setEmail,
  country,
  setCountry,
  onContinue,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  onContinue: () => void;
}) {
  const canContinue =
    fullName.trim() !== "" && email.trim() !== "" && country !== "";

  return (
    <>
      {/* LEFT: Form */}
      <section style={S.setupPanel} className="ob-step-enter">
        <div style={S.onboardingHeader}>
          <span style={S.sectionLabel}>Step 01 — Getting Started</span>
          <h1 style={S.h1}>
            Tell us about{" "}
            <br />
            <span style={{ color: COLORS.amber }}>yourself.</span>
          </h1>
          <p style={S.subtitle}>
            Let&apos;s set up your WealthMotley profile. Your security is our
            priority, and your data stays private.
          </p>
        </div>

        <div style={S.inputCard}>
          <div style={S.fieldGroup}>
            <label style={S.fieldLabel}>Full Name</label>
            <input
              className="ob-input"
              type="text"
              style={S.formInput}
              placeholder="How should we call you?"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.fieldLabel}>Email Address</label>
            <input
              className="ob-input"
              type="email"
              style={S.formInput}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={S.fieldGroupLast as React.CSSProperties}>
            <label style={S.fieldLabel}>Country</label>
            <select
              className="ob-input"
              style={S.formSelect}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="" disabled>
                Where are you based?
              </option>
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <button
          className="ob-btn-pill"
          style={S.btnPill}
          onClick={onContinue}
          disabled={!canContinue}
        >
          Continue to Connect
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </section>

      {/* RIGHT: Mascot */}
      <section style={S.visualContainer}>
        <div style={S.mascotContainer}>
          {/* 3D Mascot Sphere */}
          <div className="ob-mascot-body">
            <div className="ob-mascot-eyes">
              <div className="ob-eye-dot" />
              <div className="ob-eye-dot" />
            </div>
            <div className="ob-mascot-smile" />
          </div>

          {/* Speech bubble */}
          <div className="ob-speech-bubble">Let&apos;s build wealth! &#128176;</div>

          {/* Floating chips */}
          <div
            style={{ ...S.chip, bottom: "10%", right: "10%" }}
            className="ob-chip-1"
          >
            Private &amp; Secure
          </div>
          <div
            style={{ ...S.chip, top: "15%", left: "0%" }}
            className="ob-chip-2"
          >
            256-bit Encryption
          </div>

          {/* Sparkles */}
          <div className="ob-sparkle" style={{ top: "10%", left: "10%" }}>
            &#10022;
          </div>
          <div
            className="ob-sparkle"
            style={{
              bottom: "5%",
              right: "20%",
              animationDelay: "0.7s",
            }}
          >
            &#10022;
          </div>
        </div>
      </section>
    </>
  );
}

// =============================================================================
// STEP 2: BANK CONNECTION
// =============================================================================

function Step2Connect({
  selectedBank,
  setSelectedBank,
  bankConnected,
  monoLoading,
  onConnect,
  onSkip,
  onContinue,
}: {
  selectedBank: string | null;
  setSelectedBank: (v: string | null) => void;
  bankConnected: boolean;
  monoLoading: boolean;
  onConnect: () => void;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const [hoveredBank, setHoveredBank] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Ready to Sync");

  useEffect(() => {
    if (bankConnected) {
      setStatusText("Connected!");
    }
  }, [bankConnected]);

  const getBankStyle = (bankId: string): React.CSSProperties => {
    if (selectedBank === bankId) {
      return { ...S.bankOption, ...S.bankOptionSelected };
    }
    if (hoveredBank === bankId) {
      return { ...S.bankOption, ...S.bankOptionHover };
    }
    return S.bankOption;
  };

  return (
    <>
      {/* LEFT: Form */}
      <section style={S.setupPanel} className="ob-step-enter">
        <div style={{ ...S.onboardingHeader, marginBottom: "48px" }}>
          <span style={S.sectionLabel}>Step 02 — Integration</span>
          <h1 style={S.h1}>
            Connect your{" "}
            <br />
            <span style={{ color: COLORS.amber }}>bank.</span>
          </h1>
          <p style={S.subtitle}>
            WealthMotley uses bank-grade 256-bit encryption to keep your data
            safe. We never store your credentials.
          </p>
        </div>

        {/* Bank Grid */}
        <div style={S.bankList}>
          {NIGERIAN_BANKS.map((bank) => (
            <div
              key={bank.id}
              style={getBankStyle(bank.id)}
              onClick={() => {
                setSelectedBank(bank.id);
                setStatusText("Connecting...");
                setTimeout(() => setStatusText("Ready to Sync"), 1500);
              }}
              onMouseEnter={() => setHoveredBank(bank.id)}
              onMouseLeave={() => setHoveredBank(null)}
            >
              <div style={S.bankIcon}>{bank.icon}</div>
              <span style={S.bankName}>{bank.name}</span>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div style={S.securityBadge}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffb347"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p style={S.securityText}>
            Secured by Mono. Your data is encrypted and private. WealthMotley
            only receives read-only access.
          </p>
        </div>

        {/* Connect / Continue button */}
        {bankConnected ? (
          <button className="ob-btn-pill" style={S.btnPill} onClick={onContinue}>
            Continue
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        ) : (
          <>
            <button
              className="ob-btn-pill"
              style={{ ...S.btnPill, marginTop: "24px" }}
              onClick={onConnect}
              disabled={monoLoading}
            >
              {monoLoading ? "Connecting..." : "Connect via Mono"}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button className="ob-skip-link" onClick={onSkip}>
              Skip for now
            </button>
          </>
        )}
      </section>

      {/* RIGHT: Orbit Visualization */}
      <section style={S.visualContainer}>
        <div style={S.connectionViz}>
          {/* Orbit rings */}
          <div
            className="ob-orbit-1"
            style={{ ...S.orbitRing, ...S.orbit1 }}
          />
          <div
            className="ob-orbit-2"
            style={{ ...S.orbitRing, ...S.orbit2 }}
          />

          {/* Central hub */}
          <div style={S.centralHub}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          {/* Floating bank cards */}
          <div
            className="ob-float-card-1"
            style={{ ...S.floatingCard, top: "15%", right: "15%" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18M3 10h18M5 10V21M9 10V21M13 10V21M17 10V21M12 3l9 7H3l9-7z" />
            </svg>
          </div>
          <div
            className="ob-float-card-2"
            style={{ ...S.floatingCard, bottom: "20%", left: "10%" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div
            className="ob-float-card-3"
            style={{ ...S.floatingCard, top: "30%", left: "5%" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" />
            </svg>
          </div>

          {/* Connection status */}
          <div style={S.connectionStatus}>
            <div className="ob-pulse-dot" style={S.statusPulse} />
            {statusText}
          </div>
        </div>
      </section>
    </>
  );
}

// =============================================================================
// STEP 2.5: INVESTMENTS (OPTIONAL)
// =============================================================================

const INVESTMENT_PLATFORMS = [
  { name: "Trading 212", icon: "\uD83D\uDCC8" },
  { name: "Cowrywise", icon: "\uD83D\uDCB0" },
  { name: "Bamboo", icon: "\uD83C\uDF3F" },
  { name: "eToro", icon: "\uD83C\uDF10" },
  { name: "Risevest", icon: "\uD83D\uDE80" },
  { name: "Other", icon: "\uD83D\uDCBC" },
];

function Step25Investments({
  onSkip,
  onComplete,
}: {
  onSkip: () => void;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<"choice" | "screenshot" | "manual">("choice");
  const [manualName, setManualName] = useState("");
  const [manualPlatform, setManualPlatform] = useState("");
  const [manualQty, setManualQty] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualCurrency, setManualCurrency] = useState("USD");
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const addManualAsset = useMutation(api.allMyMoney.addManualAsset);
  const generateUploadUrl = useMutation(api.screenshotImport.generateUploadUrl);
  const createImportRecord = useMutation(api.screenshotImport.createImportRecord);
  const analyzeScreenshot = useAction(api.screenshotImport.analyzeScreenshot);
  const saveExtractedHoldings = useMutation(api.screenshotImport.saveExtractedHoldings);

  const [screenshotState, setScreenshotState] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [screenshotError, setScreenshotError] = useState("");

  const handleScreenshotUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setScreenshotState("uploading");

    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      const recordId = await createImportRecord({ imageStorageId: storageId });
      setScreenshotState("processing");

      const result = await analyzeScreenshot({ imageStorageId: storageId, importId: recordId });

      if (result.holdings.length > 0) {
        await saveExtractedHoldings({
          importId: recordId,
          platform: result.platform,
          holdings: result.holdings.map((h: any) => ({
            name: h.name,
            ticker: h.ticker || undefined,
            quantity: h.quantity || undefined,
            value: h.value,
            currency: h.currency,
          })),
        });
        setScreenshotState("done");
        // Auto-proceed after brief delay
        setTimeout(onComplete, 1500);
      } else {
        setScreenshotState("error");
        setScreenshotError("No holdings found. Try a different screenshot or add manually.");
      }
    } catch (e: any) {
      setScreenshotState("error");
      setScreenshotError(e.message || "Failed to process screenshot");
    }
  }, [generateUploadUrl, createImportRecord, analyzeScreenshot, saveExtractedHoldings, onComplete]);

  const handleManualSave = useCallback(async () => {
    const qty = parseFloat(manualQty);
    const price = parseFloat(manualPrice);
    if (!manualName || isNaN(qty) || isNaN(price)) return;

    setIsSaving(true);
    try {
      await addManualAsset({
        name: manualPlatform ? `${manualPlatform} - ${manualName}` : manualName,
        type: "investment",
        platform: manualPlatform || undefined,
        value: qty * price,
        currency: manualCurrency,
        holdings: [{
          name: manualName,
          quantity: qty,
          value: qty * price,
          currency: manualCurrency,
        }],
      });
      onComplete();
    } catch {
      // non-critical
      onComplete();
    } finally {
      setIsSaving(false);
    }
  }, [manualName, manualPlatform, manualQty, manualPrice, manualCurrency, addManualAsset, onComplete]);

  return (
    <>
      {/* Left panel */}
      <div style={S.setupPanel}>
        <div style={S.onboardingHeader}>
          <div style={S.sectionLabel}>Optional</div>
          <h1 style={{ ...S.h1, fontSize: "2.5rem" }}>
            Do you have investments elsewhere?
          </h1>
          <p style={S.subtitle}>
            Track stocks, ETFs, and funds from any platform. This is optional &mdash; you can always do this later.
          </p>
        </div>

        {mode === "choice" && (
          <>
            {/* Platform logos */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "10px", marginBottom: "28px" }}>
              {INVESTMENT_PLATFORMS.map((p) => (
                <div
                  key={p.name}
                  style={{
                    background: COLORS.glass,
                    border: `1px solid ${COLORS.glassBorder}`,
                    borderRadius: "12px",
                    padding: "10px 16px",
                    fontSize: "0.8rem",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{p.icon}</span> {p.name}
                </div>
              ))}
            </div>

            {/* Upload screenshot button */}
            <div style={S.inputCard}>
              <div style={S.cardTitle}>
                <span style={{ fontSize: "1.5rem" }}>{"\uD83D\uDCF8"}</span>
                Upload a screenshot
              </div>
              <p style={{ ...S.subtitle, fontSize: "0.875rem", marginBottom: "16px" }}>
                Screenshot your investment app and our AI will extract your holdings.
              </p>
              <label
                style={{
                  ...S.btnPill,
                  background: "rgba(255, 179, 71, 0.15)",
                  color: COLORS.amber,
                  cursor: "pointer",
                  textAlign: "center" as const,
                  display: "block",
                  position: "relative" as const,
                }}
              >
                {screenshotState === "uploading" && "Uploading..."}
                {screenshotState === "processing" && "AI is analyzing..."}
                {screenshotState === "done" && "Holdings imported!"}
                {screenshotState === "error" && "Try again"}
                {screenshotState === "idle" && "Choose Screenshot"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ position: "absolute" as const, opacity: 0, width: 0, height: 0 }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleScreenshotUpload(f);
                  }}
                  disabled={screenshotState === "uploading" || screenshotState === "processing"}
                />
              </label>
              {screenshotState === "error" && (
                <p style={{ color: "#ff4757", fontSize: "0.8rem", marginTop: "8px" }}>
                  {screenshotError}
                </p>
              )}
            </div>

            {/* Manual add button */}
            <button
              type="button"
              style={{
                ...S.btnPill,
                background: "transparent",
                color: "#ffffff",
                border: `1px solid ${COLORS.glassBorder}`,
                marginTop: "0",
              }}
              onClick={() => setMode("manual")}
            >
              {"\u270F\uFE0F"} I&apos;ll add them manually
            </button>

            {/* Skip button */}
            <button
              type="button"
              onClick={onSkip}
              style={{
                background: "none",
                border: "none",
                color: COLORS.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                cursor: "pointer",
                marginTop: "20px",
                display: "block",
                width: "100%",
                textAlign: "center" as const,
              }}
            >
              Skip &mdash; I&apos;ll do this later
            </button>
          </>
        )}

        {mode === "manual" && (
          <div style={S.inputCard}>
            <div style={S.cardTitle}>
              <span style={{ fontSize: "1.5rem" }}>{"\u270F\uFE0F"}</span>
              Quick Add Investment
            </div>
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>Platform</label>
              <select
                style={S.formSelect}
                value={manualPlatform}
                onChange={(e) => setManualPlatform(e.target.value)}
              >
                <option value="">Select platform...</option>
                {INVESTMENT_PLATFORMS.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>Stock / ETF Name</label>
              <input
                style={focusedField === "name" ? S.formInputFocus : S.formInput}
                placeholder="e.g. VOO, Apple, Cowrywise Dollar Fund"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ ...S.fieldGroup, flex: 1 }}>
                <label style={S.fieldLabel}>Quantity</label>
                <input
                  style={focusedField === "qty" ? S.formInputFocus : S.formInput}
                  type="number"
                  placeholder="0"
                  value={manualQty}
                  onChange={(e) => setManualQty(e.target.value)}
                  onFocus={() => setFocusedField("qty")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div style={{ ...S.fieldGroup, flex: 1 }}>
                <label style={S.fieldLabel}>Price per share</label>
                <input
                  style={focusedField === "price" ? S.formInputFocus : S.formInput}
                  type="number"
                  placeholder="0.00"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  onFocus={() => setFocusedField("price")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
            <div style={S.fieldGroup}>
              <label style={S.fieldLabel}>Currency</label>
              <select
                style={S.formSelect}
                value={manualCurrency}
                onChange={(e) => setManualCurrency(e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="NGN">NGN</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
            <button
              type="button"
              style={S.btnPill}
              onClick={handleManualSave}
              disabled={isSaving || !manualName || !manualQty || !manualPrice}
            >
              {isSaving ? "Saving..." : "Add & Continue"}
            </button>
            <button
              type="button"
              onClick={() => setMode("choice")}
              style={{
                background: "none",
                border: "none",
                color: COLORS.muted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                cursor: "pointer",
                marginTop: "12px",
                display: "block",
                width: "100%",
                textAlign: "center" as const,
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>

      {/* Right panel - Visual */}
      <div style={S.visualContainer}>
        <div style={{ ...S.mascotContainer, width: "400px", height: "400px" }}>
          {/* Investment visualization */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "rgba(255, 179, 71, 0.08)",
                border: `1px dashed ${COLORS.glassBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: COLORS.amber,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  boxShadow: "0 0 60px rgba(255, 179, 71, 0.12)",
                }}
              >
                {"\uD83D\uDCC8"}
              </div>
            </div>
          </div>
          {/* Floating chips */}
          <div style={{ ...S.chip, top: "20px", right: "10px" }}>VOO +12.4%</div>
          <div style={{ ...S.chip, bottom: "60px", left: "0px" }}>AAPL $227</div>
          <div style={{ ...S.chip, top: "60px", left: "10px" }}>VTI +11.8%</div>
          <div style={{ ...S.chip, bottom: "20px", right: "20px" }}>QQQ +18.2%</div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// STEP 3: SUCCESS / CELEBRATION
// =============================================================================

function Step3Success({
  goalName,
  setGoalName,
  targetAmount,
  setTargetAmount,
  targetDate,
  setTargetDate,
  bankConnected,
  onGoToDashboard,
}: {
  goalName: string;
  setGoalName: (v: string) => void;
  targetAmount: string;
  setTargetAmount: (v: string) => void;
  targetDate: string;
  setTargetDate: (v: string) => void;
  bankConnected: boolean;
  onGoToDashboard: () => void;
}) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <>
      {/* LEFT: Goal Setup */}
      <section style={{ ...S.setupPanel, maxWidth: "520px" }} className="ob-step-enter">
        <div>
          <span style={S.sectionLabel}>All Systems Go!</span>
          <h1 style={{ ...S.h1, fontSize: "4rem", lineHeight: 1, marginBottom: "24px" }}>
            Welcome to{" "}
            <br />
            <span style={{ color: COLORS.amber }}>the family.</span>
          </h1>
          <p style={{ ...S.subtitle, fontSize: "1.25rem", marginBottom: "40px" }}>
            Your wealth flow is active. Now, let&apos;s give your money a
            purpose. What&apos;s your first big goal?
          </p>
        </div>

        {/* Goal Setup Card */}
        <div className="ob-goal-glow" style={S.goalSetupCard}>
          <div style={S.cardTitle}>
            <span style={{ fontSize: "1.5rem" }}>&#127919;</span> Set your first
            goal
          </div>
          <div style={S.goalInputContainer}>
            <div style={S.inputRow}>
              <input
                className="ob-input"
                type="text"
                style={{
                  ...S.goalInput,
                  ...(focusedInput === "goalName"
                    ? { borderColor: COLORS.amber, background: "rgba(0,0,0,0.3)" }
                    : {}),
                }}
                placeholder="e.g. Emergency Fund, Japa Fund"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                onFocus={() => setFocusedInput("goalName")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
            <div style={S.inputRow}>
              <div style={S.amountInputWrap}>
                <span style={S.amountPrefix}>&#8358;</span>
                <input
                  className="ob-input"
                  type="text"
                  style={{
                    ...S.amountInput,
                    ...(focusedInput === "target"
                      ? { borderColor: COLORS.amber, background: "rgba(0,0,0,0.3)" }
                      : {}),
                  }}
                  placeholder="Target"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  onFocus={() => setFocusedInput("target")}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
              <input
                className="ob-input"
                type="text"
                style={{
                  ...S.goalInput,
                  ...(focusedInput === "date"
                    ? { borderColor: COLORS.amber, background: "rgba(0,0,0,0.3)" }
                    : {}),
                }}
                placeholder="Target Date (Optional)"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                onFocus={() => setFocusedInput("date")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>
        </div>

        <button className="ob-btn-pill" style={S.btnPill} onClick={onGoToDashboard}>
          Go to Dashboard
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </section>

      {/* RIGHT: Celebration Visualization */}
      <section style={S.visualContainer}>
        <div style={S.celebrationViz}>
          {/* Floating Badges */}
          <div style={S.badgeGrid}>
            <div
              className="ob-badge-0"
              style={{ ...S.floatingBadge, top: 0, left: "10%" }}
            >
              {bankConnected ? "Bank Connected! &#128274;" : "Profile Set! &#9989;"}
            </div>
            <div
              className="ob-badge-1"
              style={{ ...S.floatingBadge, top: "15%", right: 0 }}
            >
              Profile Set! &#9989;
            </div>
            <div
              className="ob-badge-2"
              style={{ ...S.floatingBadge, bottom: "10%", left: 0 }}
            >
              167K+ Community &#128293;
            </div>
            <div
              className="ob-badge-3"
              style={{ ...S.floatingBadge, bottom: 0, right: "15%" }}
            >
              AI Coach Ready! &#129302;
            </div>
          </div>

          {/* Celebrating Mascot */}
          <div style={S.mascotCelebrate}>
            <div className="ob-mascot-celebrate" style={S.mascotBody}>
              <div style={S.mascotEyes}>
                {/* Winking eye (curved) */}
                <div style={S.eyeWink} />
                {/* Open eye (dot) */}
                <div style={S.eyeDot} />
              </div>
              {/* Mouth with tongue */}
              <div className="ob-tongue" style={S.mascotMouth} />
            </div>
          </div>

          {/* Sparkles */}
          <div
            className="ob-sparkle-spin"
            style={{ ...S.sparkle, top: "-20px", left: "50%" }}
          >
            &#10022;
          </div>
          <div
            className="ob-sparkle-spin"
            style={{
              ...S.sparkle,
              top: "40%",
              left: "-40px",
              animationDelay: "0.3s",
            }}
          >
            &#10022;
          </div>
          <div
            className="ob-sparkle-spin"
            style={{
              ...S.sparkle,
              bottom: "10%",
              right: "-20px",
              animationDelay: "0.7s",
            }}
          >
            &#10022;
          </div>

          {/* Confetti Rain */}
          {confettiData.map((c, i) => (
            <div
              key={i}
              className="ob-confetti"
              style={{
                ...S.confetti,
                left: c.left,
                backgroundColor: c.bg,
                animationDelay: c.delay,
                width: c.size,
                height: c.size,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
