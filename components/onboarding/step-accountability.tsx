"use client";

import { motion } from "framer-motion";
import { Shield, Swords, Skull } from "lucide-react";
import type { OnboardingData } from "@/app/onboarding/page";

interface StepAccountabilityProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

const levels: {
  value: OnboardingData["accountabilityLevel"];
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}[] = [
  {
    value: "firm",
    icon: <Shield className="h-8 w-8" />,
    title: "FIRM",
    subtitle: "Encouraging but direct",
    description:
      "I'll push you but keep it professional. Consistent reminders, honest feedback, and structured accountability without crossing personal lines.",
  },
  {
    value: "drill_sergeant",
    icon: <Swords className="h-8 w-8" />,
    title: "DRILL SERGEANT",
    subtitle: "In your face",
    description:
      "No excuses accepted. Every miss gets called out. I will question your commitment, challenge your discipline, and never let you off easy.",
  },
  {
    value: "emotional_warfare",
    icon: <Skull className="h-8 w-8" />,
    title: "EMOTIONAL WARFARE",
    subtitle: "Maximum intensity",
    description:
      "I use your deepest motivations against your laziness. Your family, your legacy, your pain. When you skip a workout, I remind you of everyone you'll disappoint. Maximum intensity.",
  },
];

export function StepAccountability({
  data,
  onChange,
}: StepAccountabilityProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 font-display text-3xl font-bold text-[#F5F5F5]">
          ACCOUNTABILITY LEVEL
        </h2>
        <p className="text-sm text-[#525252]">
          How hard do you want to be pushed?
        </p>
      </motion.div>

      <div className="space-y-4">
        {levels.map((level, i) => {
          const isSelected = data.accountabilityLevel === level.value;

          return (
            <motion.button
              key={level.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              onClick={() => onChange({ accountabilityLevel: level.value })}
              className={`group relative w-full rounded-xl border p-6 text-left transition-all ${
                isSelected
                  ? "border-[#C9A84C] bg-[#111111] shadow-[0_0_30px_rgba(201,168,76,0.15)]"
                  : "border-[#1F1F1F] bg-[#111111] hover:border-[#C9A84C]/30"
              }`}
            >
              {/* Gold glow for selected */}
              {isSelected && (
                <motion.div
                  layoutId="accountability-glow"
                  className="absolute inset-0 rounded-xl border border-[#C9A84C]/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative flex gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#1F1F1F] bg-[#050505] text-[#525252] group-hover:text-[#A3A3A3]"
                  }`}
                >
                  {level.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3
                      className={`font-display text-lg font-bold tracking-wider transition-colors ${
                        isSelected ? "text-[#C9A84C]" : "text-[#F5F5F5]"
                      }`}
                    >
                      {level.title}
                    </h3>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="rounded-full bg-[#C9A84C]/20 px-2 py-0.5 text-[10px] font-semibold text-[#C9A84C]"
                      >
                        SELECTED
                      </motion.span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-[#A3A3A3]">
                    {level.subtitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#525252]">
                    {level.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
