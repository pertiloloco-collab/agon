"use client";

import { HeroBanner } from "@/components/dashboard/hero-banner";
import { TodaySnapshot } from "@/components/dashboard/today-snapshot";
import { BodyTimeline } from "@/components/dashboard/body-timeline";
import { GreekRatios } from "@/components/dashboard/greek-ratios";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";
import { PhaseProgress } from "@/components/dashboard/phase-progress";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero Banner — full width */}
        <HeroBanner />

        {/* Phase Progress — full width */}
        <PhaseProgress />

        {/* Main grid: asymmetric 2-column */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column — wider */}
          <div className="space-y-6 lg:col-span-7">
            <BodyTimeline />
            <StreakHeatmap />
          </div>

          {/* Right column — narrower */}
          <div className="space-y-6 lg:col-span-5">
            <TodaySnapshot />
            <GreekRatios />
          </div>
        </div>
      </div>
    </div>
  );
}
