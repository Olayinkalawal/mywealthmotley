"use client";

import * as React from "react";
import { useState } from "react";
import { BookmarkSimple, Lightbulb } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DAILY_TIP } from "@/lib/education-content";

// ── Daily Tip Component ─────────────────────────────────────────────

function WmDailyTip() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="border-[#D4A843]/20 bg-gradient-to-br from-[#5C3D2E]/5 via-transparent to-[#E8614D]/5">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Sholz icon */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#D4A843]/15">
              <Lightbulb className="size-5 text-[#D4A843]" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-[#D4A843] uppercase">
                    {DAILY_TIP.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Mo says...
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsSaved(!isSaved)}
                  className="shrink-0"
                >
                  {isSaved ? (
                    <BookmarkSimple className="size-4 text-[#D4A843]" weight="fill" />
                  ) : (
                    <BookmarkSimple className="size-4" />
                  )}
                  <span className="sr-only">
                    {isSaved ? "Unsave tip" : "Save tip"}
                  </span>
                </Button>
              </div>

              {/* Tip text */}
              <p className="mt-3 text-sm leading-relaxed">
                {DAILY_TIP.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { WmDailyTip };
