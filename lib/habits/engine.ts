// ═══════════════════════════════════════════════════════════
// AGON — Habit Engine
// ═══════════════════════════════════════════════════════════

import type { AgonHabit, HabitCategory, HabitFrequency, HabitType } from "./defaults";

// ───────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  value: number;
  context: "manual" | "confession" | "auto";
  notes?: string;
  drachmaApplied: number;
  createdAt: string;
}

export interface LogHabitResult {
  success: boolean;
  drachma: number;
  log: HabitLog;
  message: string;
}

// ───────────────────────────────────────────────────────────
// getActiveHabitsForPhase
// Returns habits that are active in the given phase
// ───────────────────────────────────────────────────────────

export function getActiveHabitsForPhase(
  allHabits: AgonHabit[],
  currentPhase: number
): AgonHabit[] {
  return allHabits.filter((habit) => {
    if (habit.allPhases) return true;
    if (habit.phases && habit.phases.includes(currentPhase)) return true;
    return false;
  });
}

// ───────────────────────────────────────────────────────────
// logHabit
// Logs a habit completion and calculates drachma earned/lost
// ───────────────────────────────────────────────────────────

export function logHabit(
  habit: AgonHabit,
  value: number = 1,
  context: "manual" | "confession" | "auto" = "manual",
  notes?: string
): LogHabitResult {
  const drachma = habit.drachma;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const log: HabitLog = {
    id: crypto.randomUUID(),
    habitId: habit.id,
    date: dateStr,
    value,
    context,
    notes,
    drachmaApplied: drachma,
    createdAt: now.toISOString(),
  };

  const isGood = habit.type === "good";
  const absDrachma = Math.abs(drachma);
  const message = isGood
    ? `+${absDrachma}\u20AF earned for ${habit.name}`
    : `-${absDrachma}\u20AF penalty for ${habit.name}`;

  return {
    success: true,
    drachma,
    log,
    message,
  };
}

// ───────────────────────────────────────────────────────────
// getHabitStreak
// Calculates consecutive days a good habit was logged
// ───────────────────────────────────────────────────────────

export function getHabitStreak(
  habitLogs: HabitLog[],
  habitId: string
): number {
  const logsForHabit = habitLogs
    .filter((log) => log.habitId === habitId)
    .map((log) => log.date)
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse();

  if (logsForHabit.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Check if the most recent log is today or yesterday
  const mostRecent = logsForHabit[0];
  const mostRecentDate = new Date(mostRecent + "T00:00:00");
  const todayDate = new Date(todayStr + "T00:00:00");
  const diffFromToday = Math.floor(
    (todayDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak is broken if most recent log is more than 1 day ago
  if (diffFromToday > 1) return 0;

  // Count consecutive days backwards from the most recent log
  for (let i = 0; i < logsForHabit.length; i++) {
    const currentDate = new Date(logsForHabit[i] + "T00:00:00");
    const expectedDate = new Date(mostRecentDate);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ───────────────────────────────────────────────────────────
// getDaysClean
// For bad habits — number of days since last logged
// ───────────────────────────────────────────────────────────

export function getDaysClean(
  habitLogs: HabitLog[],
  habitId: string
): number {
  const logsForHabit = habitLogs
    .filter((log) => log.habitId === habitId)
    .map((log) => log.date)
    .sort()
    .reverse();

  if (logsForHabit.length === 0) return -1; // Never logged = never slipped

  const lastSlipDate = new Date(logsForHabit[0] + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lastSlipDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ───────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────

export function isHabitLoggedToday(
  habitLogs: HabitLog[],
  habitId: string,
  todayStr: string
): boolean {
  return habitLogs.some(
    (log) => log.habitId === habitId && log.date === todayStr
  );
}

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getHabitsByType(
  habits: AgonHabit[],
  type: HabitType
): AgonHabit[] {
  return habits.filter((h) => h.type === type);
}

export function getHabitsByCategory(
  habits: AgonHabit[],
  category: HabitCategory
): AgonHabit[] {
  return habits.filter((h) => h.category === category);
}

export function formatDrachma(amount: number): string {
  if (amount >= 0) return `+${amount}\u20AF`;
  return `${amount}\u20AF`;
}

export function formatFrequency(frequency: HabitFrequency): string {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "per_occurrence":
      return "Per Occurrence";
    default:
      return frequency;
  }
}
