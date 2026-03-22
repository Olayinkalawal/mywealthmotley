"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Fire, ShareNetwork, ArrowsClockwise } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WmRoastCard, type Roast } from "@/components/wm/wm-roast-card";

// ── Pre-written roasts ──────────────────────────────────────────────

const ROASTS: Roast[] = [
  {
    headline: "Your Chicken Republic Loyalty Card",
    body: "You've been to Chicken Republic 12 times this month. At this point, they should name a meal after you. That \u20A642,000 could have been 2 months of a VOO investment. But hey, at least you're consistent.",
    tip: "Try meal prepping Sundays. Same jollof, fraction of the price.",
  },
  {
    headline: "The Bolt CEO",
    body: "You spent \u20A622,100 on rides this month. That's more than some people's rent in Ikorodu. At this rate, you're basically funding Bolt's next expansion. Your legs work, babe.",
    tip: "Try the BRT for your regular commute. Save Bolt for emergencies and date nights.",
  },
  {
    headline: "Data & Chill Champion",
    body: "\u20A618,400 on data and airtime? What are you downloading \u2014 the entire internet? Netflix doesn't even cost that much. Your MTN should send you a thank-you letter.",
    tip: "Check out monthly bundle plans. They're usually 40% cheaper than weekly top-ups.",
  },
  {
    headline: "The Owambe Investor",
    body: "\u20A626,000 on aso ebi for ONE wedding. Babe, that ankara could have bought 3 shares of VOO. At least you looked stunning while your portfolio wept.",
    tip: "Set an owambe budget at the start of each month. When it's done, it's done.",
  },
  {
    headline: "Family Finance Minister",
    body: "You've sent \u20A645,000 to family this month \u2014 10% of your income. Your mum says thank you, your retirement fund says \u2018hello, remember me?\u2019 You're carrying everyone, but who's carrying you?",
    tip: "Set a sustainable family support budget. You can't pour from an empty cup.",
  },
];

// ── Thinking dots animation ─────────────────────────────────────────

function ThinkingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Fire className="size-12 text-[#E8614D]" />
      </motion.div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-muted-foreground">
          Mo is analyzing your spending
        </span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 1] }}
          className="text-muted-foreground"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            times: [0, 0.5, 1],
            delay: 0.2,
          }}
          className="text-muted-foreground"
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            times: [0, 0.5, 1],
            delay: 0.4,
          }}
          className="text-muted-foreground"
        >
          .
        </motion.span>
      </div>
    </div>
  );
}

// ── Main Roast Me Component ─────────────────────────────────────────

function WmRoastMe() {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentRoast, setCurrentRoast] = useState<Roast | null>(null);
  const [lastIndex, setLastIndex] = useState(-1);

  const getRandomRoast = useCallback(() => {
    let index: number;
    do {
      index = Math.floor(Math.random() * ROASTS.length);
    } while (index === lastIndex && ROASTS.length > 1);
    setLastIndex(index);
    return ROASTS[index]!;
  }, [lastIndex]);

  const triggerRoast = useCallback(() => {
    setIsOpen(true);
    setIsThinking(true);
    setCurrentRoast(null);

    setTimeout(() => {
      setIsThinking(false);
      setCurrentRoast(getRandomRoast());
    }, 2000);
  }, [getRandomRoast]);

  const roastAgain = useCallback(() => {
    setIsThinking(true);
    setCurrentRoast(null);

    setTimeout(() => {
      setIsThinking(false);
      setCurrentRoast(getRandomRoast());
    }, 2000);
  }, [getRandomRoast]);

  const handleShare = useCallback(async () => {
    if (!currentRoast) return;

    const shareText = `${currentRoast.headline}\n\n${currentRoast.body}\n\nTip: ${currentRoast.tip}\n\nGet roasted at wealthmotley.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mo Roast: ${currentRoast.headline}`,
          text: shareText,
        });
      } catch {
        // User cancelled or share failed - fall through to clipboard
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [currentRoast]);

  return (
    <>
      {/* Trigger Card */}
      <Card className="border-[#E8614D]/20 bg-gradient-to-br from-[#E8614D]/5 via-transparent to-[#D4A843]/5">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8614D]/10">
            <Fire className="size-7 text-[#E8614D]" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold">
              Ready to get roasted?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Let Mo roast your spending habits. It&apos;s brutal, it&apos;s
              honest, and it&apos;s hilarious.
            </p>
          </div>
          <Button
            onClick={triggerRoast}
            className="shrink-0 bg-[#E8614D] text-white hover:bg-[#E8614D]/90"
            size="lg"
          >
            <Fire className="size-4" />
            Roast Me, Mo!
          </Button>
        </CardContent>
      </Card>

      {/* Roast Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Fire className="size-5 text-[#E8614D]" weight="duotone" />
              Mo&apos;s Roast
            </DialogTitle>
            <DialogDescription>
              Your personalized spending roast, served hot.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {isThinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ThinkingAnimation />
              </motion.div>
            ) : currentRoast ? (
              <motion.div
                key="roast"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Shareable Card Preview */}
                <WmRoastCard roast={currentRoast} />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1"
                  >
                    <ShareNetwork className="size-4" />
                    Share This Roast
                  </Button>
                  <Button
                    onClick={roastAgain}
                    className="flex-1 bg-[#E8614D] text-white hover:bg-[#E8614D]/90"
                  >
                    <ArrowsClockwise className="size-4" />
                    Roast Me Again
                  </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                  This is meant to be fun and educational. Mo loves you
                  really.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { WmRoastMe };
