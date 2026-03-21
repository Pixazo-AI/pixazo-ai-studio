"use client";

// ============================================================
// Main Page - AI Creative Studio Pipeline
// Flow: Generate Image → Generate Song → Generate Video
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useGeneration } from "@/hooks/useGeneration";
import StepIndicator from "@/components/StepIndicator";
import ImageGenerator from "@/components/ImageGenerator";
import MusicGenerator from "@/components/MusicGenerator";
import VideoGenerator from "@/components/VideoGenerator";
import GenerationHistory, { HistoryEntry } from "@/components/GenerationHistory";
import { Heart } from "lucide-react";

export default function Home() {
  const { state, generateImage, generateMusic, generateVideo, reset, goToStep } =
    useGeneration();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pixazo-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((entries: HistoryEntry[]) => {
    setHistory(entries);
    try {
      localStorage.setItem("pixazo-history", JSON.stringify(entries.slice(0, 50)));
    } catch {}
  }, []);

  // Track completed generations and add to history
  useEffect(() => {
    if (state.image.status === "completed" && state.image.url) {
      setHistory((prev) => {
        if (prev.some((e) => e.url === state.image.url)) return prev;
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          type: "image",
          prompt: "Image generation",
          url: state.image.url!,
          timestamp: Date.now(),
        };
        const updated = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem("pixazo-history", JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [state.image.status, state.image.url]);

  useEffect(() => {
    if (state.music.status === "completed" && state.music.url) {
      setHistory((prev) => {
        if (prev.some((e) => e.url === state.music.url)) return prev;
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          type: "music",
          prompt: "Song generation",
          url: state.music.url!,
          timestamp: Date.now(),
        };
        const updated = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem("pixazo-history", JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [state.music.status, state.music.url]);

  useEffect(() => {
    if (state.video.status === "completed" && state.video.url) {
      setHistory((prev) => {
        if (prev.some((e) => e.url === state.video.url)) return prev;
        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          type: "video",
          prompt: "Video generation",
          url: state.video.url!,
          timestamp: Date.now(),
        };
        const updated = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem("pixazo-history", JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [state.video.status, state.video.url]);

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    window.open(entry.url, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          imageStatus={state.image.status}
          musicStatus={state.music.status}
          videoStatus={state.video.status}
          onStepClick={goToStep}
        />

        {/* Active Step */}
        <div className="mt-6">
          {state.currentStep === "image" && (
            <ImageGenerator
              result={state.image}
              onGenerate={generateImage}
              onNext={() => goToStep("music")}
            />
          )}

          {state.currentStep === "music" && (
            <MusicGenerator
              result={state.music}
              imageUrl={state.image.url}
              onGenerate={generateMusic}
              onNext={() => goToStep("video")}
              onBack={() => goToStep("image")}
            />
          )}

          {state.currentStep === "video" && (
            <VideoGenerator
              result={state.video}
              imageUrl={state.image.url}
              audioUrl={state.music.url}
              onGenerate={generateVideo}
              onBack={() => goToStep("music")}
              onReset={reset}
            />
          )}
        </div>
      </div>

      {/* Generation History */}
      <GenerationHistory
        entries={history}
        onClear={handleClearHistory}
        onSelect={handleSelectHistory}
      />

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-20 py-6 transition-colors">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400 dark:text-gray-500 space-y-2">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-400" />{" "}
            using{" "}
            <a
              href="https://www.pixazo.ai/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 dark:text-primary-400 hover:underline font-medium"
            >
              Pixazo AI APIs
            </a>
          </p>
          <p>
            9 Image Models · 2 Music Models · 8 Video Models · 2 AI Tools
          </p>
        </div>
      </footer>
    </div>
  );
}
