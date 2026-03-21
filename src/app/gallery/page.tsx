"use client";

// ============================================================
// Gallery Page - View all past generations
// ============================================================

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Music,
  Video,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Clock,
  Search,
} from "lucide-react";

interface GalleryItem {
  id: string;
  type: "image" | "music" | "video";
  prompt: string;
  url: string;
  timestamp: number;
  model?: string;
}

type FilterType = "all" | "image" | "music" | "video";

const TYPE_CONFIG = {
  image: {
    icon: ImageIcon,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    label: "Image",
  },
  music: {
    icon: Music,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    label: "Music",
  },
  video: {
    icon: Video,
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    label: "Video",
  },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pixazo-history");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  const filtered = items.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem("pixazo-history", JSON.stringify(updated));
    } catch {}
  };

  const handleClearAll = () => {
    setItems([]);
    try {
      localStorage.removeItem("pixazo-history");
    } catch {}
  };

  const counts = {
    all: items.length,
    image: items.filter((i) => i.type === "image").length,
    music: items.filter((i) => i.type === "music").length,
    video: items.filter((i) => i.type === "video").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <ImageIcon className="w-4 h-4" />
          Gallery
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Creations
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Browse and manage all your AI-generated content
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by prompt..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Type Filters */}
        <div className="flex items-center gap-1.5">
          {(["all", "image", "music", "video"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${
                  filter === type
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)} ({counts[type]})
            </button>
          ))}
        </div>

        {/* Clear All */}
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {items.length === 0 ? "No generations yet" : "No matches found"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {items.length === 0
              ? "Start creating with the Pipeline to see your work here"
              : "Try a different search or filter"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const config = TYPE_CONFIG[item.type];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-gray-900"
              >
                {/* Preview */}
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        const v = e.target as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Music className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                        <audio
                          controls
                          className="w-48"
                          src={item.url}
                        />
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div
                    className={`absolute top-2 left-2 ${config.color} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </a>
                    <a
                      href={item.url}
                      download
                      className="p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {item.prompt || `${config.label} generation`}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    {timeAgo(item.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
