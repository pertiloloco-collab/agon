import { NextResponse } from "next/server";

// Mock data matching the workoutLogs schema
const mockWorkoutLogs = [
  {
    id: "workout-001",
    userId: "mock-user-id-001",
    date: new Date().toISOString().split("T")[0],
    phase: 1,
    week: 1,
    dayType: "Upper A",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { reps: 8, weight: 70, rpe: 7 },
          { reps: 8, weight: 70, rpe: 8 },
          { reps: 7, weight: 70, rpe: 9 },
          { reps: 6, weight: 70, rpe: 9 },
        ],
      },
      {
        name: "Barbell Row",
        sets: [
          { reps: 8, weight: 60, rpe: 7 },
          { reps: 8, weight: 60, rpe: 7 },
          { reps: 8, weight: 60, rpe: 8 },
          { reps: 7, weight: 60, rpe: 8 },
        ],
      },
      {
        name: "Overhead Press",
        sets: [
          { reps: 10, weight: 40, rpe: 7 },
          { reps: 10, weight: 40, rpe: 8 },
          { reps: 9, weight: 40, rpe: 9 },
        ],
      },
    ],
    durationMinutes: 62,
    notes: "Felt strong on bench. Grip failing on rows by set 4.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // In production: fetch workout logs for the authenticated user
    // const logs = await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId));

    return NextResponse.json(
      { workouts: mockWorkoutLogs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Workouts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production: insert into workoutLogs
    // const [log] = await db.insert(workoutLogs).values({...}).returning();

    const newLog = {
      id: crypto.randomUUID(),
      userId: "mock-user-id-001",
      date: body.date || new Date().toISOString().split("T")[0],
      phase: body.phase || 1,
      week: body.week || 1,
      dayType: body.dayType || "Upper A",
      exercises: body.exercises || [],
      durationMinutes: body.durationMinutes || null,
      notes: body.notes || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, workout: newLog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workouts POST error:", error);
    return NextResponse.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}
