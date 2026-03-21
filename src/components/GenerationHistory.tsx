"use client";

// ============================================================
// GenerationHistory - Sidebar showing past generations
// ============================================================

import { useState } from "react";
import { History, X, ImageIcon, Music, Video, Clock, ChevronRight, Trash2 } from "lucide-react";

export interface HistoryEntry {
  id: string;
  type: "image" | "music" | "video";
  prompt: string;
  url: string;
  timestamp: number;
}

interface GenerationHistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const typeConfig = {
  image: {
    icon: ImageIcon,
    label: "Image",
    color: "text-primary-600 dark:text-primary-400",
    bg: "bg-primary-50 dark:bg-primary-900/30",
    border: "border-primary-200 dark:border-primary-800",
  },
  music: {
    icon: Music,
    label: "Song",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-purple-200 dark:border-purple-800",
  },
  video: {
    icon: Video,
    label: "Video",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-rose-200 dark:border-rose-800",
  },
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function GenerationHistory({ entries, onClear, onSelect }: GenerationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (entries.length === 0) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          History
        </span>
        <span className="text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full font-medium">
          {entries.length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-80 max-h-[70vh] bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-800 rounded-tl-2xl shadow-2xl flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-primary-500" />
          Generation History
        </h3>
        <div className="flex items-center gap-1">
          {entries.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {entries.map((entry) => {
          const config = typeConfig[entry.type];
          const TypeIcon = config.icon;

          return (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className={`w-full text-left p-3 rounded-xl ${config.bg} border ${config.border} hover:shadow-md transition-all group`}
            >
              <div className="flex items-start gap-2.5">
                <TypeIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                    {entry.prompt}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {timeAgo(entry.timestamp)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>

              {/* Thumbnail for images */}
              {entry.type === "image" && (
                <img
                  src={entry.url}
                  alt=""
                  className="w-full h-20 object-cover rounded-lg mt-2"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
