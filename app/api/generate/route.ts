import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trail } = (await req.json()) as { trail: string[] };

  if (!trail || trail.length === 0) {
    return NextResponse.json({ error: "trail is required" }, { status: 400 });
  }

  const trailStr = trail.join(" → ");

  const prompt = `You are helping a Rohingya refugee with low English literacy practice speaking English.
The user has selected these pictograms in order: ${trailStr}
Generate ONE short, natural English sentence they could say in this situation.
Rules:
- Use simple A1/A2 vocabulary only. No words like "appointment" or "prescription" — say "meeting" or "medicine" instead.
- First person ("I have...", "I need...", "Can I...")
- Maximum 12 words
- Do not explain. Output ONLY the sentence, nothing else.`;

  // 1. Try Gemini if API key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const sentence =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

        if (sentence) {
          return NextResponse.json({ sentence });
        }
      }
      console.warn("Gemini request failed or returned empty. Falling back to Ollama.");
    } catch (e) {
      console.error("Gemini error:", e);
      // Fall through to Ollama
    }
  }

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
  } catch (error) {
    console.error("Ollama connection failed:", error);

    // If both services fail, return a fallback sentence so the app still works
    console.warn("Both AI services failed. Using fallback sentence generation.");
    const fallbackSentence = "I want " + trail.join(" ") + ".";
    return NextResponse.json({ sentence: fallbackSentence });
  }
  }

