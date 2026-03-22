"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PaperPlaneTilt,
  Robot,
  Fire,
  Sparkle,
  Info,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AiTone } from "@/lib/ai-prompts";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

// ── Types ────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isError?: boolean;
}

interface SuggestedPrompt {
  label: string;
  icon: React.ElementType;
}

// ── Suggested prompts ────────────────────────────────────────────────

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { label: "How am I doing with my budget?", icon: Sparkle },
  { label: "Explain ETFs to me simply", icon: Sparkle },
  { label: "Where can I cut spending?", icon: Sparkle },
  { label: "Help me plan for japa", icon: Sparkle },
  { label: "Roast my spending!", icon: Fire },
];

// ── Mo mascot avatar ─────────────────────────────────────────────────

function MoMascot({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="20" fill="#ffb347" />
      {/* Left eye - friendly arc */}
      <path
        d="M12 16 Q14 12, 16 16"
        stroke="#0d0b0a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right eye - friendly arc */}
      <path
        d="M24 16 Q26 12, 28 16"
        stroke="#0d0b0a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Smile */}
      <path
        d="M13 24 Q20 31, 27 24"
        stroke="#0d0b0a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[85%]">
      <MoMascot size={28} />
      <div className="rounded-2xl rounded-bl-sm bg-primary/10 px-4 py-3 dark:bg-secondary/10">
        <div className="flex items-center gap-1">
          <span
            className="inline-block size-1.5 animate-bounce rounded-full bg-primary/60 dark:bg-secondary/60"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="inline-block size-1.5 animate-bounce rounded-full bg-primary/60 dark:bg-secondary/60"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="inline-block size-1.5 animate-bounce rounded-full bg-primary/60 dark:bg-secondary/60"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Chat skeleton ────────────────────────────────────────────────────

function ChatSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>

      {/* Messages area skeleton */}
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-end gap-2.5 max-w-[75%]">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-16 w-64 rounded-2xl rounded-bl-sm" />
          </div>
        </div>
        <div className="flex items-end gap-2.5 max-w-[65%] ml-auto flex-row-reverse">
          <Skeleton className="h-10 w-48 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex items-end gap-2.5 max-w-[70%]">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-20 w-72 rounded-2xl rounded-bl-sm" />
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t px-4 py-3">
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

interface WmAiSholzChatProps {
  className?: string;
}

export function WmAiSholzChat({ className }: WmAiSholzChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState<AiTone>("warm");
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<
    Id<"aiConversations"> | undefined
  >(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Convex action for sending messages to AI Sholz
  const sendMessageAction = useAction(api.aiSholz.sendMessage);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      // Reset height then set to scrollHeight
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isTyping) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      // Determine if the message triggers roast mode
      const effectiveTone = content.toLowerCase().includes("roast")
        ? "roast"
        : tone;

      try {
        // Call the real AI Sholz Convex action
        const result = await sendMessageAction({
          message: content.trim(),
          tone: effectiveTone,
          conversationId,
        });

        // Store conversation ID for follow-up messages
        if (result.conversationId) {
          setConversationId(result.conversationId);
        }

        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: result.response,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("AI Sholz error:", error);

        const errorMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, I couldn't respond right now. Please try again in a moment.",
          timestamp: Date.now(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [tone, isTyping, conversationId, sendMessageAction]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputValue);
    },
    [inputValue, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage]
  );

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const handleRoastMe = useCallback(() => {
    sendMessage("Roast my spending!");
  }, [sendMessage]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-xl border bg-card",
          className
        )}
      >
        <ChatSkeleton />
      </div>
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MoMascot size={32} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-semibold">Mo</h3>
              <span className="inline-block size-2 rounded-full bg-success" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your financial education companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tone toggle */}
          <div className="flex rounded-full border bg-muted/50 p-0.5">
            <button
              onClick={() => setTone("warm")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                tone === "warm"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Warm
            </button>
            <button
              onClick={() => setTone("formal")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                tone === "formal"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Formal
            </button>
          </div>

          {/* Roast Me button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRoastMe}
            disabled={isTyping}
            className="gap-1.5 rounded-full text-xs"
          >
            <Fire className="size-3.5" weight="duotone" />
            <span className="hidden sm:inline">Roast Me</span>
          </Button>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
            {/* Welcome */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 dark:bg-secondary/10">
                <Robot className="size-8 text-primary dark:text-secondary" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                Hey, I&apos;m Mo!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                Your personal financial education companion. Ask me anything
                about your money, budgeting, or saving strategies.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleSuggestedPrompt(prompt.label)}
                  className={cn(
                    "group flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all",
                    "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                    "dark:hover:border-secondary/40 dark:hover:bg-secondary/5 dark:hover:text-secondary",
                    prompt.label.includes("Roast") &&
                      "border-secondary/30 text-secondary hover:border-secondary/60 hover:bg-secondary/5 dark:border-secondary/30 dark:text-secondary"
                  )}
                >
                  <prompt.icon className="size-3.5" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2.5",
                  message.role === "user"
                    ? "flex-row-reverse"
                    : ""
                )}
              >
                {/* Avatar (AI only) */}
                {message.role === "assistant" && (
                  message.isError ? (
                    <Avatar size="sm" className="shrink-0">
                      <AvatarFallback className="bg-destructive text-destructive-foreground text-[10px] font-bold">
                        <WarningCircle className="size-3" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <MoMascot size={28} />
                  )
                )}

                {/* Message bubble */}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    message.role === "assistant"
                      ? message.isError
                        ? "rounded-bl-sm bg-destructive/10 text-destructive"
                        : "rounded-bl-sm bg-primary/10 text-foreground dark:bg-secondary/10"
                      : "rounded-br-sm bg-secondary text-secondary-foreground dark:bg-primary dark:text-primary-foreground"
                  )}
                >
                  {message.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < message.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Disclaimer ────────────────────────────────────────── */}
      <div className="flex items-start gap-1.5 px-4 py-1.5 border-t border-dashed">
        <Info className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" />
        <p className="text-[10px] leading-snug text-muted-foreground/60">
          Mo provides financial education only. Not financial advice.
        </p>
      </div>

      {/* ── Input ─────────────────────────────────────────────── */}
      <div className="border-t px-3 py-3 sm:px-4">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Mo anything about your money..."
              rows={1}
              className={cn(
                "w-full resize-none rounded-xl border bg-muted/30 px-4 py-2.5 pr-12 text-sm",
                "placeholder:text-muted-foreground/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-secondary/30",
                "max-h-[120px]"
              )}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isTyping}
            className="shrink-0 rounded-xl"
          >
            <PaperPlaneTilt className="size-4" weight="duotone" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        {/* Persistent disclaimer below input */}
        <p className="mt-2 flex items-center justify-center gap-1 text-[10px]" style={{ color: "#968a84" }}>
          <Info className="size-3 shrink-0" />
          Mo can make mistakes. Verify important financial information.
        </p>
      </div>
    </div>
  );
}

export { ChatSkeleton as WmAiSholzChatSkeleton };
