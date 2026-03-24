"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Send, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export default function DebriefPage() {
  const [rating, setRating] = useState(7);
  const [wins, setWins] = useState("");
  const [misses, setMisses] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debriefResponse, setDebriefResponse] = useState("");

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/evening-debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          wins,
          misses,
          notes,
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

            {/* Submit */}
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
            <div className="mt-6 pt-4 border-t border-[#1F1F1F]">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setDebriefResponse("");
                  setRating(7);
                  setWins("");
                  setMisses("");
                  setNotes("");
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
