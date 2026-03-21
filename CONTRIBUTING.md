# Contributing to Pixazo AI Studio

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/pixazo-ai-studio.git
cd pixazo-ai-studio

# Install dependencies
npm install

# Set up your environment
cp .env.example .env
# Add your Pixazo API key to .env

# Start the dev server
npm run dev
```

## Project Overview

Pixazo AI Studio is a Next.js 14 app that chains multiple AI models through the Pixazo AI Gateway. The codebase is intentionally simple — no state libraries, no axios, just React hooks and `fetch`.

Key directories:

- `src/lib/models.ts` — Model registry. Start here to understand how models are configured.
- `src/lib/pixazo-client.ts` — Gateway HTTP client with retry logic.
- `src/app/api/` — Next.js API routes that proxy requests to the Pixazo Gateway.
- `src/hooks/useGeneration.ts` — Pipeline state management and polling logic.
- `src/components/` — React UI components for each pipeline step.

## Adding a New Model

1. **Add the model config** to `src/lib/models.ts` with `apiId`, `operation`, `category`, and polling fields if async.
2. **Test with curl first** — hit the Pixazo Gateway directly to discover the actual request/response format.
3. **Update the relevant API route** if the model needs special body transformation or response parsing.
4. **Update check-status** if the model uses a non-standard polling pattern.
5. **Update the model count** in `src/app/page.tsx` footer.

## Code Style

- **TypeScript** — All files use TypeScript with strict mode.
- **No external HTTP libraries** — Use the built-in `pixazoRequest()` wrapper, not axios or node-fetch.
- **Tailwind CSS** — Use utility classes. Custom colors are defined in `tailwind.config.ts`.
- **No emojis in code comments** — Keep comments clear and technical.

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/add-new-model
   ```

2. **Make your changes** and test locally with `npm run dev`.

3. **Run the linter** before committing:
   ```bash
   npm run lint
   ```

4. **Write a clear commit message** describing what and why:
   ```
   Add Stable Diffusion 3.5 model to image generation

   Adds SD 3.5 as a new async image model with the standard
   poll_operation pattern. Tested with curl against the gateway.
   ```

5. **Open a pull request** against `main` with:
   - A short description of the change
   - How you tested it
   - Screenshots if it affects the UI

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Browser and Node.js version
- Relevant console/terminal logs

## Gateway API Gotchas

If you're working with the Pixazo Gateway, keep these in mind:

- **Recraft models** skip `/v1/` in their URL path — use the `skipV1` flag.
- **Lyria 2** doubles the apiId in its operation path (`/lyria-2/v1/lyria-2/generate`).
- **Wan 2.5** uses a completely different apiId for polling (`wan-video-polling` instead of `wan-video-2-5`).
- **Poll responses vary wildly** — some return `video_url`, others nest it as `video.url` or `output.video_url`. The check-status route handles all known patterns.
- Always send both `duration` and `duration_seconds` for Lyria.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
