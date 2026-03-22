"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import {
  CaretLeft,
  CaretRight,
  ShareNetwork,
  DownloadSimple,
  ArrowRight,
  Money,
  CurrencyNgn,
  ForkKnife,
  Heart,
  Users,
  Fire,
  DeviceMobile,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MOCK_WRAPPED } from "@/lib/mock-data";
import { getArchetypeById } from "@/lib/money-dna";
import { formatCompactCurrency } from "@/lib/currencies";
import { getIconComponent } from "@/lib/archetype-icons";

// ── Slide Components ────────────────────────────────────────────────

function SlideWrapper({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-white"
      style={{ background: gradient }}
    >
      {children}
    </div>
  );
}

function TitleSlide() {
  return (
    <SlideWrapper gradient="linear-gradient(160deg, #1a1a1a 0%, #2D1B14 40%, #5C3D2E 70%, #1a1a1a 100%)">
      {/* Decorative elements */}
      <div className="absolute left-6 top-8 opacity-20">
        <CurrencyNgn size={40} weight="duotone" className="text-white" />
      </div>
      <div className="absolute bottom-12 right-8 opacity-15">
        <Money size={32} weight="duotone" className="text-white" />
      </div>
      <div className="absolute right-16 top-20 opacity-10">
        <CurrencyNgn size={24} weight="light" className="text-white" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex size-20 items-center justify-center rounded-full bg-white/10"
        >
          <Money size={40} weight="duotone" className="text-[#D4A843]" />
        </motion.div>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
            Your
          </p>
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            <span className="text-[#D4A843]">{MOCK_WRAPPED.year}</span>
            <br />
            Money Story
          </h1>
          <p className="text-sm text-white/50">Tap to continue</p>
        </div>
      </motion.div>

      {/* WealthMotley watermark */}
      <div className="absolute bottom-6 flex items-center gap-2">
        <div className="size-4 rounded bg-gradient-to-br from-[#E8614D] to-[#5C3D2E]" />
        <span className="text-xs font-bold tracking-tight text-white/30">
          WealthMotley
        </span>
      </div>
    </SlideWrapper>
  );
}

function EarnedSlide() {
  const formatted = formatCompactCurrency(
    MOCK_WRAPPED.totalEarned,
    MOCK_WRAPPED.currency,
  );

  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #1a3a1a 40%, #2d5a2d 70%, #0d0d0d 100%)">
      {/* Rain animation - naira icons */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/10"
          initial={{
            x: Math.random() * 320,
            y: -30,
            opacity: 0,
          }}
          animate={{
            y: [-(30 + Math.random() * 40), 680],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
        >
          <CurrencyNgn size={18} weight="bold" />
        </motion.div>
      ))}

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          This year, you earned
        </p>
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="text-5xl font-bold tracking-tight text-[#5B9A6D]"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {formatted}
        </motion.h2>
        <p className="text-sm text-white/40">
          That&apos;s{" "}
          {formatCompactCurrency(
            MOCK_WRAPPED.totalEarned / 12,
            MOCK_WRAPPED.currency,
          )}{" "}
          per month
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function TopCategorySlide() {
  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #3a1a0d 40%, #E8614D20 70%, #0d0d0d 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex size-20 items-center justify-center rounded-full bg-white/10"
        >
          <ForkKnife size={40} weight="duotone" className="text-[#E8614D]" />
        </motion.div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          Your biggest spending category
        </p>
        <h2
          className="text-3xl font-bold text-[#E8614D]"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {MOCK_WRAPPED.topCategory.name}
        </h2>
        <p className="text-4xl font-bold text-white/90">
          {formatCompactCurrency(
            MOCK_WRAPPED.topCategory.amount,
            MOCK_WRAPPED.currency,
          )}
        </p>
        <p className="max-w-[240px] text-sm text-white/40">
          That&apos;s {MOCK_WRAPPED.topMerchant.visits} visits to{" "}
          {MOCK_WRAPPED.topMerchant.name} alone
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function FamilySupportSlide() {
  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #2D1B14 40%, #D4A84320 70%, #0d0d0d 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div className="flex gap-3">
          {[
            { Icon: Heart, color: "#E8614D" },
            { Icon: Users, color: "#D4A843" },
            { Icon: Heart, color: "#E8614D" },
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="flex size-14 items-center justify-center rounded-full bg-white/10"
            >
              <item.Icon size={28} weight="duotone" color={item.color} />
            </motion.div>
          ))}
        </div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          You sent to family
        </p>
        <h2
          className="text-4xl font-bold text-[#D4A843]"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {formatCompactCurrency(
            MOCK_WRAPPED.familySupport,
            MOCK_WRAPPED.currency,
          )}
        </h2>
        <p className="max-w-[260px] text-lg font-medium text-white/70">
          That&apos;s love. That&apos;s family. That&apos;s you.
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function SavingsSlide() {
  const savingsPercent = MOCK_WRAPPED.savingsRate;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (savingsPercent / 100) * circumference;

  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #0d2a1a 40%, #5B9A6D20 70%, #0d0d0d 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          You saved
        </p>
        <h2
          className="text-4xl font-bold text-[#5B9A6D]"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {formatCompactCurrency(
            MOCK_WRAPPED.totalSaved,
            MOCK_WRAPPED.currency,
          )}
        </h2>

        {/* Progress ring */}
        <div className="relative flex items-center justify-center">
          <svg width="150" height="150" className="-rotate-90">
            <circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <motion.circle
              cx="75"
              cy="75"
              r="60"
              fill="none"
              stroke="#5B9A6D"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span
              className="text-2xl font-bold text-white"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {savingsPercent}%
            </span>
            <span className="text-xs text-white/40">of income</span>
          </div>
        </div>

        <p className="max-w-[240px] text-sm text-white/50">
          That&apos;s {savingsPercent}% of your total earnings saved
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function MoneyDnaSlide() {
  const archetype = getArchetypeById(MOCK_WRAPPED.moneyDna);
  if (!archetype) return null;
  const ArchetypeIcon = getIconComponent(archetype.iconName);

  return (
    <SlideWrapper
      gradient={`linear-gradient(160deg, #0d0d0d 0%, ${archetype.color}15 40%, ${archetype.color}25 70%, #0d0d0d 100%)`}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          Your Money DNA
        </p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="flex size-24 items-center justify-center rounded-full bg-white/10"
        >
          <ArchetypeIcon size={48} weight="duotone" color={archetype.color} />
        </motion.div>
        <h2
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            color: archetype.color,
          }}
        >
          {archetype.name}
        </h2>
        <p className="max-w-[260px] text-sm italic text-white/50">
          &ldquo;{archetype.tagline}&rdquo;
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function StreakSlide() {
  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #3a2a0d 40%, #E5930C20 70%, #0d0d0d 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex size-20 items-center justify-center rounded-full bg-white/10"
        >
          <Fire size={40} weight="duotone" className="text-[#E5930C]" />
        </motion.div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          Budget streak
        </p>
        <h2
          className="text-6xl font-bold text-[#E5930C]"
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {MOCK_WRAPPED.budgetStreak}
        </h2>
        <p className="text-lg font-medium text-white/60">
          days staying on budget
        </p>
        <p className="max-w-[240px] text-sm text-white/40">
          That&apos;s discipline. That&apos;s growth.
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function EvolutionSlide() {
  const prevArchetype = getArchetypeById(MOCK_WRAPPED.previousDna);
  const currentArchetype = getArchetypeById(MOCK_WRAPPED.moneyDna);
  if (!prevArchetype || !currentArchetype) return null;
  const PrevIcon = getIconComponent(prevArchetype.iconName);
  const CurrentIcon = getIconComponent(currentArchetype.iconName);

  return (
    <SlideWrapper gradient="linear-gradient(160deg, #0d0d0d 0%, #1a1a3a 40%, #4a3a8a20 70%, #0d0d0d 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
          Your money personality evolved
        </p>

        <div className="flex items-center gap-4">
          {/* Previous */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-white/5 opacity-50">
              <PrevIcon size={32} weight="duotone" color={prevArchetype.color} />
            </div>
            <span className="max-w-[100px] text-xs text-white/40">
              {prevArchetype.name}
            </span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ArrowRight className="size-6 text-white/30" />
          </motion.div>

          {/* Current */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex size-20 items-center justify-center rounded-full bg-white/10">
              <CurrentIcon size={40} weight="duotone" color={currentArchetype.color} />
            </div>
            <span
              className="max-w-[100px] text-xs font-semibold"
              style={{ color: currentArchetype.color }}
            >
              {currentArchetype.name}
            </span>
          </motion.div>
        </div>

        <p className="max-w-[260px] text-sm text-white/50">
          Growth isn&apos;t just about money. It&apos;s about who you become.
        </p>
      </motion.div>
    </SlideWrapper>
  );
}

function ShareSlide() {
  return (
    <SlideWrapper gradient="linear-gradient(160deg, #1a1a1a 0%, #2D1B14 30%, #5C3D2E 50%, #E8614D20 70%, #1a1a1a 100%)">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex size-20 items-center justify-center rounded-full bg-white/10"
        >
          <DeviceMobile size={40} weight="duotone" className="text-[#D4A843]" />
        </motion.div>
        <div className="space-y-2">
          <h2
            className="text-2xl font-bold text-white"
            style={{
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Share Your
            <br />
            <span className="text-[#D4A843]">Money Story</span>
          </h2>
          <p className="text-sm text-white/50">
            Let your friends know you&apos;re on your financial journey
          </p>
        </div>

        {/* Privacy warning */}
        <p
          className="max-w-[280px] text-center text-xs"
          style={{ color: "#968a84" }}
        >
          This card contains your personal financial information. Only share if
          you&apos;re comfortable with others seeing these details.
        </p>

        <div className="flex gap-3">
          <Button
            size="sm"
            className="gap-2 bg-white/10 text-white hover:bg-white/20"
          >
            <ShareNetwork className="size-4" />
            Share
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-white/10 text-white hover:bg-white/20"
          >
            <DownloadSimple className="size-4" />
            Save
          </Button>
        </div>
      </motion.div>

      {/* WealthMotley watermark */}
      <div className="absolute bottom-6 flex items-center gap-2">
        <div className="size-4 rounded bg-gradient-to-br from-[#E8614D] to-[#5C3D2E]" />
        <span className="text-xs font-bold tracking-tight text-white/30">
          WealthMotley
        </span>
      </div>
    </SlideWrapper>
  );
}

// ── All slides ──────────────────────────────────────────────────────

const SLIDES = [
  { id: "title", component: TitleSlide },
  { id: "earned", component: EarnedSlide },
  { id: "top-category", component: TopCategorySlide },
  { id: "family", component: FamilySupportSlide },
  { id: "savings", component: SavingsSlide },
  { id: "dna", component: MoneyDnaSlide },
  { id: "streak", component: StreakSlide },
  { id: "evolution", component: EvolutionSlide },
  { id: "share", component: ShareSlide },
];

// ── Main Wrapped Component ──────────────────────────────────────────

export function WmMoneyWrapped() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < SLIDES.length) {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
      }
    },
    [currentSlide],
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      nextSlide();
    } else if (info.offset.x > threshold) {
      prevSlide();
    }
  };

  const SlideComponent = SLIDES[currentSlide]?.component;
  if (!SlideComponent) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Slide container - 9:16 aspect ratio */}
      <div
        className="relative w-full max-w-[360px] cursor-pointer overflow-hidden rounded-2xl shadow-2xl"
        style={{ aspectRatio: "9 / 16" }}
        onClick={nextSlide}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={SLIDES[currentSlide]?.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({
                x: d > 0 ? 360 : -360,
                opacity: 0,
              }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({
                x: d > 0 ? -360 : 360,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (desktop) */}
        {currentSlide > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <CaretLeft className="size-4" />
          </button>
        )}
        {currentSlide < SLIDES.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <CaretRight className="size-4" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-1.5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <p className="text-xs text-muted-foreground">
        {currentSlide + 1} / {SLIDES.length} — Tap or swipe to navigate
      </p>
    </div>
  );
}
