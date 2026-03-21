"use client";

// ============================================================
// ProgressBar - Animated progress bar for generation polling
// ============================================================

import { useEffect, useState } from "react";

interface ProgressBarProps {
  isActive: boolean;
  color?: "primary" | "purple" | "rose" | "amber";
  label?: string;
}

const colorMap = {
  primary: "from-primary-500 to-primary-600",
  purple: "from-purple-500 to-purple-600",
  rose: "from-rose-500 to-rose-600",
  amber: "from-amber-500 to-amber-600",
};

const bgMap = {
  primary: "bg-primary-100 dark:bg-primary-900/30",
  purple: "bg-purple-100 dark:bg-purple-900/30",
  rose: "bg-rose-100 dark:bg-rose-900/30",
  amber: "bg-amber-100 dark:bg-amber-900/30",
};

const textMap = {
  primary: "text-primary-700 dark:text-primary-300",
  purple: "text-purple-700 dark:text-purple-300",
  rose: "text-rose-700 dark:text-rose-300",
  amber: "text-amber-700 dark:text-amber-300",
};

export default function ProgressBar({ isActive, color = "primary", label }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    // Simulate progress that slows down as it approaches 90%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        const increment = Math.max(0.5, remaining * 0.05);
        return Math.min(90, prev + increment);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  // Jump to 100 when complete
  useEffect(() => {
    if (!isActive && progress > 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isActive, progress]);

  if (!isActive && progress === 0) return null;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${textMap[color]}`}>{label}</span>
          <span className={`text-xs ${textMap[color]} tabular-nums`}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className={`w-full h-2 rounded-full overflow-hidden ${bgMap[color]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} relative progress-shimmer transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
