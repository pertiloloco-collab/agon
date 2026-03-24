import { anthropic, FAST_MODEL } from "@/lib/ai/client";
import { buildEveningDebriefPrompt, type DebriefContext } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      dayNumber,
      tasksCompleted,
      totalTasks,
      tasksCompletedList,
      tasksMissedList,
      selfRating,
      userNotes,
      tomorrowWorkout,
      currentStreak,
    } = body;

    if (!dayNumber || totalTasks === undefined) {
      return new Response(
        JSON.stringify({ error: "dayNumber and totalTasks are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const context: DebriefContext = {
      dayNumber,
      tasksCompleted: tasksCompleted || 0,
      totalTasks,
      tasksCompletedList: tasksCompletedList || [],
      tasksMissedList: tasksMissedList || [],
      selfRating: selfRating || 5,
      userNotes: userNotes || "",
      tomorrowWorkout: tomorrowWorkout || "Rest day",
      currentStreak: currentStreak || 0,
    };

    const prompt = buildEveningDebriefPrompt(context);

    const response = await anthropic.messages.create({
      model: FAST_MODEL,
      max_tokens: 1024,
      system: prompt,
      messages: [
        {
          role: "user",
          content: "Generate tonight's evening debrief.",
        },
      ],
    });

    const debrief =
      response.content[0].type === "text"
        ? response.content[0].text
        : "";

    return new Response(
      JSON.stringify({ debrief }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Evening debrief API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate evening debrief" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
