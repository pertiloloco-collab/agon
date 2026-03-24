// ═══════════════════════════════════════════════════════════
// AGON — ElevenLabs TTS Client
// API endpoint approach (no SDK dependency needed for free tier)
// ═══════════════════════════════════════════════════════════

export const MONTHLY_FREE_LIMIT = 10_000;

/**
 * Estimate character count for a given text string.
 * ElevenLabs bills per character; use this to track usage.
 */
export function estimateCharacterCount(text: string): number {
  return text.length;
}

/**
 * Generate speech audio from text via ElevenLabs API.
 * Returns an ArrayBuffer of audio data (mpeg), or null on failure.
 * Gracefully degrades: returns null if no API key, quota exceeded, or any error.
 */
export async function generateVoice(
  text: string,
  voiceId?: string
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  const voice =
    voiceId ||
    process.env.ELEVENLABS_DEFAULT_VOICE_ID ||
    "21m00Tcm4TlvDq8ikWAM"; // default: Rachel

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
            style: 0.7,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) return null; // quota exceeded or error — fall back to text
    return response.arrayBuffer();
  } catch {
    return null;
  }
}
