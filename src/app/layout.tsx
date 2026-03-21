import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixazo AI Studio — Generate Images, Music & Videos",
  description:
    "Create AI-generated images, music, and videos using Pixazo's unified API. Powered by Flux, Lyria, Wan, Sora, Runway, and 20+ AI models.",
  keywords: [
    "AI",
    "image generation",
    "music generation",
    "video generation",
    "Pixazo",
    "Flux",
    "Lyria",
    "Wan",
    "Sora",
    "Runway",
    "Recraft",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
