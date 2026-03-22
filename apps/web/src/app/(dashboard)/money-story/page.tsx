"use client";

import { useState, useEffect, useRef } from "react";

// ── Quiz Data ────────────────────────────────────────────────────────
const quizData = [
  {
    q: "How do you feel about checking your account balance?",
    opts: [
      "Daily, sometimes twice",
      "Weekly when I remember",
      "Only when I need to pay for something",
      "I have apps for that",
    ],
  },
  {
    q: "Your friend asks to borrow \u20A650K. You...",
    opts: [
      "Check their repayment history first",
      "Give it but set a strict reminder",
      "Offer \u20A620K instead, no strings attached",
      "Send immediately, we're family",
    ],
  },
  {
    q: "You get an unexpected \u20A6100K alert. First thought?",
    opts: [
      "Which savings goal gets this?",
      "Investment opportunity time",
      "Where's the nearest good restaurant?",
      "Let me just leave it there and think",
    ],
  },
  {
    q: "The WhatsApp group says Aso-Ebi is \u20A6150K. Your reaction?",
    opts: [
      "Mute group, ignore indefinitely",
      "Pay immediately to secure the fabric",
      "Calculate if the food will be worth it",
      "Ask for a payment plan",
    ],
  },
  {
    q: "Salary drops. What happens in the first hour?",
    opts: [
      "Automated transfers hit all savings pots",
      "Pay off debts and breathe",
      "Open ASOS/Shein carts",
      "Calculate parallel market rate to change to USD",
    ],
  },
  {
    q: "Your view on Crypto?",
    opts: [
      "Scam. Real estate only.",
      "Have a small bag, just in case",
      "Diamond hands, buy the dip!",
      "I only use it to send money abroad",
    ],
  },
  {
    q: "Black tax strategy?",
    opts: [
      "Strict monthly allowance",
      "Pay as issues arise until I'm broke",
      "Send bulk groceries instead of cash",
      "Tell everyone I was sacked",
    ],
  },
  {
    q: "What's the ultimate end goal?",
    opts: [
      "Retire early on a farm",
      "Build generational wealth",
      "Soft life, premium enjoyment only",
      "Canadian passport and peace of mind",
    ],
  },
];

// ── Puff Logo ────────────────────────────────────────────────────────
function PuffLogo() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect x="20" y="20" width="80" height="80" rx="24" fill="#ffb347" />
      <path
        d="M30 50 Q 30 45, 35 45 L 85 45 Q 90 45, 90 50 L 90 60 Q 90 65, 85 65 L 70 65 Q 65 65, 65 60 L 65 55 L 55 55 L 55 60 Q 55 65, 50 65 L 35 65 Q 30 65, 30 60 Z"
        fill="#0d0b0a"
      />
      <rect
        x="35"
        y="48"
        width="10"
        height="5"
        fill="rgba(255,255,255,0.2)"
        rx="2"
      />
      <rect
        x="70"
        y="48"
        width="10"
        height="5"
        fill="rgba(255,255,255,0.2)"
        rx="2"
      />
      <path
        d="M45 80 Q 60 90, 75 75"
        stroke="#0d0b0a"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Story Slides ─────────────────────────────────────────────────────
function Slide0() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background: "linear-gradient(to bottom, #0d0b0a, #0d0b0a)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,179,71,0.05)",
        }}
      />
      <div
        style={{ width: "128px", height: "128px", marginBottom: "32px" }}
        className="animate-float"
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          style={{
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 0 30px rgba(255,179,71,0.3))",
          }}
        >
          <circle cx="60" cy="60" r="50" fill="#ffb347" />
          <path
            d="M40 50 Q 60 70 80 50"
            stroke="#0d0b0a"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="45" cy="40" r="6" fill="#0d0b0a" />
          <circle cx="75" cy="40" r="6" fill="#0d0b0a" />
        </svg>
      </div>
      <h2
        className="font-display"
        style={{
          fontSize: "2.25rem",
          color: "white",
          marginBottom: "16px",
          lineHeight: "1.2",
          position: "relative",
          zIndex: 10,
        }}
      >
        Your 2025
        <br />
        <span style={{ color: "#ffb347" }}>Money Wrapped</span>
      </h2>
      <p
        className="font-mono"
        style={{
          color: "#968a84",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontSize: "0.875rem",
          position: "relative",
          zIndex: 10,
          marginBottom: "48px",
        }}
      >
        The numbers don&apos;t lie.
      </p>
      <div
        style={{
          marginTop: "auto",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
        className="animate-bounce"
      >
        <span
          className="font-mono"
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Tap right to begin
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffb347"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function Slide1() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to bottom right, rgba(239,68,68,0.1), #0d0b0a)",
        textAlign: "left",
      }}
    >
      <div style={{ marginBottom: "auto", marginTop: "64px" }}>
        <span
          className="font-mono"
          style={{
            color: "#ef4444",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
            background: "rgba(239,68,68,0.1)",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          The Damage
        </span>
      </div>
      <h3
        className="font-display"
        style={{ fontSize: "1.875rem", color: "white", marginBottom: "8px" }}
      >
        You spent
      </h3>
      <div
        className="font-mono"
        style={{
          fontSize: "3.75rem",
          fontWeight: "bold",
          color: "#ef4444",
          marginBottom: "24px",
          letterSpacing: "-0.05em",
          filter: "drop-shadow(0 0 20px rgba(239,68,68,0.3))",
        }}
      >
        &#x20A6;4.2M
      </div>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#968a84",
          marginBottom: "48px",
          borderLeft: "2px solid rgba(239,68,68,0.3)",
          paddingLeft: "16px",
        }}
      >
        this year.
      </p>
      <div
        style={{
          marginTop: "auto",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(239,68,68,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            &#x1F35A;
          </div>
          <p
            className="font-display"
            style={{
              fontSize: "1.125rem",
              color: "white",
              lineHeight: "1.3",
            }}
          >
            That&apos;s enough to buy
            <br />
            <span style={{ color: "#ef4444" }}>420 bags</span> of rice.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to top right, rgba(255,179,71,0.1), #0d0b0a)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "#ffb347",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
          }}
        >
          Your Biggest Weakness
        </span>
      </div>
      <div
        style={{
          width: "128px",
          height: "128px",
          margin: "0 auto 32px",
          background: "rgba(255,179,71,0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "4px solid rgba(255,179,71,0.3)",
          boxShadow: "0 0 20px rgba(255,179,71,0.15)",
          position: "relative",
        }}
      >
        <span
          style={{ fontSize: "3.5rem", position: "absolute", zIndex: 10 }}
        >
          &#x1F357;
        </span>
        <svg
          viewBox="0 0 36 36"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)",
          }}
        >
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,179,71,0.2)"
            strokeWidth="4"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#ffb347"
            strokeWidth="4"
            strokeDasharray="32, 100"
          />
        </svg>
      </div>
      <h3
        className="font-display"
        style={{ fontSize: "2.25rem", color: "white", marginBottom: "16px" }}
      >
        Jollof &amp; Chops
      </h3>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#968a84",
          fontWeight: 500,
          marginBottom: "8px",
        }}
      >
        took a massive
      </p>
      <div
        className="font-mono"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#ffb347",
          marginBottom: "32px",
        }}
      >
        32%
      </div>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#968a84",
          fontStyle: "italic",
        }}
      >
        of your entire budget.
      </p>
      <div
        style={{
          marginTop: "auto",
          marginBottom: "32px",
          margin: "0 auto",
          width: "80%",
          height: "8px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#ffb347",
            width: "32%",
            borderRadius: "9999px",
            boxShadow: "0 0 10px #ffb347",
          }}
        />
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to bottom, rgba(168,85,247,0.1), #0d0b0a)",
        textAlign: "left",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "32px",
          opacity: 0.2,
          color: "#a855f7",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "#a855f7",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
            background: "rgba(168,85,247,0.1)",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          Family First
        </span>
      </div>
      <h3
        className="font-display"
        style={{
          fontSize: "2.25rem",
          color: "white",
          marginBottom: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        You sent
        <br />
        <span
          className="font-mono"
          style={{
            fontSize: "3rem",
            color: "#a855f7",
            marginTop: "8px",
            display: "block",
          }}
        >
          &#x20A6;1.8M
        </span>
      </h3>
      <p
        style={{
          fontSize: "1.5rem",
          color: "rgba(255,255,255,0.8)",
          fontWeight: 500,
          marginBottom: "16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        to family and friends.
      </p>
      <div
        style={{
          background: "rgba(168,85,247,0.1)",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: "16px",
          padding: "20px",
          backdropFilter: "blur(8px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: "0.875rem",
            color: "#a855f7",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Black Tax Check
        </p>
        <p style={{ color: "white", fontSize: "1.125rem" }}>
          That&apos;s{" "}
          <span style={{ fontWeight: "bold", color: "#a855f7" }}>43%</span> of
          your total spending. Minister of enjoyment and welfare.
        </p>
      </div>
      <div style={{ marginBottom: "32px" }} />
    </div>
  );
}

function Slide4() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to top right, rgba(59,130,246,0.1), #0d0b0a)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          width: "100%",
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "#3b82f6",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
          }}
        >
          The Master Plan
        </span>
      </div>
      <div
        style={{
          width: "96px",
          height: "96px",
          margin: "0 auto 32px",
          background: "rgba(59,130,246,0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3b82f6",
          boxShadow: "0 0 20px rgba(59,130,246,0.15)",
        }}
        className="animate-pulse-slow"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform:
              "rotate(-45deg) translateY(-4px) translateX(4px)",
          }}
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5-1.5L14.5 6 6.3 4.2 4.5 6l6.5 4L5 16l-2.5-1.5L1 16l4 4 1.5 1.5L8 19l6-6 4 6.5 1.8-1.8Z" />
        </svg>
      </div>
      <h3
        className="font-display"
        style={{ fontSize: "1.875rem", color: "white", marginBottom: "16px" }}
      >
        Building Your Escape Fund
      </h3>
      <div
        className="font-mono"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#3b82f6",
          marginBottom: "16px",
          filter: "drop-shadow(0 0 15px rgba(59,130,246,0.4))",
        }}
      >
        &#x20A6;2.3M
      </div>
      <p
        style={{
          fontSize: "1.125rem",
          color: "#968a84",
          marginBottom: "40px",
        }}
      >
        saved toward your Japa goal.
      </p>
      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "12px",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "0.875rem",
              color: "#3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Flight Readiness
          </span>
          <span
            className="font-mono"
            style={{ fontSize: "0.875rem", color: "white" }}
          >
            65%
          </span>
        </div>
        <div
          style={{
            height: "8px",
            width: "100%",
            background: "#0d0b0a",
            borderRadius: "9999px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#3b82f6",
              borderRadius: "9999px",
              width: "65%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.2)",
                width: "50%",
                transform: "skewX(-12deg)",
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }} />
    </div>
  );
}

function Slide5() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to bottom, rgba(52,211,153,0.1), #0d0b0a)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          background:
            "radial-gradient(circle at center, rgba(52,211,153,0.2) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "#34d399",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
          }}
        >
          Your Best Money Moment
        </span>
      </div>
      <div
        style={{
          width: "112px",
          height: "112px",
          margin: "0 auto 24px",
          background: "rgba(52,211,153,0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#34d399",
          border: "1px solid rgba(52,211,153,0.3)",
          boxShadow: "0 0 20px rgba(52,211,153,0.15)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>
      <h3
        className="font-display"
        style={{
          fontSize: "2.25rem",
          color: "white",
          marginBottom: "16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        August was elite.
      </h3>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#968a84",
          marginBottom: "8px",
          position: "relative",
          zIndex: 10,
        }}
      >
        You saved
      </p>
      <div
        className="font-mono"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#34d399",
          marginBottom: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        &#x20A6;500K
      </div>
      <div
        style={{
          background: "rgba(13,11,10,0.5)",
          border: "1px solid rgba(52,211,153,0.2)",
          borderRadius: "12px",
          padding: "12px 24px",
          display: "inline-block",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Highest savings month
        </p>
      </div>
      <div style={{ marginBottom: "32px" }} />
    </div>
  );
}

function Slide6() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(to top right, rgba(251,191,36,0.1), #0d0b0a)",
        textAlign: "left",
      }}
    >
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "#fbbf24",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
            background: "rgba(251,191,36,0.1)",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(251,191,36,0.2)",
          }}
        >
          The Oopsie
        </span>
      </div>
      <h3
        className="font-display"
        style={{
          fontSize: "2.25rem",
          color: "white",
          marginBottom: "24px",
          lineHeight: "1.2",
        }}
      >
        Your Most Expensive
        <br />
        Mistake
      </h3>
      <div
        style={{
          background: "rgba(251,191,36,0.05)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: "16px",
          padding: "24px",
          backdropFilter: "blur(8px)",
          marginBottom: "24px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-24px",
            right: "-16px",
            fontSize: "3rem",
            transform: "rotate(12deg)",
          }}
        >
          &#x1F57A;
        </div>
        <p
          style={{
            fontSize: "1.125rem",
            color: "white",
            marginBottom: "8px",
          }}
        >
          That Owambe in December cost you
        </p>
        <div
          className="font-mono"
          style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#fbbf24" }}
        >
          &#x20A6;180K
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          padding: "16px",
          background: "rgba(13,11,10,0.6)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#ffb347",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "1px solid #e67e22",
          }}
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            style={{ width: "24px", height: "24px", marginTop: "4px" }}
          >
            <path d="M10 18 h20 v8 h-20 z" fill="#0d0b0a" />
            <path
              d="M15 32 Q 20 36, 25 32"
              stroke="#0d0b0a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ paddingTop: "4px" }}>
          <p
            className="font-mono"
            style={{
              fontSize: "0.625rem",
              color: "#ffb347",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Mo says:
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#968a84",
              fontStyle: "italic",
            }}
          >
            &ldquo;Aso-ebi was 50k, spraying was 100k, transport 30k. Hope the
            party rice was worth your financial peace.&rdquo;
          </p>
        </div>
      </div>
      <div style={{ marginBottom: "32px" }} />
    </div>
  );
}

function Slide7() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px",
        background:
          "linear-gradient(to bottom, rgba(255,179,71,0.1), #0d0b0a)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: "auto",
          marginTop: "64px",
          width: "100%",
        }}
      >
        <span
          className="font-mono"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
          }}
        >
          The Bottom Line
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: "192px",
          height: "192px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#ffb347"
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset="203"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,179,71,0.5))",
            }}
          />
        </svg>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span className="font-display" style={{ fontSize: "3rem", color: "white" }}>
            28
            <span style={{ fontSize: "1.875rem", color: "#ffb347" }}>%</span>
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "0.625rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginTop: "4px",
            }}
          >
            Saved
          </span>
        </div>
      </div>
      <h3
        className="font-display"
        style={{ fontSize: "1.5rem", color: "white", marginBottom: "24px" }}
      >
        You saved 28% of your income.
      </h3>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          background: "rgba(255,179,71,0.1)",
          border: "1px solid rgba(255,179,71,0.2)",
          borderRadius: "9999px",
          padding: "12px 24px",
          color: "#ffb347",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span
          className="font-mono"
          style={{
            fontSize: "0.875rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: "bold",
          }}
        >
          Top 15% of WealthMotley Users
        </span>
      </div>
      <div style={{ marginBottom: "32px" }} />
    </div>
  );
}

function Slide8() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px",
        background: "#0d0b0a",
        textAlign: "center",
      }}
    >
      {/* Summary card */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(to bottom right, #1a1512, #0d0b0a)",
          borderRadius: "24px",
          padding: "24px",
          border: "1px solid rgba(255,179,71,0.2)",
          boxShadow: "0 0 20px rgba(255,179,71,0.15)",
          marginTop: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            width: "128px",
            height: "128px",
            background: "rgba(255,179,71,0.2)",
            filter: "blur(32px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <span
            className="font-display"
            style={{ fontSize: "1.25rem", color: "#ffb347" }}
          >
            WealthMotley
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "0.625rem",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            2025 Wrapped
          </span>
        </div>
        <div style={{ textAlign: "left", marginBottom: "24px" }}>
          <p
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            Total Spent
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: "1.5rem",
              color: "white",
              fontWeight: "bold",
            }}
          >
            &#x20A6;4.2M
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p
              className="font-mono"
              style={{
                fontSize: "0.625rem",
                color: "#968a84",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "4px",
              }}
            >
              Top Expense
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "white",
                fontWeight: 500,
              }}
            >
              Jollof &amp; Chops
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              className="font-mono"
              style={{
                fontSize: "0.625rem",
                color: "#968a84",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "4px",
              }}
            >
              Savings Rate
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#34d399",
                fontWeight: "bold",
              }}
            >
              28%
            </p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(13,11,10,0.5)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)",
            marginTop: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              fontStyle: "italic",
            }}
          >
            &ldquo;Working hard, spending harder.&rdquo; - Mo
          </p>
        </div>
      </div>

      {/* Share section */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          className="font-display"
          style={{ fontSize: "1.5rem", color: "white", marginBottom: "8px" }}
        >
          Share Your Story
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#968a84",
            marginBottom: "24px",
          }}
        >
          Flex your financial discipline (or lack thereof).
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {/* Twitter */}
          <button
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(29,161,242,0.1)",
              color: "#1DA1F2",
              border: "1px solid rgba(29,161,242,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1DA1F2";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(29,161,242,0.1)";
              e.currentTarget.style.color = "#1DA1F2";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
          {/* WhatsApp */}
          <button
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(37,211,102,0.1)",
              color: "#25D366",
              border: "1px solid rgba(37,211,102,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#25D366";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(37,211,102,0.1)";
              e.currentTarget.style.color = "#25D366";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.031 22.083c-1.858 0-3.659-.533-5.227-1.503l-5.808 1.523 1.554-5.659c-1.066-1.611-1.62-3.486-1.62-5.424 0-5.498 4.479-9.972 9.982-9.972 5.49 0 9.96 4.475 9.96 9.971s-4.475 9.974-9.966 9.974h-.005z" />
            </svg>
          </button>
          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            {copied ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Story Wrapped Component ──────────────────────────────────────────
const TOTAL_SLIDES = 9;

function StoryWrapped() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fillRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getSlideClass = (index: number) => {
    if (index === currentSlide) return "active";
    if (index < currentSlide) return "prev";
    return "next";
  };

  useEffect(() => {
    fillRefs.current.forEach((fill, i) => {
      if (!fill) return;
      if (i < currentSlide) {
        fill.style.transition = "none";
        fill.style.width = "100%";
      } else if (i === currentSlide) {
        fill.style.transition = "none";
        fill.style.width = "0%";
        setTimeout(() => {
          if (fill) {
            fill.style.transition = "width 5s linear";
            fill.style.width = "100%";
          }
        }, 50);
      } else {
        fill.style.transition = "none";
        fill.style.width = "0%";
      }
    });
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < TOTAL_SLIDES - 1) setCurrentSlide((s) => s + 1);
  };
  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  const slides = [
    <Slide0 key={0} />,
    <Slide1 key={1} />,
    <Slide2 key={2} />,
    <Slide3 key={3} />,
    <Slide4 key={4} />,
    <Slide5 key={5} />,
    <Slide6 key={6} />,
    <Slide7 key={7} />,
    <Slide8 key={8} />,
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <div
        className="glass-card"
        style={{
          width: "100%",
          height: "700px",
          borderRadius: "32px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(255,179,71,0.05)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Progress bars */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            right: "16px",
            display: "flex",
            gap: "6px",
            zIndex: 50,
          }}
        >
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <div
              key={i}
              className={`story-progress-bar${i < currentSlide ? " completed" : ""}`}
              style={{ flex: 1 }}
            >
              <div
                className="story-progress-fill"
                ref={(el) => {
                  fillRefs.current[i] = el;
                }}
                style={{ width: i < currentSlide ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        {/* Click zones */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "33%",
            height: "100%",
            zIndex: 40,
            cursor: "pointer",
          }}
          onClick={prevSlide}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "67%",
            height: "100%",
            zIndex: 40,
            cursor: "pointer",
          }}
          onClick={nextSlide}
        />

        {/* Slides container */}
        <div
          style={{
            position: "relative",
            flexGrow: 1,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`story-slide ${getSlideClass(i)}`}
              style={{ position: "absolute", inset: 0 }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <p
        className="font-mono"
        style={{
          textAlign: "center",
          color: "#968a84",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginTop: "24px",
        }}
      >
        Use arrows or click edges to navigate
      </p>
    </div>
  );
}

// ── Quiz Section ─────────────────────────────────────────────────────
function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = () => {
    if (answered) return;
    setAnswered(true);
    setTimeout(() => {
      if (currentQ + 1 < quizData.length) {
        setCurrentQ((q) => q + 1);
        setAnswered(false);
      } else {
        setShowResults(true);
      }
    }, 300);
  };

  const resetQuiz = () => {
    setShowResults(false);
    setCurrentQ(0);
    setAnswered(false);
  };

  const progress = ((currentQ + 1) / quizData.length) * 100;
  const letters = ["A", "B", "C", "D"];

  if (showResults) {
    return (
      <div
        className="glass-card"
        style={{
          width: "100%",
          borderRadius: "32px",
          padding: "32px",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(168,85,247,0.1)",
          border: "1px solid rgba(168,85,247,0.3)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "256px",
            height: "256px",
            background: "rgba(168,85,247,0.1)",
            filter: "blur(60px)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: "0.75rem",
            color: "#a855f7",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "16px",
            background: "rgba(168,85,247,0.1)",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(168,85,247,0.2)",
            display: "inline-block",
          }}
        >
          Your Money DNA
        </span>
        <h2
          className="font-display"
          style={{
            fontSize: "2.25rem",
            color: "white",
            marginBottom: "24px",
          }}
        >
          The Japa Strategist
        </h2>
        <div
          style={{
            width: "128px",
            height: "128px",
            background: "rgba(168,85,247,0.2)",
            borderRadius: "50%",
            border: "4px solid rgba(168,85,247,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            boxShadow: "0 0 20px rgba(168,85,247,0.15)",
            position: "relative",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform:
                "rotate(-45deg) translateY(-8px) translateX(8px)",
            }}
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5-1.5L14.5 6 6.3 4.2 4.5 6l6.5 4L5 16l-2.5-1.5L1 16l4 4 1.5 1.5L8 19l6-6 4 6.5 1.8-1.8Z" />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              right: "-8px",
              background: "#0d0b0a",
              borderRadius: "50%",
              padding: "4px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>&#x2708;&#xFE0F;</span>
          </div>
        </div>
        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.8)",
            lineHeight: "1.6",
            marginBottom: "32px",
            padding: "0 16px",
          }}
        >
          You&apos;re future-focused, sacrificing present comfort for
          tomorrow&apos;s freedom. Every naira has a purpose: get out.
        </p>
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "32px",
            textAlign: "left",
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.75rem",
              color: "#968a84",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
              marginLeft: "4px",
            }}
          >
            Key Traits
          </p>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              "Conversions expert (always calculating parallel market rates)",
              "Immune to FOMO from local parties",
              "Best friend is a domiciliary account",
            ].map((trait, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                <div
                  style={{
                    marginTop: "2px",
                    color: "#a855f7",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {trait}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", gap: "16px", width: "100%" }}>
          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: "9999px",
              background: "#a855f7",
              color: "white",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(168,85,247,0.15)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#9333ea")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#a855f7")
            }
          >
            Share Result
          </button>
          <button
            onClick={resetQuiz}
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const data = quizData[currentQ]!;

  return (
    <div
      className="glass-card"
      style={{
        width: "100%",
        borderRadius: "32px",
        padding: "32px",
        position: "relative",
        boxShadow: "0 25px 50px -12px rgba(255,179,71,0.05)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "0.875rem",
            color: "#968a84",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            background: "rgba(255,255,255,0.05)",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Question <span style={{ color: "#ffb347" }}>{currentQ + 1}</span> of{" "}
          {quizData.length}
        </span>
        <div
          style={{
            width: "45%",
            height: "6px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "9999px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#ffb347",
              borderRadius: "9999px",
              transition: "width 0.3s",
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          className="font-display"
          style={{
            fontSize: "1.75rem",
            color: "white",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          {data.q}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "auto",
          }}
        >
          {data.opts.map((opt, idx) => (
            <button
              key={`${currentQ}-${idx}`}
              onClick={handleAnswer}
              disabled={answered}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                cursor: answered ? "default" : "pointer",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                transition: "all 0.2s",
                opacity: answered ? 0.7 : 1,
                color: "white",
              }}
              onMouseEnter={(e) => {
                if (!answered) {
                  e.currentTarget.style.background = "rgba(255,179,71,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,179,71,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "0.75rem",
                  color: "#968a84",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              >
                {letters[idx]}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.125rem",
                }}
              >
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Money Story Page ────────────────────────────────────────────
export default function MoneyStoryPage() {
  const [activeTab, setActiveTab] = useState<"wrapped" | "dna">("wrapped");

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "24px",
          marginBottom: "48px",
          width: "100%",
          maxWidth: "672px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{ width: "64px", height: "64px" }}
            className="animate-float"
          >
            <PuffLogo />
          </div>
          <div style={{ textAlign: "left" }}>
            <h1
              className="font-display"
              style={{
                fontSize: "3.5rem",
                color: "#ffffff",
                lineHeight: "1.1",
              }}
            >
              Money Story
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                color: "#968a84",
                fontWeight: 500,
              }}
            >
              Your 2025 Financial Journey
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            padding: "4px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "9999px",
            position: "relative",
            zIndex: 20,
          }}
        >
          <button
            onClick={() => setActiveTab("wrapped")}
            className="font-mono"
            style={{
              position: "relative",
              padding: "12px 32px",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.3s",
              border: "none",
              cursor: "pointer",
              ...(activeTab === "wrapped"
                ? {
                    color: "#0d0b0a",
                    background: "#ffb347",
                    boxShadow: "0 0 15px rgba(255,179,71,0.3)",
                    fontWeight: "bold",
                  }
                : {
                    color: "#968a84",
                    background: "transparent",
                    fontWeight: 500,
                  }),
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "wrapped")
                e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "wrapped")
                e.currentTarget.style.color = "#968a84";
            }}
          >
            Money Wrapped
          </button>
          <button
            onClick={() => setActiveTab("dna")}
            className="font-mono"
            style={{
              position: "relative",
              padding: "12px 32px",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.3s",
              border: "none",
              cursor: "pointer",
              ...(activeTab === "dna"
                ? {
                    color: "#0d0b0a",
                    background: "#ffb347",
                    boxShadow: "0 0 15px rgba(255,179,71,0.3)",
                    fontWeight: "bold",
                  }
                : {
                    color: "#968a84",
                    background: "transparent",
                    fontWeight: 500,
                  }),
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "dna") e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "dna")
                e.currentTarget.style.color = "#968a84";
            }}
          >
            Money DNA
          </button>
        </div>
      </header>

      {/* Content area */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          position: "relative",
          minHeight: "750px",
        }}
      >
        {activeTab === "wrapped" ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
          >
            <StoryWrapped />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
          >
            <QuizSection />
          </div>
        )}
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .story-slide {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .story-slide.active {
          opacity: 1;
          transform: translateX(0) scale(1);
          z-index: 10;
          pointer-events: auto;
        }
        .story-slide.prev {
          opacity: 0;
          transform: translateX(-50%) scale(0.95);
          z-index: 5;
          pointer-events: none;
        }
        .story-slide.next {
          opacity: 0;
          transform: translateX(50%) scale(0.95);
          z-index: 5;
          pointer-events: none;
        }

        .story-progress-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          flex: 1;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .story-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0%;
          background: #ffb347;
        }
        .story-progress-bar.completed .story-progress-fill {
          width: 100%;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1.2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .font-display {
          font-family: "DynaPuff", cursive;
        }
        .font-mono {
          font-family: "JetBrains Mono", monospace;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>

      {/* Font imports */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
