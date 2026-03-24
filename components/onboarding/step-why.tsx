"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingData } from "@/app/onboarding/page";

interface StepWhyProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

const MIN_CHARS = 50;

export function StepWhy({ data, onChange }: StepWhyProps) {
  const charCount = data.whyText.length;
  const isValid = charCount >= MIN_CHARS;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#111111]">
            <Heart className="h-8 w-8 text-[#C9A84C]" />
          </div>
        </div>
        <h2 className="mb-3 font-display text-3xl font-bold text-[#F5F5F5]">
          BEFORE WE BEGIN, TELL ME WHY.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[#A3A3A3]">
          Not the surface reason. The real one. The one that makes you
          emotional. The one you whisper to yourself at 3 AM. Write it here.
          This goes into your Why Vault — and it will be used to hold you
          accountable when you want to quit.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Textarea
          value={data.whyText}
          onChange={(e) => onChange({ whyText: e.target.value })}
          placeholder="I'm doing this because..."
          rows={8}
          className="min-h-[200px] resize-none border-[#1F1F1F] bg-[#111111] text-base leading-relaxed text-[#F5F5F5] placeholder:text-[#525252] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#525252]">
            This will be stored in your Why Vault.
          </p>
          <span
            className={`font-mono text-xs transition-colors ${
              isValid ? "text-[#C9A84C]" : "text-[#525252]"
            }`}
          >
            {charCount}/{MIN_CHARS} min
          </span>
        </div>

        {charCount > 0 && !isValid && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs text-[#C9A84C]/70"
          >
            Keep going. Dig deeper. {MIN_CHARS - charCount} more characters.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
