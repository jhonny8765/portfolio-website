# Antigravity task: cinematic hybrid rebuild of jhonreyconsolacion.vercel.app

You are working on the existing Next.js portfolio at this repo (live: https://jhonreyconsolacion.vercel.app). Do **not** start from a blank template. Inspect the codebase first, then upgrade it in place.

Reference (motion / layout / personality only — do **not** clone): https://kenjimmy.xyz

Goal: a **hybrid**. Ken Jimmy’s award-site cinema (GSAP, Lenis, custom cursor, magnetic UI, split text, preload, page transitions, mouse-follow art, horizontal works strip) wrapped around **my** identity: AI Developer & Automation Builder from Mindanao. The site must still convert for local clients **and** impress developers/recruiters.

---

## HARD RULE: no new image / video generation

A finished asset pack is already in the repo at **`public/site-assets/`** (copied from the `site-assets/` folder shipped with this prompt). Read `public/site-assets/manifest.json` and obey it.

- **Do not** call image models, Midjourney, DALL·E, Flux, playground generate, or any “create an illustration” step.
- **Do not** generate video, Lottie, or animated GIFs.
- **Do not** invent a portrait of me. No stock faces. Use `brand/monogram-jr.png` if no real photo exists in `/public`.
- **Do not** redraw or replace project screenshots. Use the existing files under `/public/projects`.
- **Do not** download Ken Jimmy’s images.
- If an asset is missing, use type + CSS — never generate a replacement.
- Floating PNGs were shot on `#07080A`. Apply `mix-blend-mode: screen` (or `lighten`) so the studio backdrop disappears. `pointer-events: none`.
- Locked accent: **`#E8F54A`**. Locked bg: **`#07080A`**. Do not pick teal.

---

## 0. First actions (mandatory)

1. Confirm `public/site-assets/manifest.json` exists. If the pack is still at repo-root `site-assets/`, copy it to `public/site-assets/` first.
2. Map the app: App Router vs Pages, layout, global CSS, fonts, existing animation libs, contact form, Ask My AI entry point, `/playground`, project case-study routes.
3. List every current section and route. Do not delete routes or API handlers.
4. Confirm stack (expected: Next.js, React, Tailwind). Keep it.
5. Add only: `gsap` + `@gsap/react` + `ScrollTrigger` + `ScrollToPlugin` (and SplitText if the GSAP license in this project allows; otherwise a small custom split). Add `lenis` for smooth scroll. Do **not** add Framer Motion unless something already depends on it.
6. Prefer CSS for simple hovers. GSAP is for scroll, cursor, magnetic, preload, transitions, split text, trails.

If a file is large, split it. Keep components small and named.

---

## 1. Non-negotiables (do not remove or hide)

- **Facts stay true.** Name: Jhon Rey Consolacion. Role: AI Developer & Automation Builder. Email: jhonreyc2001@gmail.com. Location flavor: Kidapawan City / SOCCSKSARGEN / Mindanao, Philippines. Do not invent clients, metrics, employers, or awards.
- **Ask My AI** stays a primary CTA in the hero and remains reachable from the header. Do not break its existing chat/API.
- **`/playground`** (AI Image Playground: Gemini prompt enhancer + Cloudflare Workers AI) stays live. Restyle the chrome to match the new system; do not break generate / enhance / rate-limit behavior.
- **Projects stay:** SukiSuite, Barangay Arena, BetterYield, plus the playground as experimental work. Keep live/preview labels honest (Barangay Arena = preview on request; BetterYield tech line is pending confirmation — do not invent a stack).
- **Build log facts stay:**
  - Currently building: local delivery app for Kidapawan City (independent riders on Messenger → web order + location-based delivery).
  - Currently learning: Gemini Pro token/cost optimization.
  - Recent experiment: `/playground`.
  - Next up: POS for milk-tea / small shops in Kidapawan.
- **Process stays:** Discover → Prototype → Integrate → Improve.
- **Services stay:** Web Application Development, Workflow Automation (n8n), AI Integrations.
- **Arsenal stays:** Active = AI-assisted dev, n8n, Next.js & React, Tailwind, Supabase, Firebase, GitHub, API integrations. Exploring = Advanced RAG, custom AI agents, Python data pipelines.
- **Contact form stays** (name, email, help type, message, honeypot). Restyle it; keep validation + submit working.
- Case study routes (`/projects/sukisuite`, `/projects/barangay-arena`, `/projects/betteryield`) stay. Upgrade their entrance/transition, do not gut content.

---

## 2. What to steal from kenjimmy.xyz (feel, not clone)

Steal **behavior and pacing**, not his logo, illustrations, lowercase Nigerian-dev voice, project shots, or layout 1:1.

Must implement:

1. **Preloader (1.2–2.0s, skippable if already visited this session)**  
   Terminal-flavored, not a generic spinner. Example: `build-console.sh` lines (`Initializing…` / `Idea & Planning` / `AI-Assisted Build` / `Live Deployment`) that type or tick, then a wipe/clip reveal into the hero. Progress % optional. `prefers-reduced-motion`: instant skip.

2. **Lenis smooth scroll** on the homepage and case studies. Anchor links (`#projects`, `#contact`, Ask My AI) must still work. Kill Lenis on reduced-motion.

3. **Custom cursor (pointer devices only)**  
   Small dot + trailing ring. States:
   - default
   - hover link/button → ring expands, optional word (`OPEN` / `ASK` / `VIEW`)
   - hover image/project → larger ring or inverted mix-blend
   - hover Ask My AI → label `ASK`
   Hide default cursor on desktop; never show custom cursor on touch. Always provide a real focus ring for keyboard.

4. **Magnetic buttons / logo / primary nav / hero CTAs / project “view” links**  
   Element eases toward pointer inside a radius, elastic snap-back. Disable under `768px` and on touch.

5. **Split-text hero**  
   Headline “I build with AI — websites, apps, & automations.” splits by lines then words (or chars if performant). Stagger in after preloader. Subcopy fades after. CTAs magnetic-slide in last.

6. **Scroll-triggered reveals**  
   Almost every section: fade/slide/clip with stagger. Pin the “How I Build” 01–04 steps on desktop into a short scrubbed sequence (not a long hostage pin). Mobile = stacked cards, no pin.

7. **Hover image trail on the works strip**  
   Desktop: moving across the project rail leaves a short trail of project screenshots at the pointer (reuse a tiny DOM pool, Ken-style). Touch: static images, no trail.

8. **Mouse-follow / parallax illustrations in the hero + about**  
   Use **only** the pack in `manifest.json` → `heroFloaters` + `aboutFloaters`. Depth values are mouse-parallax multipliers (px). Hide all floaters on mobile / touch as the manifest says. Do **not** copy Ken’s cartoon characters. Do **not** add extra floaters.

9. **Horizontal works strip**  
   After About / README: a full-bleed horizontal project rail (drag + scroll-linked translate on desktop; swipe on mobile). Each card: screenshot, name, one-line, status pill (Live / Preview / Experimental), stack chips, link to live and case study.

10. **Page transitions**  
    Shared-layout or overlay wipe (console scanline / clip-path) between `/`, `/playground`, and `/projects/*`. Back button and first load must feel intentional.

11. **Currently-building ticker**  
    Infinite marquee under the hero or in the header:  
    `Building · Kidapawan delivery app` / `Learning · Gemini token optimization` / `Next · POS for local shops` / `Live · SukiSuite` / `Experimental · AI Playground`

12. **README / About block** (new — Ken’s personal README energy, my facts)  
    Short, first-person, confident, not cringe. Cover: I build with AI in public; I ship real tools for salons, barangays, farmers, and local riders; when I’m not shipping I’m tightening Gemini costs or testing models in `/playground`. Add 2–3 human lines **only if they are already implied by the site** (Kidapawan, independent riders, milk-tea POS). Do **not** invent hobbies. Leave a clearly marked `TODO: add one real fun fact` comment in the component if nothing verified exists.

---

## 3. Information architecture (homepage)

Keep one long homepage. Suggested order:

1. Preloader → **Hero** (split headline, subcopy, Ask My AI + Explore Projects, email fallback, floating console assets, optional live `build-console.sh` panel as a *side* visual — not the whole hero).
2. **Marquee** (currently building / learning / next).
3. **README / About** (personality + `brand/monogram-jr.png` unless a real photo already exists in `/public`. Never generate a face).
4. **Build Log** (the four facts, restyled as a terminal/log but cinematic).
5. **Horizontal Works** + existing project cards/case study links.
6. **How I Build** (pinned 01–04 on desktop).
7. **AI Image Playground teaser** → `/playground`.
8. **Services** (three magnetic cards).
9. **Technical Arsenal** (two clusters: Active / Exploring). Ken’s “I cook with these ingredients” energy is OK as a heading *only if* rewritten in my voice, e.g. “What I actually ship with”.
10. **Let’s Work Together** contact form + email.

Header: logo/name, Works, Playground, Ask My AI, Contact. Magnetic on desktop. Footer: email, year, small “Built with AI, shipped by hand” line.

---

## 4. Visual system (hybrid, not a Ken clone)

- **Base:** near-black (`#07080A`–`#0B0D10`) with warm off-white type. Not Ken’s exact palette.
- **Accent (locked):** `#E8F54A`. Use it for cursor ring, marquee separators (`ui/marquee-sep.svg`), live pills, focus, terminal prompts.
- **Overlays:** `overlays/grain.svg` + `overlays/scanlines.svg` as fixed full-viewport layers at 3–5% opacity.
- **Preloader glyph:** `brand/preloader-glyph.png` next to the typed `build-console.sh` lines.
- **Console DNA:** `ui-monospace` / JetBrains Mono / Geist Mono for logs, labels, kicker text (`01 Discover`, `user@system`), and the preloader. Display serif **or** a sharp grotesque for the hero (not Inter for headlines).
- **Type scale:** hero must feel huge (clamp 3.5rem → 8rem). Lots of air. Lowercase kickers like Ken are fine; **my name and product names stay correctly capitalized**.
- **Surfaces:** thin 1px borders, slight noise or scanline overlay at ≤4% opacity, glass only on Ask My AI / floating console — don’t frost the whole page.
- **Project images:** keep existing screenshots in `/public/projects`. Add Ken-like hover (scale + clip or color wash). Do not fake new product UI.
- **No** purple-gradient SaaS look, no generic Framer template, no three-column Bootstrap energy.

---

## 5. Ask My AI + Playground (protect the differentiators)

- Hero primary button: **Ask My AI**. Magnetic + cursor label `ASK`.
- Opening Ask My AI should feel like a product, not a random modal: slide-over or command-palette sheet with a short terminal boot (`connecting to jhonrey…`). If it already has a route or overlay, keep that architecture and restyle.
- Playground page: same cursor/nav/transition system. Keep enhancer + generate + rate-limit copy. Add a small cinematic header, not a lab-form dump.
- Never let animation block input focus inside the chat or the prompt textarea.

---

## 6. Motion rules (quality bar)

- 60fps on a mid laptop. No scroll jank. Batch DOM reads. Kill tweens on unmount.
- Register ScrollTrigger once; `gsap.context()` + cleanup in every component.
- `prefers-reduced-motion: reduce` → no preloader lock, no Lenis, no split stagger, no trail, no magnetic, no custom cursor. Instant static layout. Still looks designed.
- Touch / coarse pointer: no custom cursor, no magnetic, no image trail, no mouse-follow. Keep Lenis light or native scroll if iOS feels off.
- Respect `loading="lazy"` on below-fold images. Preloader may wait on hero font + one hero visual only, not the whole page.
- Accessibility: skip link stays, real `<button>`/`<a>`, focus-visible rings, form labels, contrast ≥ WCAG AA, `aria-hidden` on decorative trail clones.
- Do not scroll-hijack the wheel into a forced slideshow. Lenis + ScrollTrigger pin on **one** section max (How I Build).

---

## 7. Copy voice

- First person, clear, specific, Mindanao-local when it’s real.
- Not Ken’s “exceptional software engineer / pretty good dancer” voice.
- Not LinkedIn-robot. Not fake-humble.
- Example hero sub: “I build websites, applications, and automations with AI — then I put them in front of real users in Kidapawan and beyond.”
- Kickers can be lowercase (`currently building`, `proof of work`). Headlines can be sentence case.
- Do not add testimonials you don’t have. Do not add “Awwwards” energy in the copy.

---

## 8. Implementation order

Work in this order so the site never stays half-broken:

1. Audit + install GSAP/Lenis + reduced-motion helper + cursor/magnetic primitives.
2. Global layout: fonts, color tokens, Lenis provider, cursor, header, page transition shell.
3. Preloader + hero (split text + floating assets + CTAs).
4. Marquee + README/About.
5. Horizontal works + project cards + trail.
6. Build log, process pin, services, arsenal.
7. Contact restyle (keep backend).
8. Playground + case-study transition pass.
9. Ask My AI chrome pass (do not rewrite model logic).
10. Mobile / reduced-motion / Lighthouse pass. Fix anything that ships a 400kb animation on first paint.

---

## 9. Done means

- Desktop feels *alive* like kenjimmy.xyz (cursor, magnetic, smooth scroll, split hero, trail, preload, transitions) but still obviously **Jhon Rey** (AI, console, Ask My AI, playground, Kidapawan work).
- Mobile is fast, readable, and non-broken (no fake cursor, no unusable pins).
- Every previous link, form, Ask My AI, and `/playground` generate path still works.
- No invented biography, clients, or metrics.
- You show me a short changelog of files touched and any TODO (photo, fun fact) I need to fill.

Start by printing the route/component map, then implement.
