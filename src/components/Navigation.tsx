"use client";

// ============================================================
// Navigation - Top navigation bar with page links
// ============================================================

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  Sparkles,
  Wand2,
  Image,
  Settings,
  ExternalLink,
  Sun,
  Moon,
  Github,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Pipeline", icon: Sparkles, description: "Image → Music → Video" },
  { href: "/tools", label: "AI Tools", icon: Wand2, description: "Image editing & more" },
  { href: "/gallery", label: "Gallery", icon: Image, description: "Past generations" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Preferences" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 logo-gradient rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white hidden sm:block">
              Pixazo AI Studio
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-900
                  shadow-md flex items-center justify-center
                  transition-all duration-300
                  ${theme === "dark" ? "left-[1.625rem]" : "left-0.5"}
                `}
              >
                {theme === "light" ? (
                  <Sun className="w-3 h-3 text-amber-500" />
                ) : (
                  <Moon className="w-3 h-3 text-blue-400" />
                )}
              </span>
            </button>

            <a
              href="https://github.com/Pixazo-AI/pixazo-ai-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="https://www.pixazo.ai/models"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 items-center gap-1 font-medium"
            >
              API Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
