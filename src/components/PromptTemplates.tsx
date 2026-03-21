"use client";

// ============================================================
// PromptTemplates - Categorized prompt inspiration panel
// ============================================================

import { useState } from "react";
import { Wand2, X, Mountain, Building2, Palette, Camera, TreePine, Rocket } from "lucide-react";

interface PromptTemplatesProps {
  onSelect: (prompt: string) => void;
  type: "image" | "music";
}

interface TemplateCategory {
  name: string;
  icon: typeof Mountain;
  prompts: string[];
}

const IMAGE_CATEGORIES: TemplateCategory[] = [
  {
    name: "Landscapes",
    icon: Mountain,
    prompts: [
      "A serene mountain landscape at golden hour with a reflective lake and snow-capped peaks",
      "Misty Japanese garden at dawn with cherry blossoms floating over a koi pond",
      "Dramatic volcanic landscape with lava flows meeting the ocean under a starry sky",
      "Vast desert dunes at sunset with an oasis in the distance, cinematic lighting",
    ],
  },
  {
    name: "Sci-Fi",
    icon: Rocket,
    prompts: [
      "Futuristic cityscape with neon lights and flying vehicles at night, cyberpunk aesthetic",
      "Space station orbiting a gas giant with rings, viewed from an observation deck",
      "Robot artist painting on a canvas in a sunlit studio, warm light",
      "Alien marketplace on a desert planet with two suns setting in the background",
    ],
  },
  {
    name: "Nature",
    icon: TreePine,
    prompts: [
      "An enchanted forest with bioluminescent plants and magical creatures at twilight",
      "Underwater coral reef teeming with colorful tropical fish, sunlight streaming through",
      "Ancient redwood forest with morning fog and a ray of golden sunlight",
      "Northern lights dancing over a frozen lake surrounded by snow-covered pines",
    ],
  },
  {
    name: "Architecture",
    icon: Building2,
    prompts: [
      "Grand cathedral interior with stained glass windows casting colorful light",
      "Modern minimalist house on a cliff overlooking the ocean, golden hour",
      "Ancient Greek temple ruins at sunset with olive trees in the foreground",
      "Cozy bookshop interior with warm lighting and floor-to-ceiling wooden shelves",
    ],
  },
  {
    name: "Abstract",
    icon: Palette,
    prompts: [
      "Abstract geometric art in vibrant colors with fluid dynamics and golden spirals",
      "Fractal pattern with iridescent colors morphing through impossible geometries",
      "Watercolor explosion of warm and cool colors colliding in slow motion",
      "Minimalist zen composition with ink brush strokes on textured paper",
    ],
  },
  {
    name: "Portrait",
    icon: Camera,
    prompts: [
      "Ethereal portrait with soft studio lighting and bokeh background, high fashion",
      "Steampunk inventor in a workshop surrounded by gears and brass instruments",
      "Fantasy warrior in ornate golden armor standing on a misty battlefield",
      "Astronaut floating in space with Earth reflected in their visor, photorealistic",
    ],
  },
];

const MUSIC_CATEGORIES: TemplateCategory[] = [
  {
    name: "Electronic",
    icon: Rocket,
    prompts: [
      "Upbeat electronic dance track with synths and powerful drops, festival energy",
      "Ambient electronica with shimmering pads, gentle arpeggios, and soft beats",
      "Retro synthwave track with 80s vibes, pulsing bass, and neon energy",
      "Deep house groove with warm chords, vinyl crackle, and a smooth bassline",
    ],
  },
  {
    name: "Acoustic",
    icon: TreePine,
    prompts: [
      "Calm acoustic guitar melody with nature sounds for meditation and relaxation",
      "Folk song with warm vocals, finger-picked guitar, and gentle harmonica",
      "Classical piano piece with emotional depth and dynamic range, Chopin inspired",
      "Soft ukulele and whistling with a cheerful, sunny day feeling",
    ],
  },
  {
    name: "Cinematic",
    icon: Camera,
    prompts: [
      "Cinematic orchestral score with dramatic strings and brass, epic battle scene",
      "Emotional piano and strings soundtrack for a heartfelt movie moment",
      "Tense suspense score with deep cello drones and subtle percussion",
      "Triumphant orchestral fanfare with full brass section and timpani",
    ],
  },
  {
    name: "Chill",
    icon: Mountain,
    prompts: [
      "Lo-fi hip hop beat with soft piano and rain ambience, study music",
      "Smooth jazz cafe music with muted trumpet and soft drums, relaxing",
      "Dreamy ambient soundscape with ocean waves and distant wind chimes",
      "Chill downtempo beat with vinyl texture, mellow keys, and soft bass",
    ],
  },
];

export default function PromptTemplates({ onSelect, type }: PromptTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = type === "image" ? IMAGE_CATEGORIES : MUSIC_CATEGORIES;
  const current = categories[activeCategory];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 text-primary-700 dark:text-primary-300 rounded-full hover:shadow-md transition-all border border-primary-200 dark:border-primary-800"
      >
        <Wand2 className="w-3 h-3" />
        Prompt Inspiration
      </button>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Wand2 className="w-4 h-4 text-primary-500" />
          Prompt Inspiration
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {categories.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(idx)}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
              ${activeCategory === idx
                ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <cat.icon className="w-3 h-3" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Prompts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {current.prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              onSelect(prompt);
              setIsOpen(false);
            }}
            className="text-left text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300 transition-all hover:shadow-sm border border-transparent hover:border-primary-200 dark:hover:border-primary-800 line-clamp-2"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
