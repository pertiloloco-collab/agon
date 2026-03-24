import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// GET /api/tasks — Returns tasks for today's contract
// ═══════════════════════════════════════════════════════════

interface Task {
  id: string;
  contractId: string;
  title: string;
  category: "workout" | "nutrition" | "habit" | "mindset";
  description: string;
  completed: boolean;
  completedAt: string | null;
  proofRequired: boolean;
  proofType: "photo" | "text" | "check_in" | "none";
  proofUrl: string | null;
  proofText: string | null;
  drachmaValue: number;
  sortOrder: number;
}

const mockTasks: Task[] = [
  {
    id: "task-001",
    contractId: "contract-001",
    title: "Complete Upper A workout",
    category: "workout",
    description:
      "Bench Press 4x8, Barbell Row 4x8, OHP 3x10, Pull-ups 3xAMRAP, Lateral Raises 3x15",
    completed: false,
    completedAt: null,
    proofRequired: true,
    proofType: "check_in",
    proofUrl: null,
    proofText: null,
    drachmaValue: 10,
    sortOrder: 1,
  },
  {
    id: "task-002",
    contractId: "contract-001",
    title: "Hit protein target (180g)",
    category: "nutrition",
    description: "Track all meals. Minimum 180g protein across the day.",
    completed: false,
    completedAt: null,
    proofRequired: true,
    proofType: "text",
    proofUrl: null,
    proofText: null,
    drachmaValue: 5,
    sortOrder: 2,
  },
  {
    id: "task-003",
    contractId: "contract-001",
    title: "10-minute cold exposure",
    category: "habit",
    description: "Cold shower or ice bath for minimum 10 minutes.",
    completed: false,
    completedAt: null,
    proofRequired: false,
    proofType: "none",
    proofUrl: null,
    proofText: null,
    drachmaValue: 5,
    sortOrder: 3,
  },
  {
    id: "task-004",
    contractId: "contract-001",
    title: "Evening reflection journal",
    category: "mindset",
    description:
      "Write 3 sentences about today's battle. What did you conquer?",
    completed: false,
    completedAt: null,
    proofRequired: true,
    proofType: "text",
    proofUrl: null,
    proofText: null,
    drachmaValue: 5,
    sortOrder: 4,
  },
  {
    id: "task-005",
    contractId: "contract-001",
    title: "Stay under calorie target (2200 kcal)",
    category: "nutrition",
    description: "Log all food. Do not exceed 2200 kcal.",
    completed: false,
    completedAt: null,
    proofRequired: true,
    proofType: "text",
    proofUrl: null,
    proofText: null,
    drachmaValue: 5,
    sortOrder: 5,
  },
];

export async function GET() {
  try {
    // In production: fetch tasks for today's contract for the authenticated user
    // const userTasks = await db.select().from(tasks)
    //   .where(eq(tasks.contractId, todayContractId));

    return NextResponse.json({ tasks: mockTasks }, { status: 200 });
  } catch (error) {
    console.error("Tasks GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════
// POST /api/tasks — Creates a new task
// ═══════════════════════════════════════════════════════════

interface CreateTaskRequest {
  contractId: string;
  title: string;
  category: "workout" | "nutrition" | "habit" | "mindset";
  description?: string;
  proofRequired?: boolean;
  proofType?: "photo" | "text" | "check_in" | "none";
  drachmaValue?: number;
}

export async function POST(request: Request) {
  try {
    const body: CreateTaskRequest = await request.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, category" },
        { status: 400 }
      );
    }

    // In production: insert into tasks table
    // const [newTask] = await db.insert(tasks).values({...}).returning();

    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      contractId: body.contractId || "contract-001",
      title: body.title,
      category: body.category,
      description: body.description || "",
      completed: false,
      completedAt: null,
      proofRequired: body.proofRequired ?? false,
      proofType: body.proofType || "none",
      proofUrl: null,
      proofText: null,
      drachmaValue: body.drachmaValue ?? 5,
      sortOrder: mockTasks.length + 1,
    };

    return NextResponse.json(
      { success: true, task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
