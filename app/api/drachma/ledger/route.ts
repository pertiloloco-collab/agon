import { NextResponse } from "next/server";
import { getLedger, seedMockData } from "@/lib/drachma/engine";

const MOCK_USER_ID = "mock-user-id-001";
let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    seedMockData(MOCK_USER_ID);
    seeded = true;
  }
}

export async function GET(request: Request) {
  try {
    ensureSeeded();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const type = searchParams.get("type"); // "earn" | "burn" | "purchase" | null

    let entries = getLedger(MOCK_USER_ID, limit);

    if (type === "earn") {
      entries = entries.filter((e) => e.amount > 0);
    } else if (type === "burn") {
      entries = entries.filter((e) => e.amount < 0 && !e.description.startsWith("Forged:"));
    } else if (type === "purchase") {
      entries = entries.filter((e) => e.description.startsWith("Forged:"));
    }

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("Ledger GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ledger" },
      { status: 500 }
    );
  }
}
