/**
 * POST /api/generate-music
 *
 * Multi-model music generation endpoint.
 * Primary: Google Lyria 2
 * Fallbacks: ElevenLabs Music, minimax-music, stable-audio
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";
import { MODELS } from "@/lib/models";

const isUrl = (v: unknown): v is string => typeof v === "string" && v.startsWith("http");

// Provider chain for fallback
const MUSIC_CHAIN = [
  {
    model: MODELS["lyria-2"],
    bodyKey: "prompt",
    extraBody: {},
    pollOperation: "lyria-2/prediction",
    pollIdField: "prediction_id",
  },
  {
    model: { apiId: "elevenlabs-music-api-368", operation: "elevenlabs-music-api-request" },
    bodyKey: "prompt",
    extraBody: {},
    pollOperation: "elevenlabs-music-api-request-result",
  },
  {
    model: { apiId: "minimax-music", operation: "minimax-music/generate" },
    bodyKey: "prompt",
    extraBody: {},
    pollOperation: "minimax-music/prediction",
    pollIdField: "prediction_id",
  },
  {
    model: { apiId: "stable-audio", operation: "stable-audio/generate" },
    bodyKey: "prompt",
    extraBody: {},
    pollOperation: "stable-audio/prediction",
    pollIdField: "prediction_id",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 30, temperature, seed, model_id } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: "A prompt is required" },
        { status: 400 }
      );
    }

    // If a specific model is requested, try only that model
    if (model_id && model_id !== "lyria-2") {
      const model = MODELS[model_id];
      if (!model || model.category !== "music") {
        return NextResponse.json(
          { success: false, error: `Unknown music model: ${model_id}` },
          { status: 400 }
        );
      }

      const body: Record<string, unknown> = {
        prompt: prompt.trim(),
        duration,
        duration_seconds: duration,
      };
      if (temperature !== undefined) body.temperature = temperature;
      if (seed !== undefined) body.seed = seed;

      const result = await pixazoRequest({
        apiId: model.apiId,
        operation: model.operation,
        body,
      });

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: result.statusCode || 502 }
        );
      }

      const data = result.data!;
      const audioUrl = data.audio_url || data.output_url || data.url || (isUrl(data.audio) ? data.audio : null) || data.output;
      const requestId = data.request_id || data.requestId || data.prediction_id || data.id;

      return NextResponse.json({
        success: true,
        data: {
          request_id: requestId || null,
          status: audioUrl ? "completed" : "processing",
          audio_url: audioUrl || null,
          api_id: model.apiId,
          model_id: model.id,
          poll_operation: model.pollOperation,
          ...(model.pollIdField && { poll_id_field: model.pollIdField }),
        },
      });
    }

    // Default: use fallback chain starting with Lyria 2
    let lastError = "All music providers failed";

    for (const provider of MUSIC_CHAIN) {
      try {
        const body: Record<string, unknown> = {
          [provider.bodyKey]: prompt.trim(),
          duration,
          duration_seconds: duration, // Lyria reads duration_seconds; safe to send for all
          ...provider.extraBody,
        };
        if (temperature !== undefined) body.temperature = temperature;
        if (seed !== undefined) body.seed = seed;

        const result = await pixazoRequest({
          apiId: provider.model.apiId,
          operation: provider.model.operation,
          body,
          retries: 1,
        });

        if (!result.success) {
          lastError = result.error || `${provider.model.apiId} failed`;
          console.warn(`[Music] ${provider.model.apiId} failed: ${lastError}`);
          continue;
        }

        const data = result.data!;
        const audioUrl = data.audio_url || data.output_url || data.url || data.output || (isUrl(data.audio) ? data.audio : null);
        const requestId = data.request_id || data.requestId || data.prediction_id || data.id;

        return NextResponse.json({
          success: true,
          data: {
            request_id: requestId || null,
            status: audioUrl ? "completed" : "processing",
            audio_url: audioUrl || null,
            api_id: provider.model.apiId,
            poll_operation: provider.pollOperation,
            ...(provider.pollIdField && { poll_id_field: provider.pollIdField }),
          },
        });
      } catch (err) {
        lastError = err instanceof Error ? err.message : "Unknown error";
        console.warn(`[Music] ${provider.model.apiId} threw: ${lastError}`);
        continue;
      }
    }

    return NextResponse.json(
      { success: false, error: lastError },
      { status: 502 }
    );
  } catch (err) {
    console.error("[Music] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
