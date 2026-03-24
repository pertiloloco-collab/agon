"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  CalendarX,
  Flame,
  TrendingDown,
  UtensilsCrossed,
  CheckCircle2,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TriggerType =
  | "missed_workout"
  | "missed_two_days"
  | "broken_streak"
  | "low_honor"
  | "missed_nutrition";

interface SanctionCardProps {
  id: string;
  triggerType: TriggerType;
  description: string;
  triggeredDate: string;
  fulfilled: boolean;
  onUploadProof?: (id: string) => void;
}

const triggerIcons: Record<TriggerType, React.ReactNode> = {
  missed_workout: <Dumbbell className="h-5 w-5" />,
  missed_two_days: <CalendarX className="h-5 w-5" />,
  broken_streak: <Flame className="h-5 w-5" />,
  low_honor: <TrendingDown className="h-5 w-5" />,
  missed_nutrition: <UtensilsCrossed className="h-5 w-5" />,
};

const triggerLabels: Record<TriggerType, string> = {
  missed_workout: "Missed Workout",
  missed_two_days: "Missed 2 Days",
  broken_streak: "Broken Streak",
  low_honor: "Low Honor",
  missed_nutrition: "Missed Nutrition",
};

export function SanctionCard({
  id,
  triggerType,
  description,
  triggeredDate,
  fulfilled,
  onUploadProof,
}: SanctionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const redAccent = fulfilled ? "#22C55E" : "#DC2626";
  const darkRed = "#8B0000";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-[#111111] p-4",
        fulfilled
          ? "border-[#22C55E]/30"
          : "border-[#DC2626]/40"
      )}
      style={
        !fulfilled
          ? {
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.15), inset 0 0 20px rgba(220, 38, 38, 0.05)",
              animation: "sanctionPulse 2s ease-in-out infinite",
            }
          : undefined
      }
    >
      {/* Pulsing glow keyframes injected via style tag */}
      {!fulfilled && (
        <style>{`
          @keyframes sanctionPulse {
            0%, 100% { box-shadow: 0 0 15px rgba(220, 38, 38, 0.1), inset 0 0 15px rgba(220, 38, 38, 0.03); }
            50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.25), inset 0 0 25px rgba(220, 38, 38, 0.08); }
          }
        `}</style>
      )}

      {/* Background accent */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: fulfilled ? "rgba(34,197,94,0.06)" : "rgba(220,38,38,0.06)" }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
          style={{
            borderColor: fulfilled ? "rgba(34,197,94,0.3)" : `${darkRed}66`,
            backgroundColor: fulfilled ? "rgba(34,197,94,0.1)" : `${darkRed}1A`,
            color: redAccent,
          }}
        >
          {triggerIcons[triggerType] ?? <AlertTriangle className="h-5 w-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="font-heading text-sm font-semibold uppercase tracking-wider"
              style={{ color: fulfilled ? "#22C55E" : "#DC2626" }}
            >
              {triggerLabels[triggerType]}
            </span>

            {fulfilled && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#22C55E]"
              >
                <CheckCircle2 className="h-3 w-3" />
                Redeemed
              </motion.span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[#A3A3A3]">{description}</p>

          <p className="mt-2 font-mono text-[11px] text-[#525252]">
            Triggered: {triggeredDate}
          </p>
        </div>
      </div>

      {/* Proof upload button */}
      {!fulfilled && onUploadProof && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onUploadProof(id)}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5",
            "border-[#DC2626]/30 bg-[#DC2626]/5 font-mono text-xs text-[#DC2626]",
            "transition-colors hover:border-[#DC2626]/50 hover:bg-[#DC2626]/10"
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Proof of Completion
        </motion.button>
      )}
    </motion.div>
  );
}
