/**
 * POST /api/generate-video
 *
 * Multi-model video generation endpoint.
 * Supports: Wan 2.5, Sora, Runway Gen-4.5, Kling 3.0, Luma Ray 2, Veo 3.1
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

const GATEWAY_URL = process.env.PIXAZO_GATEWAY_URL || "https://gateway.pixazo.ai";

export async function POST(req: NextRequest) {
  try {
    const {
      image_url,
      prompt,
      negative_prompt,
      audio_url,
      duration = 5,
      resolution = "720p",
      seed,
      model_id = "wan-2.5-i2v",
    } = await req.json();

    const model = MODELS[model_id];
    if (!model || model.category !== "video") {
      return NextResponse.json(
        { success: false, error: `Unknown video model: ${model_id}` },
        { status: 400 }
      );
    }

    // Some models require image_url, some work with text-only
    const isTextToVideo = model_id === "sora-text-video" || model_id === "kling-3-t2v" || model_id === "veo-3";
    if (!isTextToVideo && (!image_url || typeof image_url !== "string")) {
      return NextResponse.json(
        { success: false, error: "An image URL is required for this model" },
        { status: 400 }
      );
    }

    // Build model-specific body
    let body: Record<string, unknown> = {};

    if (model_id === "wan-2.5-i2v") {
      body = {
        img_url: image_url,
        prompt: prompt?.trim() || "Generate a smooth cinematic video from this image",
        negative_prompt: negative_prompt || "blurry, distorted, low quality",
        duration,
        resolution,
        audio: !!audio_url,
      };
    } else if (model_id.startsWith("sora")) {
      body = {
        prompt: prompt?.trim() || "Generate a cinematic video",
        ...(image_url && { image: image_url }),
        duration,
      };
    } else if (model_id === "runway-gen4") {
      body = {
        prompt: prompt?.trim() || "Generate a smooth video",
        ...(image_url && { image_url }),
        duration,
      };
    } else if (model_id.startsWith("kling")) {
      body = {
        prompt: prompt?.trim() || "Generate a high-quality video",
        ...(image_url && { image_url }),
        ...(negative_prompt && { negative_prompt }),
        duration,
      };
    } else if (model_id === "luma-ray2") {
      body = {
        prompt: prompt?.trim() || "Generate a creative video",
        ...(image_url && { image_url }),
      };
    } else if (model_id === "veo-3") {
      // Veo accepts duration of 4, 6, or 8 seconds only
      const veoDuration = [4, 6, 8].includes(duration) ? duration : 4;
      body = {
        prompt: prompt?.trim() || "Generate a photorealistic video",
        ...(image_url && { image_url }),
        duration: veoDuration,
      };
    } else {
      body = {
        prompt: prompt?.trim() || "Generate a video",
        ...(image_url && { image_url }),
        duration,
      };
    }

    if (seed != null) body.seed = seed;

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

    const d = result.data!;
    const taskId = d.task_id || d.taskId;
    const requestId = d.request_id || d.requestId || d.id;
    const videoUrl = typeof d.output === "string" && d.output.startsWith("http") ? d.output : null;

    // Build poll configuration
    let pollUrl: string | undefined;
    let pollIdField: string | undefined;

    if (model.pollUrl) {
      pollUrl = `${GATEWAY_URL}/${model.pollUrl}`;
      pollIdField = model.pollIdField || "task_id";
    }

    return NextResponse.json({
      success: true,
      data: {
        request_id: taskId || requestId || null,
        status: videoUrl ? "completed" : "processing",
        video_url: videoUrl,
        api_id: model.apiId,
        model_id: model.id,
        ...(pollUrl && { poll_url: pollUrl }),
        ...(pollIdField && { poll_id_field: pollIdField }),
        ...(model.pollOperation && { poll_operation: model.pollOperation }),
      },
    });
  } catch (err) {
    console.error("[Video] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
