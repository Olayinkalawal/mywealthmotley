"use client";

import type { MoneyDnaArchetype } from "@/lib/money-dna";
import { getIconComponent } from "@/lib/archetype-icons";

interface WmMoneyDnaShareCardProps {
  archetype: MoneyDnaArchetype;
  userName?: string;
}

export function WmMoneyDnaShareCard({
  archetype,
  userName,
}: WmMoneyDnaShareCardProps) {
  const ArchetypeIcon = getIconComponent(archetype.iconName);

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl"
      style={{ width: 360, height: 640 }}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 40%, ${archetype.color}15 70%, #0d0d0d 100%)`,
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute -right-20 -top-20 size-64 rounded-full opacity-10"
        style={{ background: archetype.color }}
      />
      <div
        className="absolute -bottom-16 -left-16 size-48 rounded-full opacity-8"
        style={{ background: archetype.color, opacity: 0.08 }}
      />

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-between p-8">
        {/* Top: Label + Logo */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{ background: archetype.color }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: archetype.color }}
            >
              Money DNA
            </span>
          </div>
          {userName && (
            <p className="text-sm text-white/50">{userName}&apos;s Result</p>
          )}
        </div>

        {/* Center: Archetype */}
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Archetype icon */}
          <div className="flex size-24 items-center justify-center rounded-full bg-white/10">
            <ArchetypeIcon size={48} weight="duotone" color={archetype.color} />
          </div>

          {/* Archetype name */}
          <div className="space-y-2">
            <h2
              className="text-2xl font-bold leading-tight tracking-tight"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                color: archetype.color,
              }}
            >
              {archetype.name}
            </h2>

            {/* Key trait / tagline */}
            <p className="mx-auto max-w-[260px] text-sm leading-relaxed text-white/60">
              &ldquo;{archetype.tagline}&rdquo;
            </p>
          </div>

          {/* Top strength highlight */}
          <div
            className="rounded-lg border px-4 py-2.5"
            style={{
              borderColor: `${archetype.color}30`,
              background: `${archetype.color}10`,
            }}
          >
            <p className="text-xs font-medium text-white/80">
              {archetype.strengths[0]}
            </p>
          </div>
        </div>

        {/* Bottom: CTA + watermark */}
        <div className="space-y-4">
          {/* CTA */}
          <div
            className="rounded-xl px-4 py-3 text-center"
            style={{
              background: `${archetype.color}20`,
              border: `1px solid ${archetype.color}30`,
            }}
          >
            <p className="text-xs font-semibold text-white/90">
              Discover yours at{" "}
              <span style={{ color: archetype.color }}>wealthmotley.com</span>
            </p>
          </div>

          {/* Watermark */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="size-5 rounded-md"
              style={{
                background: `linear-gradient(135deg, ${archetype.color}, ${archetype.color}80)`,
              }}
            />
            <span
              className="text-sm font-bold tracking-tight text-white/40"
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              WealthMotley
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
