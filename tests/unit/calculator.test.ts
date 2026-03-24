import { describe, it, expect } from "vitest";
import { getTrainingDayInfo } from "@/lib/training/calculator";

describe("getTrainingDayInfo", () => {
  // Start date: March 24, 2026 (Tuesday)
  const startDate = new Date("2026-03-24T00:00:00");

  it("returns Phase 1, Week 1 on start date", () => {
    const info = getTrainingDayInfo(startDate, new Date("2026-03-24T00:00:00"));
    expect(info.phase).toBe(1);
    expect(info.phaseName).toBe("Foundation");
    expect(info.weekInProgram).toBe(1);
    expect(info.dayNumber).toBe(1);
  });

  it("returns Phase 2 at week 13", () => {
    // dayNumber = diffDays + 1, weekInProgram = ceil(dayNumber/7)
    // For week 13: need dayNumber where ceil(dayNumber/7) = 13 => dayNumber 85
    // dayNumber = offset + 1 => offset = 84
    // But Phase 1 ends at week 12. Let's pick a safe day deep in week 13.
    // Week 13 day range: dayNumber 85-91 (offset 84-90)
    const phase2Date = new Date(startDate);
    phase2Date.setDate(phase2Date.getDate() + 86); // dayNumber = 87, week = ceil(87/7) = 13
    const info = getTrainingDayInfo(startDate, phase2Date);
    expect(info.phase).toBe(2);
    expect(info.phaseName).toBe("Hypertrophy Push");
    expect(info.weekInProgram).toBe(13);
  });

  it("returns Phase 3 at week 27", () => {
    // Week 27: dayNumber in range 183-189
    const phase3Date = new Date(startDate);
    phase3Date.setDate(phase3Date.getDate() + 184); // dayNumber = 185, week = ceil(185/7) = 27
    const info = getTrainingDayInfo(startDate, phase3Date);
    expect(info.phase).toBe(3);
    expect(info.phaseName).toBe("Advanced Hypertrophy");
    expect(info.weekInProgram).toBe(27);
  });

  it("returns Phase 4 at week 41", () => {
    // Week 41 starts at day 281 (40 full weeks * 7 = 280 days, day 281)
    const day281 = new Date(startDate);
    day281.setDate(day281.getDate() + 280);
    const info = getTrainingDayInfo(startDate, day281);
    expect(info.phase).toBe(4);
    expect(info.phaseName).toBe("The Cut");
    expect(info.weekInProgram).toBe(41);
  });

  it("returns correct training day for Monday in Phase 1 (Upper A)", () => {
    // First Monday after start: March 30, 2026 is a Monday
    const monday = new Date("2026-03-30T00:00:00");
    const info = getTrainingDayInfo(startDate, monday);
    expect(info.dayOfWeek).toBe(1); // Monday = 1
    expect(info.isRestDay).toBe(false);
    expect(info.trainingDay).not.toBeNull();
    expect(info.trainingDay!.name).toBe("Upper A");
  });

  it("returns rest day for Wednesday in Phase 1", () => {
    // Phase 1 schedule: Mon(1), Tue(2), Thu(4), Fri(5) — Wed(3) is rest
    const wednesday = new Date("2026-03-25T00:00:00"); // March 25 is a Wednesday
    const info = getTrainingDayInfo(startDate, wednesday);
    expect(info.dayOfWeek).toBe(3); // Wednesday = 3
    expect(info.isRestDay).toBe(true);
    expect(info.trainingDay).toBeNull();
  });

  it("returns correct PPL day in Phase 2", () => {
    // Phase 2 is weeks 13-26. We need a Monday in that range.
    // Start = March 24, 2026 (Tuesday). Let's find a Monday well into Phase 2.
    // June 22, 2026 is a Monday. Offset from start: March has 7 remaining days (25-31),
    // April 30, May 31, June 22 = 7+30+31+22 = 90 days offset, dayNumber = 91, week = ceil(91/7) = 13
    const mondayPhase2 = new Date("2026-06-22T00:00:00");
    const info = getTrainingDayInfo(startDate, mondayPhase2);
    expect(info.phase).toBe(2);
    expect(info.dayOfWeek).toBe(1); // Monday
    expect(info.isRestDay).toBe(false);
    expect(info.trainingDay).not.toBeNull();
    expect(info.trainingDay!.name).toBe("Push 1");
  });

  it("handles the full 52-week cycle (last day returns Phase 4)", () => {
    // Day 365 = start + 364 days
    const lastDay = new Date(startDate);
    lastDay.setDate(lastDay.getDate() + 364);
    const info = getTrainingDayInfo(startDate, lastDay);
    expect(info.dayNumber).toBe(365);
    expect(info.phase).toBe(4);
    expect(info.phaseName).toBe("The Cut");
    expect(info.weekInProgram).toBe(53); // ceil(365/7) = 53, but phase defaults to last
  });
});
