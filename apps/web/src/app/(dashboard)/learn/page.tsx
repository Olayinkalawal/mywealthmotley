"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────
interface Lesson {
  status: "done" | "active" | "locked";
  label: string;
  time: string;
  color?: string;
  desc?: string;
  activeBg?: string;
  btnBg?: string;
  btnHover?: string;
  btnTextColor?: string;
}

interface PathCardProps {
  pathNum: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  pathNumStyle: React.CSSProperties;
  cardStyle?: React.CSSProperties;
  cardGlow?: React.CSSProperties;
  title: string;
  subtitle: string;
  progress: number;
  progressColor: string;
  progressGlow: string;
  progressLabelColor: string;
  lessons: Lesson[];
}

// ── Continue Button ──────────────────────────────────────────────────
function ContinueButton({
  btnBg,
  btnHover,
  btnTextColor,
}: {
  btnBg: string;
  btnHover: string;
  btnTextColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className="ml-9 mt-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-block w-max"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: hovered ? btnHover : btnBg,
        color: btnTextColor,
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Continue
    </button>
  );
}

// ── Path Card ────────────────────────────────────────────────────────
function PathCard({
  pathNum,
  icon,
  iconColor,
  iconBg,
  iconBorder,
  pathNumStyle,
  cardStyle,
  cardGlow,
  title,
  subtitle,
  progress,
  progressColor,
  progressGlow,
  progressLabelColor,
  lessons,
}: PathCardProps) {
  return (
    <div
      className="glass-card rounded-[24px] p-6 flex flex-col h-full group relative overflow-hidden"
      style={cardStyle || {}}
    >
      {cardGlow && (
        <div
          className="absolute pointer-events-none"
          style={{ position: "absolute", ...cardGlow }}
        />
      )}

      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: iconBg,
              border: `1px solid ${iconBorder}`,
              color: iconColor,
            }}
          >
            {icon}
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              ...pathNumStyle,
            }}
          >
            {pathNum}
          </span>
        </div>
        <div>
          <h3
            className="text-2xl text-white mb-1"
            style={{ fontFamily: "'DynaPuff', cursive" }}
          >
            {title}
          </h3>
          <p className="text-sm" style={{ color: "#968a84" }}>
            {subtitle}
          </p>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: progressLabelColor,
              }}
            >
              Progress
            </span>
            <span
              className="text-xs text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {progress}%
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: progressColor,
                boxShadow: `0 0 10px ${progressGlow}`,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 flex-grow mt-4 pt-4 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {lessons.map((lesson, idx) => {
          if (lesson.status === "done") {
            return (
              <div key={idx} className="flex items-center gap-3 px-2 py-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${lesson.color}33`,
                    color: lesson.color,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span
                  className="text-sm font-medium truncate flex-grow"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {lesson.label}
                </span>
                <span
                  className="text-xs flex-shrink-0"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#968a84",
                  }}
                >
                  {lesson.time}
                </span>
              </div>
            );
          }
          if (lesson.status === "active") {
            return (
              <div
                key={idx}
                className="lesson-card-expanded rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background:
                    lesson.activeBg ||
                    "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: lesson.color }}
                />
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 animate-spin-slow"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: lesson.color,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 4.43-8.12" />
                    </svg>
                  </div>
                  <span className="text-sm text-white font-bold truncate flex-grow">
                    {lesson.label}
                  </span>
                  <span
                    className="text-xs flex-shrink-0"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: lesson.color,
                    }}
                  >
                    {lesson.time}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed pl-9"
                  style={{ color: "#968a84" }}
                >
                  {lesson.desc}
                </p>
                {lesson.btnBg && lesson.btnHover && lesson.btnTextColor && (
                  <ContinueButton
                    btnBg={lesson.btnBg}
                    btnHover={lesson.btnHover}
                    btnTextColor={lesson.btnTextColor}
                  />
                )}
              </div>
            );
          }
          if (lesson.status === "locked") {
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-2 py-1"
                style={{ opacity: 0.4 }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#968a84",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <span
                  className="text-sm font-medium truncate flex-grow"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {lesson.label}
                </span>
                <span
                  className="text-xs flex-shrink-0"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#968a84",
                  }}
                >
                  {lesson.time}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// ── Main Learn Page ──────────────────────────────────────────────────
export default function LearnPage() {
  const [tipIndex, setTipIndex] = useState(14);
  const [roastLevel, setRoastLevel] = useState("Nuclear");

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header className="flex items-end justify-between gap-6 relative">
        <div>
          <h1
            className="leading-tight mb-2"
            style={{
              fontFamily: "'DynaPuff', cursive",
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              color: "#ffffff",
            }}
          >
            Learn
          </h1>
          <p
            className="text-xl md:text-2xl font-medium"
            style={{ color: "#968a84" }}
          >
            Smart Money, Zero BS
          </p>
        </div>
        <div
          className="relative flex-shrink-0 animate-pulse-slow"
          style={{ width: "8rem", height: "8rem" }}
        >
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-xl"
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
            <circle cx="100" cy="90" r="15" fill="#ffb347" />
            <path
              d="M95 90 L 95 80 Q 95 75, 100 75 Q 105 75, 105 80 L 105 90"
              stroke="#0d0b0a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </header>

      {/* Top Cards Row */}
      <section
        className="grid grid-cols-1 gap-6"
        style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        {/* Today's Tip */}
        <div
          className="glass-card rounded-[32px] p-8 flex flex-col relative overflow-hidden group"
          style={{ gridColumn: "span 7", position: "relative" }}
        >
          <div
            className="absolute pointer-events-none transition-colors duration-500"
            style={{
              left: "-5rem",
              top: "-5rem",
              width: "16rem",
              height: "16rem",
              background: "rgba(255,179,71,0.10)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "rgba(255,179,71,0.2)",
                border: "1px solid rgba(255,179,71,0.3)",
              }}
            >
              <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 mt-2">
                <rect x="5" y="5" width="30" height="30" rx="8" fill="#ffb347" />
                <path d="M10 18 h20 v8 h-20 z" fill="#0d0b0a" />
                <path
                  d="M15 32 Q 20 36, 25 32"
                  stroke="#0d0b0a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3
                className="text-xl"
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  color: "#ffb347",
                }}
              >
                Today&apos;s Tip from Mo
              </h3>
              <p className="text-sm" style={{ color: "#968a84" }}>
                No sugarcoating, just facts.
              </p>
            </div>
          </div>
          <div
            className="flex-grow relative z-10 pl-6"
            style={{ borderLeft: "2px solid rgba(255,179,71,0.3)" }}
          >
            <p className="text-2xl md:text-3xl font-medium leading-relaxed text-white">
              &ldquo;Your money should work harder than you do. If your savings
              account is giving you 2% while inflation is 25%, you&apos;re not
              saving&mdash;you&apos;re{" "}
              <span style={{ color: "#ffb347" }}>donating</span>.&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between mt-10 relative z-10">
            <span
              className="text-sm uppercase tracking-wider"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#968a84",
              }}
            >
              Tip {tipIndex} of 365
            </span>
            <button
              className="px-6 py-3 rounded-full text-white text-sm uppercase tracking-wider flex items-center gap-2 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
              }}
              onClick={() => setTipIndex((prev) => (prev % 365) + 1)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,179,71,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              Next Tip
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "transform 0.2s" }}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sholz's Honest Take */}
        <div
          className="glass-card rounded-[32px] p-8 flex flex-col relative overflow-hidden"
          style={{
            gridColumn: "span 5",
            borderColor: "rgba(239,68,68,0.3)",
            boxShadow: "0 0 30px rgba(239,68,68,0.05)",
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              right: "-5rem",
              bottom: "-5rem",
              width: "16rem",
              height: "16rem",
              background: "rgba(239,68,68,0.10)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">&#x1F525;</span>
              <h3
                className="text-2xl"
                style={{
                  fontFamily: "'DynaPuff', cursive",
                  color: "#ef4444",
                }}
              >
                Mo&apos;s Honest Take
              </h3>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#968a84",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#968a84";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
          <div
            className="rounded-2xl p-6 mb-6 relative z-10"
            style={{
              background: "rgba(13,11,10,0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p className="text-white text-lg leading-relaxed italic">
              &ldquo;You spent &#x20A6;87K on food delivery this month. Do you
              even know where your kitchen is? Your ancestors didn&apos;t survive
              colonialism for you to be this lazy.&rdquo;
            </p>
          </div>
          <div className="mb-auto relative z-10">
            <p
              className="text-xs uppercase tracking-wider mb-3 ml-1"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#968a84",
              }}
            >
              Roast Level
            </p>
            <div
              className="flex p-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {["Mild", "Spicy", "Nuclear"].map((level) => (
                <button
                  key={level}
                  className="flex-1 py-2 rounded-full text-xs font-bold transition-colors"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background:
                      roastLevel === level
                        ? level === "Nuclear"
                          ? "#ef4444"
                          : "rgba(255,255,255,0.1)"
                        : "transparent",
                    color:
                      roastLevel === level
                        ? level === "Nuclear"
                          ? "#0d0b0a"
                          : "#ffffff"
                        : "#968a84",
                    boxShadow:
                      roastLevel === level && level === "Nuclear"
                        ? "0 0 15px rgba(239,68,68,0.4)"
                        : "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setRoastLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button
            className="w-full mt-8 py-4 rounded-full text-lg tracking-wide transition-colors relative z-10 flex items-center justify-center gap-2"
            style={{
              fontFamily: "'DynaPuff', cursive",
              background: "#ffb347",
              color: "#0d0b0a",
              boxShadow: "0 0 20px rgba(255,179,71,0.2)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#e67e22")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#ffb347")
            }
          >
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
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Roast My Spending
          </button>
        </div>
      </section>

      {/* Choose Your Path */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <h2
            className="text-3xl md:text-4xl"
            style={{ fontFamily: "'DynaPuff', cursive", color: "#ffffff" }}
          >
            Choose Your Path
          </h2>
          <div
            className="h-px flex-grow ml-4 hidden sm:block"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Path 1: Money Basics */}
          <PathCard
            pathNum="Path 1"
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-2h2c1 0 1.5-.5 2-1v-4c0-2-1.5-4-5-4z" />
                <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                <path d="M16 11h.01" />
              </svg>
            }
            iconColor="#34d399"
            iconBg="rgba(52,211,153,0.1)"
            iconBorder="rgba(52,211,153,0.2)"
            pathNumStyle={{
              color: "#968a84",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title="Money Basics"
            subtitle="Master the fundamentals"
            progress={50}
            progressColor="#34d399"
            progressGlow="rgba(52,211,153,0.5)"
            progressLabelColor="#34d399"
            lessons={[
              { status: "done", label: "Budgeting 101", time: "5m", color: "#34d399" },
              { status: "done", label: "Emergency Funds", time: "10m", color: "#34d399" },
              {
                status: "active",
                label: "Credit & Debt",
                time: "15m",
                color: "#34d399",
                desc: "Learn the difference between good debt and soul-crushing bad debt.",
                btnBg: "#34d399",
                btnHover: "#6ee7b7",
                btnTextColor: "#0d0b0a",
              },
              { status: "locked", label: "Saving Strategies", time: "8m" },
            ]}
          />

          {/* Path 2: Investing */}
          <PathCard
            pathNum="Path 2"
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            }
            iconColor="#ffb347"
            iconBg="rgba(255,179,71,0.1)"
            iconBorder="rgba(255,179,71,0.2)"
            pathNumStyle={{
              color: "#ffb347",
              background: "rgba(255,179,71,0.1)",
              border: "1px solid rgba(255,179,71,0.2)",
            }}
            cardStyle={{
              borderColor: "rgba(255,179,71,0.3)",
              boxShadow: "0 0 20px rgba(255,179,71,0.05)",
            }}
            cardGlow={{
              right: 0,
              top: 0,
              width: "8rem",
              height: "8rem",
              background: "rgba(255,179,71,0.05)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
            title="Investing"
            subtitle="Grow your wealth"
            progress={50}
            progressColor="#ffb347"
            progressGlow="rgba(255,179,71,0.5)"
            progressLabelColor="#ffb347"
            lessons={[
              { status: "done", label: "What is Investing?", time: "5m", color: "#ffb347" },
              { status: "done", label: "Risk vs Return", time: "8m", color: "#ffb347" },
              {
                status: "active",
                label: "ETFs & Index Funds",
                time: "12m",
                color: "#ffb347",
                activeBg: "rgba(255,179,71,0.05)",
                desc: "The smart way to own the whole market without picking individual stocks.",
                btnBg: "#ffb347",
                btnHover: "#e67e22",
                btnTextColor: "#0d0b0a",
              },
              { status: "locked", label: "Compound Interest", time: "10m" },
            ]}
          />

          {/* Path 3: Diaspora */}
          <PathCard
            pathNum="Path 3"
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
            iconColor="#3b82f6"
            iconBg="rgba(59,130,246,0.1)"
            iconBorder="rgba(59,130,246,0.2)"
            pathNumStyle={{
              color: "#968a84",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title="Diaspora"
            subtitle="Global money strategies"
            progress={25}
            progressColor="#3b82f6"
            progressGlow="rgba(59,130,246,0.5)"
            progressLabelColor="#3b82f6"
            lessons={[
              { status: "done", label: "Naira Hedging", time: "7m", color: "#3b82f6" },
              {
                status: "active",
                label: "USD Accounts",
                time: "15m",
                color: "#3b82f6",
                desc: "How to set up and manage domiciliary accounts effectively.",
                btnBg: "#3b82f6",
                btnHover: "#2563eb",
                btnTextColor: "#ffffff",
              },
              { status: "locked", label: "Intl Transfers", time: "10m" },
              { status: "locked", label: "Tax Implications", time: "12m" },
            ]}
          />

          {/* Path 4: Japa */}
          <PathCard
            pathNum="Path 4"
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
            iconColor="#a855f7"
            iconBg="rgba(168,85,247,0.1)"
            iconBorder="rgba(168,85,247,0.2)"
            pathNumStyle={{
              color: "#968a84",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title="Japa"
            subtitle="Relocation readiness"
            progress={50}
            progressColor="#a855f7"
            progressGlow="rgba(168,85,247,0.5)"
            progressLabelColor="#a855f7"
            lessons={[
              { status: "done", label: "Proof of Funds", time: "8m", color: "#a855f7" },
              { status: "done", label: "Cost of Living", time: "15m", color: "#a855f7" },
              {
                status: "active",
                label: "Remittance",
                time: "10m",
                color: "#a855f7",
                desc: "Best ways to send money back home without losing to wild exchange rates.",
                btnBg: "#a855f7",
                btnHover: "#9333ea",
                btnTextColor: "#ffffff",
              },
              { status: "locked", label: "Building Credit", time: "20m" },
            ]}
          />
        </div>
      </section>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: border-color 0.3s ease,
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        .glass-card:hover:not(.no-hover-effect) {
          border-color: rgba(255, 255, 255, 0.15);
        }
        .lesson-card-expanded {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .font-display {
          font-family: "DynaPuff", cursive !important;
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
