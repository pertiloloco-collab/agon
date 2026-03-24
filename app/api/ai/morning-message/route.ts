import { anthropic, DEEP_MODEL } from "@/lib/ai/client";
import { buildMorningMessagePrompt, type MorningContext } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      dayNumber,
      phase,
      streak,
      honorScore,
      whyVaultEntry,
      accountabilityLevel,
    } = body;

    if (!dayNumber) {
      return new Response(
        JSON.stringify({ error: "dayNumber is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const context: MorningContext = {
      dayNumber,
      totalDays: 365,
      phaseName: phase || "Foundation",
      phaseNumber: Math.ceil(dayNumber / 90),
      currentStreak: streak || 0,
      yesterdayHonorScore: honorScore || 0,
      accountabilityLevel: accountabilityLevel || "emotional_warfare",
      whyVaultEntry: whyVaultEntry || "To become who I was meant to be.",
    };

    const prompt = buildMorningMessagePrompt(context);

    const response = await anthropic.messages.create({
      model: DEEP_MODEL,
      max_tokens: 512,
      system: prompt,
      messages: [
        {
          role: "user",
          content: "Generate today's morning wake-up message.",
        },
      ],
    });

    const message =
      response.content[0].type === "text"
        ? response.content[0].text
        : "";

    return new Response(
      JSON.stringify({ message }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Morning message API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate morning message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
