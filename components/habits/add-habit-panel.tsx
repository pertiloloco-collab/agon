"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HABIT_CATEGORIES, type HabitCategory, type HabitFrequency, type AgonHabit } from "@/lib/habits/defaults";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────
// Emoji Picker Data
// ───────────────────────────────────────────────────────────

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Fitness",
    emojis: ["\uD83C\uDFCB\uFE0F", "\uD83D\uDCAA", "\uD83C\uDFC3", "\uD83D\uDEB4", "\uD83E\uDDD8", "\uD83E\uDD3C", "\u26BD", "\uD83C\uDFCA", "\uD83E\uDD3A", "\uD83E\uDD38"],
  },
  {
    label: "Food",
    emojis: ["\uD83E\uDD57", "\uD83E\uDD69", "\uD83C\uDF4E", "\uD83D\uDCA7", "\uD83C\uDF73", "\uD83E\uDD66", "\uD83C\uDF57", "\uD83C\uDF5A", "\uD83E\uDDC8", "\uD83C\uDF4C"],
  },
  {
    label: "Mind",
    emojis: ["\uD83E\uDDE0", "\uD83D\uDCD6", "\u270D\uFE0F", "\uD83C\uDFAF", "\uD83D\uDE4F", "\uD83D\uDCA1", "\uD83C\uDFA7", "\uD83D\uDCDD", "\u2699\uFE0F", "\uD83D\uDD2E"],
  },
  {
    label: "Recovery",
    emojis: ["\uD83D\uDE34", "\uD83E\uDD76", "\uD83D\uDEBF", "\u2615", "\uD83C\uDF05", "\uD83C\uDF19", "\uD83D\uDC86", "\uD83C\uDF3F", "\uD83D\uDECC", "\uD83C\uDFB6"],
  },
  {
    label: "Bad",
    emojis: ["\uD83C\uDF54", "\uD83C\uDF7A", "\uD83C\uDF70", "\uD83D\uDEAC", "\uD83D\uDCF1", "\uD83D\uDECB\uFE0F", "\uD83E\uDD89", "\uD83D\uDE24", "\uD83D\uDC40", "\u23ED\uFE0F"],
  },
];

const FREQUENCY_OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "per_occurrence", label: "Per Occurrence" },
];

const DRACHMA_SUGGESTIONS = {
  good: [2, 3, 5, 8, 10],
  bad: [-3, -5, -8, -10, -15],
};

interface AddHabitPanelProps {
  open: boolean;
  onClose: () => void;
  onAdd: (habit: AgonHabit) => void;
}

export function AddHabitPanel({ open, onClose, onAdd }: AddHabitPanelProps) {
  const [type, setType] = useState<"good" | "bad">("good");
  const [icon, setIcon] = useState("\uD83D\uDCAA");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("fitness");
  const [drachma, setDrachma] = useState(3);
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");

  const resetForm = useCallback(() => {
    setType("good");
    setIcon("\uD83D\uDCAA");
    setName("");
    setDescription("");
    setCategory("fitness");
    setDrachma(3);
    setFrequency("daily");
    setTarget("");
    setUnit("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (!name.trim()) return;

    const newHabit: AgonHabit = {
      id: `custom-${crypto.randomUUID()}`,
      name: name.trim(),
      icon,
      type,
      category,
      drachma: type === "bad" ? -Math.abs(drachma) : Math.abs(drachma),
      frequency,
      description: description.trim(),
      allPhases: true,
      source: "custom",
      ...(target ? { target: Number(target) } : {}),
      ...(unit ? { unit } : {}),
    };

    onAdd(newHabit);
    resetForm();
    onClose();
  }, [name, icon, type, category, drachma, frequency, description, target, unit, onAdd, onClose, resetForm]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-[#1F1F1F] bg-[#0A0A0A]"
          >
            {/* Handle bar */}
            <div className="sticky top-0 z-10 flex items-center justify-center bg-[#0A0A0A] pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-[#1F1F1F]" />
            </div>

            <div className="px-5 pb-8">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-[#F5F5F5]">
                  ADD CUSTOM HABIT
                </h2>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F1F1F] text-[#525252] hover:text-[#F5F5F5] transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Type toggle */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setType("good");
                      setDrachma(3);
                    }}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all",
                      type === "good"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:text-[#A3A3A3]"
                    )}
                  >
                    Good Habit
                  </button>
                  <button
                    onClick={() => {
                      setType("bad");
                      setDrachma(-5);
                    }}
                    className={cn(
                      "flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all",
                      type === "bad"
                        ? "border-red-500/40 bg-red-500/10 text-red-400"
                        : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:text-[#A3A3A3]"
                    )}
                  >
                    Bad Habit
                  </button>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Icon
                </label>
                <div className="space-y-3">
                  {EMOJI_GROUPS.map((group) => (
                    <div key={group.label}>
                      <span className="mb-1 block text-[10px] text-[#525252]">
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setIcon(emoji)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all",
                              icon === emoji
                                ? "border-[#C9A84C]/60 bg-[#C9A84C]/10 scale-110"
                                : "border-[#1F1F1F] bg-[#111111] hover:border-[#C9A84C]/30"
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 60))}
                  placeholder="e.g., Morning Meditation"
                  maxLength={60}
                  className="border-[#1F1F1F] bg-[#111111] text-[#F5F5F5] placeholder:text-[#525252]"
                />
                <span className="mt-1 block text-right text-[10px] text-[#525252]">
                  {name.length}/60
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  placeholder="Why does this habit matter?"
                  maxLength={200}
                  className="border-[#1F1F1F] bg-[#111111] text-[#F5F5F5] placeholder:text-[#525252] min-h-[60px]"
                />
                <span className="mt-1 block text-right text-[10px] text-[#525252]">
                  {description.length}/200
                </span>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {HABIT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                        category === cat.id
                          ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
                          : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:text-[#A3A3A3]"
                      )}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[10px] font-mono uppercase">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drachma Value */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Drachma Value
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={Math.abs(drachma)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setDrachma(type === "bad" ? -Math.abs(val) : Math.abs(val));
                    }}
                    className="w-24 border-[#1F1F1F] bg-[#111111] text-center font-mono text-[#F5F5F5]"
                  />
                  <span className="text-sm text-[#525252] font-mono">
                    {type === "good" ? "+" : "-"}{Math.abs(drachma)}{"\u20AF"}
                  </span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {DRACHMA_SUGGESTIONS[type].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDrachma(val)}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs font-mono transition-all",
                        drachma === val
                          ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
                          : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:text-[#A3A3A3]"
                      )}
                    >
                      {val > 0 ? "+" : ""}{val}{"\u20AF"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Frequency
                </label>
                <div className="flex gap-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFrequency(opt.value)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-mono transition-all",
                        frequency === opt.value
                          ? "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]"
                          : "border-[#1F1F1F] bg-[#111111] text-[#525252] hover:text-[#A3A3A3]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target + Unit (optional) */}
              <div className="mb-8">
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-[#525252]">
                  Target &amp; Unit{" "}
                  <span className="text-[#525252]/60">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., 10"
                    className="flex-1 border-[#1F1F1F] bg-[#111111] text-[#F5F5F5] placeholder:text-[#525252]"
                  />
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., minutes"
                    className="flex-1 border-[#1F1F1F] bg-[#111111] text-[#F5F5F5] placeholder:text-[#525252]"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={cn(
                  "w-full py-3 font-heading text-sm font-bold uppercase tracking-widest",
                  "bg-[#C9A84C] text-[#050505] hover:bg-[#C9A84C]/90",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                size="lg"
              >
                <Plus className="size-4 mr-1" />
                Add Habit
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
