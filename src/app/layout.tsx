import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixazo AI Studio — Generate Images, Music & Videos",
  description:
    "Create AI-generated images, music, and videos using Pixazo's unified API. Powered by Flux, Lyria, and Wan models.",
  keywords: [
    "AI",
    "image generation",
    "music generation",
    "video generation",
    "Pixazo",
    "Flux",
    "Lyria",
    "Wan",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
