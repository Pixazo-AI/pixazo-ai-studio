"use client";

// ============================================================
// ModelSelector - Dropdown for choosing AI models
// ============================================================

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Zap } from "lucide-react";

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
  icon?: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function ModelSelector({
  models,
  selectedId,
  onSelect,
  label = "Model",
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = models.find((m) => m.id === selectedId) || models[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5
          border border-gray-300 dark:border-gray-600 rounded-xl
          bg-white dark:bg-gray-800 text-left
          hover:border-primary-400 dark:hover:border-primary-500
          focus:ring-2 focus:ring-primary-500 focus:outline-none
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{selected?.icon || "🤖"}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selected?.name}
              </span>
              {selected?.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex-shrink-0">
                  {selected.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
              {selected?.provider}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-72 overflow-y-auto animate-fade-in">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2.5 text-left
                hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                ${model.id === selectedId ? "bg-primary-50 dark:bg-primary-900/20" : ""}
                first:rounded-t-xl last:rounded-b-xl
              `}
            >
              <span className="text-lg flex-shrink-0">{model.icon || "🤖"}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {model.name}
                  </span>
                  {model.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex-shrink-0">
                      {model.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
                  {model.description}
                </span>
              </div>
              {model.id === selectedId && (
                <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
