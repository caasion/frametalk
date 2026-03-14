import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trail, context } = (await req.json()) as {
    trail: string[];
    context?: string[];
  };

  if (!trail || trail.length === 0) {
    return NextResponse.json({ error: "trail is required" }, { status: 400 });
  }

  const trailStr = trail.join(" → ");
  const contextBlock =
    context && context.length > 0
      ? `\nSituation context:\n${context.map((c) => `- ${c}`).join("\n")}`
      : "";

  const prompt = `You are helping a Rohingya refugee with low English literacy practice speaking English.
The user has selected these pictograms in order: ${trailStr}${contextBlock}
Generate ONE short, natural English sentence they could say in this situation.
Rules:
- Use simple A1/A2 vocabulary only. No words like "appointment" or "prescription" — say "meeting" or "medicine" instead.
- First person ("I have...", "I need...", "Can I...")
- Maximum 12 words
- Do not explain. Output ONLY the sentence, nothing else.`;

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen3:8b",
        stream: false,
        prompt,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Ollama request failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    let sentence: string = data.response ?? "";

    // Strip <think>...</think> tags that qwen3 sometimes includes
    sentence = sentence.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return NextResponse.json({ sentence });
  } catch {
    return NextResponse.json(
      { error: "Could not connect to Ollama" },
      { status: 502 }
    );
  }
}
