/**
 * POST /api/generate-video
 *
 * Generates a video from an image using Wan 2.5 on Pixazo.
 *   Submit → POST gateway.pixazo.ai/wan-video-2-5/v1/generateImageToVideo2-5Request
 *   Poll   → POST gateway.pixazo.ai/wan-video-polling/getTextToVideoResult { task_id }
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

const GATEWAY_URL = process.env.PIXAZO_GATEWAY_URL || "https://gateway.pixazo.ai";

export async function POST(req: NextRequest) {
  try {
    const { image_url, prompt, negative_prompt, audio_url, duration = 5, resolution = "720p", seed } = await req.json();

    if (!image_url || typeof image_url !== "string") {
      return NextResponse.json({ success: false, error: "An image URL is required" }, { status: 400 });
    }

    const model = MODELS["wan-2.5-i2v"];

    const body: Record<string, unknown> = {
      img_url: image_url,
      prompt: prompt?.trim() || "Generate a smooth cinematic video from this image",
      negative_prompt: negative_prompt || "blurry, distorted, low quality",
      duration,
      resolution,
      audio: !!audio_url,  // boolean toggle — Wan 2.5 does not accept audio URLs
    };
    if (seed != null) body.seed = seed;

    const result = await pixazoRequest({ apiId: model.apiId, operation: model.operation, body });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.statusCode || 502 });
    }

    const d = result.data!;
    const taskId = d.task_id || d.taskId;
    const requestId = d.request_id || d.requestId || d.id;
    const videoUrl = typeof d.output === "string" && d.output.startsWith("http") ? d.output : null;

    return NextResponse.json({
      success: true,
      data: {
        request_id: taskId || requestId || null,
        status: videoUrl ? "completed" : "processing",
        video_url: videoUrl,
        api_id: "wan-video-polling",
        poll_url: `${GATEWAY_URL}/wan-video-polling/getTextToVideoResult`,
        poll_id_field: "task_id",
      },
    });
  } catch (err) {
    console.error("[Video] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
