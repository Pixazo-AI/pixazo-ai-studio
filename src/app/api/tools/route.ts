/**
 * POST /api/tools
 *
 * Unified endpoint for AI tools: image-to-image, text-to-speech
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const {
      tool,
      model_id,
      prompt,
      image_url,
      text,
      voice_id,
      strength,
    } = await req.json();

    if (!tool) {
      return NextResponse.json(
        { success: false, error: "Tool type is required" },
        { status: 400 }
      );
    }

    let apiId: string;
    let operation: string;
    let body: Record<string, unknown> = {};
    let skipV1 = false;

    switch (tool) {
      case "image-to-image": {
        const mid = model_id || "recraft-i2i";
        const model = MODELS[mid];
        if (!model) {
          return NextResponse.json({ success: false, error: `Unknown model: ${mid}` }, { status: 400 });
        }
        if (!image_url || !prompt) {
          return NextResponse.json(
            { success: false, error: "Image URL and prompt required" },
            { status: 400 }
          );
        }
        apiId = model.apiId;
        operation = model.operation;
        skipV1 = !!model.skipV1;
        body = {
          image: image_url,
          prompt: prompt.trim(),
          strength: strength ?? 0.7,
        };
        break;
      }

      case "text-to-speech": {
        const model = MODELS["elevenlabs-tts"];
        apiId = model.apiId;
        operation = model.operation;
        if (!text?.trim()) {
          return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 });
        }
        body = {
          text: text.trim(),
          ...(voice_id && { voice_id }),
        };
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown tool: ${tool}` },
          { status: 400 }
        );
    }

    const result = await pixazoRequest({ apiId, operation, body, skipV1 });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.statusCode || 502 }
      );
    }

    const data = result.data!;

    // Normalize the response
    const outputUrl =
      data.url || data.output_url || data.audio_url || data.image_url || data.output;
    const requestId = data.request_id || data.requestId || data.id;

    return NextResponse.json({
      success: true,
      data: {
        request_id: requestId || null,
        status: outputUrl ? "completed" : "processing",
        output_url: outputUrl || null,
        api_id: apiId,
        tool,
      },
    });
  } catch (err) {
    console.error("[Tools] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
