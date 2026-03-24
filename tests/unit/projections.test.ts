import { describe, it, expect } from "vitest";
import {
  calculateEstimated1RM,
  calculateStrengthScore,
  projectWeight,
  weeklyVolume,
} from "@/lib/analytics/projections";

describe("Projections", () => {
  it("calculateEstimated1RM uses Epley formula correctly (100kg x 5 reps = ~116.7kg)", () => {
    // Epley: 1RM = weight * (1 + reps/30) = 100 * (1 + 5/30) = 100 * 1.1667 = 116.67
    const result = calculateEstimated1RM(100, 5);
    expect(result).toBeCloseTo(116.7, 1);
  });

  it("calculateStrengthScore divides total by bodyweight", () => {
    // bench=100, squat=140, deadlift=180, bw=80
    // total=420, score=420/80=5.25
    const score = calculateStrengthScore(100, 140, 180, 80);
    expect(score).toBe(5.25);
  });

  it("projectWeight returns a projected weight", () => {
    const dataPoints = [
      { day: 1, weight: 200 },
      { day: 30, weight: 195 },
      { day: 60, weight: 190 },
    ];
    const result = projectWeight(dataPoints, 170);
    expect(result.projectedWeightAtDay365).toBeDefined();
    expect(typeof result.projectedWeightAtDay365).toBe("number");
    expect(result.weeklyRate).toBeDefined();
    expect(result.weeklyRate).toBeLessThan(0); // losing weight
  });

  it("weeklyVolume calculates total sets for a muscle group", () => {
    const now = new Date("2026-03-24T12:00:00"); // Tuesday
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday March 22

    const logs = [
      { muscleGroup: "chest", sets: 4, reps: 10, weight: 100, date: "2026-03-23T10:00:00" }, // Monday in that week
      { muscleGroup: "chest", sets: 3, reps: 12, weight: 80, date: "2026-03-24T10:00:00" }, // Tuesday
      { muscleGroup: "back", sets: 4, reps: 10, weight: 90, date: "2026-03-23T10:00:00" },
    ];

    const chestVolume = weeklyVolume(logs, "chest", now);
    // 4*10*100 + 3*12*80 = 4000 + 2880 = 6880
    expect(chestVolume).toBe(6880);
  });
});
