"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div
        className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border px-8 py-12 text-center"
        style={{
          background: "rgba(13, 11, 10, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(150, 138, 132, 0.15)",
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Mascot with neutral expression */}
        <div className="relative">
          <svg
            width={96}
            height={96}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_30px_rgba(255,179,71,0.25)]"
          >
            <circle cx="20" cy="20" r="20" fill="#ffb347" />
            {/* Left eye - neutral dot */}
            <circle cx="14" cy="15" r="2.5" fill="#0d0b0a" />
            {/* Right eye - neutral dot */}
            <circle cx="26" cy="15" r="2.5" fill="#0d0b0a" />
            {/* Neutral/flat mouth */}
            <path
              d="M14 25 L26 25"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "DynaPuff, cursive" }}
        >
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="max-w-xs text-sm leading-relaxed text-[#b8ada7]">
          No worries — you can upgrade anytime from Settings. We'll be here when
          you're ready!
        </p>

        {/* Amber decorative divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ffb347]/20" />
          <div className="size-1.5 rounded-full bg-[#ffb347]/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ffb347]/20" />
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/settings")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold text-[#b8ada7] transition-all hover:border-[#ffb347]/30 hover:text-white"
          style={{
            border: "1px solid rgba(150, 138, 132, 0.2)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <ArrowLeft className="size-4" />
          Back to Settings
        </button>
      </div>
    </div>
  );
}
