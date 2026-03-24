import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════
// POST /api/habits/suggest — AGON reviews a habit suggestion
// ═══════════════════════════════════════════════════════════

interface HabitSuggestionRequest {
  name: string;
  description: string;
  type: "good" | "bad";
  drachmaValue: number;
}

interface HabitSuggestionResponse {
  approvedValue: number;
  comment: string;
  adjustmentReason?: string;
}

// Severe bad habits that warrant higher penalties
const SEVERE_BAD_HABITS = [
  "smoking",
  "binge",
  "alcohol",
  "drugs",
  "gambling",
  "vaping",
  "junk food",
  "fast food",
  "soda",
  "energy drink",
];

export async function POST(request: Request) {
  try {
    const body: HabitSuggestionRequest = await request.json();

    if (!body.name || !body.type || body.drachmaValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, type, drachmaValue" },
        { status: 400 }
      );
    }

    // In production: use AI to evaluate the habit and its drachma value
    // const evaluation = await evaluateHabitWithAI(body);

    let approvedValue = body.drachmaValue;
    let comment: string;
    let adjustmentReason: string | undefined;

    if (body.type === "bad") {
      // Bad habits should have negative values
      const value = Math.abs(body.drachmaValue) * -1;
      const nameAndDesc = `${body.name} ${body.description}`.toLowerCase();

      const isSevere = SEVERE_BAD_HABITS.some((keyword) =>
        nameAndDesc.includes(keyword)
      );

      if (isSevere && value > -5) {
        // Penalty too low for a severe habit — bump it up
        approvedValue = -10;
        adjustmentReason =
          "This habit has significant health impact. AGON has increased the penalty to reflect the true cost of this behavior.";
        comment =
          "A warrior knows their weaknesses. This penalty reflects the real damage this habit inflicts on your goals.";
      } else {
        approvedValue = value;
        comment =
          "Acknowledged. Every time you resist, you grow stronger. Every slip costs you.";
      }
    } else {
      // Good habits: cap at 10 if too high
      if (body.drachmaValue > 10) {
        approvedValue = 10;
        adjustmentReason =
          "Maximum drachma for a single good habit is 10. Earn more by stacking multiple disciplines.";
        comment =
          "Ambition noted, warrior. But drachma are earned through consistency, not inflation. Value capped at 10.";
      } else if (body.drachmaValue < 1) {
        approvedValue = 1;
        adjustmentReason =
          "Minimum reward for a good habit is 1 drachma. Every discipline deserves recognition.";
        comment =
          "Even small victories deserve recognition. Minimum value set to 1.";
      } else {
        comment =
          "A worthy discipline. Add this to your arsenal and earn your drachma through action.";
      }
    }

    const response: HabitSuggestionResponse = {
      approvedValue,
      comment,
      ...(adjustmentReason && { adjustmentReason }),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Habit suggest POST error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate habit suggestion" },
      { status: 500 }
    );
  }
}
