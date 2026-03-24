import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// POST /api/tasks/[id]/complete — Marks a task as complete
// ═══════════════════════════════════════════════════════════

interface CompleteTaskRequest {
  proofUrl?: string;
  proofText?: string;
}

interface CompleteTaskResponse {
  completed: boolean;
  completedAt: string;
  drachmaEarned: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CompleteTaskRequest = await request.json();

    // In production: verify task exists and belongs to user
    // const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    // if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    // In production: update task as completed and credit drachma
    // await db.update(tasks).set({
    //   completed: true,
    //   completedAt: new Date().toISOString(),
    //   proofUrl: body.proofUrl,
    //   proofText: body.proofText,
    // }).where(eq(tasks.id, id));
    // await creditDrachma(userId, 5, `Task completed: ${id}`);

    console.log(`Task ${id} completed with proof:`, {
      proofUrl: body.proofUrl || null,
      proofText: body.proofText || null,
    });

    const response: CompleteTaskResponse = {
      completed: true,
      completedAt: new Date().toISOString(),
      drachmaEarned: 5,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Task complete POST error:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
