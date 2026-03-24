"use client";

import { motion } from "framer-motion";
import { Ruler, Weight, Target, Calendar, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { OnboardingData } from "@/app/onboarding/page";

interface StepStatsProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

export function StepStats({ data, onChange }: StepStatsProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 font-display text-3xl font-bold text-[#F5F5F5]">
          YOUR STATS
        </h2>
        <p className="text-sm text-[#525252]">
          Where you stand today. No judgment. Just data.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Height */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Ruler className="h-4 w-4 text-[#C9A84C]" />
            Height (cm)
          </Label>
          <Input
            type="number"
            value={data.height || ""}
            onChange={(e) =>
              onChange({ height: parseFloat(e.target.value) || 0 })
            }
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            placeholder="175"
          />
        </motion.div>

        {/* Current Weight */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Weight className="h-4 w-4 text-[#C9A84C]" />
            Current Weight (kg)
          </Label>
          <Input
            type="number"
            value={data.currentWeight || ""}
            onChange={(e) =>
              onChange({ currentWeight: parseFloat(e.target.value) || 0 })
            }
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            placeholder="80"
          />
        </motion.div>

        {/* Target Weight */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Target className="h-4 w-4 text-[#C9A84C]" />
            Target Weight (kg)
          </Label>
          <Input
            type="number"
            value={data.targetWeight || ""}
            onChange={(e) =>
              onChange({ targetWeight: parseFloat(e.target.value) || 0 })
            }
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            placeholder="75"
          />
        </motion.div>

        {/* Age */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Calendar className="h-4 w-4 text-[#C9A84C]" />
            Age
          </Label>
          <Input
            type="number"
            value={data.age || ""}
            onChange={(e) =>
              onChange({ age: parseInt(e.target.value) || 0 })
            }
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
            placeholder="30"
          />
        </motion.div>

        {/* Body Fat Estimate */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-3 flex items-center justify-between text-[#A3A3A3]">
            <span className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-[#C9A84C]" />
              Body Fat Estimate (optional)
            </span>
            <span className="font-mono text-lg text-[#F5F5F5]">
              {data.bodyFatEstimate}%
            </span>
          </Label>
          <Slider
            value={[data.bodyFatEstimate]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val;
              onChange({ bodyFatEstimate: v });
            }}
            min={5}
            max={50}
            step={1}
          />
          <div className="mt-2 flex justify-between text-xs text-[#525252]">
            <span>5%</span>
            <span>50%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
