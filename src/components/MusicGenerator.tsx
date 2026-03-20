"use client";

// ============================================================
// MusicGenerator - Step 2: Music/Song Generation with Lyria
// ============================================================

import { useState } from "react";
import { GenerationResult } from "@/types";
import { Music, Sparkles, Loader2, AlertCircle, RefreshCw, Video, ArrowLeft } from "lucide-react";

interface MusicGeneratorProps {
  result: GenerationResult;
  imageUrl?: string;
  onGenerate: (params: { prompt: string; duration?: number }) => Promise<string | null>;
  onNext: () => void;
  onBack: () => void;
}

const MUSIC_PRESETS = [
  "Upbeat electronic dance track with synths and powerful drops",
  "Calm acoustic guitar melody with nature sounds for meditation",
  "Cinematic orchestral score with dramatic strings and brass",
  "Lo-fi hip hop beat with soft piano and rain ambience",
];

const DURATION_OPTIONS = [
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
];

export default function MusicGenerator({
  result,
  imageUrl,
  onGenerate,
  onNext,
  onBack,
}: MusicGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(30);
  const [retryCount, setRetryCount] = useState(0);

  const isLoading = result.status === "submitting" || result.status === "processing";
  const isCompleted = result.status === "completed";
  const isFailed = result.status === "failed";

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) return;
    setRetryCount(0);
    onGenerate({ prompt: prompt.trim(), duration });
  };

  const handleRetry = () => {
    if (!prompt.trim() || isLoading) return;
    setRetryCount((prev) => prev + 1);
    onGenerate({ prompt: prompt.trim(), duration });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Music className="w-4 h-4" />
          Step 2: Generate Song
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Your AI Song
        </h2>
        <p className="text-gray-500 mt-1">
          Powered by <strong>Google Lyria</strong> — AI music generation
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Show the generated image as reference */}
        {imageUrl && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-green-700">Image ready</p>
              <p className="text-xs text-green-600">
                Describe the music/song you want to pair with this image
              </p>
            </div>
          </div>
        )}

        {/* Music Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your song
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="An energetic pop song with catchy synth melodies..."
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all disabled:opacity-50"
          />
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Try a preset:</p>
          <div className="flex flex-wrap gap-2">
            {MUSIC_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => setPrompt(preset)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded-full transition-colors disabled:opacity-50"
              >
                {preset.length > 45 ? preset.substring(0, 45) + "..." : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                disabled={isLoading}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    duration === opt.value
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }
                  disabled:opacity-50
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {result.status === "submitting" ? "Submitting..." : "Generating song..."}
            </>
          ) : isCompleted ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Regenerate Song
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Song
            </>
          )}
        </button>

        {/* Error with Retry */}
        {isFailed && result.error && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>{result.error}</p>
                {retryCount > 0 && (
                  <p className="text-xs mt-1 text-red-500">
                    Attempted {retryCount} {retryCount === 1 ? "retry" : "retries"}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="w-full py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Music Generation
            </button>
          </div>
        )}

        {/* Audio Preview */}
        {isCompleted && result.url && (
          <div className="animate-slide-up space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm font-medium text-purple-700 mb-2">Your generated song:</p>
              <audio controls className="w-full" src={result.url}>
                Your browser does not support the audio element.
              </audio>
            </div>
            <button
              onClick={onNext}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              Continue to Video Generation
            </button>
          </div>
        )}

        {/* Skip Music - go directly to video */}
        {!isCompleted && !isLoading && (
          <button
            onClick={onNext}
            className="w-full py-2.5 text-purple-500 hover:text-purple-700 text-sm font-medium flex items-center justify-center gap-1 transition-colors border border-purple-200 rounded-xl hover:bg-purple-50"
          >
            Skip music — generate video without audio
          </button>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Image
        </button>
      </div>
    </div>
  );
}
