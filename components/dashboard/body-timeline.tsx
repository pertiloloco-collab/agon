"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BodyStat {
  date: string;
  weight: number;
  bodyFat: number;
}

interface BodyTimelineProps {
  stats?: BodyStat[];
}

const defaultStats: BodyStat[] = [
  { date: "Day 1", weight: 91, bodyFat: 22 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs font-medium text-[#A3A3A3]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.dataKey === "weight" ? "Weight" : "Body Fat"}:{" "}
          <span className="font-mono font-bold">
            {entry.value}
            {entry.dataKey === "bodyFat" ? "%" : " lbs"}
          </span>
        </p>
      ))}
    </div>
  );
}

export function BodyTimeline({ stats }: BodyTimelineProps) {
  const data = stats ?? defaultStats;
  const hasEnoughData = data.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5"
    >
      <h2 className="mb-4 font-heading text-sm font-semibold tracking-wider text-[#F5F5F5]">
        BODY TIMELINE
      </h2>

      {hasEnoughData ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F1F1F"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={{ stroke: "#1F1F1F" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="weight"
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="bf"
                orientation="right"
                tick={{ fill: "#525252", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="#C9A84C"
                strokeWidth={2}
                dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#E8D48B", r: 5, strokeWidth: 0 }}
              />
              <Line
                yAxisId="bf"
                type="monotone"
                dataKey="bodyFat"
                stroke="#A3A3A3"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: "#A3A3A3", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#F5F5F5", r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <p className="font-mono text-3xl font-bold text-[#C9A84C]">{data[0]?.weight ?? 91}kg</p>
          <p className="mt-1 text-sm text-[#525252]">Starting weight</p>
          <p className="mt-4 text-xs text-[#525252]">Your body transformation chart will appear here as you log measurements.</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 rounded bg-[#C9A84C]" />
          <span className="text-xs text-[#A3A3A3]">Weight (kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 rounded border-t border-dashed border-[#A3A3A3]" />
          <span className="text-xs text-[#A3A3A3]">Body Fat %</span>
        </div>
      </div>
    </motion.div>
  );
}
