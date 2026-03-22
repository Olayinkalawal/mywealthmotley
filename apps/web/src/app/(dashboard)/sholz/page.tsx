"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";
import type { AiTone } from "@/lib/ai-prompts";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────

interface MathBreakdown {
  label: string;
  value: string;
  color: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isError?: boolean;
  spicy?: boolean;
  showActions?: boolean;
  showFeedback?: boolean;
  mathBreakdown?: MathBreakdown[] | null;
}

// ── Sholz Avatar ────────────────────────────────────────────────────────

function SholzAvatar({ spicy = false }: { spicy?: boolean }) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border overflow-hidden mt-1",
        spicy
          ? "bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          : "bg-[#ffb347] border-[#0d0b0a]"
      )}
    >
      {spicy ? (
        <span className="text-sm">&#128293;</span>
      ) : (
        <svg viewBox="0 0 100 100" fill="none" className="w-5 h-5">
          <rect x="20" y="20" width="60" height="60" rx="16" fill="#0d0b0a" />
          <path
            d="M 35 60 Q 50 70 65 60"
            stroke="#ffb347"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-4 max-w-[85%] md:max-w-[75%] wm-message-enter">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden mt-1 opacity-50">
        <svg viewBox="0 0 100 100" fill="none" className="w-5 h-5">
          <rect x="20" y="20" width="60" height="60" rx="16" fill="#0d0b0a" />
          <path
            d="M 35 60 Q 50 70 65 60"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <div className="wm-glass px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-fit !bg-white/5 !border-white/10">
        <div
          className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
          style={{
            animation: "wm-typing 1.4s infinite ease-in-out both",
            animationDelay: "-0.32s",
          }}
        />
        <div
          className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
          style={{
            animation: "wm-typing 1.4s infinite ease-in-out both",
            animationDelay: "-0.16s",
          }}
        />
        <div
          className="w-1.5 h-1.5 bg-yellow-400 rounded-full"
          style={{ animation: "wm-typing 1.4s infinite ease-in-out both" }}
        />
      </div>
    </div>
  );
}

// ── Message Actions ─────────────────────────────────────────────────────

function MessageActions({
  onShowMath,
  onRoastHarder,
  hasMath = false,
}: {
  onShowMath: () => void;
  onRoastHarder: () => void;
  hasMath?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {hasMath && (
        <button
          onClick={onShowMath}
          className="wm-mono text-xs uppercase tracking-wide border border-white/10 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M3 15h6" />
            <path d="M3 18h6" />
            <path d="M13 15h6" />
            <path d="M13 18h6" />
          </svg>
          Show Math
        </button>
      )}
      <button
        onClick={onRoastHarder}
        className="wm-mono text-xs uppercase tracking-wide border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
        Roast Me Harder
      </button>
    </div>
  );
}

// ── Math Modal ──────────────────────────────────────────────────────────
// Now dynamically driven: only shows when AI response includes cost-comparison data.

function parseMathFromResponse(response: string): MathBreakdown[] | null {
  // Look for cost-comparison patterns in the AI response.
  // The AI may include structured lines like "Item: ₦420,000" or "Cost: ₦X"
  // For now, detect if the response mentions a cost comparison and return null
  // (no hardcoded data). In future, the AI backend can return structured data.
  const hasCostComparison =
    /cost.*vs|compare.*price|saves?\s+you|monthly.*saving|you.*(save|spend).*instead/i.test(
      response
    );
  if (!hasCostComparison) return null;
  // Return empty array to signal "comparison detected but no structured breakdown yet"
  return [];
}

function MathModal({
  isOpen,
  onClose,
  breakdown,
}: {
  isOpen: boolean;
  onClose: () => void;
  breakdown: MathBreakdown[] | null;
}) {
  if (!isOpen || !breakdown) return null;

  const hasRows = breakdown.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
        style={{ background: "rgba(13,11,10,0.95)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <h3 className="wm-heading text-lg text-white mb-4">The Math</h3>
        {hasRows ? (
          <div className="space-y-3 wm-mono text-sm">
            {breakdown.map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-white/5 pb-2"
              >
                <span className="text-white/60">{row.label}</span>
                <span style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-sm leading-relaxed">
            Mo detected a cost comparison in this response. Detailed breakdowns
            will be available once your accounts are connected.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sidebar (Snapshot + Roast + Transactions) ───────────────────────────

function ChatSidebar({
  roastLevel,
  setRoastLevel,
  fmtCurr,
  fmtCompact,
}: {
  roastLevel: number;
  setRoastLevel: (n: number) => void;
  fmtCurr: (n: number) => string;
  fmtCompact: (n: number) => string;
}) {
  return (
    <aside
      className="hidden lg:flex flex-col w-[340px] gap-6 overflow-y-auto pr-2 pb-4 wm-scrollbar"
    >
      {/* Snapshot Card */}
      <div className="wm-glass rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#ffb347]/10 blur-[40px] rounded-full group-hover:bg-[#ffb347]/20 transition-all duration-700 pointer-events-none" />
        <h2 className="wm-heading text-lg text-white mb-6 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffb347"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          Your Snapshot
        </h2>
        <div className="space-y-6">
          <div>
            <p className="wm-mono text-[10px] text-[#968a84] uppercase tracking-widest mb-1">
              Current Balance
            </p>
            <p className="wm-mono text-3xl text-white font-bold">{fmtCurr(245000)}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <span className="wm-mono text-xs text-[#968a84] uppercase tracking-wider">
                Monthly Spend
              </span>
              <span className="wm-mono text-xs text-yellow-400">80%</span>
            </div>
            <div className="h-1.5 w-full bg-[#0d0b0a] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-yellow-400 rounded-full w-[80%]"
                style={{ boxShadow: "0 0 8px #fbbf24" }}
              />
            </div>
            <div className="flex justify-between wm-mono text-[10px] text-white/50">
              <span>{fmtCompact(1200000)} spent</span>
              <span>{fmtCompact(1500000)} budget</span>
            </div>
          </div>
          <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex justify-between items-end mb-2">
              <span className="wm-mono text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5-1.5L14.5 6 6.3 4.2 4.5 6l6.5 4L5 16l-2.5-1.5L1 16l4 4 1.5 1.5L8 19l6-6 4 6.5 1.8-1.8Z" />
                </svg>
                Japa Fund
              </span>
              <span className="wm-mono text-xs text-white">43%</span>
            </div>
            <div className="h-1.5 w-full bg-[#0d0b0a] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 rounded-full w-[43%] relative overflow-hidden"
                style={{ boxShadow: "0 0 20px rgba(59,130,246,0.15)" }}
              >
                <div
                  className="absolute inset-0 bg-white/30 w-1/2 -skew-x-12"
                  style={{ animation: "wm-shine 2s infinite" }}
                />
              </div>
            </div>
            <p className="wm-mono text-[10px] text-white/50 text-right">
              {fmtCompact(2300000)} / {fmtCompact(5300000)}
            </p>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">
                <span>&#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;</span>
              </div>
              <span className="wm-mono text-xs text-[#968a84] uppercase tracking-wider">
                Black Tax
              </span>
            </div>
            <span className="wm-mono text-sm text-purple-400 font-medium">
              {fmtCompact(180000)}
            </span>
          </div>
        </div>
      </div>

      {/* Roast Settings */}
      <div
        className="rounded-[24px] p-5 border border-red-500/20"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(239,68,68,0.05), transparent)",
          backdropFilter: "blur(16px)",
        }}
      >
        <h3 className="wm-mono text-xs text-red-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          Roast Settings
        </h3>
        <p className="text-xs text-white/70 mb-3 leading-relaxed">
          Adjust how savage Mo should be when analyzing your poor life
          choices.
        </p>
        <div className="flex gap-2">
          {["Mild", "Spicy", "Nuclear"].map((level, i) => (
            <button
              key={level}
              onClick={() => setRoastLevel(i)}
              className={cn(
                "flex-1 py-2 text-xs wm-mono rounded-lg border transition-colors",
                roastLevel === i
                  ? "bg-red-500/20 text-red-500 border-red-500/40 font-bold"
                  : "bg-white/5 text-[#968a84] border-white/10 hover:border-white/20"
              )}
              style={
                roastLevel === i
                  ? { boxShadow: "0 0 10px rgba(239,68,68,0.2)" }
                  : {}
              }
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="wm-glass rounded-[24px] p-5 border border-white/5">
        <h3 className="wm-mono text-xs text-[#968a84] uppercase tracking-widest mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-3">
          {[
            {
              emoji: "\uD83C\uDF54",
              name: "Chowdeck",
              time: "Today, 2:30 PM",
              amount: `-${fmtCurr(12500)}`,
              positive: false,
            },
            {
              emoji: "\uD83D\uDCF1",
              name: "MTN Airtime",
              time: "Yesterday",
              amount: `-${fmtCurr(5000)}`,
              positive: false,
            },
            {
              emoji: "\uD83D\uDCBC",
              name: "Salary",
              time: "Aug 25",
              amount: `+${fmtCurr(850000)}`,
              positive: true,
            },
          ].map((tx) => (
            <div key={tx.name} className="flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs border",
                    tx.positive
                      ? "bg-green-400/10 text-green-400 border-green-400/20"
                      : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                  )}
                >
                  {tx.emoji}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{tx.name}</p>
                  <p className="text-[10px] text-[#968a84] wm-mono">
                    {tx.time}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "wm-mono text-sm",
                  tx.positive
                    ? "text-green-400"
                    : "text-white group-hover:text-red-500 transition-colors"
                )}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function SholzPage() {
  const { format: fmtCurr, formatCompact: fmtCompact } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState<AiTone>("warm");
  const [roastLevel, setRoastLevel] = useState(1);
  const [mathModalOpen, setMathModalOpen] = useState(false);
  const [activeMathBreakdown, setActiveMathBreakdown] = useState<MathBreakdown[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<
    Id<"aiConversations"> | undefined
  >(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});

  const sendMessageAction = useAction(api.aiSholz.sendMessage);

  const handleFeedback = useCallback((msgId: string, type: "up" | "down") => {
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: type }));
    if (type === "up") {
      toast.success("Thanks for the feedback!");
    } else {
      toast.info("Got it, Mo will try to improve.");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;
    const content = inputValue.trim();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const effectiveTone = content.toLowerCase().includes("roast")
      ? "roast"
      : tone;

    try {
      const result = await sendMessageAction({
        message: content,
        tone: effectiveTone,
        conversationId,
      });
      if (result.conversationId) setConversationId(result.conversationId);

      const mathData = parseMathFromResponse(result.response);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: result.response,
        timestamp: Date.now(),
        spicy: effectiveTone === "roast",
        showFeedback: effectiveTone === "roast",
        showActions: effectiveTone !== "roast",
        mathBreakdown: mathData,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Sorry, I couldn't respond right now. Please try again in a moment.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, tone, conversationId, sendMessageAction]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleRoastMe = useCallback(async () => {
    const content = "Roast my spending habits right now!";
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: Date.now(),
      spicy: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await sendMessageAction({
        message: content,
        tone: "roast",
        conversationId,
      });
      if (result.conversationId) setConversationId(result.conversationId);

      const reply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: result.response,
        timestamp: Date.now(),
        spicy: true,
        showFeedback: true,
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: "Sorry, I couldn't roast you right now. Try again!",
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [conversationId, sendMessageAction]);

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full gap-6 relative">
      <MathModal
        isOpen={mathModalOpen}
        onClose={() => {
          setMathModalOpen(false);
          setActiveMathBreakdown(null);
        }}
        breakdown={activeMathBreakdown}
      />

      {/* Chat section */}
      <section className="flex-1 flex flex-col rounded-[32px] overflow-hidden shadow-2xl relative max-w-[900px] wm-glass !border-white/10">
        {/* Chat header */}
        <header
          className="flex-none p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm z-20"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backgroundColor: "rgba(13,11,10,0.4)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 overflow-hidden"
                style={{
                  backgroundColor: "#ffb347",
                  borderColor: "#0d0b0a",
                  boxShadow: "0 0 20px rgba(255,179,71,0.15)",
                }}
              >
                <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8">
                  <rect
                    x="20"
                    y="20"
                    width="60"
                    height="60"
                    rx="16"
                    fill="#0d0b0a"
                  />
                  <circle cx="35" cy="45" r="5" fill="#ffb347" />
                  <circle cx="65" cy="45" r="5" fill="#ffb347" />
                  <path
                    d="M 35 65 Q 50 75 65 65"
                    stroke="#ffb347"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 rounded-full"
                style={{
                  borderColor: "#0d0b0a",
                  boxShadow: "0 0 8px #34d399",
                }}
              />
            </div>
            <div>
              <h1 className="wm-heading text-xl md:text-2xl text-white leading-none">
                Mo
              </h1>
              <p className="text-sm font-medium mt-1 text-[#ffb347]">
                Your Financial Bestie
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex border rounded-full p-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={() => setTone("warm")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs uppercase tracking-wide transition-all wm-mono",
                  tone === "warm"
                    ? "bg-[#ffb347] text-[#0d0b0a] font-bold shadow-[0_0_10px_rgba(255,179,71,0.3)]"
                    : "text-[#968a84]"
                )}
              >
                Warm
              </button>
              <button
                onClick={() => setTone("formal")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs uppercase tracking-wide transition-all wm-mono",
                  tone === "formal"
                    ? "bg-[#ffb347] text-[#0d0b0a] font-bold shadow-[0_0_10px_rgba(255,179,71,0.3)]"
                    : "text-[#968a84]"
                )}
              >
                Formal
              </button>
            </div>
            <button
              onClick={handleRoastMe}
              className="flex items-center gap-2 px-4 py-2 rounded-full border font-bold group transition-all hover:bg-red-500 hover:text-white wm-mono text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.3)",
                color: "#ef4444",
                boxShadow: "0 0 20px rgba(239,68,68,0.15)",
              }}
            >
              <span>&#128293;</span>
              <span className="hidden sm:inline">Roast Me</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 wm-scrollbar"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(13,11,10,0.5))",
          }}
        >
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex w-16 h-16 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,179,71,0.1)",
                    border: "1px solid rgba(255,179,71,0.2)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    className="w-10 h-10"
                  >
                    <rect
                      x="20"
                      y="20"
                      width="60"
                      height="60"
                      rx="16"
                      fill="#0d0b0a"
                    />
                    <circle cx="35" cy="45" r="5" fill="#ffb347" />
                    <circle cx="65" cy="45" r="5" fill="#ffb347" />
                    <path
                      d="M 35 65 Q 50 75 65 65"
                      stroke="#ffb347"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <h3 className="wm-heading text-lg text-white">
                  Hey, I&apos;m Mo!
                </h3>
                <p className="mt-1 text-sm text-[#968a84] max-w-sm mx-auto">
                  Your money conscience with better jokes. Ask me anything about
                  your finances, or let me roast your spending habits.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                {[
                  { emoji: "\uD83D\uDCB8", text: "Where did my money go?" },
                  {
                    emoji: "\u2708\uFE0F",
                    text: "Am I saving enough for Japa?",
                  },
                  { emoji: "\uD83C\uDF7D\uFE0F", text: "Food budget check" },
                  {
                    emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
                    text: "Black tax limit",
                  },
                ].map(({ emoji, text }) => (
                  <button
                    key={text}
                    onClick={() => handleQuickPrompt(text)}
                    className="whitespace-nowrap flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                  >
                    <span>{emoji}</span> {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="wm-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[#968a84]">
                  Today
                </span>
              </div>

              {messages.map((msg) => {
                if (msg.role === "assistant") {
                  return (
                    <div
                      key={msg.id}
                      className="flex gap-4 max-w-[85%] md:max-w-[75%] wm-message-enter"
                    >
                      <SholzAvatar spicy={msg.spicy} />
                      <div className="flex flex-col gap-1">
                        <span className="wm-mono text-xs ml-1" style={{ color: msg.spicy ? "#ef4444" : "#968a84" }}>
                          {msg.spicy ? "Mo (Spicy Mode)" : "Mo"}
                        </span>
                        <div
                          className={cn(
                            "p-4 rounded-2xl rounded-tl-sm text-[15px] leading-relaxed relative overflow-hidden",
                            msg.isError
                              ? "bg-red-500/10 border border-red-500/30 text-red-400"
                              : msg.spicy
                                ? "border border-red-500/30 text-white/90"
                                : "wm-glass !bg-white/5 !border-white/10 text-white/90"
                          )}
                          style={
                            msg.spicy && !msg.isError
                              ? {
                                  backgroundColor: "rgba(26,15,15,0.8)",
                                  borderColor: "rgba(239,68,68,0.3)",
                                }
                              : {}
                          }
                        >
                          {msg.spicy && !msg.isError && (
                            <div
                              className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                              style={{
                                backgroundColor: "rgba(239,68,68,0.1)",
                                filter: "blur(32px)",
                              }}
                            />
                          )}
                          {msg.content}
                        </div>
                        {msg.showFeedback && (
                          <div className="flex items-center gap-3 mt-1 ml-1">
                            <button
                              onClick={() => handleFeedback(msg.id, "up")}
                              className="transition-colors hover:text-white"
                              style={{
                                color: feedbackGiven[msg.id] === "up" ? "#34d399" : "#968a84",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={feedbackGiven[msg.id] === "up" ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, "down")}
                              className="transition-colors hover:text-white"
                              style={{
                                color: feedbackGiven[msg.id] === "down" ? "#ef4444" : "#968a84",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill={feedbackGiven[msg.id] === "down" ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                handleCopy(msg.id, msg.content)
                              }
                              className="wm-mono text-[10px] px-2 py-0.5 rounded border border-transparent hover:border-white/10 transition-all uppercase"
                              style={{
                                color:
                                  copiedId === msg.id
                                    ? "#34d399"
                                    : "#968a84",
                              }}
                            >
                              {copiedId === msg.id ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        )}
                        {msg.showActions && (
                          <MessageActions
                            onShowMath={() => {
                              setActiveMathBreakdown(msg.mathBreakdown ?? null);
                              setMathModalOpen(true);
                            }}
                            onRoastHarder={handleRoastMe}
                            hasMath={msg.mathBreakdown != null}
                          />
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={msg.id}
                      className="flex gap-4 max-w-[85%] md:max-w-[75%] ml-auto justify-end wm-message-enter"
                    >
                      <div className="flex flex-col gap-1 items-end">
                        <span className="wm-mono text-xs mr-1 text-[#968a84]">
                          You
                        </span>
                        <div
                          className="p-4 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed text-white"
                          style={
                            msg.spicy
                              ? {
                                  backgroundColor: "rgba(239,68,68,0.15)",
                                  border:
                                    "1px solid rgba(239,68,68,0.3)",
                                }
                              : {
                                  backgroundColor: "rgba(255,179,71,0.15)",
                                  border:
                                    "1px solid rgba(255,179,71,0.2)",
                                }
                          }
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
              <div className="h-4" />
            </>
          )}
        </div>

        {/* Footer */}
        <footer
          className="flex-none flex flex-col border-t z-20 backdrop-blur-xl"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            backgroundColor: "rgba(13,11,10,0.6)",
          }}
        >
          <div
            className="px-4 py-3 flex gap-2 overflow-x-auto"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              scrollbarWidth: "none",
            }}
          >
            <span className="wm-mono text-[10px] uppercase flex items-center mr-2 whitespace-nowrap text-[#968a84]">
              Ask about:
            </span>
            {[
              { emoji: "\uD83D\uDCB8", text: "Where did my money go?" },
              { emoji: "\u2708\uFE0F", text: "Am I saving enough for Japa?" },
              { emoji: "\uD83C\uDF7D\uFE0F", text: "Food budget check" },
              {
                emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67",
                text: "Black tax limit",
              },
            ].map(({ emoji, text }) => (
              <button
                key={text}
                onClick={() => handleQuickPrompt(text)}
                className="whitespace-nowrap flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
              >
                <span>{emoji}</span> {text}
              </button>
            ))}
          </div>

          <div className="p-4 flex items-end gap-3">
            <div
              className="flex-1 rounded-2xl overflow-hidden flex items-center transition-all"
              style={{
                backgroundColor: "#141110",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="wm-scrollbar"
                placeholder="Ask Mo anything about your money..."
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "white",
                  padding: "14px 16px",
                  outline: "none",
                  resize: "none",
                  maxHeight: "128px",
                  fontSize: "15px",
                  border: "none",
                }}
              />
              <button className="p-3 mr-1 transition-colors text-[#968a84] hover:text-[#ffb347]">
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
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>
            </div>

            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all bg-[#ffb347] text-[#0d0b0a] hover:bg-[#e67e22]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: "translate(-1px, 1px)" }}
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </footer>
      </section>

      <ChatSidebar roastLevel={roastLevel} setRoastLevel={setRoastLevel} fmtCurr={fmtCurr} fmtCompact={fmtCompact} />
    </div>
  );
}
