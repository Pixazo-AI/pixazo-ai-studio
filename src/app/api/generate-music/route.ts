/**
 * POST /api/generate-music
 *
 * Generates music via Google Lyria 2 on Pixazo.
 *   Submit → POST gateway.pixazo.ai/lyria-2/v1/lyria-2/generate
 *   Poll   → POST gateway.pixazo.ai/lyria-2/v1/lyria-2/prediction { prediction_id }
 *
 * Falls back to alternative music models if the primary endpoint is unavailable.
 */

import { NextRequest, NextResponse } from "next/server";
import { pixazoRequest } from "@/lib/pixazo-client";

interface MusicEndpoint {
  apiId: string;
  operation: string;
  pollOperation: string;
  label: string;
}

const ENDPOINTS: MusicEndpoint[] = [
  // Primary – verified working
  { apiId: "lyria-2", operation: "lyria-2/generate", pollOperation: "lyria-2/prediction", label: "lyria-2" },
  // Fallbacks
  { apiId: "minimax-music", operation: "minimax-music/generate", pollOperation: "minimax-music/prediction", label: "minimax-music" },
  { apiId: "stable-audio", operation: "stable-audio/generate", pollOperation: "stable-audio/prediction", label: "stable-audio" },
];

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration, temperature, seed } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, error: "A prompt is required" }, { status: 400 });
    }

    const body: Record<string, unknown> = { prompt: prompt.trim() };
    if (duration != null) { body.duration = duration; body.duration_seconds = duration; }
    if (temperature != null) body.temperature = temperature;
    if (seed != null) body.seed = seed;

    let lastError = "";
    let lastStatus = 0;

    for (const ep of ENDPOINTS) {
      const result = await pixazoRequest({ apiId: ep.apiId, operation: ep.operation, body, retries: 3 });

      if (result.success && result.data) {
        const d = result.data;
        const audioUrl = d.audio || d.output || d.audio_url || d.output_url || d.url;
        const requestId = d.request_id || d.requestId || d.id || d.prediction_id;
        const raw = ((d.status as string) || "").toLowerCase();
        const done = typeof audioUrl === "string" && audioUrl.startsWith("http") &&
          ["succeeded", "completed", "success"].includes(raw);

        return NextResponse.json({
          success: true,
          data: {
            request_id: requestId || null,
            status: done ? "completed" : "processing",
            audio_url: (typeof audioUrl === "string" && audioUrl.startsWith("http")) ? audioUrl : null,
            api_id: ep.apiId,
            poll_operation: ep.pollOperation,
          },
        });
      }

      lastError = result.error || "Unknown error";
      lastStatus = result.statusCode || 502;

      // Auth failure → stop immediately
      if (lastStatus === 401 || lastStatus === 403) {
        return NextResponse.json(
          { success: false, error: `Authentication failed (${lastStatus}). Check your API key.` },
          { status: lastStatus },
        );
      }
    }

    return NextResponse.json(
      { success: false, error: `Music generation failed: ${lastError}` },
      { status: 502 },
    );
  } catch (err) {
    console.error("[Music] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
