/**
 * Pixazo API Client
 *
 * Handles all communication with the Pixazo Gateway.
 * Includes automatic retry with exponential backoff for transient errors (429, 502, 503, 504).
 *
 * Gateway pattern:  POST https://gateway.pixazo.ai/{apiId}/v1/{operation}
 * Auth header:      Ocp-Apim-Subscription-Key
 */

const GATEWAY_URL = process.env.PIXAZO_GATEWAY_URL || "https://gateway.pixazo.ai";
const API_KEY = process.env.PIXAZO_API_KEY || "";

const MAX_RETRIES = 4;
const INITIAL_RETRY_DELAY_MS = 1000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PixazoRequestOptions {
  apiId: string;
  operation: string;
  body: Record<string, unknown>;
  retries?: number;
}

export interface PixazoResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  statusCode?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const isRetryable = (status: number) =>
  status === 429 || status === 502 || status === 503 || status === 504;

// ---------------------------------------------------------------------------
// Main request function
// ---------------------------------------------------------------------------

export async function pixazoRequest({
  apiId,
  operation,
  body,
  retries = MAX_RETRIES,
}: PixazoRequestOptions): Promise<PixazoResponse> {
  const url = `${GATEWAY_URL}/${apiId}/v1/${operation}`;
  let lastError = "";
  let lastStatus = 0;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Back off before retries
    if (attempt > 0) {
      const ms = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 500;
      console.log(`[Pixazo] Retry ${attempt}/${retries} → ${apiId}/${operation} in ${Math.round(ms)}ms`);
      await delay(ms);
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
        body: JSON.stringify(body),
      });

      lastStatus = res.status;

      if (!res.ok) {
        const text = await res.text();
        let parsed: Record<string, string> | null = null;
        try { parsed = JSON.parse(text); } catch { /* plain text */ }

        lastError = parsed?.message || parsed?.error || parsed?.detail || `Status ${res.status}`;
        console.error(`[Pixazo] ${res.status} from ${apiId}/${operation}: ${lastError}`);

        if (isRetryable(res.status) && attempt < retries) continue;
        return { success: false, error: lastError, statusCode: res.status };
      }

      // Success
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        return { success: true, data, statusCode: res.status };
      }
      const raw = await res.text();
      return { success: true, data: { raw_response: raw }, statusCode: res.status };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown network error";
      console.error(`[Pixazo] Network error → ${apiId}/${operation}: ${lastError}`);
      if (attempt < retries) continue;
      return { success: false, error: lastError };
    }
  }

  return { success: false, error: `Failed after ${retries + 1} attempts: ${lastError}`, statusCode: lastStatus };
}

// ---------------------------------------------------------------------------
// Status polling (GET)
// ---------------------------------------------------------------------------

export async function checkRequestStatus(apiId: string, requestId: string): Promise<PixazoResponse> {
  const url = `${GATEWAY_URL}/${apiId}/v1/status/${requestId}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": API_KEY },
    });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Status check failed: ${res.status} – ${text}`, statusCode: res.status };
    }
    return { success: true, data: await res.json(), statusCode: res.status };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
