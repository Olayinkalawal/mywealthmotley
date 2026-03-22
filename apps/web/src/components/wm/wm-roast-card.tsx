"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Fire } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────

export interface Roast {
  headline: string;
  body: string;
  tip: string;
}

interface WmRoastCardProps {
  roast: Roast;
  className?: string;
}

// ── Shareable Roast Card (styled for social sharing, 9:16 ratio) ────

function WmRoastCard({ roast, className }: WmRoastCardProps) {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("perspective-[1000px]", className)}
    >
      <div
        className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl shadow-2xl"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Dark background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2D1F1A] to-[#1A1A1A]" />

        {/* Decorative fire icons */}
        <div className="pointer-events-none absolute inset-0 select-none text-[#E8614D]">
          <Fire className="absolute top-4 left-4 size-7 opacity-60" weight="duotone" />
          <Fire className="absolute top-6 right-6 size-5 opacity-40" weight="duotone" />
          <Fire className="absolute bottom-28 left-6 size-6 opacity-30" weight="duotone" />
          <Fire className="absolute top-1/3 right-4 size-4 opacity-20" weight="duotone" />
        </div>

        {/* Coral accent line at top */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#E8614D] via-[#D4A843] to-[#E8614D]" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-6">
          {/* Top: Logo area */}
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#E8614D]/20">
              <Fire size={16} weight="duotone" className="text-[#E8614D]" />
            </div>
            <span className="font-heading text-xs font-bold tracking-wider text-[#D4A843] uppercase">
              Mo Roast
            </span>
          </div>

          {/* Middle: The roast content */}
          <div className="flex-1 flex flex-col justify-center py-6">
            <h2 className="font-heading text-2xl font-bold leading-tight text-[#E8614D]">
              {roast.headline}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {roast.body}
            </p>

            {/* Tip section */}
            <div className="mt-6 rounded-lg border border-[#D4A843]/30 bg-[#D4A843]/10 p-3">
              <p className="text-[10px] font-semibold tracking-wider text-[#D4A843] uppercase">
                Mo&apos;s Tip
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-300">
                {roast.tip}
              </p>
            </div>
          </div>

          {/* Bottom: CTA + Watermark */}
          <div className="space-y-3">
            <div className="rounded-full bg-[#E8614D] px-4 py-2 text-center">
              <span className="text-xs font-semibold text-white">
                Get roasted at wealthmotley.com
              </span>
            </div>
            <p className="text-center text-[10px] text-gray-500">
              WealthMotley &mdash; Your money, your story
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export { WmRoastCard };
