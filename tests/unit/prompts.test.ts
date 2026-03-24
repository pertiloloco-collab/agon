import { describe, it, expect } from "vitest";
import {
  buildMorningMessagePrompt,
  buildChatSystemPrompt,
  buildEveningDebriefPrompt,
  buildSanctionMessagePrompt,
} from "@/lib/ai/prompts";

describe("AI Prompts", () => {
  it("buildMorningMessagePrompt includes day number", () => {
    const prompt = buildMorningMessagePrompt({
      dayNumber: 42,
      totalDays: 365,
      phaseName: "Foundation",
      phaseNumber: 1,
      currentStreak: 10,
      yesterdayHonorScore: 85,
      accountabilityLevel: "high",
      whyVaultEntry: "For my family",
    });
    expect(prompt).toContain("Day 42");
  });

  it("buildMorningMessagePrompt includes phase info", () => {
    const prompt = buildMorningMessagePrompt({
      dayNumber: 42,
      totalDays: 365,
      phaseName: "Foundation",
      phaseNumber: 1,
      currentStreak: 10,
      yesterdayHonorScore: 85,
      accountabilityLevel: "high",
      whyVaultEntry: "For my family",
    });
    expect(prompt).toContain("Foundation");
    expect(prompt).toContain("Phase 1");
  });

  it("buildChatSystemPrompt includes user context data", () => {
    const prompt = buildChatSystemPrompt({
      dayNumber: 100,
      phaseName: "Hypertrophy Push",
      weekNumber: 15,
      currentWeight: 185,
      startingWeight: 200,
      targetWeight: 175,
      currentStreak: 30,
      honorScore: 92,
      todayWorkout: "Push 1",
      workoutCompleted: false,
      last7DaysSummary: "6/7 days completed",
      whyVaultEntry: "To prove I can do hard things",
      accountabilityLevel: "spartan",
    });
    expect(prompt).toContain("Day 100");
    expect(prompt).toContain("Week 15");
    expect(prompt).toContain("185");
    expect(prompt).toContain("200");
    expect(prompt).toContain("175");
    expect(prompt).toContain("Push 1");
    expect(prompt).toContain("NOT YET");
  });

  it("buildEveningDebriefPrompt includes the day's data", () => {
    const prompt = buildEveningDebriefPrompt({
      dayNumber: 50,
      tasksCompleted: 5,
      totalTasks: 7,
      tasksCompletedList: ["Workout", "Protein", "Water", "Sleep", "Steps"],
      tasksMissedList: ["Creatine", "Stretching"],
      selfRating: 7,
      userNotes: "Felt tired but pushed through",
      tomorrowWorkout: "Pull 1",
      currentStreak: 15,
    });
    expect(prompt).toContain("Day 50");
    expect(prompt).toContain("5/7");
    expect(prompt).toContain("Creatine");
    expect(prompt).toContain("Stretching");
    expect(prompt).toContain("7/10");
    expect(prompt).toContain("Pull 1");
  });

  it("buildSanctionMessagePrompt includes failure type", () => {
    const prompt = buildSanctionMessagePrompt({
      failureType: "missed_workout",
      details: "Skipped leg day without valid reason",
      streakBeforeFailure: 21,
      dayNumber: 75,
      whyVaultEntries: ["To become the best version of myself"],
    });
    expect(prompt).toContain("missed_workout");
    expect(prompt).toContain("21");
    expect(prompt).toContain("75 of 365");
    expect(prompt).toContain("Skipped leg day without valid reason");
  });
});
