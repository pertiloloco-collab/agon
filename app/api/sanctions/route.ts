import { NextResponse } from "next/server";

// Mock data matching the sanctions schema
const mockSanctions = [
  {
    id: "sanction-001",
    userId: "mock-user-id-001",
    triggerType: "missed_workout",
    sanctionDescription: "100 burpees before next workout. No exceptions. You chose rest when the protocol demanded war.",
    triggered: true,
    triggeredAt: "2026-03-22T18:00:00.000Z",
    fulfilled: false,
    fulfilledProofUrl: null,
    createdAt: "2026-03-22T18:00:00.000Z",
  },
];

export async function GET() {
  try {
    // In production: fetch sanctions for the authenticated user
    // const userSanctions = await db.select().from(sanctions).where(eq(sanctions.userId, userId));

    return NextResponse.json(
      { sanctions: mockSanctions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sanctions GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sanctions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.triggerType) {
      return NextResponse.json(
        { error: "triggerType is required" },
        { status: 400 }
      );
    }

    // In production: insert into sanctions
    // const [sanction] = await db.insert(sanctions).values({...}).returning();

    const newSanction = {
      id: crypto.randomUUID(),
      userId: "mock-user-id-001",
      triggerType: body.triggerType,
      sanctionDescription: body.sanctionDescription || null,
      triggered: true,
      triggeredAt: new Date().toISOString(),
      fulfilled: false,
      fulfilledProofUrl: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, sanction: newSanction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sanctions POST error:", error);
    return NextResponse.json(
      { error: "Failed to create sanction" },
      { status: 500 }
    );
  }
}
