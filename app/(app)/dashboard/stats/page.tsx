"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Plus,
  TrendingDown,
  TrendingUp,
  Scale,
  Ruler,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  bodyFat: number | null;
  waist: number | null;
  shoulders: number | null;
  chest: number | null;
  arms: number | null;
}

const mockStats: BodyStat[] = [
  { date: "2026-01-15", weight: 91, bodyFat: 22, waist: 88, shoulders: 118, chest: 102, arms: 36 },
  { date: "2026-01-22", weight: 90.5, bodyFat: 21.5, waist: 87, shoulders: 118, chest: 102, arms: 36 },
  { date: "2026-01-29", weight: 90.2, bodyFat: 21, waist: 87, shoulders: 119, chest: 103, arms: 36.5 },
  { date: "2026-02-05", weight: 89.8, bodyFat: 20.5, waist: 86, shoulders: 119, chest: 103, arms: 37 },
  { date: "2026-02-12", weight: 89.5, bodyFat: 20, waist: 86, shoulders: 120, chest: 104, arms: 37 },
  { date: "2026-02-19", weight: 89.0, bodyFat: 19.5, waist: 85, shoulders: 120, chest: 104, arms: 37.5 },
  { date: "2026-02-26", weight: 88.5, bodyFat: 19, waist: 85, shoulders: 121, chest: 105, arms: 37.5 },
  { date: "2026-03-05", weight: 88.0, bodyFat: 18.5, waist: 84, shoulders: 121, chest: 105, arms: 38 },
  { date: "2026-03-12", weight: 87.5, bodyFat: 18, waist: 84, shoulders: 122, chest: 106, arms: 38 },
  { date: "2026-03-19", weight: 87.0, bodyFat: 17.5, waist: 83, shoulders: 122, chest: 106, arms: 38.5 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-lg p-3 shadow-lg">
      <p className="text-xs text-[#525252] mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-sm" style={{ color: item.color }}>
          {item.dataKey === "weight" ? `${item.value} kg` : `${item.value}%`}
        </p>
      ))}
    </div>
  );
};

export default function StatsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStat, setNewStat] = useState({
    weight: "",
    bodyFat: "",
    waist: "",
    shoulders: "",
    chest: "",
    arms: "",
    notes: "",
  });

  const latest = mockStats[mockStats.length - 1];
  const first = mockStats[0];
  const weightChange = latest.weight - first.weight;
  const bfChange = (latest.bodyFat ?? 0) - (first.bodyFat ?? 0);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[#F5F5F5] mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#C9A84C]" />
            BODY STATS
          </h1>
          <p className="text-sm text-[#525252]">Track your transformation. Numbers don&apos;t lie.</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Stats
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Current Weight", value: `${latest.weight} kg`, icon: Scale, change: weightChange, suffix: "kg" },
          { label: "Body Fat", value: `${latest.bodyFat}%`, icon: TrendingDown, change: bfChange, suffix: "%" },
          { label: "Shoulders", value: `${latest.shoulders} cm`, icon: Ruler, change: (latest.shoulders ?? 0) - (first.shoulders ?? 0), suffix: "cm" },
          { label: "Arms", value: `${latest.arms} cm`, icon: Ruler, change: (latest.arms ?? 0) - (first.arms ?? 0), suffix: "cm" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-[#111111] border border-[#1F1F1F]"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#525252]" />
              <span className="text-xs text-[#525252]">{stat.label}</span>
            </div>
            <p className="font-mono text-2xl text-[#F5F5F5] font-bold">{stat.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {stat.change <= 0 && stat.label !== "Arms" && stat.label !== "Shoulders" ? (
                <TrendingDown className="w-3 h-3 text-[#22C55E]" />
              ) : stat.change > 0 && (stat.label === "Arms" || stat.label === "Shoulders") ? (
                <TrendingUp className="w-3 h-3 text-[#22C55E]" />
              ) : (
                <TrendingUp className="w-3 h-3 text-[#DC2626]" />
              )}
              <span className={`text-xs font-mono ${
                (stat.label === "Arms" || stat.label === "Shoulders")
                  ? (stat.change > 0 ? "text-[#22C55E]" : "text-[#DC2626]")
                  : (stat.change <= 0 ? "text-[#22C55E]" : "text-[#DC2626]")
              }`}>
                {stat.change > 0 ? "+" : ""}{stat.change.toFixed(1)} {stat.suffix}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weight Chart */}
      <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
        <h2 className="font-display text-lg text-[#F5F5F5] mb-4">WEIGHT TREND</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
            <XAxis
              dataKey="date"
              stroke="#525252"
              fontSize={12}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="#525252" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#C9A84C"
              strokeWidth={2}
              dot={{ fill: "#C9A84C", r: 4 }}
              activeDot={{ r: 6, fill: "#E5D494" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Body Fat Chart */}
      <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
        <h2 className="font-display text-lg text-[#F5F5F5] mb-4">BODY FAT TREND</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mockStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
            <XAxis
              dataKey="date"
              stroke="#525252"
              fontSize={12}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="#525252" fontSize={12} domain={["dataMin - 1", "dataMax + 1"]} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ fill: "#22C55E", r: 4 }}
              activeDot={{ r: 6, fill: "#22C55E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Add Stats Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6 rounded-xl bg-[#111111] border border-[#C9A84C]/20 space-y-4"
        >
          <h2 className="font-display text-lg text-[#C9A84C]">LOG NEW STATS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "weight", label: "Weight (kg)", icon: Scale },
              { key: "bodyFat", label: "Body Fat %", icon: TrendingDown },
              { key: "waist", label: "Waist (cm)", icon: Ruler },
              { key: "shoulders", label: "Shoulders (cm)", icon: Ruler },
              { key: "chest", label: "Chest (cm)", icon: Ruler },
              { key: "arms", label: "Arms (cm)", icon: Ruler },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs text-[#525252]">{field.label}</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newStat[field.key as keyof typeof newStat]}
                  onChange={(e) => setNewStat({ ...newStat, [field.key]: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] font-mono focus:border-[#C9A84C]"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold">
              <Camera className="w-4 h-4 mr-2" />
              Add Progress Photo
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-[#525252]">Notes</Label>
            <Textarea
              value={newStat.notes}
              onChange={(e) => setNewStat({ ...newStat, notes: e.target.value })}
              placeholder="How do you look? How do you feel?"
              rows={2}
              className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-[#1F1F1F] text-[#525252]">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold">
              Save Stats
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
