/**
 * Model Configuration Registry
 *
 * Each model maps to a Pixazo gateway endpoint:
 *   POST https://gateway.pixazo.ai/{apiId}/v1/{operation}
 */

import { ModelConfig } from "@/types";

export const MODELS: Record<string, ModelConfig> = {
  // ── Image ────────────────────────────────────────────────────
  "flux-2-klein": {
    id: "flux-2-klein",
    name: "Flux 2 Klein 4B",
    provider: "Black Forest Labs",
    apiId: "flux-2-klein-4b",
    operation: "generateImage",
    category: "image",
    description: "Fast text-to-image model. Returns image URL directly.",
  },

  // ── Music ────────────────────────────────────────────────────
  // Endpoint:  POST gateway.pixazo.ai/lyria-2/v1/lyria-2/generate
  // Poll:      POST gateway.pixazo.ai/lyria-2/v1/lyria-2/prediction  { prediction_id }
  "lyria-2": {
    id: "lyria-2",
    name: "Google Lyria 2",
    provider: "Google",
    apiId: "lyria-2",
    operation: "lyria-2/generate",
    category: "music",
    description: "Google's AI music generation model for expressive, high-quality audio.",
  },

  // ── Video ────────────────────────────────────────────────────
  // Submit:  POST gateway.pixazo.ai/wan-video-2-5/v1/generateImageToVideo2-5Request
  // Poll:    POST gateway.pixazo.ai/wan-video-polling/getTextToVideoResult  { task_id }
  "wan-2.5-i2v": {
    id: "wan-2.5-i2v",
    name: "Wan 2.5 (Image to Video)",
    provider: "Alibaba",
    apiId: "wan-video-2-5",
    operation: "generateImageToVideo2-5Request",
    category: "video",
    description: "Alibaba's Wan 2.5 for generating cinematic videos from images.",
  },
};

export function getModelsByCategory(category: ModelConfig["category"]): ModelConfig[] {
  return Object.values(MODELS).filter((m) => m.category === category);
}

export function getDefaultModel(category: ModelConfig["category"]): ModelConfig {
  return getModelsByCategory(category)[0];
}
