import { NextResponse } from "next/server";

// Mock data matching the whyVault schema
const mockEntries = [
  {
    id: "why-001",
    userId: "mock-user-id-001",
    type: "text",
    title: "For my family",
    content: "I want my children to see a father who kept his word. Who chose discipline when it was hard. Who built something with his bare hands and iron will.",
    mediaUrl: null,
    createdAt: "2026-03-24T05:00:00.000Z",
  },
  {
    id: "why-002",
    userId: "mock-user-id-001",
    type: "text",
    title: "The man in the mirror",
    content: "I am tired of looking at someone I do not recognize. The body I carry is not the body I earned. That changes now.",
    mediaUrl: null,
    createdAt: "2026-03-24T05:05:00.000Z",
  },
  {
    id: "why-003",
    userId: "mock-user-id-001",
    type: "letter",
    title: "Letter to future self",
    content: "365 days from now you will read this. If you honoured every contract, you will feel the weight of earned pride. If you didn't, you will feel the weight of regret. Choose now which it will be.",
    mediaUrl: null,
    createdAt: "2026-03-24T05:10:00.000Z",
  },
];

export async function GET() {
  try {
    // In production: fetch why vault entries for the authenticated user
    // const entries = await db.select().from(whyVault).where(eq(whyVault.userId, userId)).orderBy(desc(whyVault.createdAt));

    return NextResponse.json(
      { entries: mockEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Why Vault GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch why vault entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // In production: insert into whyVault
    // const [entry] = await db.insert(whyVault).values({...}).returning();

    const newEntry = {
      id: crypto.randomUUID(),
      userId: "mock-user-id-001",
      type: body.type || "text",
      title: body.title,
      content: body.content || null,
      mediaUrl: body.mediaUrl || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, entry: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Why Vault POST error:", error);
    return NextResponse.json(
      { error: "Failed to create why vault entry" },
      { status: 500 }
    );
  }
}
