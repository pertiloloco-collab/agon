"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Skull, AlertTriangle, CheckCircle2, Clock, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sanction {
  id: string;
  triggerType: string;
  description: string;
  triggered: boolean;
  triggeredAt: string | null;
  fulfilled: boolean;
  fulfilledProofUrl: string | null;
}

const mockSanctions: Sanction[] = [
  {
    id: "1",
    triggerType: "missed_workout",
    description: "Cold shower — video proof required",
    triggered: true,
    triggeredAt: "2026-03-22T18:00:00",
    fulfilled: false,
    fulfilledProofUrl: null,
  },
  {
    id: "2",
    triggerType: "broken_streak",
    description: "No entertainment for 48 hours",
    triggered: true,
    triggeredAt: "2026-03-15T22:00:00",
    fulfilled: true,
    fulfilledProofUrl: "/proof/streak-sanction.jpg",
  },
  {
    id: "3",
    triggerType: "low_honor",
    description: "AI disappointment letter",
    triggered: false,
    triggeredAt: null,
    fulfilled: false,
    fulfilledProofUrl: null,
  },
];

const triggerLabels: Record<string, string> = {
  missed_workout: "Missed Workout",
  missed_meal: "Missed Nutrition",
  broken_streak: "Broken Streak",
  low_honor: "Low Honor Score",
  missed_two_days: "Missed 2 Days",
};

const triggerIcons: Record<string, typeof Skull> = {
  missed_workout: AlertTriangle,
  missed_meal: AlertTriangle,
  broken_streak: Skull,
  low_honor: Skull,
  missed_two_days: Skull,
};

export default function SanctionsPage() {
  const [sanctions] = useState<Sanction[]>(mockSanctions);

  const pending = sanctions.filter((s) => s.triggered && !s.fulfilled);
  const fulfilled = sanctions.filter((s) => s.fulfilled);
  const inactive = sanctions.filter((s) => !s.triggered);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-[#F5F5F5] mb-2">SANCTIONS</h1>
        <p className="text-sm text-[#525252]">
          The consequences you chose. Honor them.
        </p>
      </div>

      {/* Pending Sanctions */}
      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg text-[#DC2626] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            PENDING ({pending.length})
          </h2>
          {pending.map((sanction, i) => {
            const Icon = triggerIcons[sanction.triggerType] || Skull;
            return (
              <motion.div
                key={sanction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative p-5 rounded-xl bg-[#111111] border border-[#8B0000]/50 shadow-[0_0_20px_rgba(139,0,0,0.15)]"
              >
                <div className="absolute top-0 right-0 w-2 h-2 m-4 rounded-full bg-[#DC2626] animate-pulse" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 border-[#DC2626]/30 text-[#DC2626] text-xs">
                      {triggerLabels[sanction.triggerType]}
                    </Badge>
                    <p className="text-[#F5F5F5] font-medium mb-1">{sanction.description}</p>
                    {sanction.triggeredAt && (
                      <p className="text-xs text-[#525252] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Triggered {new Date(sanction.triggeredAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#DC2626] hover:bg-[#DC2626]/80 text-white flex items-center gap-1"
                  >
                    <Camera className="w-4 h-4" />
                    Fulfill
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Fulfilled Sanctions */}
      {fulfilled.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg text-[#22C55E] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            REDEEMED ({fulfilled.length})
          </h2>
          {fulfilled.map((sanction, i) => (
            <motion.div
              key={sanction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] opacity-70"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 border-[#22C55E]/30 text-[#22C55E] text-xs">
                    REDEEMED
                  </Badge>
                  <p className="text-[#A3A3A3] font-medium line-through">{sanction.description}</p>
                  <p className="text-xs text-[#525252]">
                    {triggerLabels[sanction.triggerType]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Inactive Sanctions */}
      {inactive.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg text-[#525252]">
            CONFIGURED ({inactive.length})
          </h2>
          {inactive.map((sanction) => (
            <div
              key={sanction.id}
              className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]"
            >
              <p className="text-[#525252] text-sm">{triggerLabels[sanction.triggerType]}</p>
              <p className="text-[#A3A3A3] text-sm mt-1">{sanction.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
