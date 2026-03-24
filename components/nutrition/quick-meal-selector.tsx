"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";

interface PrebuiltMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  emoji: string;
}

const PREBUILT_MEALS: PrebuiltMeal[] = [
  {
    id: "chicken-rice-broccoli",
    name: "Chicken + Rice + Broccoli",
    calories: 520,
    protein: 45,
    fat: 8,
    carbs: 65,
    emoji: "\uD83C\uDF57",
  },
  {
    id: "protein-shake",
    name: "Protein Shake",
    calories: 180,
    protein: 30,
    fat: 3,
    carbs: 8,
    emoji: "\uD83E\uDD64",
  },
  {
    id: "eggs-toast",
    name: "Eggs + Toast",
    calories: 350,
    protein: 22,
    fat: 18,
    carbs: 28,
    emoji: "\uD83C\uDF73",
  },
  {
    id: "greek-yogurt-honey",
    name: "Greek Yogurt + Honey",
    calories: 200,
    protein: 18,
    fat: 5,
    carbs: 22,
    emoji: "\uD83C\uDF6F",
  },
  {
    id: "salmon-veggies",
    name: "Salmon + Veggies",
    calories: 480,
    protein: 40,
    fat: 22,
    carbs: 30,
    emoji: "\uD83E\uDD69",
  },
  {
    id: "oats-banana-pb",
    name: "Oats + Banana + PB",
    calories: 420,
    protein: 14,
    fat: 16,
    carbs: 58,
    emoji: "\uD83C\uDF5C",
  },
];

interface QuickMealSelectorProps {
  onSelect: (meal: {
    description: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    source: "quick_select" | "manual";
  }) => void;
}

interface CustomMealForm {
  description: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

export function QuickMealSelector({ onSelect }: QuickMealSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customForm, setCustomForm] = useState<CustomMealForm>({
    description: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
  });

  const handleQuickSelect = (meal: PrebuiltMeal) => {
    setSelectedId(meal.id);
    onSelect({
      description: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      fat: meal.fat,
      carbs: meal.carbs,
      source: "quick_select",
    });
    // Reset selection after brief feedback
    setTimeout(() => setSelectedId(null), 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.description.trim()) return;

    onSelect({
      description: customForm.description,
      calories: parseInt(customForm.calories) || 0,
      protein: parseInt(customForm.protein) || 0,
      fat: parseInt(customForm.fat) || 0,
      carbs: parseInt(customForm.carbs) || 0,
      source: "manual",
    });

    setCustomForm({
      description: "",
      calories: "",
      protein: "",
      fat: "",
      carbs: "",
    });
    setShowCustom(false);
  };

  return (
    <div className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-5">
      <h3 className="mb-4 font-heading text-sm font-bold tracking-wider text-[#C9A84C] uppercase">
        Quick Log
      </h3>

      {/* Prebuilt meals grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PREBUILT_MEALS.map((meal, i) => (
          <motion.button
            key={meal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleQuickSelect(meal)}
            className={`relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all ${
              selectedId === meal.id
                ? "border-[#22C55E]/50 bg-[#22C55E]/10"
                : "border-[#1F1F1F] bg-[#0A0A0A] hover:border-[#C9A84C]/30 hover:bg-[#1A1A1A]"
            }`}
          >
            {selectedId === meal.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2 top-2"
              >
                <Check className="h-4 w-4 text-[#22C55E]" />
              </motion.div>
            )}
            <span className="text-lg">{meal.emoji}</span>
            <span className="text-xs font-medium text-[#F5F5F5] leading-tight">
              {meal.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-[#525252] font-mono">
              <span>{meal.calories}cal</span>
              <span className="text-[#C9A84C]">{meal.protein}p</span>
              <span>{meal.fat}f</span>
              <span>{meal.carbs}c</span>
            </div>
          </motion.button>
        ))}

        {/* Custom meal button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setShowCustom(!showCustom)}
          className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#1F1F1F] p-3 text-[#525252] transition-all hover:border-[#C9A84C]/30 hover:text-[#A3A3A3]"
        >
          {showCustom ? (
            <X className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">Custom Meal</span>
        </motion.button>
      </div>

      {/* Custom meal form */}
      <AnimatePresence>
        {showCustom && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCustomSubmit}
            className="mt-4 overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
              <input
                type="text"
                placeholder="Meal description"
                value={customForm.description}
                onChange={(e) =>
                  setCustomForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/50 focus:outline-none"
              />
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    ["calories", "Cal"],
                    ["protein", "Protein(g)"],
                    ["fat", "Fat(g)"],
                    ["carbs", "Carbs(g)"],
                  ] as const
                ).map(([key, label]) => (
                  <input
                    key={key}
                    type="number"
                    placeholder={label}
                    value={customForm[key]}
                    onChange={(e) =>
                      setCustomForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[#1F1F1F] bg-[#111111] px-2 py-2 text-center font-mono text-xs text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C]/50 focus:outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={!customForm.description.trim()}
                className="w-full rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 py-2 text-sm font-bold text-[#C9A84C] transition-all hover:bg-[#C9A84C]/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Log Meal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
