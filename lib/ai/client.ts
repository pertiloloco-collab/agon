import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const FAST_MODEL = "claude-sonnet-4-20250514";
export const DEEP_MODEL = "claude-opus-4-6";
