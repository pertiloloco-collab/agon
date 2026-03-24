"use client";

import { motion } from "framer-motion";
import { Clock, Camera, Pencil, Zap, MousePointerClick } from "lucide-react";

export interface MealLogData {
  id: string;
  mealNumber: number;
  description: string;
  photoUrl?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  source: "manual" | "photo_ai" | "quick_select";
  loggedAt: string; // ISO timestamp
}

interface MealLogCardProps {
  meal: MealLogData;
  index?: number;
}

const SOURCE_CONFIG = {
  manual: { label: "Manual", icon: Pencil, color: "#A3A3A3" },
  photo_ai: { label: "Photo AI", icon: Camera, color: "#C9A84C" },
  quick_select: { label: "Quick Select", icon: MousePointerClick, color: "#22C55E" },
} as const;

export function MealLogCard({ meal, index = 0 }: MealLogCardProps) {
  const source = SOURCE_CONFIG[meal.source];
  const SourceIcon = source.icon;

  // Format time from ISO string — done safely for SSR
  const timeDisplay = (() => {
    try {
      return new Date(meal.loggedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4 hover:border-[#C9A84C]/20 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Meal number badge */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20">
          <span className="font-mono text-sm font-bold text-[#C9A84C]">
            {meal.mealNumber}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-[#F5F5F5] truncate">
              {meal.description}
            </h4>
            {/* Source badge */}
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium flex-shrink-0"
              style={{
                color: source.color,
                backgroundColor: `${source.color}15`,
                borderColor: `${source.color}30`,
                borderWidth: 1,
              }}
            >
              <SourceIcon className="h-2.5 w-2.5" />
              {source.label}
            </span>
          </div>

          {/* Macro breakdown */}
          <div className="mt-2 grid grid-cols-4 gap-3">
            <MacroColumn label="Cal" value={meal.calories} unit="kcal" />
            <MacroColumn label="Protein" value={meal.protein} unit="g" />
            <MacroColumn label="Fat" value={meal.fat} unit="g" />
            <MacroColumn label="Carbs" value={meal.carbs} unit="g" />
          </div>

          {/* Time logged */}
          <div className="mt-2 flex items-center gap-1 text-[#525252]">
            <Clock className="h-3 w-3" />
            <span className="font-mono text-[10px]">{timeDisplay}</span>
          </div>
        </div>

        {/* Photo thumbnail */}
        {meal.photoUrl && (
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-[#1F1F1F]">
            <img
              src={meal.photoUrl}
              alt={meal.description}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MacroColumn({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-sm font-bold text-[#F5F5F5]">
        {value}
        <span className="text-[10px] text-[#525252]">{unit}</span>
      </p>
      <p className="text-[10px] text-[#525252] uppercase">{label}</p>
    </div>
  );
}
