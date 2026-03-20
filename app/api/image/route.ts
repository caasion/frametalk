import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get("prompt");
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  if (!process.env.HF_TOKEN) {
    return NextResponse.json({ error: "HF_TOKEN not configured" }, { status: 500 });
  }

  try {
    const hfRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `do not include any text in the image. ${prompt}`,
          parameters: { num_inference_steps: 8 },
        }),
        signal: AbortSignal.timeout(55000),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error("HF image error:", hfRes.status, errText.slice(0, 300));
      return NextResponse.json({ error: `HF ${hfRes.status}: ${errText.slice(0, 200)}` }, { status: 502 });
    }

    const contentType = hfRes.headers.get("content-type") ?? "image/jpeg";
    const buffer = await hfRes.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("Image generation error:", e);
    return NextResponse.json({ error: "image generation failed" }, { status: 502 });
  }
}
