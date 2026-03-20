"use client";

// ============================================================
// ImageGenerator - Step 1: Text-to-Image with Flux 2 Pro
// ============================================================

import { useState } from "react";
import { GenerationResult } from "@/types";
import { ImageIcon, Sparkles, Loader2, AlertCircle, RefreshCw, Music } from "lucide-react";

interface ImageGeneratorProps {
  result: GenerationResult;
  onGenerate: (params: {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
  }) => Promise<string | null>;
  onNext: () => void;
}

const PRESET_PROMPTS = [
  "A serene mountain landscape at golden hour with a reflective lake",
  "Futuristic cityscape with neon lights and flying vehicles at night",
  "An enchanted forest with bioluminescent plants and magical creatures",
  "Abstract geometric art in vibrant colors with fluid dynamics",
];

export default function ImageGenerator({ result, onGenerate, onNext }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  const isLoading = result.status === "submitting" || result.status === "processing";
  const isCompleted = result.status === "completed";

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) return;
    onGenerate({
      prompt: prompt.trim(),
      negative_prompt: negativePrompt.trim() || undefined,
      width,
      height,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <ImageIcon className="w-4 h-4" />
          Step 1: Generate Image
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Your AI Image
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Powered by <strong>Flux 2 Pro</strong> from Black Forest Labs
        </p>
      </div>

      {/* Prompt Input */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your image
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A breathtaking sunset over a futuristic city..."
            rows={4}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Preset Prompts */}
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Try a preset:</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((preset, i) => (
              <button
                key={i}
                onClick={() => setPrompt(preset)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 text-gray-600 dark:text-gray-400 rounded-full transition-colors disabled:opacity-50"
              >
                {preset.length > 50 ? preset.substring(0, 50) + "..." : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {showAdvanced ? "Hide" : "Show"} advanced options
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3 animate-fade-in">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Negative prompt
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, low quality, distorted..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Width</label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                    <option value={1280}>1280px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Height</label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                    <option value={1280}>1280px</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isLoading
                ? "bg-amber-500 cursor-wait"
                : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {result.status === "submitting" ? "Submitting..." : "Generating image..."}
            </>
          ) : isCompleted ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Regenerate Image
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Image
            </>
          )}
        </button>

        {/* Error Display */}
        {result.status === "failed" && result.error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {/* Result Preview */}
        {isCompleted && result.url && (
          <div className="animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <img
                src={result.url}
                alt="Generated image"
                className="w-full h-auto"
              />
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                Generated
              </div>
            </div>
            <button
              onClick={onNext}
              className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Music className="w-5 h-5" />
              Continue to Music Generation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
