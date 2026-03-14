/**
 * TTS API route – uses browser SpeechSynthesis on the client side,
 * so this endpoint generates the SSML-equivalent pacing instructions
 * as a JSON response that the client can use to chain utterances.
 *
 * POST /api/tts
 * Body: { sentence: string }
 * Response: { sentence, words, ssml }
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Generates an SSML string (kept for documentation / future use with a
 * cloud TTS provider). The actual TTS is done client-side via the
 * browser SpeechSynthesis API.
 */
export function generateSsml(sentence: string): string {
  const words = sentence.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "<speak></speak>";

  const wordByWord = words.join(' <break time="1s"/> ');

  return [
    "<speak>",
    `  ${sentence}`,
    '  <break time="1s"/>',
    '  <prosody rate="x-slow">',
    `    ${wordByWord}`,
    "  </prosody>",
    "</speak>",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const { sentence } = (await req.json()) as { sentence: string };

    if (!sentence?.trim()) {
      return NextResponse.json(
        { error: "sentence is required" },
        { status: 400 }
      );
    }

    const words = sentence.trim().split(/\s+/);
    const ssml = generateSsml(sentence);

    return NextResponse.json({ sentence, words, ssml });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
