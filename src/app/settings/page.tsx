"use client";

// ============================================================
// Settings Page - User preferences and defaults
// ============================================================

import { useState, useEffect } from "react";
import { Settings, Save, Check, RotateCcw, Palette, Cpu, Sliders } from "lucide-react";
import { getModelsByCategory } from "@/lib/models";

interface Prefs {
  defaultImageModel: string;
  defaultVideoModel: string;
  defaultMusicModel: string;
  autoAdvance: boolean;
  saveToGallery: boolean;
}

const DEFAULT_PREFS: Prefs = {
  defaultImageModel: "flux-2-klein",
  defaultVideoModel: "wan-2.5-i2v",
  defaultMusicModel: "lyria-2",
  autoAdvance: true,
  saveToGallery: true,
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  const imageModels = getModelsByCategory("image");
  const videoModels = getModelsByCategory("video");
  const musicModels = getModelsByCategory("music");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pixazo-settings");
      if (saved) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("pixazo-settings", JSON.stringify(prefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  const handleReset = () => {
    setPrefs(DEFAULT_PREFS);
    try {
      localStorage.removeItem("pixazo-settings");
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Settings className="w-4 h-4" />
          Settings
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Preferences
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Configure your default models and behavior
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Models Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-primary-500" />
            Default Models
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Image Generation Model
              </label>
              <select
                value={prefs.defaultImageModel}
                onChange={(e) => setPrefs({ ...prefs, defaultImageModel: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              >
                {imageModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.name} — {m.provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Music Generation Model
              </label>
              <select
                value={prefs.defaultMusicModel}
                onChange={(e) => setPrefs({ ...prefs, defaultMusicModel: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              >
                {musicModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.name} — {m.provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Video Generation Model
              </label>
              <select
                value={prefs.defaultVideoModel}
                onChange={(e) => setPrefs({ ...prefs, defaultVideoModel: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              >
                {videoModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.icon} {m.name} — {m.provider}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Behavior Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-primary-500" />
            Behavior
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Auto-advance steps
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically move to the next step after generation
                </p>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  prefs.autoAdvance ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setPrefs({ ...prefs, autoAdvance: !prefs.autoAdvance })}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                    prefs.autoAdvance ? "translate-x-[1.375rem]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Save to gallery
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically save all generations to your gallery
                </p>
              </div>
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  prefs.saveToGallery ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setPrefs({ ...prefs, saveToGallery: !prefs.saveToGallery })}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                    prefs.saveToGallery ? "translate-x-[1.375rem]" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* API Info Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary-500" />
            API Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Gateway</span>
              <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">gateway.pixazo.ai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Image Models</span>
              <span className="text-gray-900 dark:text-gray-100">{imageModels.length} available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Music Models</span>
              <span className="text-gray-900 dark:text-gray-100">{musicModels.length} available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Video Models</span>
              <span className="text-gray-900 dark:text-gray-100">{videoModels.length} available</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
