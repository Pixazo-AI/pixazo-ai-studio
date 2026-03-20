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

/** Model configuration for the registry */
export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  apiId: string;
  operation: string;
  category: "image" | "music" | "video";
  description: string;
}
