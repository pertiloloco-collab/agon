import { NextResponse } from "next/server";

const mockAchievements = [
  {
    id: "achieve-001",
    name: "First Blood",
    description: "Complete your first workout.",
    icon: "Sword",
    category: "milestone",
    drachmaBonus: 25,
    unlocked: true,
    unlockedAt: "2026-03-01T18:00:00.000Z",
    requirement: "Complete 1 workout",
    progress: 1,
    target: 1,
  },
  {
    id: "achieve-002",
    name: "Week Warrior",
    description: "Complete a full 7-day streak of all daily habits.",
    icon: "Shield",
    category: "streak",
    drachmaBonus: 50,
    unlocked: true,
    unlockedAt: "2026-03-08T00:00:00.000Z",
    requirement: "7-day habit streak",
    progress: 7,
    target: 7,
  },
  {
    id: "achieve-003",
    name: "Iron Month",
    description: "Complete 30 consecutive days without a missed workout.",
    icon: "Crown",
    category: "streak",
    drachmaBonus: 200,
    unlocked: false,
    unlockedAt: null,
    requirement: "30-day workout streak",
    progress: 23,
    target: 30,
  },
  {
    id: "achieve-004",
    name: "Centurion",
    description: "Log 100 total workouts.",
    icon: "Trophy",
    category: "milestone",
    drachmaBonus: 500,
    unlocked: false,
    unlockedAt: null,
    requirement: "100 total workouts",
    progress: 47,
    target: 100,
  },
  {
    id: "achieve-005",
    name: "Clean Slate",
    description: "Go 14 days with zero bad habit confessions.",
    icon: "Sparkles",
    category: "discipline",
    drachmaBonus: 100,
    unlocked: false,
    unlockedAt: null,
    requirement: "14 days, no confessions",
    progress: 6,
    target: 14,
  },
  {
    id: "achieve-006",
    name: "The Forge Master",
    description: "Forge (purchase) 10 rewards with earned drachma.",
    icon: "Hammer",
    category: "rewards",
    drachmaBonus: 150,
    unlocked: false,
    unlockedAt: null,
    requirement: "Forge 10 rewards",
    progress: 2,
    target: 10,
  },
  {
    id: "achieve-007",
    name: "Protein King",
    description: "Hit your protein target 30 days in a row.",
    icon: "Beef",
    category: "nutrition",
    drachmaBonus: 200,
    unlocked: false,
    unlockedAt: null,
    requirement: "30-day protein streak",
    progress: 18,
    target: 30,
  },
  {
    id: "achieve-008",
    name: "Early Riser",
    description: "Complete morning routine before 7 AM for 7 consecutive days.",
    icon: "Sunrise",
    category: "discipline",
    drachmaBonus: 75,
    unlocked: false,
    unlockedAt: null,
    requirement: "7 early mornings in a row",
    progress: 3,
    target: 7,
  },
];

export async function GET() {
  try {
    const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
    const totalCount = mockAchievements.length;

    return NextResponse.json(
      {
        achievements: mockAchievements,
        summary: {
          unlocked: unlockedCount,
          total: totalCount,
          completionPercent: Math.round((unlockedCount / totalCount) * 100),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Achievements GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
