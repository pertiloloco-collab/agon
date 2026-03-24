"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Shield, Flame, Skull } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HabitCard } from "@/components/habits/habit-card";
import { AddHabitPanel } from "@/components/habits/add-habit-panel";
import {
  AGON_DEFAULT_HABITS,
  type AgonHabit,
} from "@/lib/habits/defaults";
import {
  getActiveHabitsForPhase,
  getHabitsByType,
  getHabitStreak,
  getDaysClean,
  isHabitLoggedToday,
  getTodayString,
  logHabit,
  type HabitLog,
} from "@/lib/habits/engine";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const { phase } = useAppStore();

  // ── State ──────────────────────────────────────────────────
  const [habits, setHabits] = useState<AgonHabit[]>(AGON_DEFAULT_HABITS);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [todayStr, setTodayStr] = useState("");

  // Compute todayStr on mount only (avoid hydration mismatch)
  useEffect(() => {
    setTodayStr(getTodayString());
  }, []);

  // ── Derived Data ───────────────────────────────────────────
  const activeHabits = useMemo(
    () => getActiveHabitsForPhase(habits, phase),
    [habits, phase]
  );

  const goodHabits = useMemo(
    () => getHabitsByType(activeHabits, "good"),
    [activeHabits]
  );

  const badHabits = useMemo(
    () => getHabitsByType(activeHabits, "bad"),
    [activeHabits]
  );

  const todayCompletedCount = useMemo(() => {
    if (!todayStr) return 0;
    return goodHabits.filter((h) =>
      isHabitLoggedToday(habitLogs, h.id, todayStr)
    ).length;
  }, [goodHabits, habitLogs, todayStr]);

  const todayDrachmaEarned = useMemo(() => {
    if (!todayStr) return 0;
    return habitLogs
      .filter((log) => log.date === todayStr)
      .reduce((sum, log) => sum + log.drachmaApplied, 0);
  }, [habitLogs, todayStr]);

  // ── Handlers ───────────────────────────────────────────────
  const handleLog = useCallback(
    (habitId: string, value?: number) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const result = logHabit(habit, value ?? 1, "manual");
      setHabitLogs((prev) => [...prev, result.log]);
    },
    [habits]
  );

  const handleAddHabit = useCallback((newHabit: AgonHabit) => {
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  // ── Render helpers ─────────────────────────────────────────
  const renderHabitList = useCallback(
    (list: AgonHabit[]) => {
      if (!todayStr) return null;
      return (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {list.map((habit) => {
              const logged = isHabitLoggedToday(habitLogs, habit.id, todayStr);
              const streak =
                habit.type === "good"
                  ? getHabitStreak(habitLogs, habit.id)
                  : 0;
              const daysClean =
                habit.type === "bad"
                  ? getDaysClean(habitLogs, habit.id)
                  : undefined;

              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onLog={handleLog}
                  todayLogged={logged}
                  streak={streak}
                  daysClean={daysClean}
                />
              );
            })}
          </AnimatePresence>
        </div>
      );
    },
    [habitLogs, todayStr, handleLog]
  );

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="border-b border-[#1F1F1F] bg-[#050505] px-4 pb-4 pt-6 md:px-8 md:pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F5F5F5] md:text-2xl">
              Your Disciplines
            </h1>
            <p className="mt-1 text-xs text-[#525252] font-mono">
              {todayStr || "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Today's stats */}
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="size-3.5 text-emerald-400" />
                <span className="font-mono text-[#A3A3A3]">
                  {todayCompletedCount}/{goodHabits.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Flame className="size-3.5 text-[#C9A84C]" />
                <span className="font-mono text-[#A3A3A3]">
                  {todayDrachmaEarned >= 0 ? "+" : ""}
                  {todayDrachmaEarned}{"\u20AF"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
        <Tabs defaultValue="all">
          <TabsList
            variant="line"
            className="mb-6 w-full justify-start border-b border-[#1F1F1F] pb-0"
          >
            <TabsTrigger
              value="all"
              className="font-mono text-xs uppercase tracking-wider"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="good"
              className="font-mono text-xs uppercase tracking-wider"
            >
              Good Habits
            </TabsTrigger>
            <TabsTrigger
              value="bad"
              className="font-mono text-xs uppercase tracking-wider"
            >
              Bad Habits
            </TabsTrigger>
          </TabsList>

          {/* ALL tab */}
          <TabsContent value="all">
            {/* Good Habits Section */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  Forge Discipline
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/30 to-transparent" />
              </div>
              {renderHabitList(goodHabits)}
            </div>

            {/* Bad Habits Section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">
                  Confess Weakness
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-red-500/30 to-transparent" />
              </div>
              {renderHabitList(badHabits)}
            </div>
          </TabsContent>

          {/* GOOD tab */}
          <TabsContent value="good">
            {renderHabitList(goodHabits)}
          </TabsContent>

          {/* BAD tab */}
          <TabsContent value="bad">
            {renderHabitList(badHabits)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAddPanelOpen(true)}
        className={cn(
          "fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-[#C9A84C]/20 md:bottom-8",
          "bg-[#C9A84C] text-[#050505] hover:bg-[#C9A84C]/90 transition-colors"
        )}
        aria-label="Add custom habit"
      >
        <Plus className="size-6" strokeWidth={2.5} />
      </motion.button>

      {/* Add Habit Panel */}
      <AddHabitPanel
        open={addPanelOpen}
        onClose={() => setAddPanelOpen(false)}
        onAdd={handleAddHabit}
      />
    </div>
  );
}
