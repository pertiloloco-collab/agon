"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingDown } from "lucide-react";

interface DataPoint {
  day: number;
  actual?: number;
  projected?: number;
}

interface ProjectionChartProps {
  actualData?: { day: number; weight: number }[];
  targetWeight?: number;
  startWeight?: number;
  totalDays?: number;
}

const defaultActualData = [
  { day: 1, weight: 92 },
  { day: 15, weight: 91.2 },
  { day: 30, weight: 90.1 },
  { day: 45, weight: 89.5 },
  { day: 60, weight: 88.3 },
  { day: 75, weight: 87.8 },
  { day: 90, weight: 86.9 },
  { day: 105, weight: 86.2 },
  { day: 120, weight: 85.5 },
];

function buildChartData(
  actualData: { day: number; weight: number }[],
  totalDays: number
): DataPoint[] {
  const points: DataPoint[] = [];

  // Add actual data points
  for (const point of actualData) {
    points.push({ day: point.day, actual: point.weight });
  }

  // Calculate projection from last two actual points
  if (actualData.length >= 2) {
    const last = actualData[actualData.length - 1];
    const prev = actualData[actualData.length - 2];
    const ratePerDay =
      (last.weight - prev.weight) / (last.day - prev.day);

    // Add the bridge point (last actual is also first projected)
    const lastIndex = points.length - 1;
    if (lastIndex >= 0) {
      points[lastIndex].projected = last.weight;
    }

    // Generate projected points
    const projectionSteps = [150, 180, 210, 240, 270, 300, 330, 365];
    for (const step of projectionSteps) {
      if (step > last.day && step <= totalDays) {
        const projected = last.weight + ratePerDay * (step - last.day);
        points.push({ day: step, projected: Math.max(projected, 50) });
      }
    }
  }

  return points;
}

function formatCaption(
  actualData: { day: number; weight: number }[],
  targetWeight: number,
  totalDays: number
): string {
  if (actualData.length < 2) return "Not enough data for projection";

  const last = actualData[actualData.length - 1];
  const prev = actualData[actualData.length - 2];
  const ratePerDay =
    (last.weight - prev.weight) / (last.day - prev.day);

  if (ratePerDay >= 0) return "You need to increase your deficit to reach your target.";

  const daysToTarget = (targetWeight - last.weight) / ratePerDay;
  const targetDay = last.day + daysToTarget;

  if (targetDay > totalDays) {
    const projectedAtEnd = last.weight + ratePerDay * (totalDays - last.day);
    return `At current rate, you'll reach ${projectedAtEnd.toFixed(1)}kg by Day 365`;
  }

  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + (targetDay - last.day));
  const dateStr = projectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `At current rate, you'll reach ${targetWeight}kg by ${dateStr} (Day ${Math.round(targetDay)})`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2 shadow-xl">
      <p className="mb-1 font-mono text-[10px] text-[#525252]">
        Day {label}
      </p>
      {payload.map((entry: { dataKey: string; value: number; color: string }) => (
        <p key={entry.dataKey} className="font-mono text-xs" style={{ color: entry.color }}>
          {entry.dataKey === "actual" ? "Actual" : "Projected"}:{" "}
          {entry.value.toFixed(1)}kg
        </p>
      ))}
    </div>
  );
}

export function ProjectionChart({
  actualData = defaultActualData,
  targetWeight = 78,
  startWeight = 92,
  totalDays = 365,
}: ProjectionChartProps) {
  const chartData = useMemo(
    () => buildChartData(actualData, totalDays),
    [actualData, totalDays]
  );

  const caption = useMemo(
    () => formatCaption(actualData, targetWeight, totalDays),
    [actualData, targetWeight, totalDays]
  );

  // Calculate Y axis domain
  const allWeights = chartData.flatMap((d) =>
    [d.actual, d.projected].filter((v): v is number => v != null)
  );
  const yMin = Math.floor(Math.min(...allWeights, targetWeight) - 2);
  const yMax = Math.ceil(Math.max(...allWeights, startWeight) + 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111111] p-4 md:p-6"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-[#C9A84C]" />
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[#F5F5F5]">
          Weight Projection
        </h3>
      </div>

      {/* Chart */}
      <div className="h-64 w-full md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1F1F1F"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(value: number) => `D${value}`}
            />
            <YAxis
              domain={[yMin, yMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Target line */}
            <ReferenceLine
              y={targetWeight}
              stroke="#22C55E"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: `Target: ${targetWeight}kg`,
                fill: "#22C55E",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            {/* Actual weight line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#C9A84C"
              strokeWidth={2.5}
              dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "#E8D48B", r: 5, strokeWidth: 2, stroke: "#C9A84C" }}
              connectNulls={false}
            />

            {/* Projected line */}
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#C9A84C"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              connectNulls={false}
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Caption */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#1F1F1F] bg-[#050505] px-3 py-2">
        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
        <p className="font-mono text-xs text-[#A3A3A3]">{caption}</p>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 rounded bg-[#C9A84C]" />
          <span className="font-mono text-[10px] text-[#525252]">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 rounded bg-[#C9A84C]/50" style={{ backgroundImage: "repeating-linear-gradient(90deg, #C9A84C80 0, #C9A84C80 4px, transparent 4px, transparent 8px)" }} />
          <span className="font-mono text-[10px] text-[#525252]">Projected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-5 rounded bg-[#22C55E]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #22C55E 0, #22C55E 4px, transparent 4px, transparent 8px)" }} />
          <span className="font-mono text-[10px] text-[#525252]">Target</span>
        </div>
      </div>
    </motion.div>
  );
}
