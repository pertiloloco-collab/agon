"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

interface DrachmaWidgetProps {
  balance?: number;
  last7DaysEarned?: number;
  nearestReward?: {
    name: string;
    cost: number;
  };
}

export function DrachmaWidget({
  balance = 2450,
  last7DaysEarned = 350,
  nearestReward = { name: "New Training Gloves", cost: 3000 },
}: DrachmaWidgetProps) {
  const dailyAvg = useMemo(
    () => Math.round(last7DaysEarned / 7),
    [last7DaysEarned]
  );
  const rewardProgress = useMemo(
    () =>
      nearestReward.cost > 0
        ? Math.min(balance / nearestReward.cost, 1)
        : 0,
    [balance, nearestReward.cost]
  );
  const remaining = Math.max(0, nearestReward.cost - balance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-[#C9A84C]" />
          <h3 className="font-heading text-sm font-bold tracking-wider text-[#C9A84C] uppercase">
            Drachma
          </h3>
        </div>
        <Link
          href="/dashboard/forge"
          className="text-[10px] font-mono text-[#525252] hover:text-[#A3A3A3] transition-colors uppercase tracking-wider"
        >
          Forge &rarr;
        </Link>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-[#C9A84C]">
            {balance.toLocaleString()}
          </span>
          <span className="font-mono text-sm text-[#8B7432]">{"\u20AF"}</span>
        </div>
      </div>

      {/* Earning rate */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" />
        <span className="font-mono text-xs text-[#22C55E]">
          +{dailyAvg}
          {"\u20AF"}/day avg
        </span>
        <span className="text-[10px] text-[#525252]">last 7 days</span>
      </div>

      {/* Nearest reward */}
      <div className="rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-3.5 w-3.5 text-[#C9A84C]" />
          <span className="text-xs font-medium text-[#F5F5F5]">
            {nearestReward.name}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1F1F1F]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #C9A84C, #E8D48B)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${rewardProgress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#525252]">
            {balance.toLocaleString()} / {nearestReward.cost.toLocaleString()}
            {"\u20AF"}
          </span>
          <span className="font-mono text-[10px] text-[#C9A84C]">
            {remaining.toLocaleString()}
            {"\u20AF"} to go
          </span>
        </div>
      </div>
    </motion.div>
  );
}
