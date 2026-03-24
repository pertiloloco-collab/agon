import { anthropic, DEEP_MODEL } from "@/lib/ai/client";
import { buildSanctionMessagePrompt, type SanctionContext } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      failureType,
      details,
      streakBeforeFailure,
      dayNumber,
      whyVaultEntries,
    } = body;

    if (!failureType || !dayNumber) {
      return new Response(
        JSON.stringify({ error: "failureType and dayNumber are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const context: SanctionContext = {
      failureType,
      details: details || "",
      streakBeforeFailure: streakBeforeFailure || 0,
      dayNumber,
      whyVaultEntries: whyVaultEntries || [],
    };

    const prompt = buildSanctionMessagePrompt(context);

    const response = await anthropic.messages.create({
      model: DEEP_MODEL,
      max_tokens: 512,
      system: prompt,
      messages: [
        {
          role: "user",
          content: "Generate the sanction message for this failure.",
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
    console.error("Sanction message API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sanction message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
