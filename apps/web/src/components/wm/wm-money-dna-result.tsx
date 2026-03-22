"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShareNetwork, ArrowCounterClockwise, Shield, Warning, Lightbulb } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MoneyDnaArchetype } from "@/lib/money-dna";
import { getIconComponent } from "@/lib/archetype-icons";
import { WmMoneyDnaShareCard } from "./wm-money-dna-share-card";

interface WmMoneyDnaResultProps {
  archetype: MoneyDnaArchetype;
  onRetake: () => void;
}

export function WmMoneyDnaResult({
  archetype,
  onRetake,
}: WmMoneyDnaResultProps) {
  const [showShareCard, setShowShareCard] = useState(false);

  const ArchetypeIcon = getIconComponent(archetype.iconName);

  return (
    <div className="space-y-6">
      {/* Hero result card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, ${archetype.color}40, transparent 60%), radial-gradient(ellipse at 70% 80%, ${archetype.color}30, transparent 50%)`,
          }}
        />

        <div className="relative space-y-4 text-center">
          {/* Icon with bounce */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mx-auto flex size-24 items-center justify-center rounded-full bg-white/10"
          >
            <ArchetypeIcon size={48} weight="duotone" color={archetype.color} />
          </motion.div>

          {/* Archetype name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Your Money DNA
            </p>
            <h2
              className="font-heading text-2xl font-bold md:text-3xl"
              style={{ color: archetype.color }}
            >
              {archetype.name}
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto max-w-sm text-base italic text-muted-foreground md:text-lg"
          >
            &ldquo;{archetype.tagline}&rdquo;
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mx-auto max-w-lg text-sm leading-relaxed text-foreground/80"
          >
            {archetype.description}
          </motion.p>
        </div>
      </motion.div>

      {/* Strengths, Watch Outs, Tips */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
              <Shield className="size-4 text-success" />
            </div>
            <h3 className="font-heading text-sm font-semibold">
              Your Strengths
            </h3>
          </div>
          <ul className="space-y-2">
            {archetype.strengths.map((strength, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-success" />
                {strength}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Watch Outs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10">
              <Warning className="size-4 text-warning" />
            </div>
            <h3 className="font-heading text-sm font-semibold">Watch Out</h3>
          </div>
          <ul className="space-y-2">
            {archetype.watchOuts.map((watchOut, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-warning" />
                {watchOut}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
              <Lightbulb className="size-4 text-accent" />
            </div>
            <h3 className="font-heading text-sm font-semibold">
              Tips For You
            </h3>
          </div>
          <ul className="space-y-2">
            {archetype.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-accent" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button
          onClick={() => setShowShareCard(true)}
          className="flex-1 gap-2"
          style={{
            backgroundColor: archetype.color,
            color: "#fff",
          }}
        >
          <ShareNetwork className="size-4" />
          Share Your Money DNA
        </Button>
        <Button variant="outline" onClick={onRetake} className="gap-2">
          <ArrowCounterClockwise className="size-4" />
          Retake Quiz
        </Button>
      </motion.div>

      {/* Share card modal */}
      {showShareCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowShareCard(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] flex-col items-center gap-4 overflow-y-auto"
          >
            <WmMoneyDnaShareCard archetype={archetype} />
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareCard(false)}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
