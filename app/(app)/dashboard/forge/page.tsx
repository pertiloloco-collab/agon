"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Flame, ScrollText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DrachmaDisplay } from "@/components/forge/drachma-display";
import { RewardCard } from "@/components/forge/reward-card";
import { GiftWorkshopPanel } from "@/components/forge/gift-workshop-panel";
import type { NewRewardData } from "@/components/forge/gift-workshop-panel";
import { ForgeAnimation } from "@/components/forge/forge-animation";
import { TransactionLedger } from "@/components/forge/transaction-ledger";
import type {
  Reward,
  DrachmaBalance,
  LedgerEntry,
  ForgeEligibility,
} from "@/lib/drachma/engine";
import { canForgeReward } from "@/lib/drachma/engine";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ForgePage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [balance, setBalance] = useState<DrachmaBalance | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const [forgeAnim, setForgeAnim] = useState<{
    active: boolean;
    name: string;
    cost: number;
  }>({ active: false, name: "", cost: 0 });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [rewardsRes, balanceRes, ledgerRes] = await Promise.all([
        fetch("/api/rewards"),
        fetch("/api/drachma"),
        fetch("/api/drachma/ledger"),
      ]);

      const rewardsData = await rewardsRes.json();
      const balanceData = await balanceRes.json();
      const ledgerData = await ledgerRes.json();

      setRewards(rewardsData.rewards || []);
      setBalance(balanceData.balance || null);
      setLedger(ledgerData.entries || []);
    } catch (err) {
      console.error("Failed to fetch forge data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeRewards = rewards.filter((r) => r.status === "active");
  const forgedRewards = rewards.filter((r) => r.status === "forged");
  const draftRewards = rewards.filter((r) => r.status === "draft");

  const getEligibility = (reward: Reward): ForgeEligibility => {
    if (!balance) return { eligible: false, reasons: ["Loading..."] };
    return canForgeReward(balance.userId, reward.id, 0, 100, []);
  };

  const handleForgeNewGoal = async (data: NewRewardData) => {
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "active" }),
      });
      setWorkshopOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to create reward:", err);
    }
  };

  const handleSaveDraft = async (data: NewRewardData) => {
    try {
      await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "draft" }),
      });
      setWorkshopOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  const handleForgeComplete = () => {
    setForgeAnim({ active: false, name: "", cost: 0 });
    fetchData();
  };

  // Calculate weekly average (mock: sum of last 7 earning entries / 1 week)
  const weeklyAverage =
    ledger
      .filter((e) => e.amount > 0)
      .slice(0, 7)
      .reduce((sum, e) => sum + e.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-6 md:px-8 md:py-8">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]/10">
              <Flame className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-wide text-[#F5F5F5]">
                THE FORGE
              </h1>
              {balance && (
                <p className="text-xs text-[#525252]">
                  Rank: {balance.rank.name} ({balance.cumulative.toLocaleString()}₯ lifetime)
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DrachmaDisplay
              balance={balance?.current ?? 0}
              showRate
              weeklyAverage={weeklyAverage}
              size="lg"
            />
          </div>
        </motion.div>

        {/* Forge New Goal Button */}
        <motion.div variants={fadeUp}>
          <button
            onClick={() => setWorkshopOpen(true)}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9A84C]/20 bg-[#C9A84C]/5 px-4 py-3 transition-all hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/10"
          >
            <Plus className="h-4 w-4 text-[#C9A84C] transition-transform group-hover:rotate-90" />
            <span className="font-heading text-sm font-semibold uppercase tracking-widest text-[#C9A84C]">
              Forge New Goal
            </span>
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={fadeUp}>
          <Tabs defaultValue="active">
            <TabsList className="mb-4 bg-[#111111] border border-[#1F1F1F] rounded-xl p-1">
              <TabsTrigger
                value="active"
                className="rounded-lg px-4 py-1.5 font-heading text-xs uppercase tracking-widest data-active:bg-[#C9A84C]/10 data-active:text-[#C9A84C]"
              >
                Active ({activeRewards.length})
              </TabsTrigger>
              <TabsTrigger
                value="forged"
                className="rounded-lg px-4 py-1.5 font-heading text-xs uppercase tracking-widest data-active:bg-[#C9A84C]/10 data-active:text-[#C9A84C]"
              >
                Forged ({forgedRewards.length})
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="rounded-lg px-4 py-1.5 font-heading text-xs uppercase tracking-widest data-active:bg-[#C9A84C]/10 data-active:text-[#C9A84C]"
              >
                Drafts ({draftRewards.length})
              </TabsTrigger>
            </TabsList>

            {/* Active rewards */}
            <TabsContent value="active">
              {activeRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-[#1F1F1F] bg-[#111111] py-16">
                  <Flame className="mb-3 h-8 w-8 text-[#525252]" />
                  <p className="text-sm text-[#525252]">
                    No active goals yet. Forge your first reward.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {activeRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      currentBalance={balance?.current ?? 0}
                      eligibility={getEligibility(reward)}
                      onClick={() => {
                        const elig = getEligibility(reward);
                        if (elig.eligible) {
                          setForgeAnim({
                            active: true,
                            name: reward.name,
                            cost: reward.cost,
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Forged rewards */}
            <TabsContent value="forged">
              {forgedRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-[#1F1F1F] bg-[#111111] py-16">
                  <ScrollText className="mb-3 h-8 w-8 text-[#525252]" />
                  <p className="text-sm text-[#525252]">
                    No forged rewards yet. Keep earning Drachma.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {forgedRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      currentBalance={balance?.current ?? 0}
                      eligibility={{ eligible: false, reasons: [] }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Draft rewards */}
            <TabsContent value="drafts">
              {draftRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-[#1F1F1F] bg-[#111111] py-16">
                  <ScrollText className="mb-3 h-8 w-8 text-[#525252]" />
                  <p className="text-sm text-[#525252]">
                    No draft goals. Start one in the workshop.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {draftRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      currentBalance={balance?.current ?? 0}
                      eligibility={{ eligible: false, reasons: ["Draft"] }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Transaction Ledger */}
        <motion.div variants={fadeUp}>
          <TransactionLedger entries={ledger} />
        </motion.div>
      </motion.div>

      {/* Gift Workshop Panel */}
      <GiftWorkshopPanel
        isOpen={workshopOpen}
        onClose={() => setWorkshopOpen(false)}
        onForge={handleForgeNewGoal}
        onSaveDraft={handleSaveDraft}
      />

      {/* Forge Animation */}
      <ForgeAnimation
        isActive={forgeAnim.active}
        rewardName={forgeAnim.name}
        cost={forgeAnim.cost}
        startBalance={balance?.current ?? 0}
        onComplete={handleForgeComplete}
      />
    </div>
  );
}
