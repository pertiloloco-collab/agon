"use client";

import { motion } from "framer-motion";
import { Check, Flame, AlertTriangle, Zap } from "lucide-react";
import type { AgonHabit } from "@/lib/habits/defaults";
import { formatDrachma, formatFrequency } from "@/lib/habits/engine";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCallback, useState } from "react";

interface HabitCardProps {
  habit: AgonHabit;
  onLog: (habitId: string, value?: number) => void;
  todayLogged: boolean;
  streak: number;
  daysClean?: number;
}

export function HabitCard({
  habit,
  onLog,
  todayLogged,
  streak,
  daysClean,
}: HabitCardProps) {
  const [confirmSlip, setConfirmSlip] = useState(false);
  const isGood = habit.type === "good";
  const drachmaText = formatDrachma(habit.drachma);
  const freqText = formatFrequency(habit.frequency);

  const handleLog = useCallback(() => {
    if (isGood) {
      onLog(habit.id);
    }
  }, [isGood, onLog, habit.id]);

  const handleSlipConfirm = useCallback(() => {
    onLog(habit.id);
    setConfirmSlip(false);
  }, [onLog, habit.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border p-4 transition-colors",
        "bg-[#111111] border-[#1F1F1F]",
        isGood && todayLogged && "border-emerald-500/30 bg-emerald-500/5",
        !isGood && todayLogged && "border-red-500/30 bg-red-500/5",
        isGood && !todayLogged && "hover:border-emerald-500/20",
        !isGood && !todayLogged && "hover:border-red-500/20"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl",
          isGood ? "bg-emerald-500/10" : "bg-red-500/10"
        )}
      >
        {habit.icon}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-heading text-sm font-semibold text-[#F5F5F5]">
            {habit.name}
          </span>
          <Badge
            className={cn(
              "shrink-0 text-[10px] font-mono",
              isGood
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/15 text-red-400 border-red-500/20"
            )}
          >
            {drachmaText}
          </Badge>
        </div>

        <p className="line-clamp-1 text-xs text-[#A3A3A3]">
          {habit.description}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <Badge
            variant="outline"
            className="text-[10px] text-[#525252] border-[#1F1F1F] px-1.5"
          >
            {freqText}
          </Badge>

          {habit.source === "agon" ? (
            <Badge
              variant="outline"
              className="text-[10px] text-[#C9A84C] border-[#C9A84C]/30 px-1.5"
            >
              AGON
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] text-[#A3A3A3] border-[#1F1F1F] px-1.5"
            >
              CUSTOM
            </Badge>
          )}

          {/* Streak / Days Clean */}
          {isGood && streak > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#C9A84C]">
              <Flame className="size-3" />
              {streak}d
            </span>
          )}
          {!isGood && daysClean !== undefined && daysClean >= 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <Zap className="size-3" />
              {daysClean}d clean
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isGood ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLog}
            disabled={todayLogged}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border transition-all",
              todayLogged
                ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 cursor-default"
                : "border-[#1F1F1F] bg-[#0A0A0A] text-[#525252] hover:border-emerald-500/40 hover:text-emerald-400"
            )}
            aria-label={todayLogged ? `${habit.name} completed` : `Log ${habit.name}`}
          >
            <Check className="size-5" strokeWidth={todayLogged ? 3 : 2} />
          </motion.button>
        ) : (
          <>
            {confirmSlip ? (
              <div className="flex items-center gap-1.5">
                <Button
                  size="xs"
                  variant="destructive"
                  onClick={handleSlipConfirm}
                  className="text-[10px]"
                >
                  Confirm
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setConfirmSlip(false)}
                  className="text-[10px] text-[#525252]"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmSlip(true)}
                disabled={todayLogged}
                className={cn(
                  "text-[10px] font-mono uppercase tracking-wider",
                  todayLogged
                    ? "border-red-500/30 text-red-400/50 cursor-default"
                    : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                )}
              >
                {todayLogged ? (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="size-3" /> Logged
                  </span>
                ) : (
                  "LOG SLIP"
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
