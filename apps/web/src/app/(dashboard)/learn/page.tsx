"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  PlayCircle,
  Question,
  PencilSimple,
  CheckCircle,
  Lock,
  ArrowRight,
  Clock,
  Lightning,
} from "@phosphor-icons/react";

// ── Types ────────────────────────────────────────────────────────────
type ContentType = "article" | "video" | "quiz" | "exercise";

interface Lesson {
  id: string;
  label: string;
  time: string;
  contentType: ContentType;
  courseUrl: string;
  desc?: string;
}

interface LearningPath {
  id: string;
  pathNum: string;
  title: string;
  subtitle: string;
  color: string;
  colorLight: string;
  colorBg: string;
  colorBorder: string;
  icon: React.ReactNode;
  lessons: Lesson[];
}

interface PathCardProps {
  path: LearningPath;
  completedLessons: Set<string>;
  onToggleComplete: (lessonId: string) => void;
}

// ── Storage helpers ──────────────────────────────────────────────────
const STORAGE_KEY = "wm-learn-progress";

function getCompletedLessons(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveCompletedLessons(completed: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  } catch {
    /* ignore */
  }
}

// ── Content type icon ────────────────────────────────────────────────
function ContentTypeIcon({
  type,
  size = 14,
  color,
}: {
  type: ContentType;
  size?: number;
  color?: string;
}) {
  const c = color || "#968a84";
  switch (type) {
    case "article":
      return <BookOpen size={size} weight="bold" color={c} />;
    case "video":
      return <PlayCircle size={size} weight="bold" color={c} />;
    case "quiz":
      return <Question size={size} weight="bold" color={c} />;
    case "exercise":
      return <PencilSimple size={size} weight="bold" color={c} />;
  }
}

function contentTypeLabel(type: ContentType): string {
  switch (type) {
    case "article":
      return "Article";
    case "video":
      return "Video";
    case "quiz":
      return "Quiz";
    case "exercise":
      return "Exercise";
  }
}

// ── Course link button ───────────────────────────────────────────────
function CourseLinkButton({
  type,
  url,
  accentColor,
}: {
  type: ContentType;
  url: string;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  const label =
    type === "video"
      ? "Watch Video"
      : type === "quiz"
        ? "Take Quiz"
        : type === "exercise"
          ? "Start Exercise"
          : "Take Course";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 w-max no-underline"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        background: hovered ? accentColor : `${accentColor}22`,
        color: hovered ? "#0d0b0a" : accentColor,
        border: `1px solid ${accentColor}44`,
        cursor: "pointer",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ContentTypeIcon type={type} size={12} color={hovered ? "#0d0b0a" : accentColor} />
      {label}
      <ArrowRight size={12} weight="bold" />
    </a>
  );
}

// ── Path Card ────────────────────────────────────────────────────────
function PathCard({ path, completedLessons, onToggleComplete }: PathCardProps) {
  const totalLessons = path.lessons.length;
  const doneCount = path.lessons.filter((l) => completedLessons.has(l.id)).length;
  const progress = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

  // Find the first incomplete lesson (the "active" one)
  const activeLessonId = path.lessons.find((l) => !completedLessons.has(l.id))?.id;

  const isHighlighted = path.id === "investing";

  return (
    <div
      className="glass-card rounded-[24px] p-6 flex flex-col h-full group relative overflow-hidden"
      style={
        isHighlighted
          ? {
              borderColor: `${path.color}4d`,
              boxShadow: `0 0 20px ${path.color}0d`,
            }
          : {}
      }
    >
      {isHighlighted && (
        <div
          className="absolute pointer-events-none"
          style={{
            right: 0,
            top: 0,
            width: "8rem",
            height: "8rem",
            background: `${path.color}0d`,
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
      )}

      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: path.colorBg,
              border: `1px solid ${path.colorBorder}`,
              color: path.color,
            }}
          >
            {path.icon}
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: isHighlighted ? path.color : "#968a84",
              background: isHighlighted ? `${path.color}1a` : "rgba(255,255,255,0.05)",
              border: `1px solid ${isHighlighted ? `${path.color}33` : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {path.pathNum}
          </span>
        </div>
        <div>
          <h3
            className="text-2xl text-white mb-1"
            style={{ fontFamily: "'DynaPuff', cursive" }}
          >
            {path.title}
          </h3>
          <p className="text-sm" style={{ color: "#968a84" }}>
            {path.subtitle}
          </p>
        </div>

        {/* Progress section */}
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
            <span
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: path.color,
              }}
            >
              {doneCount} of {totalLessons} lessons
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
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: path.color,
                boxShadow: `0 0 10px ${path.color}80`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div
        className="flex flex-col gap-3 flex-grow mt-4 pt-4 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {path.lessons.map((lesson) => {
          const isDone = completedLessons.has(lesson.id);
          const isActive = lesson.id === activeLessonId && !isDone;
          const isLocked = !isDone && !isActive;

          if (isDone) {
            return (
              <div key={lesson.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-2 py-1">
                  <button
                    onClick={() => onToggleComplete(lesson.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
                    style={{
                      background: `${path.color}33`,
                      color: path.color,
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title="Mark as incomplete"
                  >
                    <CheckCircle size={14} weight="fill" />
                  </button>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {lesson.label}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ContentTypeIcon type={lesson.contentType} size={10} color="#968a84" />
                      <span
                        className="text-[10px]"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "#968a84",
                        }}
                      >
                        {contentTypeLabel(lesson.contentType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={10} color="#968a84" />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#968a84",
                      }}
                    >
                      {lesson.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          if (isActive) {
            return (
              <div
                key={lesson.id}
                className="lesson-card-expanded rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background:
                    isHighlighted
                      ? `${path.color}0d`
                      : "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: path.color }}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleComplete(lesson.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: `1.5px solid ${path.color}66`,
                      color: path.color,
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title="Mark as complete"
                  >
                    <Lightning size={10} weight="bold" />
                  </button>
                  <div className="flex flex-col flex-grow min-w-0">
                    <span className="text-sm text-white font-bold truncate">
                      {lesson.label}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ContentTypeIcon type={lesson.contentType} size={10} color={path.color} />
                      <span
                        className="text-[10px]"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: path.color,
                        }}
                      >
                        {contentTypeLabel(lesson.contentType)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Clock size={10} color={path.color} />
                    <span
                      className="text-xs flex-shrink-0"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: path.color,
                      }}
                    >
                      {lesson.time}
                    </span>
                  </div>
                </div>
                {lesson.desc && (
                  <p
                    className="text-xs leading-relaxed pl-9"
                    style={{ color: "#968a84" }}
                  >
                    {lesson.desc}
                  </p>
                )}
                <div className="pl-9">
                  <CourseLinkButton
                    type={lesson.contentType}
                    url={lesson.courseUrl}
                    accentColor={path.color}
                  />
                </div>
              </div>
            );
          }

          if (isLocked) {
            return (
              <div
                key={lesson.id}
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
                  <Lock size={10} weight="bold" />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {lesson.label}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ContentTypeIcon type={lesson.contentType} size={10} />
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#968a84",
                      }}
                    >
                      {contentTypeLabel(lesson.contentType)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock size={10} color="#968a84" />
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "#968a84",
                    }}
                  >
                    {lesson.time}
                  </span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// ── Learning Paths Data ──────────────────────────────────────────────
const LEARNING_PATHS: LearningPath[] = [
  {
    id: "money-basics",
    pathNum: "Path 1",
    title: "Money Basics",
    subtitle: "Master the fundamentals",
    color: "#34d399",
    colorLight: "#6ee7b7",
    colorBg: "rgba(52,211,153,0.1)",
    colorBorder: "rgba(52,211,153,0.2)",
    icon: (
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
    ),
    lessons: [
      {
        id: "mb-1",
        label: "What is budgeting?",
        time: "5 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/money-basics-1",
        desc: "Learn the basics of budgeting and why it matters for building wealth.",
      },
      {
        id: "mb-2",
        label: "The 50/30/20 rule explained",
        time: "8 min video",
        contentType: "video",
        courseUrl: "https://wealthmotley.com/courses/money-basics-2",
        desc: "A simple framework to split your income: needs, wants, and savings.",
      },
      {
        id: "mb-3",
        label: "Emergency funds: How much do you need?",
        time: "6 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/money-basics-3",
        desc: "Why 3-6 months of expenses is the magic number everyone talks about.",
      },
      {
        id: "mb-4",
        label: "Setting up your first budget",
        time: "10 min exercise",
        contentType: "exercise",
        courseUrl: "https://wealthmotley.com/courses/money-basics-4",
        desc: "Hands-on: Create a real budget using Mo's guided template.",
      },
      {
        id: "mb-5",
        label: "Money Basics Quiz",
        time: "5 min quiz",
        contentType: "quiz",
        courseUrl: "https://wealthmotley.com/courses/money-basics-quiz",
        desc: "Test your knowledge of budgeting fundamentals.",
      },
    ],
  },
  {
    id: "investing",
    pathNum: "Path 2",
    title: "Investing",
    subtitle: "Grow your wealth",
    color: "#ffb347",
    colorLight: "#e67e22",
    colorBg: "rgba(255,179,71,0.1)",
    colorBorder: "rgba(255,179,71,0.2)",
    icon: (
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
    ),
    lessons: [
      {
        id: "inv-1",
        label: "What are index funds? The broom analogy",
        time: "10 min video",
        contentType: "video",
        courseUrl: "https://wealthmotley.com/courses/investing-1",
        desc: "Why buying the whole market is like sweeping every room at once.",
      },
      {
        id: "inv-2",
        label: "Understanding risk: Low, medium, high",
        time: "7 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/investing-2",
        desc: "Learn how risk levels affect returns and what matches your comfort zone.",
      },
      {
        id: "inv-3",
        label: "ISA/TFSA: Your tax-free superpower",
        time: "8 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/investing-3",
        desc: "How to invest without giving the taxman a cut of your gains.",
      },
      {
        id: "inv-4",
        label: "How to read your investment dashboard",
        time: "12 min video",
        contentType: "video",
        courseUrl: "https://wealthmotley.com/courses/investing-4",
        desc: "Walk through every chart, number, and metric on your portfolio page.",
      },
      {
        id: "inv-5",
        label: "Building your first portfolio",
        time: "15 min exercise",
        contentType: "exercise",
        courseUrl: "https://wealthmotley.com/courses/investing-5",
        desc: "Hands-on: Allocate a mock portfolio across asset classes.",
      },
      {
        id: "inv-6",
        label: "Investing Quiz",
        time: "5 min quiz",
        contentType: "quiz",
        courseUrl: "https://wealthmotley.com/courses/investing-quiz",
        desc: "Test your investment knowledge before you put real money in.",
      },
    ],
  },
  {
    id: "diaspora",
    pathNum: "Path 3",
    title: "Diaspora Finance",
    subtitle: "Global money strategies",
    color: "#3b82f6",
    colorLight: "#2563eb",
    colorBg: "rgba(59,130,246,0.1)",
    colorBorder: "rgba(59,130,246,0.2)",
    icon: (
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
    ),
    lessons: [
      {
        id: "dia-1",
        label: "Managing money across two countries",
        time: "8 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/diaspora-1",
        desc: "Strategies for balancing finances between your home country and abroad.",
      },
      {
        id: "dia-2",
        label: "Multi-currency strategies",
        time: "10 min video",
        contentType: "video",
        courseUrl: "https://wealthmotley.com/courses/diaspora-2",
        desc: "How to hold and convert currencies without losing to bad exchange rates.",
      },
      {
        id: "dia-3",
        label: "Sending money home wisely",
        time: "6 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/diaspora-3",
        desc: "Compare remittance options so your family gets the most value.",
      },
      {
        id: "dia-4",
        label: "Diaspora Quiz",
        time: "5 min quiz",
        contentType: "quiz",
        courseUrl: "https://wealthmotley.com/courses/diaspora-quiz",
        desc: "Test what you know about managing money across borders.",
      },
    ],
  },
  {
    id: "japa",
    pathNum: "Path 4",
    title: "Japa Planning",
    subtitle: "Relocation readiness",
    color: "#a855f7",
    colorLight: "#9333ea",
    colorBg: "rgba(168,85,247,0.1)",
    colorBorder: "rgba(168,85,247,0.2)",
    icon: (
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
    ),
    lessons: [
      {
        id: "japa-1",
        label: "Financial prep for relocation",
        time: "10 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/japa-1",
        desc: "Everything you need to sort out financially before you leave.",
      },
      {
        id: "japa-2",
        label: "Proof of funds: What you need",
        time: "8 min video",
        contentType: "video",
        courseUrl: "https://wealthmotley.com/courses/japa-2",
        desc: "How much proof of funds you need and how to show it properly.",
      },
      {
        id: "japa-3",
        label: "Setting up banking abroad",
        time: "7 min read",
        contentType: "article",
        courseUrl: "https://wealthmotley.com/courses/japa-3",
        desc: "Open accounts, build credit, and navigate a new banking system.",
      },
      {
        id: "japa-4",
        label: "Japa Readiness Quiz",
        time: "5 min quiz",
        contentType: "quiz",
        courseUrl: "https://wealthmotley.com/courses/japa-quiz",
        desc: "Are you actually financially ready to relocate?",
      },
    ],
  },
];

// ── Continue Learning Banner ─────────────────────────────────────────
function ContinueLearningBanner({
  paths,
  completedLessons,
}: {
  paths: LearningPath[];
  completedLessons: Set<string>;
}) {
  // Find the most recently started path that is incomplete
  // For MVP, just find the first path with some progress but not fully complete
  let resumePath: LearningPath | null = null;
  let resumeLesson: Lesson | null = null;

  for (const p of paths) {
    const done = p.lessons.filter((l) => completedLessons.has(l.id)).length;
    if (done > 0 && done < p.lessons.length) {
      resumePath = p;
      resumeLesson = p.lessons.find((l) => !completedLessons.has(l.id)) || null;
      break;
    }
  }

  // If no partial path, find the first path with zero progress
  if (!resumePath) {
    for (const p of paths) {
      const done = p.lessons.filter((l) => completedLessons.has(l.id)).length;
      if (done === 0) {
        resumePath = p;
        resumeLesson = p.lessons[0] || null;
        break;
      }
    }
  }

  if (!resumePath || !resumeLesson) return null;

  const doneCount = resumePath.lessons.filter((l) => completedLessons.has(l.id)).length;
  const totalCount = resumePath.lessons.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <div
      className="glass-card rounded-[24px] p-6 relative overflow-hidden"
      style={{
        borderColor: `${resumePath.color}33`,
        boxShadow: `0 0 30px ${resumePath.color}0d`,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-4rem",
          top: "-4rem",
          width: "14rem",
          height: "14rem",
          background: `${resumePath.color}12`,
          borderRadius: "50%",
          filter: "blur(50px)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Lightning size={18} weight="fill" color="#ffb347" />
          <span
            className="text-xs uppercase tracking-widest"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#ffb347",
            }}
          >
            Continue Learning
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: resumePath.colorBg,
                  border: `1px solid ${resumePath.colorBorder}`,
                  color: resumePath.color,
                }}
              >
                {resumePath.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-white text-lg font-bold truncate">
                  {resumeLesson.label}
                </h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "#968a84",
                    }}
                  >
                    {resumePath.title}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <div className="flex items-center gap-1.5">
                    <ContentTypeIcon
                      type={resumeLesson.contentType}
                      size={11}
                      color={resumePath.color}
                    />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: resumePath.color,
                      }}
                    >
                      {contentTypeLabel(resumeLesson.contentType)}
                    </span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <div className="flex items-center gap-1">
                    <Clock size={11} color="#968a84" />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "#968a84",
                      }}
                    >
                      {resumeLesson.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="flex items-center gap-3 mt-3">
              <div
                className="h-1 flex-grow rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: resumePath.color,
                    boxShadow: `0 0 8px ${resumePath.color}80`,
                  }}
                />
              </div>
              <span
                className="text-[10px] flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#968a84",
                }}
              >
                {doneCount}/{totalCount} done
              </span>
            </div>
          </div>

          <a
            href={resumeLesson.courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm uppercase tracking-wider font-bold transition-all flex-shrink-0 no-underline"
            style={{
              fontFamily: "'DynaPuff', cursive",
              background: resumePath.color,
              color: "#0d0b0a",
              boxShadow: `0 0 20px ${resumePath.color}33`,
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = resumePath!.colorLight;
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = resumePath!.color;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <ArrowRight size={16} weight="bold" />
            Resume
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Learn Page ──────────────────────────────────────────────────
export default function LearnPage() {
  const [tipIndex, setTipIndex] = useState(14);
  const [roastLevel, setRoastLevel] = useState("Nuclear");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = getCompletedLessons();
    // Seed some default progress for demo purposes if nothing stored
    if (stored.size === 0) {
      stored.add("mb-1");
      stored.add("mb-2");
      stored.add("inv-1");
      stored.add("inv-2");
      stored.add("dia-1");
      stored.add("japa-1");
      stored.add("japa-2");
      saveCompletedLessons(stored);
    }
    setCompletedLessons(stored);
    setHydrated(true);
  }, []);

  const toggleComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      saveCompletedLessons(next);
      return next;
    });
  }, []);

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

      {/* Continue Learning Banner */}
      {hydrated && (
        <ContinueLearningBanner
          paths={LEARNING_PATHS}
          completedLessons={completedLessons}
        />
      )}

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

        {/* Mo's Honest Take */}
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
          {LEARNING_PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              completedLessons={completedLessons}
              onToggleComplete={toggleComplete}
            />
          ))}
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
