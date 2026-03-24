import { NextResponse } from "next/server";

// In production, this would query the database
const mockHabitMap: Record<string, { id: string; name: string; icon: string; type: string; category: string; drachmaReward: number; frequency: string; targetCount: number; unit: string; source: string; active: boolean; description: string }> = {
  "habit-good-001": {
    id: "habit-good-001",
    name: "Morning Cold Shower",
    icon: "Snowflake",
    type: "good",
    category: "discipline",
    drachmaReward: 15,
    frequency: "daily",
    targetCount: 1,
    unit: "session",
    source: "agon",
    active: true,
    description: "Take a cold shower within 30 minutes of waking up.",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production: query habit by id from database
    const habit = mockHabitMap[id] || {
      id,
      name: "Unknown Habit",
      icon: "Circle",
      type: "good",
      category: "other",
      drachmaReward: 10,
      frequency: "daily",
      targetCount: 1,
      unit: "occurrence",
      source: "agon",
      active: true,
      description: "Habit not found in mock data, returning placeholder.",
    };

    return NextResponse.json({ habit }, { status: 200 });
  } catch (error) {
    console.error("Habit GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit" },
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

    // In production: update habit in database
    const updatedHabit = {
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, habit: updatedHabit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Habit PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
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

    // In production: soft-delete by setting active = false
    return NextResponse.json(
      {
        success: true,
        habit: { id, active: false, deactivatedAt: new Date().toISOString() },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Habit DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate habit" },
      { status: 500 }
    );
  }
}
