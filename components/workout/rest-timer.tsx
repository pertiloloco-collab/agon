"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RestTimerProps {
  duration: number;
  onComplete: () => void;
}

export function RestTimer({ duration, onComplete }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isVisible, setIsVisible] = useState(true);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    setTimeLeft(duration);
    setIsVisible(true);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Vibrate on complete if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      handleSkip();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, handleSkip]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / duration;

  // SVG circle properties
  const size = 200;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="font-heading text-sm tracking-[0.3em] text-[#C9A84C]/60 uppercase">
              Rest Period
            </p>

            {/* Circular timer */}
            <div className="relative flex items-center justify-center">
              <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#1F1F1F"
                  strokeWidth={strokeWidth}
                />
                {/* Progress arc */}
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>

              {/* Time display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-4xl text-[#F5F5F5] tabular-nums">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className={cn(
                "rounded-lg border border-[#1F1F1F] bg-[#111111] px-8 py-3",
                "font-heading text-xs tracking-[0.2em] text-[#A3A3A3]",
                "hover:border-[#C9A84C]/30 hover:text-[#C9A84C] transition-colors"
              )}
            >
              SKIP
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
