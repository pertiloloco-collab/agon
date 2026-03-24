"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Scale, Shield, Skull, Swords, Zap } from "lucide-react";
import type { OnboardingData } from "@/app/onboarding/page";

interface StepOathProps {
  data: OnboardingData;
  onComplete: () => Promise<void>;
}

const accountabilityLabels: Record<
  OnboardingData["accountabilityLevel"],
  { label: string; icon: React.ReactNode }
> = {
  firm: { label: "Firm", icon: <Shield className="h-4 w-4" /> },
  drill_sergeant: {
    label: "Drill Sergeant",
    icon: <Swords className="h-4 w-4" />,
  },
  emotional_warfare: {
    label: "Emotional Warfare",
    icon: <Skull className="h-4 w-4" />,
  },
};

export function StepOath({ data, onComplete }: StepOathProps) {
  const [committed, setCommitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountability = accountabilityLabels[data.accountabilityLevel];

  const endDate = (() => {
    if (!data.startDate) return "---";
    const start = new Date(data.startDate);
    start.setDate(start.getDate() + 365);
    return start.toISOString().split("T")[0];
  })();

  const handleCommit = async () => {
    setCommitted(true);
    setIsSubmitting(true);
    try {
      await onComplete();
    } catch {
      setIsSubmitting(false);
      setCommitted(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mx-auto mb-6 inline-flex"
        >
          <div className="absolute inset-0 rounded-full bg-[#C9A84C]/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#111111]">
            <Scale className="h-10 w-10 text-[#C9A84C]" />
          </div>
        </motion.div>

        <h2 className="mb-2 font-display text-4xl font-bold tracking-wider text-[#C9A84C]">
          THE OATH
        </h2>
        <p className="text-sm text-[#525252]">
          Read this carefully. There is no going back.
        </p>
      </motion.div>

      {/* Commitment summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 rounded-xl border border-[#1F1F1F] bg-[#111111] p-6"
      >
        <p className="mb-6 text-center font-display text-lg leading-relaxed text-[#F5F5F5]">
          I commit to{" "}
          <span className="text-[#C9A84C]">365 days</span> of transformation.
        </p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[#1F1F1F] bg-[#050505] p-3 text-center">
            <p className="text-xs text-[#525252]">Starting Weight</p>
            <p className="font-mono text-xl text-[#F5F5F5]">
              {data.currentWeight}
              <span className="text-sm text-[#525252]">kg</span>
            </p>
          </div>
          <div className="rounded-lg border border-[#1F1F1F] bg-[#050505] p-3 text-center">
            <p className="text-xs text-[#525252]">Target Weight</p>
            <p className="font-mono text-xl text-[#C9A84C]">
              {data.targetWeight}
              <span className="text-sm text-[#C9A84C]/50">kg</span>
            </p>
          </div>
          <div className="rounded-lg border border-[#1F1F1F] bg-[#050505] p-3 text-center">
            <p className="text-xs text-[#525252]">Start Date</p>
            <p className="font-mono text-sm text-[#F5F5F5]">
              {data.startDate}
            </p>
          </div>
          <div className="rounded-lg border border-[#1F1F1F] bg-[#050505] p-3 text-center">
            <p className="text-xs text-[#525252]">End Date</p>
            <p className="font-mono text-sm text-[#F5F5F5]">{endDate}</p>
          </div>
        </div>

        {/* Accountability level */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#050505] p-3">
          <span className="text-[#C9A84C]">{accountability.icon}</span>
          <span className="text-xs text-[#525252]">Accountability:</span>
          <span className="font-display text-sm font-semibold tracking-wider text-[#F5F5F5]">
            {accountability.label}
          </span>
        </div>

        {/* Sanctions summary */}
        <div className="space-y-2">
          <p className="mb-2 text-center text-xs font-semibold tracking-wider text-[#525252]">
            SANCTIONS
          </p>
          {Object.entries(data.sanctions).map(([, value]) => (
            <div
              key={value}
              className="flex items-center gap-2 text-xs text-[#A3A3A3]"
            >
              <Zap className="h-3 w-3 shrink-0 text-[#C9A84C]/50" />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Commit button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        {!committed ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCommit}
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden rounded-xl border border-[#C9A84C] bg-[#C9A84C] py-5 font-display text-xl font-bold tracking-[0.3em] text-[#050505] transition-all hover:shadow-[0_0_60px_rgba(201,168,76,0.3)] disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Flame className="h-6 w-6" />
              I COMMIT
              <Flame className="h-6 w-6" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] via-white/30 to-[#C9A84C]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(201,168,76,0.2)",
                  "0 0 60px rgba(201,168,76,0.4)",
                  "0 0 20px rgba(201,168,76,0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-24 w-24 items-center justify-center rounded-full border border-[#C9A84C] bg-[#C9A84C]/10"
            >
              <Flame className="h-12 w-12 text-[#C9A84C]" />
            </motion.div>
            <p className="font-display text-2xl font-bold tracking-wider text-[#C9A84C]">
              IT IS DONE.
            </p>
            <p className="text-sm text-[#525252]">
              {isSubmitting
                ? "Preparing your transformation..."
                : "Redirecting to your dashboard..."}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
