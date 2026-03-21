/**
 * Model Configuration Registry
 *
 * Each model maps to a Pixazo gateway endpoint:
 *   POST https://gateway.pixazo.ai/{apiId}/v1/{operation}
 */

import { ModelConfig, ModelCategory } from "@/types";

export const MODELS: Record<string, ModelConfig> = {
  // ══════════════════════════════════════════════════════════════
  // IMAGE MODELS
  // ══════════════════════════════════════════════════════════════

  "flux-2-klein": {
    id: "flux-2-klein",
    name: "Flux 2 Klein 4B",
    provider: "Black Forest Labs",
    apiId: "flux-2-klein-4b",
    operation: "generateImage",
    category: "image",
    description: "Fast, lightweight text-to-image. Great for quick iterations.",
    badge: "Fast",
    icon: "⚡",
  },

  "flux-2-pro": {
    id: "flux-2-pro",
    name: "Flux 2 Pro",
    provider: "Black Forest Labs",
    apiId: "flux-2-pro-text-to-image-799",
    operation: "flux-2-pro-text-to-image-request",
    category: "image",
    description: "Professional quality with enhanced detail and coherence.",
    isAsync: true,
    pollOperation: "flux-2-pro-text-to-image-request-result",
    badge: "Pro",
    icon: "🎨",
  },

  "flux-dev": {
    id: "flux-dev",
    name: "Flux Dev",
    provider: "Black Forest Labs",
    apiId: "flux-dev",
    operation: "dev/textToImage",
    category: "image",
    description: "Developer-focused model with fine-tuning support.",
    isAsync: true,
    pollOperation: "dev/textToImage-result",
    badge: "Dev",
    icon: "🛠",
  },

  "flux-pro-1-1-ultra": {
    id: "flux-pro-1-1-ultra",
    name: "Flux Pro 1.1 Ultra",
    provider: "Black Forest Labs",
    apiId: "pro1.1",
    operation: "pro1.1ultra/generateRequest",
    category: "image",
    description: "Ultra-high resolution output with maximum detail.",
    isAsync: true,
    pollOperation: "pro1.1ultra/generateRequest-result",
    badge: "Ultra",
    icon: "💎",
  },

  "flux-1-schnell": {
    id: "flux-1-schnell",
    name: "Flux 1 Schnell",
    provider: "Black Forest Labs",
    apiId: "flux-1-schnell",
    operation: "getData",
    category: "image",
    description: "Fastest Flux model. Instant image generation.",
    badge: "Instant",
    icon: "🚀",
  },

  "gpt-image": {
    id: "gpt-image",
    name: "GPT Image 1.5",
    provider: "OpenAI",
    apiId: "gpt-image-1-5-api-923",
    operation: "gpt-image-1-5-api-request",
    category: "image",
    description: "OpenAI's latest image generation with exceptional prompt understanding.",
    isAsync: true,
    pollOperation: "gpt-image-1-5-api-request-result",
    badge: "New",
    icon: "🤖",
  },

  "recraft-v4": {
    id: "recraft-v4",
    name: "Recraft V4",
    provider: "Recraft",
    apiId: "recraft",
    operation: "v4-pro/generate",
    category: "image",
    description: "Professional design-focused image generation.",
    skipV1: true,
    badge: "Design",
    icon: "🎯",
  },

  "recraft-v3": {
    id: "recraft-v3",
    name: "Recraft V3",
    provider: "Recraft",
    apiId: "recraft",
    operation: "v3/generate",
    category: "image",
    description: "Reliable image generation with consistent style.",
    skipV1: true,
    icon: "🖼",
  },

  "studio-ghibli": {
    id: "studio-ghibli",
    name: "Studio Ghibli Style",
    provider: "Pixazo",
    apiId: "studio-ghibli",
    operation: "studio-ghibli/generate",
    category: "image",
    description: "Generate images in the iconic Studio Ghibli anime style.",
    isAsync: true,
    pollOperation: "prediction",
    pollIdField: "prediction_id",
    badge: "Anime",
    icon: "🌸",
  },

  // ══════════════════════════════════════════════════════════════
  // MUSIC MODELS
  // ══════════════════════════════════════════════════════════════

  "lyria-2": {
    id: "lyria-2",
    name: "Google Lyria 2",
    provider: "Google",
    apiId: "lyria-2",
    operation: "lyria-2/generate",
    category: "music",
    description: "Google's AI music model. Expressive, high-quality audio.",
    isAsync: true,
    pollOperation: "lyria-2/prediction",
    pollIdField: "prediction_id",
    badge: "Best",
    icon: "🎵",
  },

  "elevenlabs-music": {
    id: "elevenlabs-music",
    name: "ElevenLabs Music",
    provider: "ElevenLabs",
    apiId: "elevenlabs-music-api-368",
    operation: "elevenlabs-music-api-request",
    category: "music",
    description: "ElevenLabs' music generation with rich instrumentation.",
    isAsync: true,
    pollOperation: "elevenlabs-music-api-request-result",
    badge: "New",
    icon: "🎹",
  },

  // ══════════════════════════════════════════════════════════════
  // VIDEO MODELS
  // ══════════════════════════════════════════════════════════════

  "wan-2.5-i2v": {
    id: "wan-2.5-i2v",
    name: "Wan 2.5",
    provider: "Alibaba",
    apiId: "wan-video-2-5",
    operation: "generateImageToVideo2-5Request",
    category: "video",
    description: "Cinematic videos from images with smooth motion.",
    isAsync: true,
    pollUrl: "wan-video-polling/getTextToVideoResult",
    pollIdField: "task_id",
    badge: "Default",
    icon: "🎬",
  },

  "sora-video": {
    id: "sora-video",
    name: "Sora",
    provider: "OpenAI",
    apiId: "sora-video",
    operation: "video/i2v/generate",
    category: "video",
    description: "OpenAI's video generation with cinematic quality.",
    isAsync: true,
    pollOperation: "video/i2v/generate-result",
    badge: "Premium",
    icon: "🌟",
  },

  "sora-text-video": {
    id: "sora-text-video",
    name: "Sora (Text to Video)",
    provider: "OpenAI",
    apiId: "sora-video",
    operation: "video/generate",
    category: "video",
    description: "Generate video directly from text prompts with Sora.",
    isAsync: true,
    pollOperation: "video/generate-result",
    badge: "New",
    icon: "📝",
  },

  "runway-gen4": {
    id: "runway-gen4",
    name: "Runway Gen-4.5",
    provider: "Runway",
    apiId: "runway-gen-4-5",
    operation: "gen-4.5/generate",
    category: "video",
    description: "Industry-leading video generation with fine control.",
    isAsync: true,
    pollOperation: "gen-4.5/generate-result",
    badge: "Pro",
    icon: "🎥",
  },

  "kling-3-t2v": {
    id: "kling-3-t2v",
    name: "Kling 3.0 (Text to Video)",
    provider: "Kuaishou",
    apiId: "kling-3-0-text-to-video-standard",
    operation: "kling-3-0-text-to-video-standard-request",
    category: "video",
    description: "High-quality text-to-video generation.",
    isAsync: true,
    pollOperation: "kling-3-0-text-to-video-standard-request-result",
    badge: "New",
    icon: "📹",
  },

  "kling-3-i2v": {
    id: "kling-3-i2v",
    name: "Kling 3.0 (Image to Video)",
    provider: "Kuaishou",
    apiId: "kling-3-0-image-to-video-standard",
    operation: "kling-3-0-image-to-video-standard-request",
    category: "video",
    description: "Animate images into video with Kling 3.0.",
    isAsync: true,
    pollOperation: "kling-3-0-image-to-video-standard-request-result",
    badge: "I2V",
    icon: "🖼",
  },

  "luma-ray2": {
    id: "luma-ray2",
    name: "Luma Dream Machine",
    provider: "Luma AI",
    apiId: "luma-dream-machine-ray-2-flash-image-to-video",
    operation: "luma-dream-machine-ray-2-flash-image-to-video-request",
    category: "video",
    description: "Dream Machine Ray 2 for creative video synthesis.",
    isAsync: true,
    pollOperation: "luma-dream-machine-ray-2-flash-image-to-video-request-result",
    badge: "Creative",
    icon: "💫",
  },

  "veo-3": {
    id: "veo-3",
    name: "Veo 3.1",
    provider: "Google",
    apiId: "veo",
    operation: "veo-3.1/generate",
    category: "video",
    description: "Google's latest video model with photorealistic output.",
    isAsync: true,
    pollOperation: "veo-3.1/generate-result",
    badge: "HD",
    icon: "🌐",
  },

  // ══════════════════════════════════════════════════════════════
  // TEXT-TO-SPEECH
  // ══════════════════════════════════════════════════════════════

  "elevenlabs-tts": {
    id: "elevenlabs-tts",
    name: "ElevenLabs V3",
    provider: "ElevenLabs",
    apiId: "eleven-v3-alpha-954",
    operation: "eleven-v3-alpha-request",
    category: "tts",
    description: "Natural-sounding text-to-speech with multiple voices.",
    isAsync: true,
    pollOperation: "eleven-v3-alpha-request-result",
    badge: "Voices",
    icon: "🗣",
  },

  // ══════════════════════════════════════════════════════════════
  // TOOLS (Image Processing)
  // ══════════════════════════════════════════════════════════════

  "recraft-i2i": {
    id: "recraft-i2i",
    name: "Recraft Image-to-Image",
    provider: "Recraft",
    apiId: "recraft",
    operation: "v3/image-to-image",
    category: "tool",
    description: "Transform images with style transfer.",
    skipV1: true,
    icon: "🎨",
  },

  "flux-pro-i2i": {
    id: "flux-pro-i2i",
    name: "Flux Pro Image-to-Image",
    provider: "Black Forest Labs",
    apiId: "flux-2-pro-image-to-image-866",
    operation: "flux-2-pro-image-to-image-request",
    category: "tool",
    description: "Professional image-to-image transformation with Flux.",
    isAsync: true,
    pollOperation: "flux-2-pro-image-to-image-request-result",
    icon: "🖌",
  },
};

export function getModelsByCategory(category: ModelCategory): ModelConfig[] {
  return Object.values(MODELS).filter((m) => m.category === category);
}

export function getDefaultModel(category: ModelCategory): ModelConfig {
  return getModelsByCategory(category)[0];
}

export function getModelById(id: string): ModelConfig | undefined {
  return MODELS[id];
}
