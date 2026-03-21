"use client";

// ============================================================
// useGeneration Hook
// Manages the full image → music → video pipeline with polling
// Now supports multi-model selection
// ============================================================

import { useState, useCallback, useRef } from "react";
import {
  PipelineState,
  PipelineStep,
  GenerationResult,
  GenerationStatus,
} from "@/types";

const POLL_SLOW_INTERVAL = 5000; // 5 seconds for first 10 polls
const POLL_FAST_INTERVAL = 2000; // 2 seconds after that
const POLL_SLOW_COUNT = 10; // number of polls at slow interval
const MAX_POLL_ATTEMPTS = 120; // ~5 minutes max

const initialResult: GenerationResult = { status: "idle" };

const initialState: PipelineState = {
  currentStep: "image",
  image: { ...initialResult },
  music: { ...initialResult },
  video: { ...initialResult },
};

export function useGeneration() {
  const [state, setState] = useState<PipelineState>(initialState);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Stop any active polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Update a specific step's result
  const updateStep = useCallback(
    (step: PipelineStep, update: Partial<GenerationResult>) => {
      setState((prev) => ({
        ...prev,
        [step]: { ...prev[step], ...update },
      }));
    },
    []
  );

  // Poll for async request status with adaptive interval
  const pollStatus = useCallback(
    async (
      apiId: string,
      requestId: string,
      step: PipelineStep,
      outputUrlKey: string,
      pollOperation?: string,
      pollIdField?: string,
      pollUrl?: string
    ): Promise<string | null> => {
      return new Promise((resolve) => {
        let attempts = 0;

        const schedulePoll = () => {
          const interval = attempts < POLL_SLOW_COUNT ? POLL_SLOW_INTERVAL : POLL_FAST_INTERVAL;
          pollingRef.current = setTimeout(poll, interval);
        };

        const poll = async () => {
          attempts++;
          if (attempts > MAX_POLL_ATTEMPTS) {
            stopPolling();
            updateStep(step, {
              status: "failed",
              error: "Generation timed out. Please try again.",
            });
            resolve(null);
            return;
          }

          try {
            const res = await fetch("/api/check-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                api_id: apiId,
                request_id: requestId,
                poll_operation: pollOperation,
                poll_id_field: pollIdField,
                poll_url: pollUrl,
              }),
            });

            const json = await res.json();

            if (!json.success) {
              // Keep polling on transient errors
              schedulePoll();
              return;
            }

            const { status, output_url, error: pollError } = json.data;

            if (
              status === "completed" ||
              status === "success" ||
              status === "COMPLETED"
            ) {
              stopPolling();
              updateStep(step, { status: "completed", url: output_url });
              resolve(output_url);
              return;
            }

            if (status === "failed" || status === "error" || status === "FAILED") {
              stopPolling();
              updateStep(step, {
                status: "failed",
                error: pollError || "Generation failed on the server side.",
              });
              resolve(null);
              return;
            }

            // Still processing — schedule next poll
            updateStep(step, { status: "processing" });
            schedulePoll();
          } catch {
            // Network error — keep polling
            schedulePoll();
          }
        };

        poll(); // First poll immediately
      });
    },
    [stopPolling, updateStep]
  );

  // --- Generate Image (with model selection) ---
  const generateImage = useCallback(
    async (params: {
      prompt: string;
      negative_prompt?: string;
      width?: number;
      height?: number;
      model_id?: string;
    }) => {
      stopPolling();
      updateStep("image", { status: "submitting", url: undefined, error: undefined });
      setState((prev) => ({ ...prev, currentStep: "image" }));

      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const json = await res.json();

        if (!json.success) {
          updateStep("image", { status: "failed", error: json.error });
          return null;
        }

        const { request_id, status, image_url, api_id, poll_operation, poll_id_field } = json.data;

        // If image is ready immediately
        if (image_url && (status === "completed" || status === "success")) {
          updateStep("image", { status: "completed", url: image_url });
          setState((prev) => ({ ...prev, currentStep: "music" }));
          return image_url;
        }

        // Otherwise poll (pass poll config for async models like Studio Ghibli)
        if (request_id) {
          updateStep("image", { status: "processing", requestId: request_id });
          const url = await pollStatus(api_id, request_id, "image", "image_url", poll_operation, poll_id_field);
          if (url) {
            setState((prev) => ({ ...prev, currentStep: "music" }));
          }
          return url;
        }

        updateStep("image", { status: "failed", error: "No request ID returned" });
        return null;
      } catch (error) {
        updateStep("image", {
          status: "failed",
          error: error instanceof Error ? error.message : "Network error",
        });
        return null;
      }
    },
    [stopPolling, updateStep, pollStatus]
  );

  // --- Generate Music (with model selection) ---
  const generateMusic = useCallback(
    async (params: { prompt: string; duration?: number; model_id?: string }) => {
      stopPolling();
      updateStep("music", { status: "submitting", url: undefined, error: undefined });
      setState((prev) => ({ ...prev, currentStep: "music" }));

      try {
        const res = await fetch("/api/generate-music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const json = await res.json();

        if (!json.success) {
          updateStep("music", { status: "failed", error: json.error });
          return null;
        }

        const { request_id, status, audio_url, api_id, poll_operation, poll_id_field } = json.data;

        if (audio_url && (status === "completed" || status === "success")) {
          updateStep("music", { status: "completed", url: audio_url });
          return audio_url;
        }

        if (request_id) {
          updateStep("music", { status: "processing", requestId: request_id });
          const pollOp = poll_operation || "lyria-2/prediction";
          const url = await pollStatus(api_id, request_id, "music", "audio_url", pollOp, poll_id_field);
          return url;
        }

        updateStep("music", { status: "failed", error: "No audio URL or request ID returned. The API may not support this endpoint." });
        return null;
      } catch (error) {
        updateStep("music", {
          status: "failed",
          error: error instanceof Error ? error.message : "Network error",
        });
        return null;
      }
    },
    [stopPolling, updateStep, pollStatus]
  );

  // --- Generate Video (with model selection) ---
  const generateVideo = useCallback(
    async (params: {
      image_url: string;
      audio_url?: string;
      prompt?: string;
      duration?: number;
      model_id?: string;
    }) => {
      stopPolling();
      updateStep("video", { status: "submitting", url: undefined, error: undefined });
      setState((prev) => ({ ...prev, currentStep: "video" }));

      try {
        const res = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const json = await res.json();

        if (!json.success) {
          updateStep("video", { status: "failed", error: json.error });
          return null;
        }

        const { request_id, status, video_url, api_id, poll_operation, poll_id_field, poll_url } = json.data;

        if (video_url && (status === "completed" || status === "success")) {
          updateStep("video", { status: "completed", url: video_url });
          return video_url;
        }

        if (request_id) {
          updateStep("video", { status: "processing", requestId: request_id });
          const url = await pollStatus(api_id, request_id, "video", "video_url", poll_operation, poll_id_field, poll_url);
          return url;
        }

        updateStep("video", { status: "failed", error: "No request ID returned" });
        return null;
      } catch (error) {
        updateStep("video", {
          status: "failed",
          error: error instanceof Error ? error.message : "Network error",
        });
        return null;
      }
    },
    [stopPolling, updateStep, pollStatus]
  );

  // --- Reset Pipeline ---
  const reset = useCallback(() => {
    stopPolling();
    setState(initialState);
  }, [stopPolling]);

  // --- Navigate Steps ---
  const goToStep = useCallback((step: PipelineStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  return {
    state,
    generateImage,
    generateMusic,
    generateVideo,
    reset,
    goToStep,
  };
}
