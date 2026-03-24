"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

interface HabitScoreProps {
  habits?: Habit[];
}

const defaultHabits: Habit[] = [
  { id: "1", name: "Morning workout", completed: true },
  { id: "2", name: "Log meals", completed: true },
  { id: "3", name: "10,000 steps", completed: false },
  { id: "4", name: "8 hours sleep", completed: true },
  { id: "5", name: "Drink 3L water", completed: false },
  { id: "6", name: "Read 20 pages", completed: false },
  { id: "7", name: "Evening debrief", completed: true },
];

export function HabitScore({ habits = defaultHabits }: HabitScoreProps) {
  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits]
  );
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const uncompleted = useMemo(
    () => habits.filter((h) => !h.completed).slice(0, 3),
    [habits]
  );

  // SVG ring
  const radius = 52;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] p-4 md:p-6"
    >
      <div className="flex items-start gap-5">
        {/* Circular progress ring */}
        <div className="relative shrink-0">
          <svg
            width={(radius + strokeWidth) * 2}
            height={(radius + strokeWidth) * 2}
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
              stroke="url(#habitGoldGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient
                id="habitGoldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#E8D48B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-heading text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #E8D48B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {Math.round(percentage)}%
            </span>
            <span className="font-mono text-[10px] text-[#525252]">DONE</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 font-heading text-sm font-semibold uppercase tracking-wider text-[#F5F5F5]">
            Today&apos;s Habits
          </h3>
          <p className="mb-3 font-mono text-xs text-[#C9A84C]">
            {completedCount}/{totalCount} habits done
          </p>

          {/* Uncompleted habits */}
          {uncompleted.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#525252]">
                Still to do
              </p>
              {uncompleted.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-2 text-sm text-[#A3A3A3]"
                >
                  <Circle className="h-3.5 w-3.5 shrink-0 text-[#525252]" />
                  <span className="truncate text-xs">{habit.name}</span>
                </div>
              ))}
            </div>
          )}

          {uncompleted.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-[#22C55E]">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">All habits completed!</span>
            </div>
          )}

          {/* Link */}
          <Link
            href="/dashboard/habits"
            className={cn(
              "mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#C9A84C] transition-colors hover:text-[#E8D48B]"
            )}
          >
            View all habits
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
