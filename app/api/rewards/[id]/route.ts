import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: query reward by id from database
    const reward = {
      id,
      userId: "mock-user-id-001",
      name: "Mock Reward",
      description: "Placeholder reward data.",
      category: "other",
      cost: 200,
      tier: "medium",
      icon: "Gift",
      imageUrl: null,
      forgedCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ reward }, { status: 200 });
  } catch (error) {
    console.error("Reward GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reward" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedReward = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, reward: updatedReward },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reward PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update reward" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Archive (soft-delete) the reward
    return NextResponse.json(
      {
        success: true,
        reward: { id, active: false, archivedAt: new Date().toISOString() },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reward DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to archive reward" },
      { status: 500 }
    );
  }
}
