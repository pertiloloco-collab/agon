"use client";

import { motion } from "framer-motion";
import { Flame, Shield } from "lucide-react";

interface HeroBannerProps {
  dayNumber?: number;
  totalDays?: number;
  phaseName?: string;
  phaseNumber?: number;
  currentStreak?: number;
  honorScore?: number;
}

const defaultProps: Required<HeroBannerProps> = {
  dayNumber: 47,
  totalDays: 365,
  phaseName: "Foundation",
  phaseNumber: 1,
  currentStreak: 12,
  honorScore: 78,
};

export function HeroBanner(props: HeroBannerProps) {
  const {
    dayNumber,
    totalDays,
    phaseName,
    phaseNumber,
    currentStreak,
    honorScore,
  } = { ...defaultProps, ...props };

  const progress = dayNumber / totalDays;
  const radius = 80;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] p-6 md:p-8"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#C9A84C]/5 blur-3xl" />

      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg
            width={radius * 2 + strokeWidth * 2}
            height={radius * 2 + strokeWidth * 2}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="#1F1F1F"
              strokeWidth={strokeWidth}
            />
            {/* Progress */}
            <motion.circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#E8D48B" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-sm text-[#A3A3A3]">DAY</span>
            <span
              className="font-heading text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8D48B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {dayNumber}
            </span>
            <span className="font-mono text-xs text-[#525252]">OF {totalDays}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
          <div>
            <h1
              className="font-heading text-center text-2xl font-bold tracking-wider md:text-left md:text-3xl"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8D48B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DAY {dayNumber} OF {totalDays}
            </h1>
            <p className="mt-1 text-center text-sm text-[#A3A3A3] md:text-left">
              The war is won one day at a time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Phase badge */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-xs font-medium text-[#C9A84C]">
              <Shield className="h-3 w-3" />
              Phase {phaseNumber}: {phaseName}
            </span>

            {/* Streak */}
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-md border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            >
              <Flame className="h-3 w-3" />
              {currentStreak} Day Streak
            </motion.span>
          </div>

          {/* Honor Score */}
          <div className="w-full max-w-xs">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-[#A3A3A3]">HONOR SCORE</span>
              <span className="font-mono text-xs text-[#C9A84C]">{honorScore}/100</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1F1F1F]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #C9A84C, #E8D48B)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${honorScore}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
