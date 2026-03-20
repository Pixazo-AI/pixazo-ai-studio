"use client";

// ============================================================
// Main Page - AI Creative Studio Pipeline
// Flow: Generate Image → Generate Song → Generate Video
// ============================================================

import { useGeneration } from "@/hooks/useGeneration";
import StepIndicator from "@/components/StepIndicator";
import ImageGenerator from "@/components/ImageGenerator";
import MusicGenerator from "@/components/MusicGenerator";
import VideoGenerator from "@/components/VideoGenerator";
import { Sparkles, ExternalLink } from "lucide-react";

export default function Home() {
  const { state, generateImage, generateMusic, generateVideo, reset, goToStep } =
    useGeneration();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Pixazo AI Studio
              </h1>
              <p className="text-xs text-gray-500">
                Image → Song → Video Pipeline
              </p>
            </div>
          </div>
          <a
            href="https://www.pixazo.ai/models"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            Pixazo Models
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400">
          <p>
            Built with{" "}
            <a
              href="https://www.pixazo.ai/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:underline"
            >
              Pixazo AI APIs
            </a>{" "}
            — Flux 2 Pro (Image) · Google Lyria (Music) · Wan 2.5 (Video)
          </p>
        </div>
      </footer>
    </div>
  );
}
