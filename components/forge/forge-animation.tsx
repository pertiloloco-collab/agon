"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ForgeAnimationProps {
  isActive: boolean;
  rewardName: string;
  cost: number;
  startBalance: number;
  onComplete: () => void;
}

function Spark({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute h-1.5 w-1.5 rounded-full bg-[#C9A84C]"
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: [1, 1, 0],
        x: x,
        y: y,
        scale: [1, 0.5, 0],
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      }}
      style={{
        boxShadow: "0 0 6px rgba(201, 168, 76, 0.8)",
      }}
    />
  );
}

export function ForgeAnimation({
  isActive,
  rewardName,
  cost,
  startBalance,
  onComplete,
}: ForgeAnimationProps) {
  const [phase, setPhase] = useState<"idle" | "hammer" | "sparks" | "stamp">("idle");
  const [countValue, setCountValue] = useState(startBalance);

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      return;
    }

    setCountValue(startBalance);
    setPhase("hammer");

    const t1 = setTimeout(() => setPhase("sparks"), 800);
    const t2 = setTimeout(() => {
      setPhase("stamp");
      // Animate counter down
      const steps = 30;
      const decrement = cost / steps;
      let current = startBalance;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        current -= decrement;
        setCountValue(Math.max(Math.round(current), startBalance - cost));
        if (step >= steps) clearInterval(interval);
      }, 40);
    }, 1400);
    const t3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isActive, startBalance, cost, onComplete]);

  // Generate spark positions
  const sparks = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: Math.random() * 0.3,
    };
  });

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dimmed backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Central content */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Card */}
            <motion.div
              className="relative flex h-48 w-64 flex-col items-center justify-center rounded-xl border border-[#C9A84C]/40 bg-[#111111] p-6"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="font-heading text-sm font-semibold text-[#F5F5F5]">
                {rewardName}
              </span>

              {/* Sparks */}
              {phase === "sparks" && (
                <div className="absolute left-1/2 top-1/2">
                  {sparks.map((spark, i) => (
                    <Spark key={i} delay={spark.delay} x={spark.x} y={spark.y} />
                  ))}
                </div>
              )}

              {/* Hammer strike */}
              {phase === "hammer" && (
                <motion.div
                  className="absolute -top-8 text-4xl"
                  initial={{ y: -60, rotate: -30, opacity: 0 }}
                  animate={{ y: 0, rotate: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeIn",
                  }}
                >
                  {"\u{1F528}"}
                </motion.div>
              )}

              {/* Stamp overlay */}
              {phase === "stamp" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="rotate-[-12deg] rounded-lg border-2 border-[#C9A84C] bg-black/60 px-6 py-2">
                    <span className="font-heading text-2xl font-bold tracking-[0.2em] text-[#C9A84C]">
                      FORGED
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Drachma counter */}
            <motion.div
              className="flex items-baseline gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-heading text-lg text-[#C9A84C]">₯</span>
              <span className="font-mono text-3xl font-bold tabular-nums text-[#C9A84C]">
                {countValue.toLocaleString()}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
