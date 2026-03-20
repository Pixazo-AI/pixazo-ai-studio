# Pixazo AI Studio

A full-stack AI creative pipeline that generates **images**, **music**, and **videos** using [Pixazo AI APIs](https://www.pixazo.ai/api). Built with Next.js 14, React 18, and Tailwind CSS.

## Pipeline

```
Step 1: Text → Image    (Flux 2 Klein — Black Forest Labs)
Step 2: Text → Music    (Google Lyria 2)
Step 3: Image → Video   (Wan 2.5 — Alibaba)
```

Each step feeds into the next — generate an image from a text prompt, create a matching soundtrack, then combine them into a cinematic AI video.

## Demo

### Step 1 — Generate Image
![Step 1: Image Generation](screenshots/step1-image.png)

### Step 2 — Generate Music
![Step 2: Music Generation](screenshots/step2-music.png)

### Step 3 — Generate Video
![Step 3: Video Generation](screenshots/step3-video.png)

---

## Getting Your Pixazo API Key

1. Go to [pixazo.ai/api](https://www.pixazo.ai/api)
2. Click **Sign Up** and create a free account
3. Once logged in, navigate to **Dashboard → API Keys**
4. Your `Ocp-Apim-Subscription-Key` is auto-generated and displayed on the dashboard — copy it (it looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
5. Click the **Add Funds** button to add balance to your account so the AI models can process requests

> **Important:** The AI models require account balance to run. Make sure you have sufficient funds before generating images, music, or videos.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Pixazo-AI/pixazo-ai-studio.git
cd pixazo-ai-studio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your API key

Copy the example environment file and add your key:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with your actual key:

```env
PIXAZO_API_KEY=your_subscription_key_here
PIXAZO_GATEWAY_URL=https://gateway.pixazo.ai
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## How It Works

### Step 1 — Image Generation

- Enter a text prompt describing the image you want
- Optionally set dimensions (512–1280px) and a negative prompt
- Uses **Flux 2 Klein 4B** via Pixazo for fast, high-quality generation
- The image URL is returned directly (synchronous)

### Step 2 — Music Generation

- Describe the music/song you want to pair with the image
- Choose duration: 15s, 30s, 1 min, or 2 min
- Pick from presets or write your own prompt
- Uses **Google Lyria 2** via Pixazo (asynchronous — polls for result)
- You can skip this step if you only want a silent video

### Step 3 — Video Generation

- Your generated image is animated into a video
- Add an optional motion description (e.g., "camera slowly zooms in")
- Choose duration: 3s, 5s, 8s, or 10s
- Uses **Wan 2.5** via Pixazo (asynchronous — polls for result)
- Download the final video when complete

---

## Project Structure

```
pixazo-ai-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-image/route.ts   # Flux 2 image generation
│   │   │   ├── generate-music/route.ts   # Lyria 2 music generation
│   │   │   ├── generate-video/route.ts   # Wan 2.5 video generation
│   │   │   └── check-status/route.ts     # Async polling for all models
│   │   ├── layout.tsx                    # Root layout with metadata
│   │   ├── page.tsx                      # Main pipeline page
│   │   └── globals.css                   # Tailwind + global styles
│   ├── components/
│   │   ├── ImageGenerator.tsx            # Step 1 UI
│   │   ├── MusicGenerator.tsx            # Step 2 UI
│   │   ├── VideoGenerator.tsx            # Step 3 UI
│   │   └── StepIndicator.tsx             # Progress bar
│   ├── hooks/
│   │   └── useGeneration.ts              # Pipeline state & polling logic
│   ├── lib/
│   │   ├── pixazo-client.ts              # API client with retry logic
│   │   └── models.ts                     # Model configuration registry
│   └── types/
│       └── index.ts                      # TypeScript interfaces
├── .env.example                          # Environment template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## API Endpoints (Internal)

| Endpoint | Method | Description |
|---|---|---|
| `/api/generate-image` | POST | Generate image from text prompt |
| `/api/generate-music` | POST | Generate music/song from text prompt |
| `/api/generate-video` | POST | Generate video from image URL |
| `/api/check-status` | POST | Poll async generation status |

---

## Pixazo Gateway Endpoints (External)

All requests go through the Pixazo unified gateway with the header:
```
Ocp-Apim-Subscription-Key: YOUR_KEY
```

| Model | Submit Endpoint | Poll Endpoint |
|---|---|---|
| Flux 2 Klein | `POST /flux-2-klein-4b/v1/generateImage` | Synchronous (no polling) |
| Lyria 2 | `POST /lyria-2/v1/lyria-2/generate` | `POST /lyria-2/v1/lyria-2/prediction` |
| Wan 2.5 | `POST /wan-video-2-5/v1/generateImageToVideo2-5Request` | `POST /wan-video-polling/getTextToVideoResult` |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom theme
- **Icons:** Lucide React
- **AI APIs:** Pixazo Gateway (Flux, Lyria, Wan)

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PIXAZO_API_KEY` | Yes | — | Your Pixazo subscription key |
| `PIXAZO_GATEWAY_URL` | No | `https://gateway.pixazo.ai` | Gateway base URL |

---

## Troubleshooting

**502 errors on music/video generation?**
These models are asynchronous and may be temporarily overloaded. The app retries automatically with exponential backoff. If it persists, check your API key credits at [pixazo.ai](https://www.pixazo.ai).

**"InvalidParameter" on video generation?**
Ensure the image URL from Step 1 is publicly accessible. The Wan 2.5 model needs to fetch the image from the URL.

**Music duration not matching selection?**
The Lyria API may not support all duration values. It works best with standard durations (15s, 30s).

---

## License

MIT
