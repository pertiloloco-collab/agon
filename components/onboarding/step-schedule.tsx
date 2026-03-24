"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Globe, CalendarDays, CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingData } from "@/app/onboarding/page";

interface StepScheduleProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

const TIMEZONES = [
  "Europe/Paris",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Europe/Brussels",
  "Europe/Zurich",
  "Europe/Stockholm",
  "Europe/Oslo",
  "Europe/Helsinki",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Vienna",
  "Europe/Athens",
  "Europe/Bucharest",
  "Europe/Moscow",
  "Europe/Istanbul",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "America/Sao_Paulo",
  "America/Mexico_City",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Asia/Seoul",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Africa/Casablanca",
  "Africa/Lagos",
  "Africa/Cairo",
  "Pacific/Auckland",
];

const PHASE1_DAYS = ["Mon", "Tue", "Thu", "Fri"];

export function StepSchedule({ data, onChange }: StepScheduleProps) {
  const endDate = useMemo(() => {
    if (!data.startDate) return "";
    const start = new Date(data.startDate);
    start.setDate(start.getDate() + 365);
    return start.toISOString().split("T")[0];
  }, [data.startDate]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h2 className="mb-2 font-display text-3xl font-bold text-[#F5F5F5]">
          YOUR SCHEDULE
        </h2>
        <p className="text-sm text-[#525252]">
          When does your war begin? Set your rhythm.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Wake-up time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Clock className="h-4 w-4 text-[#C9A84C]" />
            Wake-up Time
          </Label>
          <Input
            type="time"
            value={data.wakeUpTime}
            onChange={(e) => onChange({ wakeUpTime: e.target.value })}
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
          />
        </motion.div>

        {/* Timezone */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <Globe className="h-4 w-4 text-[#C9A84C]" />
            Timezone
          </Label>
          <select
            value={data.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            className="h-14 w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 font-mono text-base text-[#F5F5F5] outline-none transition-colors focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace("_", " ")}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Start date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#A3A3A3]">
            <CalendarDays className="h-4 w-4 text-[#C9A84C]" />
            Training Start Date
          </Label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="h-14 border-[#1F1F1F] bg-[#111111] font-mono text-2xl text-[#F5F5F5] focus-visible:border-[#C9A84C] focus-visible:ring-[#C9A84C]/20"
          />
        </motion.div>

        {/* End date (auto-calculated) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-[#1F1F1F]/50 bg-[#111111]/50 p-4"
        >
          <Label className="mb-2 flex items-center gap-2 text-[#525252]">
            <CalendarCheck className="h-4 w-4 text-[#C9A84C]/50" />
            Target End Date (auto-calculated)
          </Label>
          <p className="font-mono text-2xl text-[#A3A3A3]">
            {endDate || "---"}
          </p>
          <p className="mt-1 text-xs text-[#525252]">
            365 days from start date
          </p>
        </motion.div>

        {/* Training days */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
        >
          <Label className="mb-3 text-[#A3A3A3]">
            Phase 1 Training Days
          </Label>
          <div className="flex gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
              const isActive = PHASE1_DAYS.includes(day);
              return (
                <div
                  key={day}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#1F1F1F] bg-[#050505] text-[#525252]"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-[#525252]">
            Phase 1: 4 days/week — Upper/Lower split
          </p>
        </motion.div>
      </div>
    </div>
  );
}
