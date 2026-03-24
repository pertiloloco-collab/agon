import { NextResponse } from "next/server";

// Mock data matching the bodyStats schema
const mockBodyStats = [
  {
    id: "stats-001",
    userId: "mock-user-id-001",
    date: "2026-03-24",
    weight: "91.00",
    bodyFatEstimate: "22.0",
    waistCm: "88.0",
    shouldersCm: "118.0",
    chestCm: "102.0",
    armsCm: "36.0",
    legsCm: "58.0",
    progressPhotoFront: null,
    progressPhotoSide: null,
    notes: "Starting measurements. Day 1.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stats-002",
    userId: "mock-user-id-001",
    date: "2026-03-17",
    weight: "91.50",
    bodyFatEstimate: "22.5",
    waistCm: "88.5",
    shouldersCm: "117.5",
    chestCm: "101.5",
    armsCm: "35.5",
    legsCm: "57.5",
    progressPhotoFront: null,
    progressPhotoSide: null,
    notes: "Pre-program baseline.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // In production: fetch body stats for the authenticated user
    // const stats = await db.select().from(bodyStats).where(eq(bodyStats.userId, userId)).orderBy(desc(bodyStats.date));

    return NextResponse.json(
      { stats: mockBodyStats },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stats GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch body stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In production: insert into bodyStats
    // const [stat] = await db.insert(bodyStats).values({...}).returning();

    const newStat = {
      id: crypto.randomUUID(),
      userId: "mock-user-id-001",
      date: body.date || new Date().toISOString().split("T")[0],
      weight: body.weight || null,
      bodyFatEstimate: body.bodyFatEstimate || null,
      waistCm: body.waistCm || null,
      shouldersCm: body.shouldersCm || null,
      chestCm: body.chestCm || null,
      armsCm: body.armsCm || null,
      legsCm: body.legsCm || null,
      progressPhotoFront: body.progressPhotoFront || null,
      progressPhotoSide: body.progressPhotoSide || null,
      notes: body.notes || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, stat: newStat },
      { status: 201 }
    );
  } catch (error) {
    console.error("Stats POST error:", error);
    return NextResponse.json(
      { error: "Failed to save body stats" },
      { status: 500 }
    );
  }
}
