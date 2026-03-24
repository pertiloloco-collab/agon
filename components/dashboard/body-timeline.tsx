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
  { date: "Jan 1", weight: 205, bodyFat: 22 },
  { date: "Jan 15", weight: 203, bodyFat: 21.5 },
  { date: "Feb 1", weight: 200, bodyFat: 20.8 },
  { date: "Feb 15", weight: 198, bodyFat: 19.9 },
  { date: "Mar 1", weight: 196, bodyFat: 19.2 },
  { date: "Mar 15", weight: 194, bodyFat: 18.5 },
  { date: "Apr 1", weight: 193, bodyFat: 17.8 },
  { date: "Apr 15", weight: 191, bodyFat: 17.1 },
  { date: "May 1", weight: 190, bodyFat: 16.5 },
  { date: "May 15", weight: 189, bodyFat: 15.8 },
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
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <YAxis
              yAxisId="bf"
              orientation="right"
              tick={{ fill: "#525252", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
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

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 rounded bg-[#C9A84C]" />
          <span className="text-xs text-[#A3A3A3]">Weight (lbs)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4 rounded border-t border-dashed border-[#A3A3A3]" />
          <span className="text-xs text-[#A3A3A3]">Body Fat %</span>
        </div>
      </div>
    </motion.div>
  );
}
