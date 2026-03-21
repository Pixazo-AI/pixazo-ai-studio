/**
 * POST /api/generate-image
 *
 * Multi-model image generation endpoint.
 * Supports: Flux variants, GPT Image, Recraft, Studio Ghibli
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      negative_prompt,
      width = 1024,
      height = 1024,
      steps = 4,
      seed,
      model_id = "flux-2-klein",
    } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, error: "A prompt is required" }, { status: 400 });
    }

    const model = MODELS[model_id];
    if (!model || model.category !== "image") {
      return NextResponse.json(
        { success: false, error: `Unknown image model: ${model_id}` },
        { status: 400 }
      );
    }

    // Build request body
    const body: Record<string, unknown> = {
      prompt: prompt.trim(),
      width,
      height,
    };
    if (steps && model_id.includes("flux")) body.steps = steps;
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (seed !== undefined) body.seed = seed;

    const result = await pixazoRequest({
      apiId: model.apiId,
      operation: model.operation,
      body,
      skipV1: model.skipV1,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode || 502 }
      );
    }

    const data = result.data!;

    // Parse response
    let imageUrl: string | null = null;
    let requestId: string | null = null;

    imageUrl =
      (data.output as string) ||
      (data.image_url as string) ||
      (data.output_url as string) ||
      (data.url as string) ||
      null;

    requestId =
      (data.request_id as string) ||
      (data.requestId as string) ||
      (data.id as string) ||
      (data.task_id as string) ||
      null;

    return NextResponse.json({
      success: true,
      data: {
        request_id: requestId,
        status: imageUrl ? "completed" : "processing",
        image_url: imageUrl,
        api_id: model.apiId,
        model_id: model.id,
        // Pass poll config for async models
        ...(model.pollOperation && { poll_operation: model.pollOperation }),
        ...(model.pollIdField && { poll_id_field: model.pollIdField }),
      },
    });
  } catch (err) {
    console.error("[Image] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
