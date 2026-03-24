import { NextResponse } from "next/server";
import {
  getBalance,
  earnDrachma,
  burnDrachma,
  seedMockData,
  EARNING_TABLE,
  BURNING_TABLE,
  type EarningSource,
  type BurningSource,
} from "@/lib/drachma/engine";

const MOCK_USER_ID = "mock-user-id-001";
let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    seedMockData(MOCK_USER_ID);
    seeded = true;
  }
}

export async function GET() {
  try {
    ensureSeeded();
    const balance = getBalance(MOCK_USER_ID);

    return NextResponse.json({ balance }, { status: 200 });
  } catch (error) {
    console.error("Drachma GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    ensureSeeded();
    const body = await request.json();

    const { action, source, amount, referenceId } = body;

    if (!action || !source) {
      return NextResponse.json(
        { error: "action and source are required" },
        { status: 400 }
      );
    }

    if (action === "earn") {
      const defaultAmount = EARNING_TABLE[source as EarningSource];
      if (defaultAmount === undefined) {
        return NextResponse.json(
          { error: `Unknown earning source: ${source}` },
          { status: 400 }
        );
      }
      const entry = earnDrachma(
        MOCK_USER_ID,
        amount ?? defaultAmount,
        source as EarningSource,
        referenceId
      );
      const balance = getBalance(MOCK_USER_ID);
      return NextResponse.json({ success: true, entry, balance }, { status: 200 });
    }

    if (action === "burn") {
      const defaultAmount = BURNING_TABLE[source as BurningSource];
      if (defaultAmount === undefined) {
        return NextResponse.json(
          { error: `Unknown burning source: ${source}` },
          { status: 400 }
        );
      }
      const entry = burnDrachma(
        MOCK_USER_ID,
        amount ?? Math.abs(defaultAmount),
        source as BurningSource,
        referenceId
      );
      const balance = getBalance(MOCK_USER_ID);
      return NextResponse.json({ success: true, entry, balance }, { status: 200 });
    }

    return NextResponse.json(
      { error: "action must be 'earn' or 'burn'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Drachma POST error:", error);
    return NextResponse.json(
      { error: "Failed to process drachma transaction" },
      { status: 500 }
    );
  }
}
