"use client";

import { motion } from "framer-motion";
import {
  Dumbbell,
  CalendarX,
  Flame,
  TrendingDown,
  UtensilsCrossed,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FailureType =
  | "missed_workout"
  | "missed_two_days"
  | "broken_streak"
  | "low_honor"
  | "missed_nutrition";

interface SanctionRow {
  key: FailureType;
  icon: React.ReactNode;
  trigger: string;
  defaultConsequence: string;
}

export interface SanctionSetupData {
  missed_workout: string;
  missed_two_days: string;
  broken_streak: string;
  low_honor: string;
  missed_nutrition: string;
}

interface SanctionSetupProps {
  data: SanctionSetupData;
  onChange: (updates: Partial<SanctionSetupData>) => void;
}

const sanctionRows: SanctionRow[] = [
  {
    key: "missed_workout",
    icon: <Dumbbell className="h-5 w-5" />,
    trigger: "Missed workout",
    defaultConsequence: "Cold shower \u2014 video proof required",
  },
  {
    key: "missed_two_days",
    icon: <CalendarX className="h-5 w-5" />,
    trigger: "Missed 2 consecutive days",
    defaultConsequence: "Why letter read aloud",
  },
  {
    key: "broken_streak",
    icon: <Flame className="h-5 w-5" />,
    trigger: "Broken 7+ day streak",
    defaultConsequence: "No entertainment for 48 hours",
  },
  {
    key: "low_honor",
    icon: <TrendingDown className="h-5 w-5" />,
    trigger: "Honor score below 50 for a week",
    defaultConsequence: "AI disappointment letter",
  },
  {
    key: "missed_nutrition",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    trigger: "Missed nutrition 3+ days",
    defaultConsequence: "Mandatory meal prep Sunday \u2014 photo proof",
  },
];

export function SanctionSetup({ data, onChange }: SanctionSetupProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 font-heading text-3xl font-bold text-[#F5F5F5]">
          SANCTIONS
        </h2>
        <p className="mx-auto max-w-md text-sm text-[#525252]">
          Configure the consequences for failure. These are your rules. Break
          them and pay the price.
        </p>
      </motion.div>

      <div className="space-y-4">
        {sanctionRows.map((row, i) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * (i + 1) }}
            className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1F1F1F] bg-[#050505] text-[#C9A84C]">
                {row.icon}
              </div>
              <Label className="text-sm font-semibold text-[#F5F5F5]">
                {row.trigger}
              </Label>
            </div>
            <Input
              value={data[row.key]}
              onChange={(e) => onChange({ [row.key]: e.target.value })}
              placeholder={row.defaultConsequence}
              className="border-[#1F1F1F] bg-[#050505] text-sm text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
