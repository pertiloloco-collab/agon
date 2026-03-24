"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { NUTRITION_PHASES } from "@/lib/training/nutrition";

interface MacroProgress {
  current: number;
  target: number;
}

interface MacroDashboardProps {
  calories?: MacroProgress;
  protein?: MacroProgress;
  fat?: MacroProgress;
  carbs?: MacroProgress;
  phase?: number;
}

const DEFAULT_PHASE = 1;

function getStatusColor(pct: number): string {
  if (pct >= 0.9 && pct <= 1.1) return "#22C55E"; // green — on track
  if (pct >= 0.75 && pct <= 1.25) return "#F59E0B"; // amber — close
  return "#DC2626"; // red — way off
}

interface RingProps {
  label: string;
  unit: string;
  current: number;
  target: number;
  delay: number;
}

function MacroRing({ label, unit, current, target, delay }: RingProps) {
  const pct = target > 0 ? current / target : 0;
  const clampedPct = Math.min(pct, 1);
  const color = getStatusColor(pct);

  const radius = 44;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedPct);

  const remaining = Math.max(0, target - current);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width={112}
          height={112}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={56}
            cy={56}
            r={radius}
            fill="none"
            stroke="#1F1F1F"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={56}
            cy={56}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-bold text-[#F5F5F5]">
            {current}
          </span>
          <span className="font-mono text-[10px] text-[#525252]">
            / {target}
            {unit}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">
        {label}
      </span>
      {remaining > 0 && (
        <span className="font-mono text-[10px] text-[#525252]">
          {remaining}
          {unit} left
        </span>
      )}
    </div>
  );
}

export function MacroDashboard({
  calories,
  protein,
  fat,
  carbs,
  phase = DEFAULT_PHASE,
}: MacroDashboardProps) {
  const targets = useMemo(() => {
    return NUTRITION_PHASES[phase] || NUTRITION_PHASES[1];
  }, [phase]);

  const cal = calories || { current: 0, target: targets.calories };
  const pro = protein || { current: 0, target: targets.protein };
  const f = fat || { current: 0, target: targets.fat };
  const c = carbs || { current: 0, target: targets.carbs };

  // Use protein target to calculate remaining needed
  const proteinRemaining = Math.max(0, pro.target - pro.current);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-6"
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold tracking-wider text-[#C9A84C] uppercase">
          Daily Macros
        </h3>
        <span className="font-mono text-[10px] text-[#525252] uppercase">
          {targets.strategy}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <MacroRing
          label="Calories"
          unit="kcal"
          current={cal.current}
          target={cal.target}
          delay={0}
        />
        <MacroRing
          label="Protein"
          unit="g"
          current={pro.current}
          target={pro.target}
          delay={0.1}
        />
        <MacroRing
          label="Fat"
          unit="g"
          current={f.current}
          target={f.target}
          delay={0.2}
        />
        <MacroRing
          label="Carbs"
          unit="g"
          current={c.current}
          target={c.target}
          delay={0.3}
        />
      </div>

      {/* Suggestion text */}
      {proteinRemaining > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-5 text-center text-sm text-[#A3A3A3]"
        >
          You need{" "}
          <span className="font-mono font-bold text-[#C9A84C]">
            {proteinRemaining}g
          </span>{" "}
          more protein today
        </motion.p>
      )}
    </motion.div>
  );
}
