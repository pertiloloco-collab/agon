import { NextResponse } from "next/server";
import { AGON_DEFAULT_HABITS } from "@/lib/habits/defaults";
import { logHabit } from "@/lib/habits/engine";

// ═══════════════════════════════════════════════════════════
// POST /api/habits/[id]/log — Log a habit completion
// Returns drachma earned or lost
// ═══════════════════════════════════════════════════════════

// Mock balance for the user
const MOCK_BALANCE = 847;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { value, context } = body;

    // In production: look up habit from DB
    // const habit = await db.select().from(habits).where(eq(habits.id, id)).limit(1);
    const habit = AGON_DEFAULT_HABITS.find((h) => h.id === id);

    if (!habit) {
      // Handle custom habits with a generic response
      const isBadHabit = id.includes("bad") || (body.drachma && body.drachma < 0);
      const drachmaAmount = body.drachma || (isBadHabit ? -5 : 3);
      const newBalance = MOCK_BALANCE + drachmaAmount;

      return NextResponse.json(
        {
          success: true,
          drachmaApplied: drachmaAmount,
          newBalance,
          message: isBadHabit
            ? `Slip logged. ${Math.abs(drachmaAmount)}\u20AF deducted.`
            : `Habit completed! +${drachmaAmount}\u20AF earned.`,
          log: {
            id: crypto.randomUUID(),
            habitId: id,
            date: new Date().toISOString().split("T")[0],
            value: value ?? 1,
            context: context || "manual",
            drachmaApplied: drachmaAmount,
          },
        },
        { status: 201 }
      );
    }

    // Use the engine to log the habit
    const result = logHabit(
      habit,
      value ?? 1,
      context || "manual"
    );

    const newBalance = MOCK_BALANCE + result.drachma;

    // In production: write to habit_logs table and update drachma_ledger
    // await db.insert(habitLogs).values({ ... });
    // await db.insert(drachmaLedger).values({ ... });
    // await db.update(users).set({ drachmaBalance: newBalance }).where(eq(users.id, userId));

    return NextResponse.json(
      {
        success: true,
        drachmaApplied: result.drachma,
        newBalance,
        message: result.message,
        log: result.log,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Habit log POST error:", error);
    return NextResponse.json(
      { error: "Failed to log habit" },
      { status: 500 }
    );
  }
}
