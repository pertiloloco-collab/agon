import { NextResponse } from "next/server";
import { generateVoice } from "@/lib/voice/elevenlabs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, voiceId } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text exceeds maximum length of 5000 characters" },
        { status: 400 }
      );
    }

    const audioBuffer = await generateVoice(text, voiceId);

    if (!audioBuffer) {
      // Graceful fallback: no API key, quota exceeded, or ElevenLabs error
      return NextResponse.json(
        {
          error: "Voice generation unavailable",
          fallback: true,
          text,
        },
        { status: 503 }
      );
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Voice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
