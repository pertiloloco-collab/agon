import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // TODO: In production, save onboarding data to Supabase
    // For now, accept the data and return success
    console.log("Onboarding completed:", {
      height: data.height,
      currentWeight: data.currentWeight,
      targetWeight: data.targetWeight,
      accountabilityLevel: data.accountabilityLevel,
      startDate: data.startDate,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
