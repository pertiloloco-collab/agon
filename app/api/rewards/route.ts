import { NextResponse } from "next/server";
import {
  getRewards,
  createReward,
  seedMockData,
  type RewardCategory,
  type RewardTier,
} from "@/lib/drachma/engine";

const MOCK_USER_ID = "mock-user-id-001";
let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    seedMockData(MOCK_USER_ID);
    seeded = true;
  }
}

export async function GET() {
  try {
    ensureSeeded();
    const rewards = getRewards(MOCK_USER_ID);

    return NextResponse.json({ rewards }, { status: 200 });
  } catch (error) {
    console.error("Rewards GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    ensureSeeded();
    const body = await request.json();

    const reward = createReward({
      userId: MOCK_USER_ID,
      name: body.name || "Untitled Reward",
      description: body.description || "",
      externalLink: body.externalLink,
      category: (body.category as RewardCategory) || "custom",
      tier: (body.tier as RewardTier["name"]) || "small",
      cost: body.cost || 100,
      images: body.images || [],
      conditions: body.conditions || {},
      isPriority: body.isPriority || false,
      status: body.status || "active",
    });

    return NextResponse.json({ success: true, reward }, { status: 201 });
  } catch (error) {
    console.error("Rewards POST error:", error);
    return NextResponse.json(
      { error: "Failed to create reward" },
      { status: 500 }
    );
  }
}
