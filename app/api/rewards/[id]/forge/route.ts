import { NextResponse } from "next/server";

// Mock data
const MOCK_BALANCE = 847;
const MOCK_REWARD_COSTS: Record<string, number> = {
  "reward-001": 100,
  "reward-002": 300,
  "reward-003": 500,
  "reward-004": 1500,
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: look up reward cost and user balance from database
    const cost = MOCK_REWARD_COSTS[id] ?? 200;

    if (MOCK_BALANCE < cost) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient drachma balance",
          currentBalance: MOCK_BALANCE,
          cost,
          deficit: cost - MOCK_BALANCE,
        },
        { status: 400 }
      );
    }

    const newBalance = MOCK_BALANCE - cost;

    const forgeComments: Record<string, string> = {
      "reward-001": "Enjoy the feast, warrior. You earned this fuel.",
      "reward-002": "New gear forged. Time to put it to use in the arena.",
      "reward-003": "Recovery is part of the battle. Rest well.",
      "reward-004": "A warrior's adventure awaits. Make it legendary.",
    };

    return NextResponse.json(
      {
        success: true,
        rewardId: id,
        cost,
        newBalance,
        forgeComment: forgeComments[id] || "Reward forged. You've earned it, warrior.",
        forgedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reward forge POST error:", error);
    return NextResponse.json(
      { error: "Failed to forge reward" },
      { status: 500 }
    );
  }
}
