import { NextResponse } from "next/server";
import { suggestPrice } from "@/lib/drachma/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Reward name is required" },
        { status: 400 }
      );
    }

    const suggestion = suggestPrice(body.name, body.description || "");

    return NextResponse.json({ suggestion }, { status: 200 });
  } catch (error) {
    console.error("Suggest price error:", error);
    return NextResponse.json(
      { error: "Failed to suggest price" },
      { status: 500 }
    );
  }
}
