"use client";

// ============================================================
// Main Page - AI Creative Studio Pipeline
// Flow: Generate Image → Generate Song → Generate Video
// ============================================================

import { useGeneration } from "@/hooks/useGeneration";
import { useTheme } from "@/context/ThemeContext";
import StepIndicator from "@/components/StepIndicator";
import ImageGenerator from "@/components/ImageGenerator";
import MusicGenerator from "@/components/MusicGenerator";
import VideoGenerator from "@/components/VideoGenerator";
import { Sparkles, ExternalLink, Sun, Moon } from "lucide-react";

export default function Home() {
  const { state, generateImage, generateMusic, generateVideo, reset, goToStep } =
    useGeneration();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Pixazo AI Studio
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Image → Song → Video Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span
                className={`
                  absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-gray-900
                  shadow-md flex items-center justify-center
                  transition-all duration-300
                  ${theme === "dark" ? "left-[1.875rem]" : "left-0.5"}
                `}
              >
                {theme === "light" ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                )}
              </span>
            </button>

            <a
              href="https://www.pixazo.ai/models"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              Pixazo Models
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
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
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-20 py-6 transition-colors">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>
            Built with{" "}
            <a
              href="https://www.pixazo.ai/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 dark:text-primary-400 hover:underline"
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
