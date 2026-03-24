"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

interface HeatmapDay {
  date: string;
  completed: boolean;
  honorScore: number;
}

interface StreakHeatmapProps {
  data?: HeatmapDay[];
  currentStreak?: number;
  longestStreak?: number;
}

function getColor(score: number): string {
  if (score >= 76) return "#C9A84C";
  if (score >= 51) return "#8B7A3A";
  if (score >= 26) return "#4A4020";
  return "#1F1F1F";
}

// Simple seeded pseudo-random
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMockData(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const rand = seededRandom(42);
  // Use UTC date math to avoid timezone differences between server/client
  const baseTime = Date.UTC(2026, 2, 24); // March 24, 2026 UTC
  for (let i = 89; i >= 0; i--) {
    const ms = baseTime - i * 86400000;
    const d = new Date(ms);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const completed = rand() > 0.2;
    days.push({
      date: `${year}-${month}-${day}`,
      completed,
      honorScore: completed ? Math.floor(rand() * 60) + 40 : Math.floor(rand() * 25),
    });
  }
  return days;
}

const DAY_LABELS = ["M", "", "W", "", "F", "", "S"];

export function StreakHeatmap(props: StreakHeatmapProps) {
  const [mockData, setMockData] = useState<HeatmapDay[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMockData(generateMockData());
    setMounted(true);
  }, []);

  const data = props.data ?? mockData;
  const currentStreak = props.currentStreak ?? 12;
  const longestStreak = props.longestStreak ?? 34;

  // Organize data into columns (weeks) with 7 rows (Mon-Sun)
  const columns: (HeatmapDay | null)[][] = [];
  if (mounted && data.length > 0) {
    const firstDate = new Date(data[0].date + "T00:00:00");
    const dayOfWeek = (firstDate.getDay() + 6) % 7; // Mon=0
    const padded: (HeatmapDay | null)[] = [
      ...Array.from({ length: dayOfWeek }, () => null),
      ...data,
    ];

    for (let i = 0; i < padded.length; i += 7) {
      columns.push(padded.slice(i, i + 7));
    }
    // Pad last column
    const last = columns[columns.length - 1];
    if (last && last.length < 7) {
      while (last.length < 7) last.push(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold tracking-wider text-[#F5F5F5]">
          BATTLE LOG
        </h2>
        <span className="text-xs text-[#525252]">Last 90 days</span>
      </div>

      {/* Streak stats */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <div>
            <p className="font-mono text-sm font-bold text-[#F5F5F5]">{currentStreak}</p>
            <p className="text-[10px] text-[#525252]">Current</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2">
          <Trophy className="h-4 w-4 text-[#C9A84C]" />
          <div>
            <p className="font-mono text-sm font-bold text-[#F5F5F5]">{longestStreak}</p>
            <p className="text-[10px] text-[#525252]">Best</p>
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[3px] overflow-x-auto">
        {/* Day labels */}
        <div className="flex flex-shrink-0 flex-col gap-[3px]">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex h-[14px] w-[14px] items-center justify-center text-[8px] text-[#525252]"
            >
              {label}
            </div>
          ))}
        </div>
        {/* Columns */}
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((day, ri) => (
              <motion.div
                key={ri}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.4 + ci * 0.02 + ri * 0.01,
                }}
                className="h-[14px] w-[14px] rounded-[2px]"
                style={{
                  backgroundColor: day ? getColor(day.honorScore) : "transparent",
                }}
                title={day ? `${day.date}: ${day.honorScore}` : ""}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1">
        <span className="mr-1 text-[9px] text-[#525252]">Less</span>
        {["#1F1F1F", "#4A4020", "#8B7A3A", "#C9A84C"].map((c) => (
          <div
            key={c}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="ml-1 text-[9px] text-[#525252]">More</span>
      </div>
    </motion.div>
  );
}
