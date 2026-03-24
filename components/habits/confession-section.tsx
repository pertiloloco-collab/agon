"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { AgonHabit } from "@/lib/habits/defaults";
import { formatDrachma } from "@/lib/habits/engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfessionSectionProps {
  badHabits: AgonHabit[];
  onSubmit: (confessedHabitIds: string[]) => void;
  disabled?: boolean;
}

export function ConfessionSection({
  badHabits,
  onSubmit,
  disabled = false,
}: ConfessionSectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleHabit = useCallback((habitId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(habitId)) {
        next.delete(habitId);
      } else {
        next.add(habitId);
      }
      return next;
    });
  }, []);

  const totalPenalty = badHabits
    .filter((h) => selected.has(h.id))
    .reduce((sum, h) => sum + h.drachma, 0);

  const handleSubmit = useCallback(() => {
    const ids = Array.from(selected);
    onSubmit(ids);
    setSubmitted(true);
  }, [selected, onSubmit]);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-6 text-center"
      >
        <ShieldAlert className="mx-auto mb-3 size-8 text-[#C9A84C]" />
        <p className="font-heading text-sm font-semibold text-[#F5F5F5]">
          CONFESSION RECORDED
        </p>
        <p className="mt-1 text-xs text-[#A3A3A3]">
          {selected.size === 0
            ? "Clean day. No slips. Keep it up, warrior."
            : `${selected.size} slip${selected.size > 1 ? "s" : ""} logged. ${formatDrachma(totalPenalty)} applied. Own it and move forward.`}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-5 text-red-400" />
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
            Confession
          </h3>
          <p className="text-xs text-[#A3A3A3]">
            Did you fall into any of these today?
          </p>
        </div>
      </div>

      {/* Bad habit checkboxes */}
      <div className="space-y-2">
        <AnimatePresence>
          {badHabits.map((habit, index) => {
            const isChecked = selected.has(habit.id);
            return (
              <motion.button
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => toggleHabit(habit.id)}
                disabled={disabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  isChecked
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-[#1F1F1F] bg-[#111111] hover:border-[#1F1F1F]/80"
                )}
              >
                {/* Custom checkbox */}
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
                    isChecked
                      ? "border-red-500 bg-red-500"
                      : "border-[#1F1F1F] bg-[#0A0A0A]"
                  )}
                >
                  {isChecked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="size-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </div>

                {/* Icon */}
                <span className="text-lg">{habit.icon}</span>

                {/* Name */}
                <span
                  className={cn(
                    "flex-1 text-sm",
                    isChecked ? "text-red-300" : "text-[#A3A3A3]"
                  )}
                >
                  {habit.name}
                </span>

                {/* Penalty */}
                <span className="font-mono text-xs text-red-400">
                  {formatDrachma(habit.drachma)}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary + Submit */}
      <div className="flex items-center justify-between pt-2">
        {selected.size > 0 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-red-400"
          >
            Total: {formatDrachma(totalPenalty)}
          </motion.span>
        )}
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          className={cn(
            "ml-auto font-heading text-xs font-bold uppercase tracking-widest",
            selected.size > 0
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-[#C9A84C] text-[#050505] hover:bg-[#C9A84C]/90"
          )}
        >
          {selected.size > 0
            ? `Submit Confession (${selected.size})`
            : "Clean Day \u2014 No Slips"}
        </Button>
      </div>
    </div>
  );
}
