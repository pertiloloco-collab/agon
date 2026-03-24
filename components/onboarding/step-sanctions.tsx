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
import type { OnboardingData } from "@/app/onboarding/page";

interface StepSanctionsProps {
  data: OnboardingData;
  onChangeSanctions: (updates: Partial<OnboardingData["sanctions"]>) => void;
}

const sanctions: {
  key: keyof OnboardingData["sanctions"];
  icon: React.ReactNode;
  trigger: string;
  defaultValue: string;
}[] = [
  {
    key: "missedWorkout",
    icon: <Dumbbell className="h-5 w-5" />,
    trigger: "Missed workout",
    defaultValue: "Cold shower \u2014 video proof required",
  },
  {
    key: "missedTwoDays",
    icon: <CalendarX className="h-5 w-5" />,
    trigger: "Missed 2 consecutive days",
    defaultValue: "Why letter read aloud",
  },
  {
    key: "brokenStreak",
    icon: <Flame className="h-5 w-5" />,
    trigger: "Broken 7+ day streak",
    defaultValue: "No entertainment for 48 hours",
  },
  {
    key: "lowHonor",
    icon: <TrendingDown className="h-5 w-5" />,
    trigger: "Honor score below 50 for a week",
    defaultValue: "AI disappointment letter",
  },
  {
    key: "missedNutrition",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    trigger: "Missed nutrition 3+ days",
    defaultValue: "Mandatory meal prep Sunday \u2014 photo proof",
  },
];

export function StepSanctions({ data, onChangeSanctions }: StepSanctionsProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 font-display text-3xl font-bold text-[#F5F5F5]">
          SANCTIONS
        </h2>
        <p className="mx-auto max-w-md text-sm text-[#525252]">
          Configure the consequences for failure. These are your rules. Break
          them and pay the price.
        </p>
      </motion.div>

      <div className="space-y-4">
        {sanctions.map((sanction, i) => (
          <motion.div
            key={sanction.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * (i + 1) }}
            className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1F1F1F] bg-[#050505] text-[#C9A84C]">
                {sanction.icon}
              </div>
              <Label className="text-sm font-semibold text-[#F5F5F5]">
                {sanction.trigger}
              </Label>
            </div>
            <Input
              value={data.sanctions[sanction.key]}
              onChange={(e) =>
                onChangeSanctions({ [sanction.key]: e.target.value })
              }
              placeholder={sanction.defaultValue}
              className="border-[#1F1F1F] bg-[#050505] text-sm text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
