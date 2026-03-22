"use client";

import { useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Design tokens (match landing page exactly)                         */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#0d0b0a",
  amber: "#ffb347",
  muted: "#968a84",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const;

const styles = {
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
  mascotCelebrate: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "260px",
    height: "260px",
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
    gap: "32px",
    transform: "translateY(-16px)",
  },
  eyeHappy: {
    width: "24px",
    height: "12px",
    border: "5px solid #1a1614",
    borderRadius: "24px 24px 0 0",
    borderBottom: 0,
  },
  mascotMouth: {
    position: "absolute" as const,
    bottom: "65px",
    width: "48px",
    height: "24px",
    background: "#1a1614",
    borderRadius: "0 0 48px 48px",
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
    background: COLORS.glass,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: "16px",
    padding: "10px 16px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.8rem",
    color: "#ffb347",
    zIndex: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  sparkle: {
    position: "absolute" as const,
    color: "#ffb347",
    fontSize: "1.5rem",
  },
  confetti: {
    position: "absolute" as const,
    width: "8px",
    height: "8px",
    borderRadius: "2px",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Inject keyframes + fonts (same approach as landing page)            */
/* ------------------------------------------------------------------ */
function AuthStyles() {
  useEffect(() => {
    const id = "auth-template-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DynaPuff:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

      .auth-noise-overlay::before {
        content: "";
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 9999;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
      }

      @keyframes auth-bounce {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.05) translateY(-20px); }
      }

      @keyframes auth-fillRing {
        from { stroke-dashoffset: 1256; }
        to { stroke-dashoffset: 350; }
      }

      @keyframes auth-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }

      @keyframes auth-drop {
        0% { transform: translateY(-300px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
      }

      @keyframes auth-sparkle {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.3); opacity: 1; }
      }

      .auth-mascot-bounce { animation: auth-bounce 2s ease-in-out infinite; }

      .auth-ring-progress {
        fill: none;
        stroke: #ffb347;
        stroke-width: 12;
        stroke-linecap: round;
        stroke-dasharray: 1256;
        stroke-dashoffset: 400;
        animation: auth-fillRing 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .auth-ring-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.08);
        stroke-width: 12;
      }

      .auth-chip-1 { animation: auth-float 4s ease-in-out infinite; animation-delay: 0s; }
      .auth-chip-2 { animation: auth-float 4s ease-in-out infinite; animation-delay: 1s; }
      .auth-chip-3 { animation: auth-float 4s ease-in-out infinite; animation-delay: 0.5s; }

      .auth-sparkle-1 { animation: auth-sparkle 1.5s infinite; }
      .auth-sparkle-2 { animation: auth-sparkle 1.5s infinite; animation-delay: 0.5s; }

      .auth-confetti-1 { animation: auth-drop 3s linear infinite; animation-delay: 0s; }
      .auth-confetti-2 { animation: auth-drop 3s linear infinite; animation-delay: 0.5s; }
      .auth-confetti-3 { animation: auth-drop 3s linear infinite; animation-delay: 1.2s; }
      .auth-confetti-4 { animation: auth-drop 3s linear infinite; animation-delay: 0.8s; }

      /* Auth glass input focus */
      .auth-glass-input:focus {
        border-color: #ffb347 !important;
        box-shadow: 0 0 0 2px rgba(255, 179, 71, 0.1) !important;
        outline: none;
      }

      /* Auth pill button hover */
      .auth-pill-btn:hover:not(:disabled) {
        background: #ffffff !important;
        transform: scale(1.02);
      }
      .auth-pill-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* Auth social button hover */
      .auth-social-btn:hover {
        background: rgba(255, 255, 255, 0.07) !important;
        border-color: rgba(255, 179, 71, 0.2) !important;
      }

      /* Auth glass card */
      .auth-glass-card {
        background: rgba(255, 255, 255, 0.04);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
      }

      /* Auth tab underline */
      .auth-tab-active {
        color: #ffffff;
      }
      .auth-tab-inactive {
        color: #968a84;
      }
      .auth-tab-inactive:hover {
        color: #b8ada6;
      }

      /* Custom checkbox */
      .auth-checkbox {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        position: relative;
        flex-shrink: 0;
      }
      .auth-checkbox:checked {
        background: #ffb347;
        border-color: #ffb347;
      }
      .auth-checkbox:checked::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 5px;
        width: 5px;
        height: 9px;
        border: solid #0d0b0a;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      /* Gradient fade at bottom of right panel */
      .auth-right-fade {
        background: linear-gradient(to top, #0d0b0a 0%, transparent 100%);
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Right panel: mascot + ring + chips + sparkles + confetti            */
/* ------------------------------------------------------------------ */
function RightPanel() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: "32px", zIndex: 40 }}>
        <h2
          style={{
            fontFamily: "'DynaPuff', cursive",
            fontSize: "2rem",
            color: "#ffffff",
            lineHeight: 1.2,
          }}
        >
          Start your{" "}
          <span style={{ color: "#ffb347" }}>wealth journey.</span>
        </h2>
      </div>

      {/* Mascot visualization */}
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          flexShrink: 0,
        }}
      >
        {/* SVG Ring */}
        <svg style={styles.goalRingSvg} viewBox="0 0 440 440">
          <circle className="auth-ring-bg" cx="220" cy="220" r="200" />
          <circle
            className="auth-ring-progress"
            cx="220"
            cy="220"
            r="200"
          />
        </svg>

        {/* 3D Mascot */}
        <div style={styles.mascotCelebrate}>
          <div className="auth-mascot-bounce" style={styles.mascotBody}>
            <div style={styles.mascotEyes}>
              <div style={styles.eyeHappy} />
              <div style={styles.eyeHappy} />
            </div>
            <div style={styles.mascotMouth} />
          </div>
        </div>

        {/* Floating chips */}
        <div
          className="auth-chip-1"
          style={{ ...styles.chip, top: "8%", right: "2%" }}
        >
          +N2.4M net worth
        </div>
        <div
          className="auth-chip-2"
          style={{ ...styles.chip, bottom: "18%", left: "-2%" }}
        >
          Bank-level security
        </div>
        <div
          className="auth-chip-3"
          style={{ ...styles.chip, top: "28%", left: "2%" }}
        >
          167K+ community
        </div>

        {/* Sparkles */}
        <div
          className="auth-sparkle-1"
          style={{ ...styles.sparkle, top: "10%", left: "18%" }}
        >
          &#10022;
        </div>
        <div
          className="auth-sparkle-2"
          style={{ ...styles.sparkle, bottom: "22%", right: "12%" }}
        >
          &#10022;
        </div>

        {/* Confetti */}
        <div
          className="auth-confetti-1"
          style={{ ...styles.confetti, left: "10%", background: "#ffb347" }}
        />
        <div
          className="auth-confetti-2"
          style={{ ...styles.confetti, left: "30%", background: "#fff" }}
        />
        <div
          className="auth-confetti-3"
          style={{ ...styles.confetti, left: "60%", background: "#ffb347" }}
        />
        <div
          className="auth-confetti-4"
          style={{ ...styles.confetti, left: "85%", background: "#fff" }}
        />
      </div>

      {/* Gradient fade at bottom */}
      <div
        className="auth-right-fade"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          zIndex: 35,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Auth layout                                                        */
/* ================================================================== */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
      className="auth-noise-overlay"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: COLORS.bg,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <AuthStyles />

      {/* Ambient glows */}
      <div style={{ ...styles.ambientGlow, ...styles.glow1 }} />
      <div style={{ ...styles.ambientGlow, ...styles.glow2 }} />

      {/* ====== LEFT SIDE: Form area ====== */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          zIndex: 10,
          padding: "40px",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'DynaPuff', cursive",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: COLORS.amber,
            textDecoration: "none",
            marginBottom: "40px",
            display: "inline-block",
          }}
        >
          WealthMotley
        </Link>

        {/* Form container — centered */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "440px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </div>

      {/* ====== RIGHT SIDE: Visual panel (hidden on mobile) ====== */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          minHeight: "100vh",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, rgba(255,179,71,0.06) 0%, transparent 70%)",
        }}
      >
        <RightPanel />
      </div>
    </div>
  );
}
