/**
 * POST /api/generate-image
 *
 * Generates an image via Flux 2 Klein on Pixazo.
 * Returns the image URL directly (synchronous model).
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const { prompt, negative_prompt, width = 1024, height = 1024, steps = 4, seed } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, error: "A prompt is required" }, { status: 400 });
    }

    const model = MODELS["flux-2-klein"];
    const body: Record<string, unknown> = { prompt: prompt.trim(), steps, width, height };
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (seed !== undefined) body.seed = seed;

    const result = await pixazoRequest({ apiId: model.apiId, operation: model.operation, body });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.statusCode || 502 });
    }

    const data = result.data!;
    const imageUrl = data.output || data.image_url || data.output_url || data.url;
    const requestId = data.request_id || data.requestId || data.id;

    return NextResponse.json({
      success: true,
      data: {
        request_id: requestId || null,
        status: imageUrl ? "completed" : "processing",
        image_url: imageUrl || null,
        api_id: model.apiId,
      },
    });
  } catch (err) {
    console.error("[Image] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
