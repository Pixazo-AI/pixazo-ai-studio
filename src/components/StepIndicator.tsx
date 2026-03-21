"use client";

// ============================================================
// StepIndicator - Visual progress bar for the 3-step pipeline
// ============================================================

import { PipelineStep, GenerationStatus } from "@/types";
import { ImageIcon, Music, Video, Check, Loader2 } from "lucide-react";

interface StepIndicatorProps {
  currentStep: PipelineStep;
  imageStatus: GenerationStatus;
  musicStatus: GenerationStatus;
  videoStatus: GenerationStatus;
  onStepClick: (step: PipelineStep) => void;
}

const steps: { key: PipelineStep; label: string; icon: typeof ImageIcon }[] = [
  { key: "image", label: "Generate Image", icon: ImageIcon },
  { key: "music", label: "Generate Song", icon: Music },
  { key: "video", label: "Generate Video", icon: Video },
];

function getStepStatus(step: PipelineStep, props: StepIndicatorProps): GenerationStatus {
  switch (step) {
    case "image":
      return props.imageStatus;
    case "music":
      return props.musicStatus;
    case "video":
      return props.videoStatus;
  }
}

function StepIcon({ status, Icon }: { status: GenerationStatus; Icon: typeof ImageIcon }) {
  if (status === "completed") {
    return <Check className="w-5 h-5" />;
  }
  if (status === "processing" || status === "submitting") {
    return <Loader2 className="w-5 h-5 animate-spin" />;
  }
  return <Icon className="w-5 h-5" />;
}

export default function StepIndicator(props: StepIndicatorProps) {
  const { currentStep, onStepClick } = props;

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key, props);
          const isActive = currentStep === step.key;
          const isCompleted = status === "completed";
          const isProcessing = status === "processing" || status === "submitting";

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => onStepClick(step.key)}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full
                  transition-all duration-300 cursor-pointer
                  ${
                    isCompleted
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-4 ring-primary-200 dark:ring-primary-800 pulse-ring"
                        : isProcessing
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 pulse-ring"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                <StepIcon status={status} Icon={step.icon} />
              </button>

              {/* Step label */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary-700 dark:text-primary-400"
                      : isCompleted
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Step {index + 1}
                </p>
                <p
                  className={`text-xs transition-colors ${
                    isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-0.5 rounded transition-all duration-500 ${
                      isCompleted ? "bg-green-400 dark:bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
