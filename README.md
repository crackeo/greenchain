# GreenChain AI — Farm intelligence for Bhutan

GreenChain AI is a mobile-first, installable farm advisory application for household and commercial farmers. It combines crop planning, plant-photo diagnosis, soil-health planning, and future IoT sensor ingestion in one Next.js application.

## Farmer experiences

- **Household farm:** food security, mixed cropping, staggered harvests, affordable inputs, and family-manageable steps.
- **Commercial farm:** acre-based quantities, production scale, labor, seasonal budget, target market, and operational risk.
- **Plant doctor:** camera-first diagnosis with photo-quality checks, visible confidence/severity, organic-first actions, chemical safety notes, and NPPC/extension referral.
- **Soil health:** manual NSSC/soil-card values or IoT readings converted into timed amendments and quantities.

## Routes

| Module | Page | API route |
|---|---|---|
| Home | `/` | `GET /api/status` |
| Crop planner | `/crops` | `POST /api/crop-recommendation` |
| Plant doctor | `/disease` | `POST /api/disease-diagnosis` |
| Soil health | `/soil` | `POST /api/soil-health` |
| IoT ingestion | — | `POST /api/iot/soil-reading` |

## Run locally

```sh
npm ci
cp .env.example .env.local
# Add at least one real API key to .env.local
npm run dev
```

Open `http://localhost:8720`. On a phone connected to the same network, open the Mac's LAN address on port 8720. For a permanent installable phone app, deploy over HTTPS and use **Add to Home Screen**.

## AI providers

Provider order is:

1. **OpenAI** (`OPENAI_API_KEY`) — uses the Responses API with web search and strict structured output.
2. **Anthropic** (`ANTHROPIC_API_KEY`) — structured-output agricultural reasoning.
3. **Google Gemini** (`GEMINI_API_KEY`) — free-tier multimodal fallback.

All keys stay server-side. Never prefix them with `NEXT_PUBLIC_`, commit `.env.local`, or embed them in browser code. Rotate any key that has been pasted into chat or another shared channel.

## Design and safety

- [DESIGN.md](./DESIGN.md) is the UI and experience source of truth.
- `CLAUDE.md` contains contributor and safety guidance.
- AI output is decision support, not laboratory confirmation. Urgent or uncertain plant-health findings should be confirmed through NPPC or a dzongkhag extension office.
- Source links are displayed when the provider returns them; users should verify pesticide registration, rates, PPE, and pre-harvest intervals locally.

## Verify

```sh
npm run build
npm audit --omit=dev
```
