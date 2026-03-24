import { NextResponse } from "next/server";
import { AGON_DEFAULT_HABITS } from "@/lib/habits/defaults";

// ═══════════════════════════════════════════════════════════
// GET /api/habits — Returns all habits for the user
// ═══════════════════════════════════════════════════════════

export async function GET() {
  try {
    // In production: fetch habits from DB for the authenticated user
    // const userHabits = await db.select().from(habits).where(eq(habits.userId, userId));

    // Mock: return AGON defaults as if they belong to the user
    const mockHabits = AGON_DEFAULT_HABITS.map((habit) => ({
      ...habit,
      userId: "mock-user-id-001",
      active: true,
    }));

    return NextResponse.json({ habits: mockHabits }, { status: 200 });
  } catch (error) {
    console.error("Habits GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════
// POST /api/habits — Creates a new custom habit
// ═══════════════════════════════════════════════════════════

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.type || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, category" },
        { status: 400 }
      );
    }

    // In production: insert into habits table
    // const [newHabit] = await db.insert(habits).values({
    //   userId,
    //   name: body.name,
    //   type: body.type,
    //   ...
    // }).returning();

    const newHabit = {
      id: `custom-${crypto.randomUUID()}`,
      userId: "mock-user-id-001",
      name: body.name,
      icon: body.icon || "\u2728",
      type: body.type,
      category: body.category,
      drachma: body.drachma || (body.type === "good" ? 3 : -5),
      frequency: body.frequency || "daily",
      target: body.target || undefined,
      unit: body.unit || undefined,
      description: body.description || "",
      allPhases: true,
      source: "custom" as const,
      active: true,
    };

    return NextResponse.json(
      { success: true, habit: newHabit },
      { status: 201 }
    );
  } catch (error) {
    console.error("Habits POST error:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
