# GreenChain AI — Farm Advisor for Bhutan

Next.js (App Router) + React rebuild of the farm advisory prototype. The backend is
Next.js API routes calling Claude Opus 4.8; the frontend is a designed app shell
(sidebar on desktop, bottom nav on mobile) with three modules.

| Module | Page | API route |
|---|---|---|
| Crop selection | `/crops` | `POST /api/crop-recommendation` |
| Disease check (photo) | `/disease` | `POST /api/disease-diagnosis` |
| Soil health | `/soil` | `POST /api/soil-health` |
| IoT sensor ingestion | — | `POST /api/iot/soil-reading` |

## Run

```sh
npm install
# Either key works; if both are set, Claude is preferred:
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local   # Claude Opus 4.8 (best quality)
echo "GEMINI_API_KEY=AIza..." >> .env.local        # Gemini free tier (Google AI Studio)
npm run dev        # http://localhost:8720
```

`GET /api/status` reports which provider/model is active.

## Architecture

- `lib/claude.ts` — Anthropic client, Bhutan agronomist system prompt (cached),
  structured-output JSON schemas, in-memory IoT reading store
- `app/api/*/route.ts` — the four backend endpoints
- `app/globals.css` — design system (tokens + component classes); Fraunces display
  serif + Schibsted Grotesk UI type via `next/font`
- `components/ui.tsx` — shared presentational components (Pill, Loading, Bullets…)
- `app/{crops,disease,soil}/page.tsx` — feature modules (client components)

Design decisions, safety rails, and roadmap: see `../bhutan-agri-ai/README.md`
(same product decisions; this repo supersedes the Python prototype).
