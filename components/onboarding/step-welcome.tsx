"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StepWelcomeProps {
  onBegin: () => void;
}

const sentence = "This is AGON. Your transformation starts now.";

export function StepWelcome({ onBegin }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Logo with gold glow */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 rounded-full bg-[#C9A84C]/20 blur-3xl" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#111111]">
          <Flame className="h-14 w-14 text-[#C9A84C]" />
        </div>
      </motion.div>

      {/* AGON title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-8 font-display text-5xl font-bold tracking-[0.25em] text-[#C9A84C] md:text-7xl"
      >
        AGON
      </motion.h1>

      {/* Typewriter text */}
      <div className="mb-8 h-12">
        <motion.p className="font-display text-xl text-[#F5F5F5] md:text-2xl">
          {sentence.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.0 + i * 0.04,
                duration: 0.01,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="mb-16 max-w-md"
      >
        <p className="text-sm leading-relaxed text-[#A3A3A3]">
          365 days. 4 phases. No excuses. You are about to enter a system
          designed to forge discipline, destroy weakness, and build the version
          of yourself you have always feared becoming. Every workout tracked.
          Every failure punished. Every victory honored.
        </p>
      </motion.div>

      {/* BEGIN button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBegin}
        className="group relative overflow-hidden rounded-lg border border-[#C9A84C]/50 bg-[#C9A84C] px-16 py-4 font-display text-lg font-bold tracking-[0.3em] text-[#050505] transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.3)]"
      >
        <span className="relative z-10">BEGIN</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-white/20 to-[#C9A84C]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      </motion.button>
    </div>
  );
}
