import { NextResponse } from "next/server";

// Mock data matching the dailyContracts + tasks schema
const mockContract = {
  id: "contract-001",
  userId: "mock-user-id-001",
  date: new Date().toISOString().split("T")[0],
  signed: false,
  signedAt: null,
  honorScore: null,
  aiMorningMessage: null,
  aiEveningDebrief: null,
  rating: null,
  notes: null,
  createdAt: new Date().toISOString(),
  tasks: [
    {
      id: "task-001",
      title: "Complete Upper A workout",
      category: "workout",
      description: "Bench Press 4x8, Barbell Row 4x8, OHP 3x10, Pull-ups 3xAMRAP, Lateral Raises 3x15",
      completed: false,
      proofRequired: true,
      proofType: "check_in",
    },
    {
      id: "task-002",
      title: "Hit protein target (180g)",
      category: "nutrition",
      description: "Track all meals. Minimum 180g protein across the day.",
      completed: false,
      proofRequired: true,
      proofType: "text",
    },
    {
      id: "task-003",
      title: "10-minute cold exposure",
      category: "habit",
      description: "Cold shower or ice bath for minimum 10 minutes.",
      completed: false,
      proofRequired: false,
      proofType: "none",
    },
    {
      id: "task-004",
      title: "Evening reflection journal",
      category: "mindset",
      description: "Write 3 sentences about today's battle. What did you conquer?",
      completed: false,
      proofRequired: true,
      proofType: "text",
    },
    {
      id: "task-005",
      title: "Stay under calorie target (2200 kcal)",
      category: "nutrition",
      description: "Log all food. Do not exceed 2200 kcal.",
      completed: false,
      proofRequired: true,
      proofType: "text",
    },
  ],
};

export async function GET() {
  try {
    // In production: fetch today's contract for the authenticated user
    // const contract = await db.select().from(dailyContracts).where(...).limit(1);

    return NextResponse.json(
      { contract: mockContract },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contracts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production: create a new daily contract with tasks
    // const [contract] = await db.insert(dailyContracts).values({...}).returning();
    // for (const task of body.tasks) { await db.insert(tasks).values({...}); }

    const newContract = {
      ...mockContract,
      id: crypto.randomUUID(),
      date: body.date || new Date().toISOString().split("T")[0],
      signed: body.signed || false,
      tasks: body.tasks || mockContract.tasks,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, contract: newContract },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contracts POST error:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}
