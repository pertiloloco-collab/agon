"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Send, Loader2, Star, Skull, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface BadHabit {
  id: string;
  name: string;
  icon: string;
  penalty: number;
  description: string;
}

const BAD_HABITS: BadHabit[] = [
  { id: "habit-bad-001", name: "Junk Food", icon: "Pizza", penalty: -25, description: "Ate fast food, candy, chips, or other junk." },
  { id: "habit-bad-002", name: "Alcohol", icon: "Wine", penalty: -30, description: "Consumed any alcoholic drinks." },
  { id: "habit-bad-003", name: "Skipped Workout", icon: "XCircle", penalty: -40, description: "Skipped a scheduled training session." },
  { id: "habit-bad-004", name: "Stayed Up Past Midnight", icon: "AlarmClockOff", penalty: -15, description: "Went to bed after midnight." },
  { id: "habit-bad-005", name: "Doom Scrolling (30+ min)", icon: "Smartphone", penalty: -20, description: "Spent 30+ minutes mindlessly scrolling." },
  { id: "habit-bad-006", name: "Sugary Drinks", icon: "CupSoda", penalty: -15, description: "Consumed soda, energy drinks, or sugary beverages." },
  { id: "habit-bad-007", name: "Smoking / Vaping", icon: "CloudOff", penalty: -35, description: "Smoked or vaped any substance." },
  { id: "habit-bad-008", name: "Missed Meal / Underate", icon: "UtensilsCrossed", penalty: -20, description: "Skipped a planned meal or significantly underate." },
  { id: "habit-bad-009", name: "Porn", icon: "EyeOff", penalty: -30, description: "Watched pornographic content." },
  { id: "habit-bad-010", name: "Complained / Negative Spiral", icon: "Frown", penalty: -10, description: "Got stuck in a complaining or negative thought spiral." },
];

export default function DebriefPage() {
  const [rating, setRating] = useState(7);
  const [wins, setWins] = useState("");
  const [misses, setMisses] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debriefResponse, setDebriefResponse] = useState("");

  // Confession state
  const [confessions, setConfessions] = useState<Set<string>>(new Set());
  const [confessionSubmitted, setConfessionSubmitted] = useState(false);
  const [confessionLoading, setConfessionLoading] = useState(false);

  function toggleConfession(habitId: string) {
    setConfessions((prev) => {
      const next = new Set(prev);
      if (next.has(habitId)) {
        next.delete(habitId);
      } else {
        next.add(habitId);
      }
      return next;
    });
  }

  const totalPenalty = BAD_HABITS.filter((h) => confessions.has(h.id)).reduce(
    (sum, h) => sum + h.penalty,
    0
  );

  async function handleConfessionSubmit() {
    if (confessions.size === 0) return;
    setConfessionLoading(true);
    try {
      // Log each confessed bad habit
      const promises = Array.from(confessions).map((habitId) =>
        fetch(`/api/habits/${habitId}/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: 1, context: "evening-debrief-confession" }),
        })
      );
      await Promise.all(promises);
      setConfessionSubmitted(true);
    } catch {
      // Silently handle - confession is logged on best-effort basis
      setConfessionSubmitted(true);
    } finally {
      setConfessionLoading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const confessedHabits = BAD_HABITS.filter((h) => confessions.has(h.id)).map((h) => h.name);

      const res = await fetch("/api/ai/evening-debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          wins,
          misses,
          notes,
          confessions: confessedHabits,
          confessionPenalty: totalPenalty,
          dayNumber: 47,
          tasksCompleted: 5,
          totalTasks: 7,
          currentStreak: 12,
          tomorrowWorkout: "Lower A",
        }),
      });
      const data = await res.json();
      setDebriefResponse(data.debrief || "Great work today. Rest well, warrior. Tomorrow we go again.");
      setSubmitted(true);
    } catch {
      setDebriefResponse("Rest well. Tomorrow we rise again.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Moon className="w-10 h-10 text-[#C9A84C] mx-auto" />
        <h1 className="font-display text-3xl text-[#F5F5F5]">EVENING DEBRIEF</h1>
        <p className="text-sm text-[#525252]">
          Reflect. Acknowledge. Prepare for tomorrow.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Rating */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#A3A3A3]">How was today?</label>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#C9A84C]" />
                  <span className="font-mono text-2xl font-bold text-[#C9A84C]">{rating}</span>
                  <span className="text-sm text-[#525252]">/ 10</span>
                </div>
              </div>
              <Slider
                value={[rating]}
                onValueChange={(v) => setRating(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={10}
                step={1}
                className="[&_[role=slider]]:bg-[#C9A84C] [&_[role=slider]]:border-[#C9A84C]"
              />
              <div className="flex justify-between text-xs text-[#525252]">
                <span>Terrible</span>
                <span>Average</span>
                <span>Legendary</span>
              </div>
            </div>

            {/* Wins */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-3">
              <label className="text-sm text-[#22C55E] font-medium">
                What did you crush today?
              </label>
              <Textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="Your victories, no matter how small..."
                rows={3}
                className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#22C55E] resize-none"
              />
            </div>

            {/* Misses */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-3">
              <label className="text-sm text-[#DC2626] font-medium">
                What did you dodge or skip?
              </label>
              <Textarea
                value={misses}
                onChange={(e) => setMisses(e.target.value)}
                placeholder="Be honest. Accountability starts here..."
                rows={3}
                className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#DC2626] resize-none"
              />
            </div>

            {/* Notes */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-3">
              <label className="text-sm text-[#A3A3A3] font-medium">
                Additional notes (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else on your mind..."
                rows={2}
                className="bg-[#0A0A0A] border-[#1F1F1F] text-[#F5F5F5] placeholder:text-[#525252] focus:border-[#C9A84C] resize-none"
              />
            </div>

            {/* CONFESSION Section */}
            <div className="p-5 rounded-xl bg-[#111111] border border-[#DC2626]/30 space-y-4">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-[#DC2626]" />
                <h2 className="font-display text-lg text-[#DC2626]">CONFESSION</h2>
              </div>
              <p className="text-xs text-[#525252]">
                Honesty is strength. Check any bad habits you fell into today. Penalties will be applied to your drachma balance.
              </p>

              <div className="space-y-2">
                {BAD_HABITS.map((habit) => {
                  const isChecked = confessions.has(habit.id);
                  return (
                    <button
                      key={habit.id}
                      type="button"
                      onClick={() => toggleConfession(habit.id)}
                      disabled={confessionSubmitted}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                        isChecked
                          ? "bg-[#DC2626]/10 border-[#DC2626]/40"
                          : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#DC2626]/20"
                      } ${confessionSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked
                            ? "bg-[#DC2626] border-[#DC2626]"
                            : "border-[#525252]"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${isChecked ? "text-[#DC2626]" : "text-[#A3A3A3]"}`}>
                            {habit.name}
                          </span>
                          <span className="text-xs font-mono text-[#DC2626] flex-shrink-0 ml-2">
                            {habit.penalty}
                          </span>
                        </div>
                        <p className="text-xs text-[#525252] truncate">{habit.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Confession Summary */}
              {confessions.size > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-[#1F1F1F]">
                  <span className="text-sm text-[#A3A3A3]">
                    {confessions.size} confession{confessions.size !== 1 ? "s" : ""}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#DC2626]">
                    {totalPenalty} drachma
                  </span>
                </div>
              )}

              {/* Submit Confession */}
              {confessions.size > 0 && !confessionSubmitted && (
                <Button
                  onClick={handleConfessionSubmit}
                  disabled={confessionLoading}
                  variant="outline"
                  className="w-full border-[#DC2626]/40 text-[#DC2626] hover:bg-[#DC2626]/10"
                >
                  {confessionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Skull className="w-4 h-4 mr-2" />
                      SUBMIT CONFESSION
                    </>
                  )}
                </Button>
              )}

              {confessionSubmitted && (
                <p className="text-xs text-[#DC2626]/70 text-center">
                  Confessions logged. Accountability accepted.
                </p>
              )}
            </div>

            {/* Submit Debrief */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-[#8B7432] text-[#050505] font-bold py-6 text-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  SUBMIT DEBRIEF
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-[#111111] border border-[#C9A84C]/30 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B7432] flex items-center justify-center flex-shrink-0">
                <span className="font-display text-sm font-bold text-[#050505]">A</span>
              </div>
              <span className="font-display text-[#C9A84C]">AGON</span>
            </div>
            <p className="text-[#F5F5F5] leading-relaxed whitespace-pre-wrap">
              {debriefResponse}
            </p>

            {/* Confession summary in response */}
            {confessions.size > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-[#DC2626]/5 border border-[#DC2626]/20">
                <p className="text-xs text-[#DC2626]/80">
                  {confessions.size} confession{confessions.size !== 1 ? "s" : ""} logged today ({totalPenalty} drachma).
                  Honesty is the foundation of transformation.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#1F1F1F]">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setDebriefResponse("");
                  setRating(7);
                  setWins("");
                  setMisses("");
                  setNotes("");
                  setConfessions(new Set());
                  setConfessionSubmitted(false);
                }}
                variant="outline"
                className="border-[#1F1F1F] text-[#525252]"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
