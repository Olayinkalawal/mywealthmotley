"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

/**
 * Hook for triggering celebration animations (confetti).
 * Used for milestone achievements, savings goals, streaks, etc.
 *
 * @example
 * const { celebrate, celebrateBig, celebrateEmoji } = useCelebration();
 * celebrate(); // standard confetti burst
 * celebrateBig(); // multi-burst celebration
 * celebrateEmoji("💰"); // money emoji rain
 */
export function useCelebration() {
  const celebrate = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#5C3D2E", "#E8614D", "#D4A843", "#5B9A6D"],
    });
  }, []);

  const celebrateBig = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#5C3D2E", "#E8614D", "#D4A843"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#5C3D2E", "#E8614D", "#D4A843"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const celebrateEmoji = useCallback((emoji: string = "\uD83D\uDCB0") => {
    const scalar = 2;
    const emojiShape = confetti.shapeFromText({ text: emoji, scalar });

    confetti({
      shapes: [emojiShape],
      scalar,
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  return {
    celebrate,
    celebrateBig,
    celebrateEmoji,
  } as const;
}
