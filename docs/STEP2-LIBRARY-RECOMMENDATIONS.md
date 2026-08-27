# STEP 2 — Library & Asset Recommendations (researched Aug 2026, tailored to this repo)

> Prerequisite research for the audit backlog. Every recommendation is mapped to findings in `AUDIT_REPORT.md`. Ecosystem facts verified against 2026 sources — several items in older recommendation lists are now outdated (see corrections below).

## ⚠️ 2026 corrections to common recommendation lists

| List said                       | 2026 reality                                                                                                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Framer Motion ~32KB"           | Renamed **Motion** mid-2025 (now framework-agnostic: React/Vue/vanilla). Package `motion`, import `motion/react`. Tree-shakable: `animate()` mini ≈ **2.6KB**, full ≈ 18KB                |
| "GSAP ~28KB, club plugins paid" | **Since 3.13 (mid-2024, Webflow) GSAP is 100% free incl. SplitText/MorphSVG/Flip.** Core ≈ 23KB gzip. Project is on ^3.15 — keep                                                          |
| "shadcn/ui = Radix + Tailwind"  | shadcn/ui **switched its default primitive layer to Base UI (Jul 2026)**; Radix (acquired by WorkOS) is maintenance-slowed. Both still supported — no migration needed for on-copied code |
| "Vercel AI SDK"                 | v5 shipped Jul 2025; **v6 late 2025**. Your pins (`ai@^3.4.33`, `@ai-sdk/google@^0.0.52`) are **two majors behind** — this is the root cause of 8/10 audit vulnerabilities                |
| "NextUI"                        | Renamed **HeroUI**                                                                                                                                                                        |

---

## 1. KEEP — already the right tools

| Library                                                            | Why it stays                                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next/image`                                                       | Doing exactly the right thing: WebP/AVIF content negotiation, explicit `deviceSizes`/`imageSizes`, responsive `/_next/image` srcset. Add AVIF-first `formats` + placeholders (§4)                                   |
| `gsap` + `@gsap/react`                                             | Correct tool for this scroll-driven, timeline-based design. The audit's desktop-perf problem is **usage** (unthrottled per-event tweens, eager hydration), not the library. Also: you now own every plugin for free |
| `lenis`                                                            | Industry-standard smooth scroll; official GSAP/ScrollTrigger integration pattern                                                                                                                                    |
| `lucide-react`                                                     | Consistent single icon set; tree-shaken                                                                                                                                                                             |
| Tailwind CSS v4, Supabase, Resend, `server-only`, `react-markdown` | Coherent, minimal, fit-for-scale                                                                                                                                                                                    |

## 2. REMOVE / UPGRADE (maps to audit P0/P1)

| Action           | Package(s)                                                                                                                                                                                                                                                                                                                                                                            | Audit link      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Uninstall**    | `react-draggable` — 0 imports (confirmed via depcheck+grep); leftover from retired XP-desktop theme                                                                                                                                                                                                                                                                                   | §4/§8 dead code |
| **Upgrade**      | `ai@^3.4.33` → **current** (`ai` v5+ / v6 line) and `@ai-sdk/google@^0.0.52` → matching provider major. Fixes `nanoid` (high), `@ai-sdk/provider-utils` (moderate), `ai` (moderate) advisories                                                                                                                                                                                        | §7 security     |
| Upgrade path     | Run the official codemod first: `npx @ai-sdk/codemod@latest migrate`. Key renames affecting `src/app/api/*/route.ts`: `maxTokens` → `maxOutputTokens`; response helper → `toUIMessageStreamResponse()` / `toDataStreamResponse()`; client `useChat` messages: `m.content` → `m.parts`; `Message[]` → `UIMessage[]` + `convertToModelMessages()` server-side. Re-run `npm audit` after | §7              |
| Also via upgrade | `jsondiffpatch` (moderate XSS) is a transitive dep of the old SDK line — it disappears after the upgrade. Verify with `npm ls jsondiffpatch`                                                                                                                                                                                                                                          | §7              |

## 3. ADD — small, high-leverage (each mapped to an audit issue)

| Library                         | Size (gzip) | Use for (audit ref)                                                                                                                                  | Priority |
| ------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `sonner`                        | ~4KB        | Toast feedback for contact submit + playground errors — replaces bespoke status UI, themeable in volt (`richColors:false`, custom CSS vars)          | P2       |
| `nuqs`                          | ~3KB        | Type-safe URL state for the **AI Playground** (`?prompt=&model=`) → shareable generations = free marketing for the portfolio                         | P2       |
| `vaul`                          | ~6KB        | Bottom-sheet for AskMyAI on mobile (mobile chat overlay today is a full takeover; drawer is the 2026 pattern). Only when touching the chat UI anyway | P3       |
| `cmdk`                          | ~8KB        | Optional ⌘K palette (jump to projects, open chat) — fits the console aesthetic perfectly; not required                                               | P3       |
| `plaiceholder` (or `thumbhash`) | build-time  | Automatic `blurDataURL` placeholders for `/projects/*.png` case-study images (perf §4, perceived-LCP win). Generated at build — zero runtime cost    | P2       |
| `@formkit/auto-animate`         | ~2KB        | Only if you want list animation for the chat message list / build log without adopting Motion                                                        | P3       |

## 4. NATIVE FIRST — replace JS with 0KB platform features

| Native API                     | Replace what (audit ref)                                                               | Note                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **View Transitions API**       | Custom `RouteTransition` + `#page-transition-overlay` + `TransitionLink` JS chain (§4) | Next 16 supports via `experimental.viewTransition`; navs become declarative, zero hydration cost |
| **CSS `@starting-style`**      | The `mounted`-state pattern that caused the ESLint error in `Projects.tsx:29` (§8)     | Fixes the lint error _and_ removes a render cycle                                                |
| `animation-timeline: scroll()` | Simple scroll-reveals (e.g. `AnimatedSection`)                                         | Progressive enhancement only; keep GSAP ScrollTrigger where scrubbing/pinning is real            |

## 5. CONSIDER LATER — deliberately NOT now

| Library                                   | Why not now                                                                                                                                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Motion (`motion/react`)                   | Excellent (a11y-default, 2.6–18KB, AnimatePresence), but **adding a second animation system now just grows the bundle**. GSAP covers everything this design needs; revisit only if you rebuild the chat/menus and want React-declarative exits — then _replace_ GSAP, don't add |
| shadcn/ui (+ **Base UI** primitives)      | The hand-rolled Tailwind UI is small and coherent. Adopt selectively when form/UI volume grows (e.g. Base UI `Dialog` could replace the hand-rolled focus trap in `Header.tsx`/`AskMyAI.tsx`)                                                                                   |
| Aceternity / Magic UI / Cult UI           | Beautiful but each pulls in `motion` + friends — directly against the P0 perf goal. Steal _ideas_ (grain, marquee, text reveals — all of which you already have), not dependencies                                                                                              |
| HeroUI / Park UI / Ark UI                 | Solving problems you don't have                                                                                                                                                                                                                                                 |
| Rive / Theatre.js / react-spring / Lottie | No use case in current design; each ≥15KB for zero conversion value                                                                                                                                                                                                             |

## 6. Canonical reference lists (refreshed 2026)

**Animation:** Motion 2.6–18KB (React-first, a11y-default) · GSAP ~23KB (scroll/timeline king, all plugins free) · react-spring ~30KB (physics) · Auto Animate ~2KB · Lottie ~15KB (AE exports) · Rive ~50KB (interactive state) · Theatre.js ~40KB (cinematic) · Tailwind-CSS-Motion ~5KB (pure CSS) · View Transitions & `@starting-style` & scroll-timelines: **0KB native**
**UI primitives:** shadcn/ui (copy-paste; Radix _or_ Base UI layer) · Base UI (actively maintained MUI-backed primitives) · Radix (stable, slowed) · HeroUI · Ark UI/Park UI · Headless UI
**Images/assets:** next/image (built-in: AVIF/WebP/srcset/lazy) · sharp (build-time) · plaiceholder/ThumbHash (placeholders) · SVGO (SVG) · Cloudinary/imgix (only if assets outgrow the repo)
**Micro-polish:** sonner (toasts) · vaul (drawer) · cmdk (palette) · nuqs (URL state) · tippy.js (tooltips) · Embla (carousel) · react-hot-toast (alt toast)

## 7. Bundle budget (adopt as CI gate)

First-load JS ≤ **200 KB gzip** per route (Google's guideline); animation code loads _after_ LCP via `next/dynamic`; every new dependency must justify itself in the PR description. Track with a bundle analyzer (`@next/bundle-analyzer`) in CI — you have no budget gate today.

**Bottom line:** this project needs **−1 dependency removed, 2 upgraded, 3–4 micro-adds** — not a stack swap. The strongest moves: complete the AI SDK upgrade (kills 8/10 vulns), load GSAP lazily, and let native CSS/View-Transitions absorb what JS is doing today.
