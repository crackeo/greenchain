# Design System — GreenChain AI

## Product Context
- **What this is:** A mobile-first agricultural decision-support app for crop selection, plant health, and soil management in Bhutan.
- **Who it is for:** Household farmers who need simple guidance and commercial farmers who plan in acres, budgets, labor, and markets.
- **Space/industry:** Agricultural extension, farm management, and field diagnostics.
- **Project type:** Installable responsive web app (PWA) with a desktop dashboard mode.
- **Memorable thing:** It should feel like a trusted extension officer in the farmer's pocket.

## Aesthetic Direction
- **Direction:** Field notebook meets trusted extension service.
- **Decoration level:** Intentional — subtle contour lines, agricultural photography/color, and strong information hierarchy.
- **Mood:** Calm, practical, and credible in bright outdoor conditions. Never futuristic, clinical, or “AI magic.”

## Typography
- **Display/Hero:** Fraunces — an agricultural/editorial character that keeps the brand human.
- **Body/UI:** Schibsted Grotesk — compact, highly legible, and clear on small screens.
- **Data:** Schibsted Grotesk with tabular numerals.
- **Scale:** 12, 14, 16, 18, 22, 30, 42px with responsive clamp for page titles.

## Color
- **Approach:** Restrained natural palette; green signals actions and health, amber signals attention, red is reserved for urgent referral.
- **Pine:** `#12372A`; **Leaf:** `#2F7D4A`; **Growth:** `#B9D84A`.
- **Paper:** `#F4F3EA`; **Surface:** `#FFFFFF`; **Ink:** `#17231C`; **Muted:** `#5D6B63`.
- **Semantic:** success `#237A45`, warning `#9A6300`, error `#B42318`, info `#1E5A73`.
- **Dark mode:** Not primary because the main use case is outdoors; preserve platform status-bar compatibility.

## Spacing
- **Base unit:** 4px.
- **Density:** Comfortable on phones, denser on commercial desktop views.
- **Scale:** 4, 8, 12, 16, 20, 24, 32, 48, 64px.

## Layout
- **Approach:** Mobile-first grid discipline with editorial emphasis for recommendation results.
- **Grid:** One column on phones, two-column forms from 720px, sidebar and wide report view from 1040px.
- **Max content width:** 1180px.
- **Radius:** 10px controls, 16px cards, 24px feature surfaces, full pills.
- **Touch:** All interactive targets are at least 48px high with at least 8px separation.

## Experience Rules
1. Ask “Household or Commercial?” before asking farm details.
2. Household mode emphasizes mixed cropping, food security, low-cost inputs, and manageable steps.
3. Commercial mode uses acres and adds yield, labor, budget, market, irrigation reliability, and risk planning.
4. Every recommendation answers: why it fits, when to act, what it costs/needs, key risks, and what to do first.
5. Disease results separate immediate action, organic options, regulated chemical options, and expert referral.
6. AI confidence is visible. Sources are shown when web-grounded information is used.
7. No emoji as structural icons; use one consistent outlined SVG icon family.

## Motion
- **Approach:** Minimal-functional.
- **Duration:** 150–250ms for presses and disclosure; no decorative looping animation.
- **Accessibility:** Respect `prefers-reduced-motion`; never rely on motion to explain state.

## Safe Choices and Deliberate Risks
- **Safe:** Familiar bottom navigation, labeled forms, green agricultural palette, clear warning semantics.
- **Risk:** The farmer-type switch materially changes workflow rather than merely filtering a dashboard. This adds product complexity but keeps both audiences understandable.
- **Risk:** Results look like an extension report with evidence and next actions, not chat bubbles. This feels less “AI,” but is far more useful and trustworthy.

## Decisions Log
| Date | Decision | Rationale |
|---|---|---|
| 2026-08-12 | Mobile-first dual farmer modes | Household and commercial farms have different planning needs but share the same core intelligence. |
| 2026-08-12 | Outdoor-light theme | Primary use is in fields and on phones; daylight contrast matters more than fashionable dark UI. |
| 2026-08-12 | Evidence-forward AI outputs | Agricultural advice must expose uncertainty and sources rather than imply certainty. |
