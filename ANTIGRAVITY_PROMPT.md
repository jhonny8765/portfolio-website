# Antigravity task — cinematic hybrid rebuild of `jhonreyconsolacion.vercel.app`

Repo: `jhonny8765/portfolio-website` · Live: https://jhonreyconsolacion.vercel.app
Motion reference (feel only, never clone): https://kenjimmy.xyz

You are upgrading an existing, deployed Next.js portfolio **in place**. Do not scaffold a new
app, do not start from a template, do not delete routes or API handlers. Inspect first, then
rebuild the surface while keeping every working system underneath alive.

**Goal:** a hybrid. Ken Jimmy's award-site cinema (GSAP, Lenis, custom cursor, magnetic UI,
split text, preloader, page transitions, mouse-follow art, horizontal works rail) wrapped
around a specific identity: **Jhon Rey Consolacion — AI Developer & Automation Builder from
Kidapawan City, Mindanao.** It must convert for local clients *and* impress developers.

A **custom 3D asset kit already exists** for this rebuild (§1). The visual direction is no
longer open — it is set by those renders. Build the system to match them.

---

## 0. Verified codebase map — ground truth, don't re-guess it

Confirmed by audit at commit `d532a66`. Correct me only if the code has since changed.

**Stack (keep it):** Next.js **16.3.1** App Router (`src/app`), React **19.2.8**, TypeScript 5,
**Tailwind CSS v4** via `@tailwindcss/postcss`. Flat ESLint (`eslint.config.mjs`).
Scripts: `npm run dev | build | start | lint`.

> ⚠️ Two traps that will burn you:
> 1. There is **no `tailwind.config.js`**. Theme tokens live in an `@theme` block inside
>    `src/app/globals.css`. Add tokens there. Do not create a config file.
> 2. `AGENTS.md` warns this Next.js version diverges from your training data. Read
>    `node_modules/next/dist/docs/` before using any App Router / caching / routing API.
>    Preserve the `<!-- BEGIN:nextjs-agent-rules -->` block in `AGENTS.md`.

**Routes**
```
/                          src/app/page.tsx
/playground                AI Image Playground
/projects/sukisuite
/projects/barangay-arena
/projects/betteryield
api/chat                   streamed Gemini chat (@ai-sdk/google + ai v3), grounded system prompt
api/enhance-prompt         Gemini prompt enhancer
api/generate-image         Cloudflare Workers AI
robots.ts, sitemap.ts      sitemap already lists all 5 pages — keep it in sync
```

**Components** — `Header`, `Hero`, `AiStateManager`, `AskMyAI`, `AnimatedSection`,
`AnimatedBackground`, `BuildLog`, `HowIBuild`, `Projects`, `PlaygroundTeaser`, `Services`,
`Skills`, `Contact`, `Footer`, `ImageGenerator`.

**Architecture facts to work with, not around:**
- `AiStateManager` is a client component that owns `isAiOpen`, renders `Header` + `Hero`, and
  lazy-loads `AskMyAI` via `next/dynamic({ ssr: false })` with a loading fallback.
  **Keep that lazy boundary** — it exists to keep react-markdown and `ai/react` out of the first
  bundle. Restyle the chrome; never hoist AskMyAI into the initial bundle.
- `AskMyAI` uses `useChat({ api: '/api/chat' })` with a focus trap, suggested prompts, reset.
  Do not rewrite the model logic.
- `src/data/portfolioData.ts` is the **single source of truth** for identity, skills, projects,
  services — and `/api/chat`'s system prompt is built from the same object. Change its shape and
  you must update the route.
- `src/actions/contact.ts` is a server action: Supabase insert + Resend mail to
  `jhonreyc2001@gmail.com`, with a honeypot field literally named `website`. Restyle the form;
  keep the action, field names, and honeypot intact.
- `src/lib/rate-limit.ts` = HMAC-hashed IP + atomic Supabase RPC, per-IP **and** global daily
  caps, used by `/api/enhance-prompt` and `/api/generate-image`. `/api/chat` still uses a weaker
  in-memory `Map`. Don't break either; flag the inconsistency in your audit.
- `layout.tsx` has a skip link, OG/Twitter metadata, and `@vercel/analytics`. Keep all three.
  It currently loads **no `next/font`** — Inter is only a CSS fallback string.

**Animation libs today:** `framer-motion` v13 in `Hero`, `Projects`, `Services`,
`AnimatedSection`, `AnimatedBackground`. `react-draggable` installed.

**Existing images:** `public/projects/{sukisuite,barangay-arena,betteryield,salon-suite}.png`,
`public/og-image.jpg`, plus unused `*-placeholder.jpg`.

### Library plan
Add: `gsap`, `@gsap/react` with `ScrollTrigger` + `ScrollToPlugin`; `lenis`. Use `SplitText` only
if this project's GSAP license permits — otherwise write a small custom line/word splitter.
**Do not rip out framer-motion in one pass**; five components depend on it. Migrate incrementally
per §9 and drop the dependency only when `grep -rn "framer-motion" src` is empty. Shipping both
libraries permanently is a fail.

Prefer CSS for simple hovers. GSAP owns scroll, cursor, magnetic, preload, transitions, split
text, trails. Keep components small and named; split anything past ~200 lines.

---

## 1. The asset kit (new — this drives the whole visual system)

Nine custom 3D renders exist. Place them at **`public/brand/`** with these exact names:

| File | Subject | Where it goes |
|---|---|---|
| `monogram-jr.png` | Interlocked **JR** monogram, black extruded slab, volt-yellow edge lighting | README/About portrait slot, favicon/OG source, header logo mark |
| `preloader-glyph.png` | Rounded-square terminal tile, glowing volt `>_` prompt | Preloader centerpiece; Ask My AI launch icon |
| `console.png` | Wide glass terminal window, gold hairline border, real shell output + volt cursor | Hero side visual (`build-console.sh`); Build Log header |
| `ai-braces.png` | Two large metal `{ }` braces framing a glowing `AI` chip glyph, amber circuit traces | Hero floating art; AI Integrations service card |
| `chip.png` | Isometric gold-trace processor die with volt-lit core | Technical Arsenal header; hero floating art |
| `workflow-nodes.png` | Three glass node tiles linked by volt cables | Workflow Automation service card; How I Build |
| `delivery-pin.png` | Map pin + delivery box, amber route line | Build Log — “currently building: Kidapawan delivery app” |
| `milk-tea.png` | Clear cup, volt lid ring, blank black sleeve | Build Log — “next up: milk-tea POS” |
| `pos.png` | Handheld POS terminal, volt check on screen | Build Log — “next up: POS”, pairs with `milk-tea.png` |

**Read these before you use them — they are not clean UI sprites:**

1. **Every render has a baked near-black background. None are transparent.** Dropping them into
   the hero as floating parallax art will produce visible dark rectangles over any surface that
   isn't the exact same black. Handle it deliberately, one of three ways:
   - Set `mix-blend-mode: screen` (or `lighten`) on the floating instances — these are all
     glow-on-black, so screen-blending erases the plate cleanly. **Preferred.**
   - Or cut transparent WebP/PNG versions once and commit them as `*-cut.webp` alongside.
   - Never mask them with a matching black `<div>`; it breaks the moment the section tint shifts.
2. **They're wide 16:9 plates with the subject small and centered** (`console.png` and
   `chip.png` especially). For small floating glyphs, crop tight — either pre-crop the files or
   use a wrapper with `object-fit: cover` + `object-position` and an aspect-ratio box. Do not
   scale the full plate down to 80px; the subject will vanish.
3. **They are heavy photoreal PNGs.** Convert to WebP/AVIF, serve through `next/image` with
   explicit `sizes`, `loading="lazy"` below the fold. **Total image weight above the fold must
   stay under ~250KB.** The preloader may block on the hero font plus at most one of these.
4. **The kit sets the palette. Read it off the renders, don't invent one:**
   - Base black `#07080A`–`#0B0D10` (the plates are already this)
   - **Accent: volt yellow `#E8F54A`** — this settles the earlier volt-vs-teal choice. The kit is
     volt. Teal is dead; do not introduce it.
   - Secondary warm amber `#F5A524`-ish appears in `ai-braces`, `delivery-pin`, `chip` traces.
     Allow it as a **tertiary glow only** — never for text, links, or state.
   - Gold/bronze hairline borders (`console.png`) → the site's 1px border treatment.
   - Type on the plates is monospace. That's the console DNA; match it.
5. **`monogram-jr.png` is the portrait.** There is no photo of Jhon Rey in the repo and none is
   coming. Use the monogram in the About block and stop looking for a face. Do not use stock people.
6. Do not generate new assets in a different style. If a slot needs art the kit doesn't cover,
   leave a `TODO(jhonrey)` and tell me — don't improvise a mismatched render.

If a `manifest.json` ships with the kit, treat it as the authoritative filename/slot map and
reconcile the table above against it before coding.

---

## 2. Non-negotiables

**Facts.** Jhon Rey Consolacion · AI Developer & Automation Builder · `jhonreyc2001@gmail.com` ·
Kidapawan City / SOCCSKSARGEN / Mindanao, Philippines. **Invent nothing** — no clients, metrics,
employers, awards, testimonials, or hobbies. `PRODUCT.md` states outright that no testimonials,
case studies, or résumé are committed and that future work must not fabricate them.

**Ask My AI** stays a primary hero CTA and stays reachable from the header.

**`/playground`** (Gemini enhancer + Cloudflare Workers AI) stays live. Restyle chrome only —
generate, enhance, and rate-limit behaviour untouched, including 429 copy and `Retry-After`.

**Projects** stay: SukiSuite (Live) · Barangay Arena (**preview on request** — `liveUrl` is the
literal string `"preview-on-request"`; render a pill, never a dead link) · BetterYield (Live;
`techStack` is `["[Pending confirmation]"]` — **do not invent a stack**, render as pending or
omit the chips) · plus the playground as experimental work.

**Build log facts** (already in `BuildLog.tsx`, keep verbatim in substance) — and each now has
matching art:
- Currently building — Kidapawan City delivery app, independent riders on Messenger → web order
  + location-based delivery → `delivery-pin.png`
- Currently learning — Gemini Pro token/cost optimization → `chip.png`
- Recent experiment — `/playground` → `preloader-glyph.png` or `ai-braces.png`
- Next up — POS for milk-tea / small shops in Kidapawan → `pos.png` + `milk-tea.png`

**Process** stays: Discover → Prototype → Integrate → Improve.
**Services** stay: Web Application Development · Workflow Automation (n8n) · AI Integrations —
now pair them with `console.png`, `workflow-nodes.png`, `ai-braces.png` respectively.
**Arsenal** stays — Active: AI-assisted dev, n8n, Next.js & React, Tailwind, Supabase, Firebase,
Git & GitHub, API integrations. Exploring: Advanced RAG, custom AI agents, Python data pipelines.
**Contact form** stays (name, email, help type, message, honeypot), validation + submit working.
**Case study routes** stay — upgrade entrance/transition, don't gut content.

---

## 3. What to take from kenjimmy.xyz (behavior and pacing, not assets)

Never copy his logo, illustrations, project shots, lowercase-Nigerian-dev voice, or layout 1:1.

**Preloader** — 1.2–2.0s, skipped if already seen this session (`sessionStorage`).
Terminal-flavored, not a spinner: `preloader-glyph.png` centered, `build-console.sh` lines
(Initializing… / Idea & Planning / AI-Assisted Build / Live Deployment) ticking in monospace
beneath it, then a clip-path wipe into the hero. Reduced motion → instant skip, no scroll lock.

**Lenis** smooth scroll on home + case studies. `#projects`, `#contact`, and the Ask My AI
anchors must still work — existing sections use `scroll-mt-24`, so route `ScrollToPlugin`
through Lenis rather than fighting it. Disable Lenis entirely under reduced motion.

**Custom cursor** (fine pointers only) — dot + trailing ring in volt `#E8F54A`. States: default;
link/button → ring expands with optional label (OPEN / VIEW); project or image → larger ring or
`mix-blend-mode: difference`; Ask My AI → label **ASK**. Hide the native cursor on desktop only,
never on touch, and always keep a real `:focus-visible` ring (one exists globally already).

**Magnetic** logo, primary nav, hero CTAs, project "view" links, service cards. Ease toward the
pointer inside a radius, elastic snap-back. Off below 768px and on coarse pointers.

**Split-text hero** — “I build with AI — websites, apps, & automations.” splits by line then word
(chars only if performant). Stagger after the preloader; subcopy fades; CTAs slide in last.

**Scroll reveals** on nearly every section (fade/slide/clip + stagger). Pin **How I Build** 01–04
on desktop as a short scrubbed sequence — not a long hostage pin. Mobile: stacked cards, no pin.
This is the **only** pinned section on the site.

**Hover image trail** on the works rail (desktop): a short trail of project screenshots following
the pointer via a small recycled DOM pool. Touch: static images, no trail. Clones `aria-hidden`.

**Mouse-follow parallax art** in hero + About: 4–6 instances drawn from the kit —
`ai-braces`, `chip`, `console`, `workflow-nodes`, `preloader-glyph` — screen-blended per §1,
depth-layered, subtle. Not childish, not a sticker collage. Do not reproduce Ken's cartoon set.

**Horizontal works rail** after About: full-bleed, drag + scroll-linked translate on desktop,
swipe on mobile. Each card: screenshot, name, one-liner, status pill (Live / Preview /
Experimental), stack chips, links to live + case study. May replace or wrap the current
`Projects` grid — keep the `id="projects"` anchor either way.

**Page transitions** between `/`, `/playground`, `/projects/*` — console scanline or clip-path
wipe. Intentional on back-button and first load; must not break App Router navigation or leave
the overlay stuck on a failed route.

**Currently-building ticker** — infinite marquee: `Building · Kidapawan delivery app` /
`Learning · Gemini token optimization` / `Next · POS for local shops` / `Live · SukiSuite` /
`Experimental · AI Playground`, separated by volt glyphs. Pause on hover; freeze on reduced motion.

**README / About block (new)** — first person, confident, not cringe: builds with AI in public;
ships real tools for salons, barangays, farmers, and local riders; otherwise tightening Gemini
costs or testing models in `/playground`. Anchored by `monogram-jr.png`. Only facts already
implied by the site. If no verified fun fact exists, leave `{/* TODO(jhonrey): one real fun fact */}`
— do not fill it with fiction.

---

## 4. Homepage IA

One long homepage:

1. Preloader (`preloader-glyph`) → **Hero** — split headline, subcopy, `Ask My AI` +
   `Explore Projects`, email fallback, floating kit art, `console.png` as the side visual
   (a side visual, not the whole hero)
2. Marquee (building / learning / next)
3. README / About — `monogram-jr.png`, no stock face
4. Build Log — four facts, each with its kit render, terminal-styled but cinematic
5. Horizontal Works + case-study links
6. How I Build — pinned 01–04 on desktop, `workflow-nodes` accent
7. AI Image Playground teaser → `/playground`
8. Services — three magnetic cards, one kit render each
9. Technical Arsenal — Active / Exploring clusters, `chip.png` header. Ken's "ingredients" energy
   only if rewritten in this voice, e.g. **“What I actually ship with”**
10. Let's Work Together — contact form + email

Header: name/logo (`monogram-jr` mark) · Works · Playground · Ask My AI · Contact — magnetic on
desktop. Footer: email, year, “Built with AI, shipped by hand.”

---

## 5. Visual system

- **Base:** near-black `#07080A`–`#0B0D10`, warm off-white type — matching the render plates.
- **Accent: volt `#E8F54A`.** Cursor ring, marquee separators, Live pills, focus, terminal
  prompts, active nav. Amber `#F5A524` is a tertiary glow only.
  **This replaces the current violet `#8B5CF6` system.** Retire the violet tokens in `@theme`
  and sweep every hardcoded `var(--color-violet)` out of `layout.tsx`, `playground/page.tsx`,
  and the components. Two live palettes is the single most likely way this rebuild looks broken.
- **Console DNA:** JetBrains Mono / Geist Mono / `ui-monospace` for logs, kickers, labels
  (`01 Discover`, `user@system`), preloader — matching the type in `console.png`. A display serif
  or sharp grotesque for the hero — **not Inter for headlines.** Load via `next/font` in
  `layout.tsx` (currently absent) and update `--font-sans` / `--font-mono` in `@theme`.
- **Type scale:** hero huge, `clamp(3.5rem, 10vw, 8rem)`. Lots of air. Lowercase kickers fine;
  “Jhon Rey Consolacion”, “SukiSuite”, “Barangay Arena”, “BetterYield” stay capitalized.
- **Surfaces:** 1px gold/neutral hairline borders echoing `console.png`; noise or scanline
  overlay ≤4%; glass reserved for Ask My AI and the floating console — don't frost the page.
  A `.glass-panel` utility already exists in `globals.css`; retune it, don't duplicate it.
- **Project images:** reuse the real screenshots in `public/projects/`. Ken-like hover
  (scale + clip or volt wash). Do not mock up product UI that doesn't exist.
- Banned: purple-gradient SaaS look, generic Framer template, three-column Bootstrap energy.

---

## 6. Protect the differentiators

- Hero primary button **Ask My AI** — magnetic, cursor label `ASK`, `preloader-glyph` icon.
- Opening it should feel like a product: slide-over or command-palette sheet with a short
  terminal boot (`connecting to jhonrey…`). Keep the existing dynamic-import + focus-trap
  architecture; restyle only. The boot animation must never delay input focus.
- `/playground` gets the same cursor, nav, and transition system, a cinematic header instead of
  a lab-form dump, and unchanged enhancer / generate / rate-limit copy.
- Animation must never block focus in the chat input or the prompt textarea.

---

## 7. Motion quality bar

- 60fps on a mid laptop. No scroll jank. Batch DOM reads. Transform/opacity only.
- Register `ScrollTrigger` once; every component uses `useGSAP` / `gsap.context()` with cleanup.
  Kill tweens and triggers on unmount — App Router keeps clients mounted across navigations and
  stale triggers will haunt you.
- `prefers-reduced-motion: reduce` → no preloader lock, no Lenis, no split stagger, no trail, no
  magnetic, no custom cursor, no parallax. Instant static layout that still looks designed.
- Coarse pointer / touch → no cursor, no magnetic, no trail, no mouse parallax. Lenis light or
  native scroll if iOS feels off.
- Photoreal kit renders are the biggest perf risk on this site. WebP/AVIF, `next/image`, correct
  `sizes`, lazy below the fold, `priority` on the single hero visual only.
- A11y: keep the skip link, real `<button>`/`<a>`, focus-visible rings, form labels, WCAG AA
  contrast (**re-check everything against volt — `#E8F54A` on black is fine, but volt text on
  light surfaces and white text on volt buttons will both fail; use black text on volt fills**),
  `aria-hidden` on decorative clones and all purely decorative kit art (`alt=""`).
- No wheel hijacking into a forced slideshow. One pinned section, maximum.

---

## 8. Copy voice

First person, clear, specific, Mindanao-local where it's true. Not Ken's “pretty good dancer”
register, not LinkedIn-robot, not fake-humble.
Example hero sub: *“I build websites, applications, and automations with AI — then I put them in
front of real users in Kidapawan and beyond.”*
Lowercase kickers (`currently building`, `proof of work`) fine; headlines sentence case.
No testimonials you don't have. No Awwwards-bait language.

---

## 9. Implementation order

Ship in this order so the site is never half-broken. **Run `npm run lint && npm run build` after
every numbered step** and report the real output.

0. Print the route/component map + a short audit. Confirm the nine kit files are present in
   `public/brand/`, report their real dimensions and byte sizes, and state your transparency
   plan per §1.1. Flag anything above that no longer matches the code.
   **Wait for approval before writing code.**
1. Install GSAP/Lenis; add reduced-motion + pointer-capability hooks and the cursor/magnetic
   primitives. Optimize the kit to WebP/AVIF and commit derivatives.
2. Global layout: `next/font`, volt tokens in `@theme` (violet removed), Lenis provider, cursor,
   header with monogram, page-transition shell.
3. Preloader + hero — split text, `console.png` side panel, floating kit art, CTAs. Migrate
   `Hero` off framer-motion here.
4. Marquee + README/About with `monogram-jr`.
5. Horizontal works + project cards + trail — migrate `Projects`.
6. Build Log (four kit renders), How I Build pin, Services (three renders), Arsenal (`chip`) —
   migrate `Services`, `AnimatedSection`, `AnimatedBackground`.
7. Contact restyle — server action untouched.
8. `/playground` + case-study transition pass.
9. Ask My AI chrome pass — model logic untouched.
10. Remove `framer-motion` once unused. Regenerate `og-image.jpg` and the favicon from
    `monogram-jr.png`. Mobile / reduced-motion / Lighthouse pass. Fix anything shipping a
    400kb animation or image payload on first paint.

Work on the session branch. Conventional Commits. One focused PR per step or per pair of steps.

---

## 10. Done means

- [ ] Desktop feels alive like kenjimmy.xyz — cursor, magnetic, smooth scroll, split hero, trail,
      preload, transitions — while reading unmistakably as Jhon Rey (volt-on-black, console DNA,
      Ask My AI, playground, Kidapawan work)
- [ ] All nine kit assets are used in their assigned slots, screen-blended or cut so **no black
      plate edges are visible anywhere**, at any viewport, over any section background
- [ ] Mobile is fast, readable, unbroken: no fake cursor, no unusable pins, no full-size PNGs
- [ ] Every prior link, the contact form, Ask My AI, and the `/playground` generate + enhance
      paths still work; all three API routes still rate-limit and return graceful 429s
- [ ] `npm run lint` clean and `npm run build` green — stated with the actual output
- [ ] Exactly one palette (volt) and one animation library (GSAP) remain in `src/`
- [ ] Correct at 375px, 768px, 1440px; WCAG AA re-verified against volt, including button fills
- [ ] No invented biography, clients, testimonials, metrics, or tech stacks
- [ ] `task.md` updated; short changelog of files touched, plus every `TODO(jhonrey)`
      (fun fact, BetterYield stack, any uncovered art slot) listed for me to fill

**Start by printing the route/component map and your audit. Then wait.**
