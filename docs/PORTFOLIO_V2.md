# Portfolio v2 — "Signal" Rebuild

**Branch:** `arena/01a03b0e-portfolio-website` (based on `feat/developer-standard-design`)
**Live reference:** https://jhonreyconsolacion.vercel.app/
**Status:** implemented, builds clean (`next build` + `eslint` = 0 errors), all routes static.

---

## 0. What this is

The live site was directionally right (dark, honest, product-led) but visually generic,
static (2 keyframes in the whole stylesheet), and had 6 WCAG contrast failures. This branch
ports the live design's **content and positioning** into this repo and rebuilds it on a
proper design + motion system, then adds two signature features that *demonstrate* the
service being sold ("Ask My AI" + a ⌘K palette).

The XP/Android OS theme remains untouched on `main` — nothing was destroyed, only superseded.

## 1. Design system — "Signal"

An engineering-telemetry look that matches what the site's owner actually does
(pipelines, automations, dashboards):

| Layer | Decision |
|---|---|
| Canvas | Obsidian `#090a0f` + static aurora glows + 44px engineering grid + sparse violet data-stream canvas |
| Violet ramp | One hue, three jobs: `#6d28d9` solid (white text = **7.07:1**), `#a78bfa` text accent (**6.9:1**), `#8b5cf6` decorative glow only. Clears every contrast failure the old single-violet caused |
| Type | Self-hosted **Inter** + **JetBrains Mono** variable fonts (89 kB total, preloaded, `display: swap`). Fluid scale via `clamp()` — hero `clamp(2.6rem → 5rem)` |
| Surfaces | 3 elevation levels (surface / raised / glass) instead of one glass-rectangle doing everything; `backdrop-filter` reserved for genuinely overlapping chrome |
| Layout | `lg`/`xl` breakpoints, 12-col bento for Proof of Work (featured 7-col + 5-col + full-width "claim the next slot" CTA strip) |
| Detail | Focus-visible ring everywhere, custom scrollbar, brand selection color, skip link, `aria` on all custom widgets |

## 2. Motion system (60fps, reduced-motion safe)

Principles: animate **only** `transform`/`opacity`; 150–400ms UI feedback, 600–900ms entrances;
everything inside `prefers-reduced-motion: reduce` → instant; reveal hidden-state only applies
when JS is proven running (`[data-js]` gate) so content can never be lost.

- **Entrances** — `IntersectionObserver` reveal with per-element stagger (heading → body → cards)
- **Hero** — per-word masked headline assembly; typed terminal (`whoami`, `ls ./products --live`, `n8n deploy …`); Manila clock; breathing availability dot; count-up stats
- **Automation loop diagram** — trigger → data → ai → shipped, with a traveling pulse on the wire and node glows timed to meet it. *Shows* the service instead of describing it
- **Micro-interactions** — button lift/press, cursor-tracking spotlight on cards (`--mx/--my`), animated nav underline + active-section indicator, chip spring-pop, marquee tech ticker, calendar cells that pop on project-card hover, animated winning path in the bracket SVG
- **Page-level** — 2px gradient scroll-progress bar, smooth anchors with header offset
- **Perf guards on the canvas** — DPR capped at 1, throttled to ~20fps, pauses when tab hidden, density scales on mobile

## 3. Signature features

### ⌘K command palette
Navigation, "Ask My AI", both live products, GitHub, and a hidden **"Play Snake"** —
the Snake game rescued from the repo's XP era, re-skinned (canvas, keyboard + touch D-pad,
persistent best score). Personality without making it the front door.

### Ask My AI (grounded, browser-only)
Floating chat + hero CTA + palette entry. Intent-matches questions and answers **strictly
from `src/lib/content.ts`** — the same module the page renders from, so it cannot drift or
hallucinate. Streams replies, suggests prompts, and drops a "Start a project" CTA into the
thread at the right moments. Labeled honestly as a demo that runs 100% in the browser.

**Upgrade path:** swap `answerFor()` for a streaming API route (RAG over the same content
file + rate limiting). The UI is already built for streaming.

## 4. Credibility & SEO fixes (from the audit)

- Contrast ramp clears all 6 WCAG failures (computed ratios, not eyeballed)
- Fonts actually load (they were declared but never downloaded on the old site)
- OG image generated dynamically at 1200×630 via `next/og` — always matches the copy; 922 kB `og-image.jpg` deleted; 25.9 kB `.ico` replaced by a 300-byte `icon.svg`
- `robots.txt` + `sitemap.xml` now exist in-repo (they were deployed but untracked)
- JSON-LD `Person` schema; honest metadata (`AI Developer & Automation Builder`, correct `metadataBase`)
- Hero copy drops "beginner" and leads with the two live products; project cards use labeled stylized wireframe previews (honest) instead of fake screenshots; contact form keeps the honeypot and adds submit states (idle → transmitting → 200 OK / error)

## 5. Definition of done — verify after deploy

- Lighthouse Performance ≥ 0.95, Accessibility = 1.00, 0 contrast failures, CLS = 0
- Whole site usable with `prefers-reduced-motion: reduce`
- Keyboard-only pass: skip link → nav → palette (⌘K) → chat → form → snake

## 6. Roadmap (next 3 phases, ranked by return)

1. **Written case studies** (`/work/sukisuite`, `/work/barangay-arena`) — problem →
   constraints → architecture → trade-offs → screenshots → what I'd do differently.
   Highest conversion value; `next/view-transitions` for route changes.
2. **Real RAG upgrade for Ask My AI** — streaming API route grounded in `content.ts` +
   case studies, strict system prompt, rate limited. Turns the demo into proof.
3. **Automation playground** — visitor enters an email, watches the flow diagram light up
   node-by-node, receives the actual automated email seconds later. Nobody forgets that.
4. Later: live GitHub telemetry at build time (ISR), command-palette "Retro Mode" that
   boots the full XP desktop as a full-screen toy (rescuing `main`'s work wholesale).

## 7. Deploy notes

- Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) power the
  contact form; without them the form simulates success (demo mode).
- Merge this branch → `main` and point the Vercel project at this repo to make the live
  domain serve v2.
