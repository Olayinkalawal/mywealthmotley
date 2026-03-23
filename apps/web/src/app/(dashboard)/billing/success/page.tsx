"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react";

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "Pro";
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  const [countdown, setCountdown] = useState(5);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

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
        {/* Mascot with checkmark */}
        <div className="relative">
          <svg
            width={96}
            height={96}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_30px_rgba(255,179,71,0.4)]"
          >
            <circle cx="20" cy="20" r="20" fill="#ffb347" />
            {/* Left eye - happy arc */}
            <path
              d="M12 16 Q14 12, 16 16"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right eye - happy arc */}
            <path
              d="M24 16 Q26 12, 28 16"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Big smile */}
            <path
              d="M13 24 Q20 31, 27 24"
              stroke="#0d0b0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {/* Checkmark badge */}
          <div
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
            }}
          >
            <CheckCircle
              className="size-5 text-white"
              weight="bold"
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "DynaPuff, cursive" }}
        >
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="max-w-xs text-sm leading-relaxed text-[#b8ada7]">
          Your <span className="font-semibold text-[#ffb347]">{planLabel}</span>{" "}
          subscription is now active. Welcome to the club!
        </p>

        {/* Amber decorative divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#ffb347]/30" />
          <div className="size-1.5 rounded-full bg-[#ffb347]/50" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#ffb347]/30" />
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-[#0d0b0a] transition-all hover:shadow-[0_0_20px_rgba(255,179,71,0.3)]"
          style={{
            background:
              "linear-gradient(135deg, #ffb347 0%, #e6952e 100%)",
          }}
        >
          Go to Dashboard
        </button>

        {/* Auto-redirect notice */}
        <p className="text-xs text-[#968a84]">
          Redirecting to dashboard in {countdown}s...
        </p>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <BillingSuccessContent />
    </Suspense>
  );
}
