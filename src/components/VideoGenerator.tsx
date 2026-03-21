"use client";

// ============================================================
// VideoGenerator - Step 3: Multi-Model Video Generation
// ============================================================

import { useState, useEffect } from "react";
import { GenerationResult } from "@/types";
import { getModelsByCategory } from "@/lib/models";
import ModelSelector from "./ModelSelector";
import {
  Video,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import ProgressBar from "./ProgressBar";

interface VideoGeneratorProps {
  result: GenerationResult;
  imageUrl?: string;
  audioUrl?: string;
  onGenerate: (params: {
    image_url: string;
    audio_url?: string;
    prompt?: string;
    duration?: number;
    model_id?: string;
  }) => Promise<string | null>;
  onBack: () => void;
  onReset: () => void;
}

const MOTION_PRESETS = [
  { label: "Slow zoom in", value: "Camera slowly zooms in with subtle parallax motion" },
  { label: "Pan right", value: "Camera pans smoothly from left to right, cinematic movement" },
  { label: "Dreamy float", value: "Gentle floating motion with soft focus shifts, dreamy atmosphere" },
  { label: "Dynamic action", value: "Dramatic camera movement with quick zooms and dynamic angles" },
];

export default function VideoGenerator({
  result,
  imageUrl,
  audioUrl,
  onGenerate,
  onBack,
  onReset,
}: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("wan-2.5-i2v");

  const videoModels = getModelsByCategory("video");
  const currentModel = videoModels.find((m) => m.id === selectedModel);

  // Load preferred model from settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pixazo-settings");
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.defaultVideoModel) setSelectedModel(prefs.defaultVideoModel);
      }
    } catch {}
  }, []);

  const isLoading = result.status === "submitting" || result.status === "processing";
  const isCompleted = result.status === "completed";

  // Check if selected model requires an image
  const isTextToVideo = selectedModel === "sora-text-video" || selectedModel === "kling-3-t2v" || selectedModel === "veo-3";

  const handleGenerate = () => {
    if (!isTextToVideo && !imageUrl) return;
    if (isLoading) return;
    onGenerate({
      image_url: imageUrl || "",
      audio_url: audioUrl,
      prompt: prompt.trim() || undefined,
      duration,
      model_id: selectedModel,
    });
  };

  const handleCopyUrl = async () => {
    if (result.url) {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Video className="w-4 h-4" />
          Step 3: Generate Video
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Your AI Video
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Choose from {videoModels.length} video models
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Model Selector */}
        <ModelSelector
          models={videoModels}
          selectedId={selectedModel}
          onSelect={setSelectedModel}
          label="Video Model"
          disabled={isLoading}
        />

        {/* Input Assets Summary */}
        <div className="grid grid-cols-2 gap-3">
          {imageUrl && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl hover-float">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">Source Image</p>
              <img
                src={imageUrl}
                alt="Source"
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          {audioUrl ? (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover-float">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">Audio Track</p>
              <audio controls className="w-full mt-4" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : imageUrl ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                No audio — video will be generated without sound
              </p>
            </div>
          ) : null}
        </div>

        {!imageUrl && !isTextToVideo && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
            Please generate an image first (Step 1) before creating a video, or select a text-to-video model.
          </div>
        )}

        {isTextToVideo && !imageUrl && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            This model generates video from text only — no image required.
          </div>
        )}

        {/* Motion Presets */}
        {(imageUrl || isTextToVideo) && (
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Quick motion presets:</p>
            <div className="flex flex-wrap gap-2">
              {MOTION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setPrompt(preset.value)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 text-gray-600 dark:text-gray-400 rounded-full transition-all disabled:opacity-50 border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Motion Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isTextToVideo ? "Video description" : "Motion description"}{" "}
            {!isTextToVideo && <span className="text-gray-400 dark:text-gray-500">(optional)</span>}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isTextToVideo
                ? "A stunning aerial shot of mountains at sunrise..."
                : "Camera slowly zooms in, clouds drift across the sky..."
            }
            rows={2}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Press Ctrl+Enter to generate · Using {currentModel?.name || selectedModel}
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Duration
          </label>
          <div className="flex gap-2">
            {[3, 5, 8, 10].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                disabled={isLoading}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    duration === d
                      ? "bg-rose-600 text-white shadow-md shadow-rose-500/25"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300"
                  }
                  disabled:opacity-50
                `}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          isActive={isLoading}
          color="rose"
          label={
            result.status === "submitting"
              ? `Submitting to ${currentModel?.name || "model"}...`
              : `Generating your video with ${currentModel?.name || "model"}... (this may take a few minutes)`
          }
        />

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={(!imageUrl && !isTextToVideo) || isLoading}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isLoading
                ? "bg-amber-500 cursor-wait"
                : "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-[0.99]"
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {result.status === "submitting" ? "Submitting..." : "Generating video..."}
            </>
          ) : isCompleted ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Regenerate Video
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Video
            </>
          )}
        </button>

        {/* Error */}
        {result.status === "failed" && result.error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {/* Video Result */}
        {isCompleted && result.url && (
          <div className="animate-slide-up space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-black group">
              <video controls autoPlay loop className="w-full" src={result.url}>
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                Generated
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={result.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary-500/25"
              >
                <Download className="w-5 h-5" />
                Download Video
              </a>
              <button
                onClick={handleCopyUrl}
                className="py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                title="Copy video URL"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <RotateCcw className="w-5 h-5" />
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Music
        </button>
      </div>
    </div>
  );
}
