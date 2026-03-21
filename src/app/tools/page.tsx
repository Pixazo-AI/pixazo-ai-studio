"use client";

// ============================================================
// AI Tools Page - Standalone image tools
// ============================================================

import { useState } from "react";
import {
  Wand2,
  ArrowRightLeft,
  Volume2,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Link as LinkIcon,
} from "lucide-react";

type ToolId = "image-to-image" | "text-to-speech";

interface ToolConfig {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fields: string[];
}

const TOOLS: ToolConfig[] = [
  {
    id: "image-to-image",
    name: "Image to Image",
    description: "Transform images with style transfer and prompts",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    color: "from-amber-500 to-orange-500",
    fields: ["image_url", "prompt", "strength"],
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Convert text to natural-sounding speech",
    icon: <Volume2 className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    fields: ["text"],
  },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [strength, setStrength] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!activeTool) return;
    setLoading(true);
    setError(null);
    setResultUrl(null);
    setDescription(null);

    try {
      const body: Record<string, unknown> = { tool: activeTool };
      if (imageUrl) body.image_url = imageUrl;
      if (prompt) body.prompt = prompt;
      if (text) body.text = text;
      if (activeTool === "image-to-image") body.strength = strength;

      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Tool execution failed");
        return;
      }

      if (json.data.description) {
        setDescription(json.data.description);
      }
      if (json.data.output_url) {
        setResultUrl(json.data.output_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeConfig = TOOLS.find((t) => t.id === activeTool);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-3">
          <Wand2 className="w-4 h-4" />
          AI Tools
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Standalone AI Tools
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
          Powerful AI tools for image transformation and audio generation. Powered by Recraft and ElevenLabs.
        </p>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              setError(null);
              setResultUrl(null);
              setDescription(null);
            }}
            className={`
              p-4 rounded-xl border-2 text-left transition-all duration-200
              ${
                activeTool === tool.id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
              }
            `}
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-3`}
            >
              {tool.icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {tool.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {tool.description}
            </p>
          </button>
        ))}
      </div>

      {/* Tool Form */}
      {activeTool && activeConfig && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {activeConfig.icon}
              {activeConfig.name}
            </h2>

            {activeConfig.fields.includes("image_url") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeConfig.fields.includes("prompt") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the transformation you want..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {activeConfig.fields.includes("text") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Text to speak
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to convert to speech..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {activeConfig.fields.includes("strength") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Transformation strength: {strength.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Subtle</span>
                  <span>Strong</span>
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Run {activeConfig.name}
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Description Result */}
            {description && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                    AI Description
                  </h3>
                  <button
                    onClick={() => handleCopy(description)}
                    className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  {description}
                </p>
              </div>
            )}

            {/* Image/Audio Result */}
            {resultUrl && (
              <div className="animate-slide-up">
                {activeTool === "text-to-speech" ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <h3 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                      Generated Audio
                    </h3>
                    <audio controls className="w-full" src={resultUrl} />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={resultUrl} alt="Tool result" className="w-full h-auto" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                      <button
                        onClick={() => handleCopy(resultUrl)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={resultUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
