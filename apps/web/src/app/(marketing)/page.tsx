"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  SquaresFour,
  Receipt,
  AirplaneTilt,
  Robot,
  DeviceMobile,
  Camera,
  ChartBar,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
  Lock,
  GlobeHemisphereWest,
  Sparkle,
  Users,
  Star,
  Crown,
  Heart,
  MapPin,
  Copy,
  Check,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  APP_NAME,
  SUPPORTED_COUNTRIES,
  ROUTES,
  SUPPORT_EMAIL,
} from "@/lib/constants";

// =============================================================================
// DESIGN TOKENS (coral adaptation of the Puff template)
// =============================================================================
const COLORS = {
  bg: "#0d0b0a",
  coral: "#ffb347",
  cocoa: "#e67e22",
  muted: "#968a84",
  mutedLight: "#b8ada6",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  glassHover: "rgba(255,255,255,0.07)",
  coralGlow: "rgba(255, 179, 71, 0.12)",
  cocoaGlow: "rgba(230, 126, 34, 0.08)",
  coralHighlight: "rgba(255, 179, 71, 0.15)",
  white: "#f5f0eb",
  whiteTrue: "#ffffff",
} as const;

// =============================================================================
// TEMPLATE-EXACT INLINE STYLES (ported from react-app.js)
// =============================================================================
const customStyles = {
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
    color: "#ffb347",
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
    color: "#968a84",
    lineHeight: 1.6,
  },
  ruleCard: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "24px",
    transition: "border-color 0.3s ease",
  },
  ruleInfoH3: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "1.25rem",
    color: "#ffffff",
    marginBottom: "4px",
  },
  ruleInfoP: {
    fontSize: "0.875rem",
    color: "#968a84",
  },
  mascotCelebrate: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "320px",
    height: "320px",
    zIndex: 20,
  },
  mascotBody: {
    position: "absolute" as const,
    inset: 0,
    background: "#ffb347",
    borderRadius: "50%",
    boxShadow:
      "inset 30px 30px 40px rgba(255,255,255,0.7), inset -40px -40px 60px rgba(0,0,0,0.5), 0 40px 60px rgba(0,0,0,0.4)",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  mascotEyes: {
    display: "flex" as const,
    gap: "40px",
    transform: "translateY(-20px)",
  },
  eyeHappy: {
    width: "30px",
    height: "15px",
    border: "6px solid #1a1614",
    borderRadius: "30px 30px 0 0",
    borderBottom: 0,
  },
  mascotMouth: {
    position: "absolute" as const,
    bottom: "80px",
    width: "60px",
    height: "30px",
    background: "#1a1614",
    borderRadius: "0 0 60px 60px",
  },
  goalRingSvg: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)",
  },
  chip: {
    position: "absolute" as const,
    background: "rgba(255, 255, 255, 0.04)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "12px 20px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: "#ffb347",
    zIndex: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  goalLabel: {
    position: "absolute" as const,
    bottom: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center" as const,
  },
  goalAmount: {
    fontFamily: "'DynaPuff', cursive",
    fontSize: "2.5rem",
    color: "#ffffff",
  },
  goalTarget: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.875rem",
    color: "#968a84",
    textTransform: "uppercase" as const,
  },
  sparkle: {
    position: "absolute" as const,
    color: "#ffb347",
    fontSize: "2rem",
  },
  confetti: {
    position: "absolute" as const,
    width: "10px",
    height: "10px",
    borderRadius: "2px",
  },
  btnPill: {
    background: "#ffb347",
    color: "#0d0b0a",
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
  },
};

// =============================================================================
// GLASS STYLE HELPERS (for sections below hero)
// =============================================================================
const glassCard = {
  background: COLORS.glass,
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: `1px solid ${COLORS.glassBorder}`,
} as const;

// =============================================================================
// ANIMATION VARIANTS (for sections below hero)
// =============================================================================
const EASE_OUT = "easeOut" as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const liftCard = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

// =============================================================================
// SECTION LABEL PILL (for sections below hero)
// =============================================================================
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em]"
      style={{
        ...glassCard,
        color: COLORS.coral,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </span>
  );
}

// =============================================================================
// INJECT TEMPLATE KEYFRAMES + FONTS (matches react-app.js exactly)
// =============================================================================
function TemplateStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

      .hero-noise-overlay::before {
        content: "";
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 9999;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
      }

      @keyframes bounce {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.05) translateY(-30px); }
      }

      @keyframes fillRing {
        from { stroke-dashoffset: 1256; }
        to { stroke-dashoffset: 350; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }

      @keyframes drop {
        0% { transform: translateY(-500px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.3); opacity: 1; }
      }

      .mascot-body-anim { animation: bounce 2s ease-in-out infinite; }

      .ring-progress-anim {
        fill: none;
        stroke: #ffb347;
        stroke-width: 12;
        stroke-linecap: round;
        stroke-dasharray: 1256;
        stroke-dashoffset: 400;
        animation: fillRing 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .ring-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.08);
        stroke-width: 12;
      }

      .chip-float-1 { animation: float 4s ease-in-out infinite; animation-delay: 0s; }
      .chip-float-2 { animation: float 4s ease-in-out infinite; animation-delay: 1s; }
      .chip-float-3 { animation: float 4s ease-in-out infinite; animation-delay: 0.5s; }

      .sparkle-pulse-1 { animation: pulse 1.5s infinite; }
      .sparkle-pulse-2 { animation: pulse 1.5s infinite; animation-delay: 0.5s; }

      .confetti-drop-1 { animation: drop 3s linear infinite; animation-delay: 0s; }
      .confetti-drop-2 { animation: drop 3s linear infinite; animation-delay: 0.5s; }
      .confetti-drop-3 { animation: drop 3s linear infinite; animation-delay: 1.2s; }
      .confetti-drop-4 { animation: drop 3s linear infinite; animation-delay: 0.8s; }

      /* Landing-page specific overrides */
      .landing-hero-section {
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Responsive hero grid */
      @media (max-width: 1024px) {
        .hero-grid {
          grid-template-columns: 1fr !important;
          height: auto !important;
          padding-top: 120px !important;
          padding-bottom: 60px !important;
          gap: 40px !important;
        }
        .hero-left-panel {
          max-width: 100% !important;
          text-align: center;
        }
        .hero-left-panel h1 {
          font-size: 2.5rem !important;
        }
        .hero-visual-container {
          height: auto !important;
          min-height: 500px;
        }
        .goal-viz {
          width: 380px !important;
          height: 380px !important;
        }
        .mascot-celebrate {
          width: 240px !important;
          height: 240px !important;
        }
      }

      @media (max-width: 640px) {
        .hero-grid {
          padding: 100px 4% 40px !important;
          gap: 20px !important;
        }
        .hero-left-panel h1 {
          font-size: 2rem !important;
        }
        .goal-viz {
          width: 300px !important;
          height: 300px !important;
        }
        .mascot-celebrate {
          width: 180px !important;
          height: 180px !important;
        }
        .hero-rule-card {
          padding: 20px !important;
        }
        .hero-chip {
          font-size: 0.75rem !important;
          padding: 8px 14px !important;
        }
        .goal-amount-text {
          font-size: 1.75rem !important;
        }
        .hero-btn-pill {
          padding: 16px 32px !important;
          font-size: 1rem !important;
        }
      }

      /* Glass card hover for sections below hero */
      .landing-glass-card:hover {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(255, 179, 71, 0.2) !important;
        box-shadow: 0 0 40px rgba(255, 179, 71, 0.04);
        transform: translateY(-2px);
      }

      /* Gold shimmer for "Most Popular" feature card */
      @keyframes gold-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .gold-shimmer-border {
        background: linear-gradient(
          90deg,
          rgba(255, 179, 71, 0.1) 0%,
          rgba(255, 179, 71, 0.3) 50%,
          rgba(255, 179, 71, 0.1) 100%
        );
        background-size: 200% 100%;
        animation: gold-shimmer 3s linear infinite;
      }

      /* Confetti drop for CTA section */
      @keyframes landing-confetti-drop {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.3; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      .landing-confetti-drop {
        animation: landing-confetti-drop 4s ease-in infinite;
      }

      /* Sparkle pulse for section labels */
      @keyframes landing-sparkle-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }
      .landing-sparkle-pulse {
        animation: landing-sparkle-pulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

// =============================================================================
// SPARKLE CHARACTER (for section labels below hero)
// =============================================================================
function SparkleChar({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={`landing-sparkle-pulse inline-block ${className}`}
      style={{
        animationDelay: `${delay}s`,
        color: COLORS.coral,
        fontSize: "inherit",
      }}
    >
      &#10022;
    </span>
  );
}

// =============================================================================
// CONFETTI DOTS (for CTA section)
// =============================================================================
function ConfettiDots() {
  const dots = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + Math.random() * 84}%`,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 3 + Math.random() * 4,
    color:
      i % 3 === 0 ? COLORS.coral : i % 3 === 1 ? COLORS.cocoa : COLORS.muted,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <span
          key={i}
          className="landing-confetti-drop absolute rounded-full"
          style={{
            left: dot.left,
            top: "-10px",
            width: dot.size,
            height: dot.size,
            background: dot.color,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// 1. FLOATING PILL NAVBAR
// =============================================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
        background: scrolled
          ? "rgba(13, 11, 10, 0.85)"
          : "rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "999px",
        width: "90%",
        maxWidth: "1200px",
        zIndex: 100,
        transition: "background 0.3s ease",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "'DynaPuff', cursive",
          fontSize: "1.5rem",
          color: "#ffb347",
          textDecoration: "none",
          letterSpacing: "-1px",
        }}
      >
        {APP_NAME}
      </Link>

      {/* Center: Nav links (desktop) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: "#968a84",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        <a href="#features" style={{ color: "#968a84", textDecoration: "none" }}>
          Features
        </a>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <a
          href="#how-it-works"
          style={{ color: "#968a84", textDecoration: "none" }}
        >
          How It Works
        </a>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <a href="#join" style={{ color: "#ffb347", textDecoration: "none" }}>
          Join Waitlist
        </a>
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#ffb347",
            boxShadow: "0 0 10px #ffb347",
          }}
        />
      </div>

      {/* Right: Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href={ROUTES.signIn}
          style={{
            color: "#968a84",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}

// =============================================================================
// 2. HERO SECTION (FAITHFUL PORT OF react-app.js TEMPLATE)
// =============================================================================
function HeroSection() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section
      className="hero-noise-overlay landing-hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#0d0b0a",
        color: "#ffffff",
      }}
    >
      {/* Ambient glow blurs — EXACT from template */}
      <div
        style={{ ...customStyles.ambientGlow, ...customStyles.glow1 }}
      />
      <div
        style={{ ...customStyles.ambientGlow, ...customStyles.glow2 }}
      />

      {/* Main 2-col grid — EXACT layout from template */}
      <main
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "120px 5% 60px",
          gap: "80px",
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL — setup/content side */}
        <section className="hero-left-panel" style={{ maxWidth: "520px", paddingTop: "20px" }}>
          <div style={{ marginBottom: "48px" }}>
            {/* Section label */}
            <span style={customStyles.sectionLabel}>
              The Financial Companion for Africans
            </span>

            {/* Headline */}
            <h1 style={customStyles.h1}>
              See{" "}
              <span style={{ color: "#ffb347" }}>ALL</span> your money.
              <br />
              In one place.
              <br />
              <span style={{ color: "#ffb347" }}>Finally.</span>
            </h1>

            {/* Subtitle */}
            <p style={customStyles.subtitle}>
              Bank accounts, investments, pensions, crypto — connected
              across countries, converted to your currency. One beautiful
              dashboard.
            </p>
          </div>

          {/* Feature card 1: Smart Aggregation */}
          <div className="hero-rule-card" style={customStyles.ruleCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3 style={customStyles.ruleInfoH3}>Smart Aggregation</h3>
                <p style={customStyles.ruleInfoP}>
                  Automatically connect every bank, investment & crypto account
                  you own.
                </p>
              </div>
              <div style={{ color: "#ffb347", flexShrink: 0, marginLeft: "12px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.875rem",
                color: "#ffb347",
              }}
            >
              <span>5 accounts</span>
              <span>3 countries</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "78%",
                  height: "100%",
                  background: "#ffb347",
                  borderRadius: "4px",
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>

          {/* Feature card 2: AI Financial Coach */}
          <div className="hero-rule-card" style={customStyles.ruleCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <h3 style={customStyles.ruleInfoH3}>AI Financial Coach</h3>
                <p style={customStyles.ruleInfoP}>
                  Personalized advice that understands African money culture.
                  Sholz has your back.
                </p>
              </div>
              <div style={{ color: "#ffb347", flexShrink: 0, marginLeft: "12px" }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
            </div>
            {/* Sample chat bubble */}
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "16px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "#968a84",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#ffb347" }}>Sholz:</span> &ldquo;Your
              savings rate jumped to 23.7% this month. At this pace, your Japa
              fund hits target by August.&rdquo;
            </div>
          </div>

          {/* CTA button */}
          <a
            href="#join"
            className="hero-btn-pill"
            style={{
              ...customStyles.btnPill,
              ...(btnHovered
                ? { transform: "scale(1.02)", background: "#ffffff" }
                : {}),
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            Join the Waitlist
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
          </a>
        </section>

        {/* RIGHT PANEL — ring + mascot visualization */}
        <section
          className="hero-visual-container"
          style={{
            position: "sticky",
            top: "120px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "40px",
          }}
        >
          <div
            className="goal-viz"
            style={{
              position: "relative",
              width: "500px",
              height: "500px",
            }}
          >
            {/* SVG RING — EXACT from template */}
            <svg style={customStyles.goalRingSvg} viewBox="0 0 440 440">
              <circle className="ring-bg" cx="220" cy="220" r="200" />
              <circle
                className="ring-progress-anim"
                cx="220"
                cy="220"
                r="200"
                style={{ stroke: "#ffb347" }}
              />
            </svg>

            {/* 3D MASCOT — EXACT from template, coral color */}
            <div className="mascot-celebrate" style={customStyles.mascotCelebrate}>
              <div className="mascot-body-anim" style={customStyles.mascotBody}>
                <div style={customStyles.mascotEyes}>
                  <div style={customStyles.eyeHappy} />
                  <div style={customStyles.eyeHappy} />
                </div>
                <div style={customStyles.mascotMouth} />
              </div>
            </div>

            {/* FLOATING CHIPS — EXACT layout, WealthMotley content */}
            <div
              className="chip-float-1 hero-chip"
              style={{ ...customStyles.chip, top: "10%", right: "5%" }}
            >
              +N2.4M this month
            </div>
            <div
              className="chip-float-2 hero-chip"
              style={{ ...customStyles.chip, bottom: "15%", left: "0%" }}
            >
              23.7% savings rate
            </div>
            <div
              className="chip-float-3 hero-chip"
              style={{ ...customStyles.chip, top: "25%", left: "10%" }}
            >
              Goal: Financial Freedom
            </div>

            {/* SPARKLES — EXACT from template */}
            <div
              className="sparkle-pulse-1"
              style={{ ...customStyles.sparkle, top: "10%", left: "20%" }}
            >
              &#10022;
            </div>
            <div
              className="sparkle-pulse-2"
              style={{ ...customStyles.sparkle, bottom: "20%", right: "15%" }}
            >
              &#10022;
            </div>

            {/* GOAL LABEL — WealthMotley content */}
            <div style={customStyles.goalLabel}>
              <div style={customStyles.goalTarget}>Total Net Worth</div>
              <div className="goal-amount-text" style={customStyles.goalAmount}>
                N12,450,000
              </div>
            </div>

            {/* CONFETTI DOTS — EXACT from template */}
            <div
              className="confetti-drop-1"
              style={{
                ...customStyles.confetti,
                left: "10%",
                background: "#ffb347",
              }}
            />
            <div
              className="confetti-drop-2"
              style={{
                ...customStyles.confetti,
                left: "30%",
                background: "#fff",
              }}
            />
            <div
              className="confetti-drop-3"
              style={{
                ...customStyles.confetti,
                left: "60%",
                background: "#ffb347",
              }}
            />
            <div
              className="confetti-drop-4"
              style={{
                ...customStyles.confetti,
                left: "85%",
                background: "#fff",
              }}
            />
          </div>
        </section>
      </main>
    </section>
  );
}

// =============================================================================
// 3. FEATURES SECTION
// =============================================================================
const features: {
  icon: PhosphorIcon;
  title: string;
  description: string;
  featured: boolean;
}[] = [
  {
    icon: SquaresFour,
    title: "All My Money",
    description:
      "See everything you own across every platform. Nigerian bank accounts, UK investments, crypto wallets, pension funds — one beautiful dashboard, one currency.",
    featured: true,
  },
  {
    icon: Receipt,
    title: "Smart Budget",
    description:
      "Budget categories that actually make sense. Jollof & Chops, Data & Airtime, Owambe Fund, Black Tax — because your money is not a Western textbook.",
    featured: false,
  },
  {
    icon: AirplaneTilt,
    title: "Japa Ready Score",
    description:
      "Planning to relocate? Know exactly where you stand. Visa fees, proof of funds, first 3 months rent — see your readiness score tick up in real time.",
    featured: false,
  },
  {
    icon: Robot,
    title: "AI Financial Coach",
    description:
      "Sholz's warmth meets your real spending data. Get personalized advice that understands susu, esusu, ajo, and why you sent money home three times this month.",
    featured: false,
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 sm:py-28"
      style={{ background: COLORS.bg }}
    >
      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel>What You Get</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              color: COLORS.white,
              fontFamily: "'DynaPuff', cursive",
            }}
          >
            Everything your money needs.
            <br />
            <span style={{ color: COLORS.coral }}>
              Nothing it doesn&apos;t.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-2xl text-base"
            style={{ color: COLORS.muted }}
          >
            Built from the ground up for how Africans actually manage money —
            across borders, across currencies, across platforms.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={liftCard}>
              <div
                className="landing-glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 sm:p-8"
                style={{
                  ...glassCard,
                  ...(feature.featured
                    ? {
                        borderColor: "rgba(255, 179, 71, 0.2)",
                        boxShadow: "0 0 40px rgba(255, 179, 71, 0.06)",
                      }
                    : {}),
                }}
              >
                {/* Featured badge */}
                {feature.featured && (
                  <div className="absolute -top-px right-6 z-10">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-b-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        background: COLORS.coral,
                        color: COLORS.bg,
                      }}
                    >
                      <Crown className="size-3" weight="fill" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Gold shimmer for featured */}
                {feature.featured && (
                  <div className="gold-shimmer-border pointer-events-none absolute inset-0 rounded-2xl opacity-20" />
                )}

                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: feature.featured
                      ? "rgba(255, 179, 71, 0.12)"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${feature.featured ? "rgba(255, 179, 71, 0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <feature.icon
                    className="size-6"
                    style={{
                      color: feature.featured
                        ? COLORS.coral
                        : COLORS.mutedLight,
                    }}
                  />
                </div>

                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: COLORS.white,
                    fontFamily: "'DynaPuff', cursive",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: COLORS.muted }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// 4. WHO IT'S FOR SECTION
// =============================================================================
const personas: {
  icon: PhosphorIcon;
  title: string;
  description: string;
  bgIcon: PhosphorIcon;
}[] = [
  {
    icon: GlobeHemisphereWest,
    title: "The Diaspora Professional",
    description:
      "Managing money across two countries. GBP to Naira, investments here and there. Finally, one view.",
    bgIcon: GlobeHemisphereWest,
  },
  {
    icon: Heart,
    title: "The First-Gen Builder",
    description:
      "Supporting family, building wealth, no safety net. Every naira matters.",
    bgIcon: Heart,
  },
  {
    icon: MapPin,
    title: "The Japa Planner",
    description:
      "Saving to relocate? Know exactly when you\u2019re ready. Track your progress down to the last naira.",
    bgIcon: AirplaneTilt,
  },
];

function WhoItsForSection() {
  return (
    <section
      id="who-it's-for"
      className="relative py-20 sm:py-28"
      style={{ background: COLORS.bg }}
    >
      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel>
              <Users className="size-3.5" />
              Who It&apos;s For
            </SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              color: COLORS.white,
              fontFamily: "'DynaPuff', cursive",
            }}
          >
            Built for Africans who{" "}
            <span style={{ color: COLORS.coral }}>refuse to stay broke</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-base"
            style={{ color: COLORS.muted }}
          >
            Whether you&apos;re building from scratch, juggling two currencies,
            or planning your next move — we get it.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-4 sm:gap-5 md:grid-cols-3"
        >
          {personas.map((persona) => (
            <motion.div key={persona.title} variants={liftCard}>
              <div
                className="landing-glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 sm:p-8"
                style={glassCard}
              >
                {/* Background icon watermark */}
                <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.04]">
                  <persona.bgIcon
                    size={80}
                    weight="duotone"
                    color={COLORS.white}
                  />
                </div>

                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(255, 179, 71, 0.08)",
                    border: "1px solid rgba(255, 179, 71, 0.15)",
                  }}
                >
                  <persona.icon
                    className="size-6"
                    style={{ color: COLORS.coral }}
                  />
                </div>

                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: COLORS.white,
                    fontFamily: "'DynaPuff', cursive",
                  }}
                >
                  {persona.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: COLORS.muted }}
                >
                  {persona.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// 5. HOW IT WORKS SECTION
// =============================================================================
const steps = [
  {
    step: "01",
    icon: DeviceMobile,
    title: "Connect your bank",
    description:
      "Link your Nigerian bank accounts securely in 60 seconds via Mono. Read-only access — we can never move your money.",
  },
  {
    step: "02",
    icon: Camera,
    title: "Add your investments",
    description:
      "Screenshot any investment app — Cowrywise, PiggyVest, Trading 212, Bamboo — and our AI imports your holdings automatically.",
  },
  {
    step: "03",
    icon: ChartBar,
    title: "See your complete picture",
    description:
      "Everything you own, everywhere it lives, converted to your preferred currency. Updated daily. Completely private.",
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28"
      style={{ background: COLORS.bg }}
    >
      {/* Subtle horizontal divider glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 179, 71, 0.15), transparent)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel>How It Works</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              color: COLORS.white,
              fontFamily: "'DynaPuff', cursive",
            }}
          >
            Three steps to{" "}
            <span style={{ color: COLORS.coral }}>financial clarity</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-xl text-base"
            style={{ color: COLORS.muted }}
          >
            No spreadsheets. No manual entry. Just connect and see.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="relative mt-14"
        >
          {/* Connecting line (desktop) */}
          <div
            className="pointer-events-none absolute top-[72px] left-[16.67%] right-[16.67%] hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 179, 71, 0.2), rgba(255, 179, 71, 0.2), transparent)",
            }}
          />

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <motion.div key={step.step} variants={liftCard}>
                <div
                  className="landing-glass-card group relative h-full overflow-hidden rounded-2xl p-6 text-center transition-all duration-500 sm:p-8"
                  style={glassCard}
                >
                  {/* Step number */}
                  <span
                    className="text-5xl font-bold"
                    style={{
                      color: "rgba(255, 179, 71, 0.15)",
                      fontFamily: "'DynaPuff', cursive",
                    }}
                  >
                    {step.step}
                  </span>

                  {/* Icon */}
                  <div
                    className="mx-auto mt-4 mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(255, 179, 71, 0.08)",
                      border: "1px solid rgba(255, 179, 71, 0.15)",
                    }}
                  >
                    <step.icon
                      className="size-7"
                      style={{ color: COLORS.coral }}
                    />
                  </div>

                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: COLORS.white,
                      fontFamily: "'DynaPuff', cursive",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: COLORS.muted }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// 6. SOCIAL PROOF SECTION
// =============================================================================
const testimonials = [
  {
    quote:
      "I finally know my actual net worth across Naira and Pounds. No more guessing.",
    name: "Tolu A.",
    location: "Lagos / London",
    rating: 5,
  },
  {
    quote:
      "The Japa Ready Score showed me I was closer to relocating than I thought. Game changer.",
    name: "Kwame O.",
    location: "Accra",
    rating: 5,
  },
  {
    quote:
      "Black Tax tracker helped me set boundaries with family without the guilt. Thank you.",
    name: "Amina S.",
    location: "Nairobi / Toronto",
    rating: 5,
  },
];

function SocialProofSection() {
  return (
    <section
      className="relative py-20 sm:py-28"
      style={{ background: COLORS.bg }}
    >
      {/* Subtle divider */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={fadeInUp}>
            <SectionLabel>
              <Users className="size-3.5" />
              Community
            </SectionLabel>
          </motion.div>

          {/* Large number */}
          <motion.div variants={fadeInUp} className="mt-8">
            <span
              className="text-5xl font-bold sm:text-6xl lg:text-7xl"
              style={{
                color: COLORS.coral,
                fontFamily: "'DynaPuff', cursive",
              }}
            >
              167,000+
            </span>
            <p
              className="mt-2 text-xl font-semibold sm:text-2xl"
              style={{
                color: COLORS.white,
                fontFamily: "'DynaPuff', cursive",
              }}
            >
              Africans mastering their money
            </p>
            <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
              From Lagos to London, Accra to Abu Dhabi — people across the
              continent and diaspora are taking control.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5"
        >
          {testimonials.map((t, idx) => (
            <motion.div key={idx} variants={liftCard}>
              <div
                className="landing-glass-card group h-full rounded-2xl p-6 transition-all duration-500 sm:p-8"
                style={glassCard}
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4"
                      weight="fill"
                      color={COLORS.coral}
                    />
                  ))}
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: COLORS.mutedLight }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "rgba(255, 179, 71, 0.12)",
                      color: COLORS.coral,
                      fontFamily: "'DynaPuff', cursive",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: COLORS.white }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.muted }}>
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// 7. WAITLIST CTA SECTION
// =============================================================================
function CTASection() {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    position: number;
    referralCode: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const joinWaitlist = useMutation(api.waitlist.join);
  const MOCK_BASE_COUNT = 2847;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !country) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const res = await joinWaitlist({ email, country });
      if (res.success) {
        setResult({
          position: MOCK_BASE_COUNT + res.position,
          referralCode: res.referralCode,
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCopyReferral() {
    if (!result) return;
    const shareUrl = `${window.location.origin}?ref=${result.referralCode}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section
      id="join"
      className="relative py-20 sm:py-28"
      style={{ background: COLORS.bg }}
    >
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 179, 71, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          {/* CTA Glass Card */}
          <motion.div
            variants={scaleIn}
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 179, 71, 0.06) 0%, rgba(230, 126, 34, 0.06) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 179, 71, 0.15)",
              boxShadow: "0 0 60px rgba(255, 179, 71, 0.06)",
            }}
          >
            <ConfettiDots />

            <div className="relative z-10 text-center">
              <SparkleChar delay={0} className="text-lg" />

              <h2
                className="mt-4 text-3xl font-bold sm:text-4xl"
                style={{
                  color: COLORS.white,
                  fontFamily: "'DynaPuff', cursive",
                }}
              >
                Join the waitlist
              </h2>
              <p className="mt-2 text-base" style={{ color: COLORS.muted }}>
                Early members get{" "}
                <span
                  style={{ color: COLORS.coral }}
                  className="font-semibold"
                >
                  lifetime premium pricing
                </span>
              </p>

              {/* Live counter */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                  style={glassCard}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ background: "#22c55e" }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: "#22c55e" }}
                    />
                  </span>
                  <span className="text-sm" style={{ color: COLORS.muted }}>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.coral }}
                    >
                      {MOCK_BASE_COUNT.toLocaleString()}
                    </span>{" "}
                    people waiting
                  </span>
                </span>
              </div>

              {/* Form or Result */}
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 flex-1 rounded-xl border px-4 text-sm outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.1)",
                          color: COLORS.white,
                        }}
                      />
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-12 rounded-xl border px-3 text-sm outline-none transition-all duration-300 sm:w-40"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.1)",
                          color: country ? COLORS.white : COLORS.muted,
                        }}
                      >
                        <option value="" disabled>
                          Country
                        </option>
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <option
                            key={c.code}
                            value={c.code}
                            style={{
                              background: COLORS.bg,
                              color: COLORS.white,
                            }}
                          >
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 rounded-xl px-6 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 sm:w-auto"
                        style={{
                          background: COLORS.coral,
                          color: COLORS.bg,
                        }}
                      >
                        {isSubmitting ? "Joining..." : "Join"}
                        {!isSubmitting && (
                          <ArrowRight className="ml-1.5 inline size-4" />
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mx-auto max-w-md rounded-2xl p-6 text-center sm:p-8"
                      style={{
                        ...glassCard,
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ background: "rgba(34, 197, 94, 0.15)" }}
                      >
                        <Sparkle
                          className="size-7"
                          style={{ color: "#22c55e" }}
                        />
                      </div>

                      <p
                        className="text-xl font-bold"
                        style={{
                          color: COLORS.white,
                          fontFamily: "'DynaPuff', cursive",
                        }}
                      >
                        You&apos;re in!
                      </p>
                      <p
                        className="mt-2 text-5xl font-bold"
                        style={{ color: COLORS.coral }}
                      >
                        #{result.position.toLocaleString()}
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: COLORS.muted }}
                      >
                        in the queue
                      </p>

                      <div
                        className="my-5 h-px"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      />

                      <p className="text-xs" style={{ color: COLORS.muted }}>
                        Share your referral link to move up the list
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <code
                          className="rounded-lg px-4 py-2 text-sm font-bold tracking-wider"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: COLORS.coral,
                            fontFamily: "'DynaPuff', cursive",
                          }}
                        >
                          {result.referralCode}
                        </code>
                        <button
                          onClick={handleCopyReferral}
                          className="rounded-lg p-2 transition-all duration-200 hover:bg-white/5"
                          style={{ color: COLORS.muted }}
                        >
                          {copied ? (
                            <Check
                              className="size-4"
                              style={{ color: "#22c55e" }}
                            />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <p
                          className="mt-2 text-xs"
                          style={{ color: "#22c55e" }}
                        >
                          Referral link copied!
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p className="mt-3 text-sm" style={{ color: COLORS.coral }}>
                    {error}
                  </p>
                )}
              </div>

              <div
                className="mt-6 flex items-center justify-center gap-2 text-xs"
                style={{ color: "rgba(150, 138, 132, 0.6)" }}
              >
                <Lock className="size-3" />
                <span>We&apos;ll never spam you. Unsubscribe anytime.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// 8. FOOTER
// =============================================================================
function Footer() {
  return (
    <footer
      className="relative"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: COLORS.bg,
      }}
    >
      <div
        className="py-12 sm:py-16"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <span
                  className="text-lg font-bold"
                  style={{
                    color: COLORS.coral,
                    fontFamily: "'DynaPuff', cursive",
                  }}
                >
                  {APP_NAME}
                </span>
              </Link>
              <p
                className="mt-3 max-w-xs text-sm leading-relaxed"
                style={{ color: COLORS.muted }}
              >
                The first AI-powered financial education companion built for
                Africans. See all your money. In one place.
              </p>
              <div className="mt-4 flex gap-3">
                {[
                  {
                    icon: TwitterLogo,
                    href: "https://twitter.com/wealthmotley",
                    label: "Twitter",
                  },
                  {
                    icon: InstagramLogo,
                    href: "https://instagram.com/wealthmotley",
                    label: "Instagram",
                  },
                  {
                    icon: LinkedinLogo,
                    href: "https://linkedin.com/company/wealthmotley",
                    label: "LinkedIn",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      color: COLORS.muted,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3
                className="text-sm font-semibold"
                style={{
                  color: COLORS.white,
                  fontFamily: "'DynaPuff', cursive",
                }}
              >
                Product
              </h3>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Join Waitlist", href: "#join" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: COLORS.muted }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3
                className="text-sm font-semibold"
                style={{
                  color: COLORS.white,
                  fontFamily: "'DynaPuff', cursive",
                }}
              >
                Company
              </h3>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "About", href: "#" },
                  { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
                  { label: "Careers", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: COLORS.muted }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3
                className="text-sm font-semibold"
                style={{
                  color: COLORS.white,
                  fontFamily: "'DynaPuff', cursive",
                }}
              >
                Legal
              </h3>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "NDPA Compliance", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: COLORS.muted }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div
            className="my-8 h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs" style={{ color: COLORS.muted }}>
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights
              reserved.
            </p>
            <p
              className="max-w-md text-center text-[11px] leading-relaxed sm:text-right"
              style={{ color: "rgba(150, 138, 132, 0.5)" }}
            >
              {APP_NAME} provides educational financial tools only. Not
              financial advice. Always consult a qualified financial advisor for
              personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// FLOATING MOBILE CTA
// =============================================================================
function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 lg:hidden"
          style={{
            background: "rgba(13, 11, 10, 0.9)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderTop: `1px solid rgba(255, 179, 71, 0.15)`,
          }}
        >
          <a
            href="#join"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              background: COLORS.coral,
              color: COLORS.bg,
              boxShadow: "0 4px 24px rgba(255, 179, 71, 0.3)",
            }}
          >
            Join the Waitlist
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// MAIN LANDING PAGE
// =============================================================================
export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen"
      style={{ background: COLORS.bg, color: COLORS.white }}
    >
      <TemplateStyles />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhoItsForSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
