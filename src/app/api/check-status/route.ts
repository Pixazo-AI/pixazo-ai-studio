/**
 * POST /api/check-status
 *
 * Polls the status of an async generation request.
 *
 * Supports three polling styles:
 *   1. poll_url  – exact URL provided by the submit endpoint (Wan video)
 *   2. poll_operation – path appended to gateway/{api_id}/v1/ (Lyria)
 *   3. Fallback  – GET gateway/{api_id}/v1/status/{request_id}
 *
 * Body: { api_id, request_id, poll_operation?, poll_id_field?, poll_url? }
 */

import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.PIXAZO_GATEWAY_URL || "https://gateway.pixazo.ai";
const API_KEY = process.env.PIXAZO_API_KEY || "";

// ── Helpers ────────────────────────────────────────────────────

const isUrl = (v: unknown): v is string => typeof v === "string" && v.startsWith("http");

async function fetchRetry(url: string, opts: RequestInit, retries = 2): Promise<Response> {
  let last: Error | null = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, opts);
      if (r.ok || (r.status >= 400 && r.status < 500)) return r;
      if (i < retries) { await new Promise((r) => setTimeout(r, 1000 << i)); continue; }
      return r;
    } catch (e) {
      last = e instanceof Error ? e : new Error(String(e));
      if (i < retries) await new Promise((r) => setTimeout(r, 1000 << i));
    }
  }
  throw last || new Error("Fetch failed");
}

// ── Route Handler ──────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { api_id, request_id, poll_operation, poll_id_field, poll_url } = await req.json();

    if (!request_id) {
      return NextResponse.json({ success: false, error: "request_id is required" }, { status: 400 });
    }

    // Build fetch URL & options
    let url: string;
    let opts: RequestInit;

    if (poll_url) {
      // 1. Exact URL (e.g. wan-video-polling/getTextToVideoResult)
      url = poll_url;
      opts = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": API_KEY },
        body: JSON.stringify({ [poll_id_field || "request_id"]: request_id }),
      };
    } else if (poll_operation) {
      // 2. Operation path (e.g. lyria-2/prediction → /lyria-2/v1/lyria-2/prediction)
      //    or prediction → /studio-ghibli/v1/prediction
      url = `${GATEWAY_URL}/${api_id}/v1/${poll_operation}`;

      let idField = poll_id_field || "request_id";
      if (!poll_id_field && poll_operation.includes("prediction")) idField = "prediction_id";

      opts = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Ocp-Apim-Subscription-Key": API_KEY },
        body: JSON.stringify({ [idField]: request_id }),
      };
    } else {
      // 3. Fallback GET
      url = `${GATEWAY_URL}/${api_id}/v1/status/${request_id}`;
      opts = { method: "GET", headers: { "Ocp-Apim-Subscription-Key": API_KEY } };
    }

    console.log(`[Status] Polling: ${opts.method} ${url}`, opts.body ? `Body: ${opts.body}` : "");

    const res = await fetchRetry(url, opts);

    if (!res.ok) {
      const text = await res.text();
      console.error(`[Status] Poll failed: ${res.status} ${text.slice(0, 200)}`);
      return NextResponse.json(
        { success: false, error: `Status check failed (${res.status}): ${text.slice(0, 100)}` },
        { status: 502 },
      );
    }

    const data = await res.json();

    console.log("[Status] Raw response:", JSON.stringify(data).slice(0, 500));

    // Wan wraps results in an "output" object — flatten it
    const nested = data.output && typeof data.output === "object" && !Array.isArray(data.output) ? data.output : null;
    const flat = nested ? { ...data, ...nested } : data;

    // Handle output array (e.g. Studio Ghibli returns output: ["url1", "url2"])
    const outputArray = Array.isArray(flat.output) ? flat.output : null;
    const firstArrayUrl = outputArray?.find((v: unknown) => isUrl(v)) || null;

    // Helper: extract URL from a nested object like {video:{url:"..."}} or {audio:{url:"..."}}
    const nestedUrl = (field: unknown): string | null => {
      if (field && typeof field === "object" && !Array.isArray(field)) {
        const obj = field as Record<string, unknown>;
        if (isUrl(obj.url)) return obj.url as string;
        if (isUrl(obj.uri)) return obj.uri as string;
      }
      return null;
    };

    // Extract output URL (only accept real URLs)
    // Check flat string fields first, then nested object fields
    const outputUrl =
      firstArrayUrl ||
      (isUrl(flat.video_url) && flat.video_url) ||
      (isUrl(flat.audio_url) && flat.audio_url) ||
      (isUrl(flat.image_url) && flat.image_url) ||
      (isUrl(flat.audio) && flat.audio) ||
      (isUrl(flat.output) && flat.output) ||
      (isUrl(flat.output_url) && flat.output_url) ||
      (isUrl(flat.url) && flat.url) ||
      nestedUrl(flat.video) ||    // Kling: {"video":{"url":"..."}}
      nestedUrl(flat.audio) ||    // Some models: {"audio":{"url":"..."}}
      nestedUrl(flat.image) ||    // Some models: {"image":{"url":"..."}}
      nestedUrl(flat.result) ||   // Some models: {"result":{"url":"..."}}
      null;

    // Normalize status
    const raw = ((flat.task_status || flat.status || "") as string).toLowerCase();
    let status = "processing";
    if (["succeeded", "completed", "success", "done"].includes(raw) || outputUrl) status = "completed";
    else if (["failed", "error"].includes(raw)) status = "failed";

    return NextResponse.json({
      success: true,
      data: {
        status,
        output_url: outputUrl,
        progress: flat.progress ?? (status === "completed" ? 100 : undefined),
        error: status === "failed" ? (flat.message || flat.error || flat.code || null) : null,
      },
    });
  } catch (err) {
    console.error("[Status] Error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
