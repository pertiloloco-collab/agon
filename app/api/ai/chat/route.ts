import { anthropic, FAST_MODEL } from "@/lib/ai/client";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const { messages, userContext } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build system prompt with context (use defaults if no context provided)
    const systemPrompt = buildChatSystemPrompt(
      userContext || {
        dayNumber: 1,
        phaseName: "Foundation",
        weekNumber: 1,
        currentWeight: 91,
        startingWeight: 91,
        targetWeight: 80,
        currentStreak: 0,
        honorScore: 0,
        todayWorkout: "Upper A",
        workoutCompleted: false,
        last7DaysSummary: "Just starting",
        whyVaultEntry: "For my family.",
        accountabilityLevel: "emotional_warfare",
      }
    );

    const stream = await anthropic.messages.stream({
      model: FAST_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                  )
                );
              }
            }
            controller.enqueue(
              new TextEncoder().encode("data: [DONE]\n\n")
            );
            controller.close();
          } catch (error) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
              )
            );
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
