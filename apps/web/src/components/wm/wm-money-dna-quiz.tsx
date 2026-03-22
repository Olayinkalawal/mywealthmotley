"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  MONEY_DNA_QUESTIONS,
  calculateMoneyDna,
  type MoneyDnaArchetype,
  type QuizOption,
} from "@/lib/money-dna";
import { getIconComponent } from "@/lib/archetype-icons";

interface WmMoneyDnaQuizProps {
  onComplete: (result: MoneyDnaArchetype) => void;
}

export function WmMoneyDnaQuiz({ onComplete }: WmMoneyDnaQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isRevealing, setIsRevealing] = useState(false);

  const totalQuestions = MONEY_DNA_QUESTIONS.length;
  const question = MONEY_DNA_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleSelect = useCallback(
    (option: QuizOption) => {
      if (!question) return;
      setSelectedOption(option.id);
      setIsTransitioning(true);

      // Brief delay so the user sees their selection highlighted
      setTimeout(() => {
        const newAnswers = { ...answers, [question.id]: option.id };
        setAnswers(newAnswers);

        if (currentQuestion < totalQuestions - 1) {
          setDirection(1);
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          // Quiz complete - reveal result
          setIsRevealing(true);
          setTimeout(() => {
            const result = calculateMoneyDna(newAnswers);
            onComplete(result);
          }, 2000);
        }
        setIsTransitioning(false);
      }, 400);
    },
    [answers, currentQuestion, totalQuestions, question, onComplete],
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setDirection(-1);
      const prevIndex = currentQuestion - 1;
      const prevQuestion = MONEY_DNA_QUESTIONS[prevIndex];
      // Restore previously selected answer for the question we're going back to
      const previousAnswer = prevQuestion ? answers[prevQuestion.id] : null;
      setCurrentQuestion(prevIndex);
      setSelectedOption(previousAnswer ?? null);
      setIsTransitioning(false);
    }
  }, [currentQuestion, answers]);

  if (!question) return null;

  // Dramatic reveal screen
  if (isRevealing) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkle className="size-16 text-accent" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold">
              Analyzing your Money DNA...
            </h2>
            <p className="text-muted-foreground">
              Crunching the numbers on your financial personality
            </p>
          </div>
          {/* Animated dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="size-3 rounded-full bg-primary"
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] flex-col">
      {/* Progress bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 60%, hsl(var(--accent)) 100%)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Back button - glassmorphism style for visibility */}
      {currentQuestion > 0 && (
        <button
          onClick={handleBack}
          className="mb-4 w-fit flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:bg-white/10"
          style={{
            color: "#968a84",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      )}

      {/* Question card with animations */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({
              x: d > 0 ? 80 : -80,
              opacity: 0,
              scale: 0.95,
            }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (d: number) => ({
              x: d > 0 ? -80 : 80,
              opacity: 0,
              scale: 0.95,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-1 flex-col"
        >
          {/* Question text */}
          <h2 className="mb-6 font-heading text-xl font-bold leading-tight md:text-2xl">
            {question.question}
          </h2>

          {/* Answer options */}
          <div className="grid gap-3">
            {question.options.map((option, index) => {
              const OptionIcon = getIconComponent(option.iconName);
              return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                onClick={() => handleSelect(option)}
                disabled={isTransitioning}
                className={cn(
                  "group relative flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:cursor-default",
                  selectedOption === option.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card",
                )}
              >
                {/* Icon */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-transform duration-200 group-hover:scale-110">
                  <OptionIcon size={20} weight="duotone" className="text-foreground/70" />
                </div>

                {/* Text */}
                <span className="flex-1 text-sm font-medium md:text-base">
                  {option.text}
                </span>

                {/* Selection indicator */}
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                    selectedOption === option.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30",
                  )}
                >
                  {selectedOption === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="size-2.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </div>
              </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
