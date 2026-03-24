import { describe, it, expect } from "vitest";
import {
  earnDrachma,
  burnDrachma,
  getBalance,
  getRank,
  getNextRank,
  EARNING_TABLE,
  BURNING_TABLE,
} from "@/lib/drachma/engine";

describe("Drachma Engine", () => {
  it("earnDrachma increases balance", () => {
    const userId = "test-earn-" + Math.random();
    earnDrachma(userId, 10, "workout_with_proof");
    const balance = getBalance(userId);
    expect(balance.current).toBe(10);
    expect(balance.cumulative).toBe(10);
  });

  it("burnDrachma decreases balance", () => {
    const userId = "test-burn-" + Math.random();
    earnDrachma(userId, 50, "complete_all_daily_tasks");
    burnDrachma(userId, 20, "missed_workout");
    const balance = getBalance(userId);
    expect(balance.current).toBe(30);
  });

  it("balance can go negative (floor -500)", () => {
    const userId = "test-negative-" + Math.random();
    burnDrachma(userId, 100, "zero_compliance_day");
    const balance = getBalance(userId);
    expect(balance.current).toBe(-100);
  });

  it("balance cannot go below -500", () => {
    const userId = "test-floor-" + Math.random();
    burnDrachma(userId, 300, "zero_compliance_day");
    burnDrachma(userId, 300, "zero_compliance_day");
    const balance = getBalance(userId);
    expect(balance.current).toBe(-500);
  });

  it("getRank returns correct rank for each threshold", () => {
    expect(getRank(0).name).toBe("Mortal");
    expect(getRank(50).name).toBe("Mortal");
    expect(getRank(100).name).toBe("Citizen");
    expect(getRank(300).name).toBe("Soldier");
    expect(getRank(600).name).toBe("Warrior");
    expect(getRank(1000).name).toBe("Champion");
    expect(getRank(1500).name).toBe("Hero");
    expect(getRank(2200).name).toBe("Demigod");
    expect(getRank(3000).name).toBe("Titan");
    expect(getRank(4000).name).toBe("Olympian");
    expect(getRank(5500).name).toBe("Greek God");
    expect(getRank(9999).name).toBe("Greek God");
  });

  it("getNextRank returns correct next rank threshold", () => {
    const next = getNextRank(1);
    expect(next).not.toBeNull();
    expect(next!.name).toBe("Citizen");
    expect(next!.threshold).toBe(100);

    const nextFromMax = getNextRank(10);
    expect(nextFromMax).toBeNull();
  });

  it("EARNING_TABLE has all expected keys", () => {
    const expectedKeys = [
      "complete_all_daily_tasks",
      "workout_with_proof",
      "hit_protein_target",
      "hit_all_macros",
      "morning_confirm_fast",
      "evening_debrief",
      "seven_day_streak",
      "thirty_day_streak",
      "achievement_unlock",
      "rank_up",
      "pr_on_lift",
      "perfect_honor_day",
      "weekly_compliance_90",
    ];
    for (const key of expectedKeys) {
      expect(EARNING_TABLE).toHaveProperty(key);
    }
  });

  it("BURNING_TABLE has all expected keys", () => {
    const expectedKeys = [
      "missed_workout",
      "zero_compliance_day",
      "broken_streak",
      "sanction_triggered",
      "unfulfilled_sanction_48h",
      "honor_below_30",
      "task_skipped",
      "three_missed_days_row",
      "contract_unsigned_noon",
      "late_morning_30min",
    ];
    for (const key of expectedKeys) {
      expect(BURNING_TABLE).toHaveProperty(key);
    }
  });
});
