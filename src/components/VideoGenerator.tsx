"use client";

// ============================================================
// VideoGenerator - Step 3: Image + Audio → Video with Wan 2.5
// ============================================================

import { useState } from "react";
import { GenerationResult } from "@/types";
import {
  Video,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  RotateCcw,
} from "lucide-react";

interface VideoGeneratorProps {
  result: GenerationResult;
  imageUrl?: string;
  audioUrl?: string;
  onGenerate: (params: {
    image_url: string;
    audio_url?: string;
    prompt?: string;
    duration?: number;
  }) => Promise<string | null>;
  onBack: () => void;
  onReset: () => void;
}

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

  const isLoading = result.status === "submitting" || result.status === "processing";
  const isCompleted = result.status === "completed";

  const handleGenerate = () => {
    if (!imageUrl || isLoading) return;
    onGenerate({
      image_url: imageUrl,
      audio_url: audioUrl,
      prompt: prompt.trim() || undefined,
      duration,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Video className="w-4 h-4" />
          Step 3: Generate Video
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Your AI Video
        </h2>
        <p className="text-gray-500 mt-1">
          Powered by <strong>Wan 2.5</strong> from Alibaba — Image to Video with Audio
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input Assets Summary */}
        <div className="grid grid-cols-2 gap-3">
          {imageUrl && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-xs font-medium text-green-600 mb-2">Source Image</p>
              <img
                src={imageUrl}
                alt="Source"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          {audioUrl && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-xs font-medium text-purple-600 mb-2">Audio Track</p>
              <audio controls className="w-full mt-4" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {!imageUrl && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            Please generate an image first (Step 1) before creating a video.
          </div>
        )}

        {/* Optional Motion Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motion description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Camera slowly zooms in, clouds drift across the sky..."
            rows={2}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700"
                  }
                  disabled:opacity-50
                `}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!imageUrl || isLoading}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-white
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isLoading
                ? "bg-amber-500 cursor-wait"
                : "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg shadow-rose-500/25"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {result.status === "submitting"
                ? "Submitting..."
                : "Generating video... (this may take a few minutes)"}
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
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {/* Video Result */}
        {isCompleted && result.url && (
          <div className="animate-slide-up space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-black">
              <video
                controls
                autoPlay
                loop
                className="w-full"
                src={result.url}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="flex gap-3">
              <a
                href={result.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Video
              </a>
              <button
                onClick={onReset}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
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
          className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Music
        </button>
      </div>
    </div>
  );
}
