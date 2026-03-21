/** Pipeline step identifiers */
export type PipelineStep = "image" | "music" | "video";

/** Status of a single generation task */
export type GenerationStatus = "idle" | "submitting" | "processing" | "completed" | "failed";

/** Result object for each generation step */
export interface GenerationResult {
  status: GenerationStatus;
  url?: string;
  error?: string;
  requestId?: string;
}

/** Full pipeline state */
export interface PipelineState {
  currentStep: PipelineStep;
  image: GenerationResult;
  music: GenerationResult;
  video: GenerationResult;
}

/** Model category types */
export type ModelCategory = "image" | "music" | "video" | "tts" | "tool";

/** Model configuration for the registry */
export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiId: string;
  operation: string;
  category: ModelCategory;
  description: string;
  isAsync?: boolean;
  pollOperation?: string;
  pollIdField?: string;
  pollUrl?: string;
  skipV1?: boolean; // when true, omit /v1/ from gateway URL
  bodyTransform?: string; // special body transformation key
  responseTransform?: string; // special response parsing key
  badge?: string; // e.g. "Fast", "HD", "Pro"
  icon?: string; // emoji or icon key
}

/** Tool types for standalone AI tools */
export type ToolType = "image-to-image" | "text-to-speech";

/** Gallery entry for persistent storage */
export interface GalleryEntry {
  id: string;
  type: "image" | "music" | "video";
  prompt: string;
  url: string;
  model: string;
  timestamp: number;
  thumbnail?: string;
}

/** User preferences */
export interface UserPreferences {
  defaultImageModel: string;
  defaultVideoModel: string;
  defaultMusicModel: string;
  theme: "light" | "dark" | "system";
  autoAdvance: boolean;
  saveToGallery: boolean;
}
