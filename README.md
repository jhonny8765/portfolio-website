# Jhon Rey Consolacion — Portfolio (v2 "Signal")

Dark, motion-rich portfolio for an AI developer & automation builder.
Next.js 16 · React 19 · Tailwind CSS 4 · zero UI libraries.

## Stack

- **Next.js 16** (App Router, Turbopack) — fully static output
- **Tailwind CSS 4** via `@theme` design tokens (see `src/app/globals.css`)
- **Self-hosted variable fonts** — Inter + JetBrains Mono (`src/app/fonts/`)
- **Supabase** — optional contact-form persistence (falls back to demo mode)

## Features

- "Signal" design system: obsidian canvas, WCAG-safe violet ramp, engineering grid + aurora
- Motion layer: scroll reveals with stagger, typed terminal, animated automation-loop diagram,
  cursor-tracking card spotlights, marquee stack ticker, scroll progress — all reduced-motion safe
- **Ask My AI**: grounded browser-only assistant (`src/lib/content.ts` is its only knowledge source)
- **⌘K command palette** with navigation, live products, and a Snake easter egg
- SEO: dynamic OG image (`next/og`), `robots.txt`, `sitemap.xml`, JSON-LD Person schema

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static build
npm run lint
```

### Environment (optional — contact form persistence)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without these the contact form runs in demo mode (simulated success).

## Structure

```
src/
  app/            # layout, page, globals.css, fonts, og-image, robots, sitemap
  components/     # Header, Hero, Portfolio, Services, TechArsenal, Contact,
                  # Footer, AskMyAI, CommandPalette, SnakeGame, Reveal, ...
  lib/content.ts  # single source of truth — sections + AI answers
docs/             # PORTFOLIO_V2.md — design/motion rationale + roadmap
```

## Credits

Snake rescued from this repo's Windows-XP-era `main`. The XP theme lives on there.
