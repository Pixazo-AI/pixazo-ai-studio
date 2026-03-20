<div align="center">

# Pixazo AI Studio

### Image → Music → Video — All from a single text prompt

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pixazo API](https://img.shields.io/badge/Pixazo_API-7C3AED?style=for-the-badge)](https://www.pixazo.ai/api)
[![Dark Mode](https://img.shields.io/badge/Dark_Mode-Supported-1a1a2e?style=for-the-badge&logo=moon&logoColor=white)]()

A full-stack AI creative pipeline that generates **images**, **music**, and **videos**<br/>using [Pixazo AI APIs](https://www.pixazo.ai/api).

</div>

<br/>

## How the Pipeline Works

| Step | What it does | AI Model | Provider |
|:---:|---|---|---|
| **1** | Text → Image | Flux 2 Klein 4B | Black Forest Labs |
| **2** | Text → Music | Google Lyria 2 | Google |
| **3** | Image → Video | Wan 2.5 | Alibaba |

Each step feeds into the next — describe an image, create a matching soundtrack, then combine them into a cinematic AI video.

<br/>

## Features

- **3-Step AI Pipeline** — Image generation, music creation, and video synthesis in one workflow
- **Light & Dark Theme** — Toggle between light and dark mode from the header; your preference is saved automatically
- **Retry & Fallback** — Built-in retry logic with exponential backoff for transient API errors
- **Skip Music** — Optionally skip the music step and generate video with image only
- **Responsive UI** — Works on desktop and mobile with smooth animations

<br/>

## Demo

<table>
<tr>
<td width="33%" align="center"><b>Step 1 — Generate Image</b></td>
<td width="33%" align="center"><b>Step 2 — Generate Music</b></td>
<td width="33%" align="center"><b>Step 3 — Generate Video</b></td>
</tr>
<tr>
<td><img src="screenshots/step1-image.png" alt="Step 1: Image Generation"/></td>
<td><img src="screenshots/step2-music.png" alt="Step 2: Music Generation"/></td>
<td><img src="screenshots/step3-video.png" alt="Step 3: Video Generation"/></td>
</tr>
<tr>
<td align="center"><sub>Enter a prompt, pick dimensions, generate</sub></td>
<td align="center"><sub>Describe your song, choose duration, generate</sub></td>
<td align="center"><sub>Add motion description, combine image + audio</sub></td>
</tr>
</table>

<br/>

## Getting Your Pixazo API Key

1. Go to **[pixazo.ai/api](https://www.pixazo.ai/api)** and create an account
2. Once logged in, navigate to **Dashboard → API Keys**
3. Your `Ocp-Apim-Subscription-Key` is auto-generated — copy it
4. Click the **Add Funds** button to add balance so the AI models can process requests

> **Important:** The AI models require account balance to run. Make sure you have sufficient funds before generating images, music, or videos.

<br/>

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Pixazo-AI/pixazo-ai-studio.git
cd pixazo-ai-studio

# 2. Install
npm install

# 3. Configure — add your Pixazo API key
cp .env.example .env
# Edit .env and paste your key:
#   PIXAZO_API_KEY=your_subscription_key_here

# 4. Run
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start creating.

<br/>

## Production Build

```bash
npm run build
npm start
```

<br/>

## Project Structure

```
pixazo-ai-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-image/route.ts   ← Flux 2 image generation
│   │   │   ├── generate-music/route.ts   ← Lyria 2 music generation
│   │   │   ├── generate-video/route.ts   ← Wan 2.5 video generation
│   │   │   └── check-status/route.ts     ← Async polling for all models
│   │   ├── layout.tsx
│   │   ├── page.tsx                      ← Main pipeline UI
│   │   └── globals.css
│   ├── components/
│   │   ├── ImageGenerator.tsx            ← Step 1 UI
│   │   ├── MusicGenerator.tsx            ← Step 2 UI
│   │   ├── VideoGenerator.tsx            ← Step 3 UI
│   │   └── StepIndicator.tsx             ← Progress bar
│   ├── context/
│   │   └── ThemeContext.tsx              ← Light/Dark theme provider
│   ├── hooks/
│   │   └── useGeneration.ts              ← Pipeline state & polling
│   ├── lib/
│   │   ├── pixazo-client.ts              ← API client with retry logic
│   │   └── models.ts                     ← Model configuration
│   └── types/
│       └── index.ts
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

<br/>

## API Reference

### Internal Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/generate-image` | POST | Generate image from text prompt |
| `/api/generate-music` | POST | Generate music/song from text prompt |
| `/api/generate-video` | POST | Generate video from image URL |
| `/api/check-status` | POST | Poll async generation status |

### Pixazo Gateway Endpoints

All requests go through `https://gateway.pixazo.ai` with the header `Ocp-Apim-Subscription-Key`.

| Model | Submit | Poll |
|---|---|---|
| Flux 2 Klein | `POST /flux-2-klein-4b/v1/generateImage` | Synchronous |
| Lyria 2 | `POST /lyria-2/v1/lyria-2/generate` | `POST /lyria-2/v1/lyria-2/prediction` |
| Wan 2.5 | `POST /wan-video-2-5/v1/generateImageToVideo2-5Request` | `POST /wan-video-polling/getTextToVideoResult` |

<br/>

## Environment Variables

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PIXAZO_API_KEY` | Yes | — | Your Pixazo subscription key |
| `PIXAZO_GATEWAY_URL` | No | `https://gateway.pixazo.ai` | Gateway base URL |

<br/>

## Troubleshooting

| Issue | Solution |
|---|---|
| **502 errors** on music/video | Models may be overloaded. The app retries automatically. Check your API credits at [pixazo.ai](https://www.pixazo.ai). |
| **InvalidParameter** on video | Ensure the image URL from Step 1 is publicly accessible. |
| **Duration mismatch** on music | Lyria works best with standard durations (15s, 30s). |

<br/>

## License

MIT

<br/>

<div align="center">
<sub>Built with <a href="https://www.pixazo.ai/api">Pixazo AI APIs</a> — Flux · Lyria · Wan</sub>
</div>
