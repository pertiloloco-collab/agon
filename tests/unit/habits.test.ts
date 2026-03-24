import { describe, it, expect } from "vitest";
import { AGON_DEFAULT_HABITS } from "@/lib/habits/defaults";
import { getActiveHabitsForPhase, logHabit } from "@/lib/habits/engine";

describe("Habit Defaults", () => {
  it("AGON_DEFAULT_HABITS has correct number of good habits (13)", () => {
    const goodHabits = AGON_DEFAULT_HABITS.filter((h) => h.type === "good");
    expect(goodHabits).toHaveLength(13);
  });

  it("AGON_DEFAULT_HABITS has correct number of bad habits (10)", () => {
    const badHabits = AGON_DEFAULT_HABITS.filter((h) => h.type === "bad");
    expect(badHabits).toHaveLength(10);
  });

  it("all good habits have positive drachma values", () => {
    const goodHabits = AGON_DEFAULT_HABITS.filter((h) => h.type === "good");
    for (const habit of goodHabits) {
      expect(habit.drachma).toBeGreaterThan(0);
    }
  });

  it("all bad habits have negative drachma values", () => {
    const badHabits = AGON_DEFAULT_HABITS.filter((h) => h.type === "bad");
    for (const habit of badHabits) {
      expect(habit.drachma).toBeLessThan(0);
    }
  });
});

describe("Habit Engine", () => {
  it("getActiveHabitsForPhase filters phase-specific habits correctly", () => {
    // Phase 1 should include all allPhases habits but NOT phase-4-only habits
    const phase1Habits = getActiveHabitsForPhase(AGON_DEFAULT_HABITS, 1);
    const phase4OnlyIds = ["agon-track-meals", "agon-post-lift-cardio", "agon-fasted-walk"];
    for (const id of phase4OnlyIds) {
      expect(phase1Habits.find((h) => h.id === id)).toBeUndefined();
    }
  });

  it("Phase 4 includes cut-specific habits (Track All Meals, etc.)", () => {
    const phase4Habits = getActiveHabitsForPhase(AGON_DEFAULT_HABITS, 4);
    const trackMeals = phase4Habits.find((h) => h.id === "agon-track-meals");
    const postLiftCardio = phase4Habits.find((h) => h.id === "agon-post-lift-cardio");
    const fastedWalk = phase4Habits.find((h) => h.id === "agon-fasted-walk");

    expect(trackMeals).toBeDefined();
    expect(postLiftCardio).toBeDefined();
    expect(fastedWalk).toBeDefined();
  });

  it("logHabit returns correct drachma for good habit", () => {
    const goodHabit = AGON_DEFAULT_HABITS.find((h) => h.type === "good")!;
    const result = logHabit(goodHabit);
    expect(result.success).toBe(true);
    expect(result.drachma).toBeGreaterThan(0);
    expect(result.drachma).toBe(goodHabit.drachma);
  });

  it("logHabit returns negative drachma for bad habit", () => {
    const badHabit = AGON_DEFAULT_HABITS.find((h) => h.type === "bad")!;
    const result = logHabit(badHabit);
    expect(result.success).toBe(true);
    expect(result.drachma).toBeLessThan(0);
    expect(result.drachma).toBe(badHabit.drachma);
  });
});
