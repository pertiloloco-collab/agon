"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, Star, Check, ShieldAlert } from "lucide-react";
import type { Reward, ForgeEligibility } from "@/lib/drachma/engine";

interface RewardCardProps {
  reward: Reward;
  currentBalance: number;
  eligibility: ForgeEligibility;
  onClick?: () => void;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  small: {
    bg: "bg-[#C0C0C0]/10",
    text: "text-[#C0C0C0]",
    border: "border-[#C0C0C0]/30",
    label: "Silver",
  },
  medium: {
    bg: "bg-[#CD7F32]/10",
    text: "text-[#CD7F32]",
    border: "border-[#CD7F32]/30",
    label: "Bronze",
  },
  large: {
    bg: "bg-[#C9A84C]/10",
    text: "text-[#C9A84C]",
    border: "border-[#C9A84C]/30",
    label: "Gold",
  },
  epic: {
    bg: "bg-[#9B59B6]/10",
    text: "text-[#9B59B6]",
    border: "border-[#9B59B6]/30",
    label: "Epic",
  },
  legendary: {
    bg: "bg-[#00CED1]/10",
    text: "text-[#00CED1]",
    border: "border-[#00CED1]/30",
    label: "Legendary",
  },
};

const CATEGORY_EMOJI: Record<string, string> = {
  gear: "\u{1F3CB}",
  experience: "\u2728",
  food: "\u{1F969}",
  travel: "\u2708\uFE0F",
  tech: "\u{1F4BB}",
  custom: "\u2B50",
};

export function RewardCard({
  reward,
  currentBalance,
  eligibility,
  onClick,
}: RewardCardProps) {
  const tier = TIER_COLORS[reward.tier] || TIER_COLORS.small;
  const progress = Math.min((currentBalance / reward.cost) * 100, 100);
  const isForged = reward.status === "forged";
  const isUnlocked = eligibility.eligible && !isForged;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xl border bg-[#111111] text-left transition-all",
        isUnlocked
          ? "border-[#C9A84C]/40 gold-glow-sm"
          : "border-[#1F1F1F] hover:border-[#333333]",
        isForged && "opacity-80"
      )}
    >
      {/* Image / thumbnail area */}
      <div
        className={cn(
          "relative flex h-32 items-center justify-center",
          "bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]"
        )}
      >
        <span className="text-4xl">{CATEGORY_EMOJI[reward.category] || "\u2B50"}</span>

        {/* Priority star */}
        {reward.isPriority && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A84C]/20">
            <Star className="h-3.5 w-3.5 fill-[#C9A84C] text-[#C9A84C]" />
          </div>
        )}

        {/* Lock overlay */}
        {!eligibility.eligible && !isForged && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            {eligibility.reasons.some((r) => r.includes("rank")) ? (
              <ShieldAlert className="h-8 w-8 text-[#525252]" />
            ) : (
              <Lock className="h-8 w-8 text-[#525252]" />
            )}
          </div>
        )}

        {/* Forged stamp overlay */}
        {isForged && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="rotate-[-12deg] rounded-lg border-2 border-[#C9A84C] px-4 py-1">
              <span className="font-heading text-lg font-bold tracking-widest text-[#C9A84C]">
                FORGED
              </span>
            </div>
          </div>
        )}

        {/* Unlocked glow pulse */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-t-xl border-t border-[#C9A84C]/20"
            animate={{
              boxShadow: [
                "inset 0 0 20px rgba(201, 168, 76, 0.05)",
                "inset 0 0 30px rgba(201, 168, 76, 0.12)",
                "inset 0 0 20px rgba(201, 168, 76, 0.05)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + tier */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold text-[#F5F5F5] line-clamp-1">
            {reward.name}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
              tier.bg,
              tier.text,
              tier.border
            )}
          >
            {tier.label}
          </span>
        </div>

        {/* Price */}
        <div className="font-mono text-lg font-bold tabular-nums text-[#C9A84C]">
          {reward.cost.toLocaleString()}₯
        </div>

        {/* Progress bar */}
        {!isForged && (
          <div className="space-y-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#1F1F1F]">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  isUnlocked
                    ? "bg-gradient-to-r from-[#C9A84C] to-[#E5D494]"
                    : "bg-[#C9A84C]/40"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#525252]">
              <span className="font-mono">
                {currentBalance.toLocaleString()} / {reward.cost.toLocaleString()}₯
              </span>
              {isUnlocked && (
                <span className="flex items-center gap-0.5 text-[#C9A84C]">
                  <Check className="h-3 w-3" /> Ready
                </span>
              )}
            </div>
          </div>
        )}

        {/* Forged date */}
        {isForged && reward.forgedAt && (
          <div className="flex items-center gap-1 text-[10px] text-[#525252]">
            <Check className="h-3 w-3 text-[#C9A84C]" />
            <span>
              Forged{" "}
              {new Date(reward.forgedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
