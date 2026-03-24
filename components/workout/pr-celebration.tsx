"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

interface PrCelebrationProps {
  exerciseName: string;
  newWeight: number;
  unit?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
}

const GOLD_COLORS = [
  "#C9A84C",
  "#E8D48B",
  "#FFD700",
  "#DAA520",
  "#F5DEB3",
  "#FAFAD2",
  "#B8860B",
];

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: 10 + (i * 80) / count + ((i * 17) % 20), // deterministic spread
      y: -10 - ((i * 13) % 30),
      size: 4 + ((i * 7) % 8),
      color: GOLD_COLORS[i % GOLD_COLORS.length],
      delay: (i * 0.03) % 0.5,
      duration: 1.5 + ((i * 11) % 10) / 10,
      rotation: (i * 37) % 360,
    });
  }
  return particles;
}

// Generate particles once, outside render
const particles = generateParticles(40);

export function PrCelebration({
  exerciseName,
  newWeight,
  unit = "kg",
  onDismiss,
  autoDismissMs = 3000,
}: PrCelebrationProps) {
  const [visible, setVisible] = useState(true);

  const dismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#050505]/90 backdrop-blur-sm"
        >
          {/* Confetti particles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: `${particle.x}vw`,
                  y: `${particle.y}vh`,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: "110vh",
                  rotate: particle.rotation,
                  opacity: [1, 1, 0.5, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: "easeIn",
                }}
                className="absolute rounded-sm"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
              />
            ))}
          </div>

          {/* Center content */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
            }}
            className="relative flex flex-col items-center gap-4 px-8"
          >
            {/* Glow */}
            <div className="absolute -inset-20 rounded-full bg-[#C9A84C]/10 blur-3xl" />

            {/* Trophy */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Trophy className="relative h-16 w-16 text-[#C9A84C]" />
            </motion.div>

            {/* NEW PR text */}
            <h1
              className="relative font-heading text-5xl font-black tracking-widest md:text-6xl"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8D48B, #C9A84C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEW PR!
            </h1>

            {/* Exercise details */}
            <div className="relative text-center">
              <p className="font-heading text-lg font-semibold uppercase tracking-wider text-[#F5F5F5]">
                {exerciseName}
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-[#C9A84C]">
                {newWeight}
                {unit}
              </p>
            </div>

            {/* Tap to dismiss */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="relative mt-4 font-mono text-[10px] text-[#525252]"
            >
              TAP TO DISMISS
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
