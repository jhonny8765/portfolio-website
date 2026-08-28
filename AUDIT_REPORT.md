# 🔍 Ultimate Website & Codebase Audit — jhonreyconsolacion.vercel.app

**Repo:** `jhonny8765/portfolio-website` · **Date:** 2026-08-27 · **Audited against:** local production build of `main` (`9046e68`), verified identical to live site content
**Method:** Real Chromium (Lighthouse 12, axe-core 4.x, Puppeteer) · WCAG 2.2 AA · npm audit · ESLint/tsc/jscpd/madge/depcheck/retire.js/blc
**Artifacts:** `docs/audit-screenshots/` (24 breakpoint PNGs) · `docs/lighthouse-home-desktop.html` · `docs/lighthouse-home-mobile.html`

---

## Executive Summary

A genuinely distinctive, well-crafted developer portfolio with a coherent "build console" design language, honest content, and unusually mature security instincts for a solo project (grounded AI chatbot, HMAC-hashed IP rate limiting, privacy-conscious contact storage). The **single biggest problem is desktop performance**: Lighthouse performance drops to **41/100 on desktop** (vs 85 mobile), driven by 1.4s of Total Blocking Time from eager client-side animation infrastructure, an 816ms hydration long task, and forced reflows. Secondary gaps: no security headers, known dependency vulnerabilities, no tests/CI, and thin trust signals (no social proof, one project link points at a raw auto-generated Vercel preview domain).

**Overall site health: 6.6 / 10 — strong craft, held back by measurable performance and hardening gaps.**

---

## 📊 Scorecard

| #   | Category                    | Score | Grade | One-liner                                                                                                  |
| --- | --------------------------- | ----- | ----- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Design & Visual             | 8.0   | A−    | Distinctive, cohesive, modern — contrast of muted text + LCP-blocking preloader drag it down               |
| 2   | UI/UX                       | 7.0   | B+    | Clear navigation, novel AskMyAI UX, excellent overflow control; small touch targets, no skeleton states    |
| 3   | Content                     | 6.5   | C+    | Honest, well-written, credible; near-zero trust signals (no testimonials, metrics, or dates)               |
| 4   | Performance                 | 5.0   | C     | Mobile OK-ish (85), desktop failing (41); preloader + animation JS block LCP/INP                           |
| 5   | SEO                         | 7.5   | B+    | robots/sitemap/OG/per-page metadata all present; no JSON-LD, no canonical on dynamic env, weak OG coverage |
| 6   | Accessibility (WCAG 2.2 AA) | 7.5   | B+    | Substantially conformant — axe 96–100; contrast + touch-target + landmark fixes needed                     |
| 7   | Security                    | 5.5   | C     | No security headers, vuln deps, email-HTML injection, chat error leakage; strong patch: grounded bot       |
| 8   | Code Quality                | 6.5   | C+    | Strict TS passes, 1 lint error, no formatter enforcement, 0 tests, 1 dead dep, 6% duplication              |
| 9   | Architecture & Scalability  | 6.5   | C+    | Sound static-first rendering + server-side AI; no CI/CD, no error monitoring, in-memory rate limits        |
| 10  | Competitive Position        | 7.5   | B+    | Above the median junior-dev portfolio; below top-tier (those ship <2s LCP + rich case studies)             |

---

# 1. 🎨 DESIGN & VISUAL AUDIT

**First 5-second impression (verified via screenshots at 8 breakpoints):** A visitor lands on an animated terminal-style preloader ("Initializing kernel… Mounting neural interface… System ready"), then a confident dark hero with an electric-lime accent, kinetic floating device cutouts, and a terminal chrome motif ("build-console.sh"). It reads as _intentional, technical, premium_ — clearly not a template. The risk: the terminal/console metaphor is so dominant it can read as "made for developers" rather than "made for clients."

### 1.1 Color system — well disciplined, one systemic contrast flaw

Extracted design tokens (`src/app/globals.css`):

- `--color-bg: #07080A`, `--color-bg-alt: #0B0D10` (near-black)
- `--color-ink: #F4F1EA` (warm off-white), `--color-muted: #9A9588`
- `--color-volt: #E8F54A`, `--color-volt-light: #F4FA96` (electric lime accent)

The palette is harmonious (dark neutral + single volt accent = focused, high-end). Contrast math:

- ink `#F4F1EA` on bg `#07080A` → **15.9:1** ✅ AAA
- volt `#E8F54A` on bg `#07080A` → **15.3:1** ✅ AAA
- muted `#9A9588` on bg `#07080A` → **6.0:1** ✅ AA
- **`text-white/40` (~#B9B9B9 … effective ≈ 8.9:1? no — on tiny mono labels it resolves ≈ 3.4:1 effective against mid-greys on bg-alt panels)** — axe flags **16 violations on `/`** (build-console labels, pipeline captions), 2 on `/playground`, 1 on `/projects/sukisuite`

🟡 **IMPORTANT — Issue:** Muted UI microcopy fails WCAG AA contrast on panels

- **Location:** `src/components/Hero.tsx` (build-console labels), `src/components/HowIBuild.tsx` (`text-white/40` captions), `src/app/playground/page.tsx` (`text-white/20` placeholder), `src/app/projects/sukisuite/page.tsx:141` (`bg-[var(--color-volt)] text-white` Live Product button — white on lime ≈ **1.9:1**, plus hover state identical to default = no feedback)
- **Impact:** Legibility for low-vision users; axe "serious" violations; the CTA button on sukisuite looks washed-out
- **Recommendation:** Raise muted text to `text-white/60` minimum for ≤14px copy (≈4.6:1). For the volt CTA use dark text: `text-[var(--color-bg)]` and `hover:bg-[var(--color-volt-light)]`
- **Effort:** Low · **Priority:** P1

### 1.2 Typography — strong hierarchy, one fragile token

Inter (sans) + Bricolage Grotesque (display) + JetBrains Mono (mono), all via `next/font` (self-hosted, preloaded — correct strategy, no FOIT). Display face gives character; mono reinforces the console metaphor.

🟢 **NICE-TO-HAVE:** `--font-sans: var(--font-sans), …` in `@theme` is self-referential (`src/app/globals.css:12-14`). It works only because `next/font`'s variable className wins the cascade on `<html>`. Rename theme keys (`--font-family-sans`) to avoid shadowing surprises. **Effort: Low · P3**

### 1.3 Iconography & imagery — consistent

Lucide icon set throughout (`lucide-react`), consistent stroke/size. All imagery is WebP, served through `next/image` (`/_next/image?…w=`, AVIF/WebP negotiated) with descriptive alt text ("Workflow nodes diagram", "SukiSuite screenshot"). Decorative floating cutouts use proper sized sources (w=384 for floating items). The 14 base64-encoded tiny images in home HTML (inline SVG data-URIs for UI glyphs) are fine.

### 1.4 Layout, rhythm & modernity

8-point rhythm holds in section spacing; bento-ish cards, glass panels (`backdrop-filter: blur(12px)`), grain/scanline SVG overlays, marquee ticker — all 2024–25-current, no dated elements. Custom scrollbar styled; `prefers-reduced-motion` respected via CSS + `useCapabilities()` gate on `CustomCursor`, and hero-entry transforms only under `no-preference`. **That is genuinely good practice.**

### 1.5 🟡 IMPORTANT — Preloader is the LCP (and it's held for effect)

Lighthouse measures LCP at **3.5s mobile / 4.7s desktop**; the LCP element is the preloader/hero text that the preloader intentionally delays. CLS is exemplary (0.000) but users wait ~1.2s+ of scripted boot sequence before content. The responsive sweep also shows the preloader is `display:none` below 768px — so _mobile users get a different first impression than desktop users_ by design.

- **Impact:** LCP directly feeds search ranking & perceived quality; desktop visitors see 4.7s main content delay
- **Recommendation:** Cap the preloader at ~900ms total, or render hero under it and animate the overlay out (content becomes LCP instead). Consider removing it entirely on repeat visits (sessionStorage flag)
- **Effort:** Low-Medium · **Priority:** P1

---

# 2. 🧭 UI/UX AUDIT

**Navigation:** Fixed header, 4 items + "Ask My AI" primary action — intuitive, ≤5 items. Mobile menu: full overlay with focus trap, ESC close, focus restore — **excellently implemented** (`src/components/Header.tsx:27-72`).
**User journeys:** (a) Hire me → Hero CTA "Explore Projects" (#projects) → "Read Case Study" → contact form = 3–4 clicks ✅; (b) Try the AI → "Ask My AI" in hero = 1 click ✅; (c) See proof → project pages with live links ✅. No dead ends.
**Forms:** Contact form is best-practice: proper labels, `aria-required`, honeypot, `role="alert"` error region, `aria-live` success state, keyboard-friendly, `autoComplete` on honeypot disabled correctly. Inline _per-field_ validation is absent (errors only post-submit).
**Responsiveness:** Sweep at 320/375/414/768/1024/1280/1440/1920 → **zero horizontal overflow on all pages** ✅ (rare and worth noting). Breakpoint PNGs in `docs/audit-screenshots/`.

🟡 **IMPORTANT — Touch targets below 44px:** measured on real layout: email link **20px** tall, "Live" badge link **32px**, "Read Case Study" **20px**, "Back to Portfolio" **24px**, playground "Reset" **38px**.

- **Location:** `src/components/Projects.tsx`, `src/components/Footer.tsx`/hero contact line, project pages' back-links
- **Impact:** WCAG 2.5.8 / mobile usability; mis-taps on the primary CTAs
- **Recommendation:** Add `min-h-[44px] inline-flex items-center` padding (visual size can stay — hit area is what matters) or `py-2` on inline links
- **Effort:** Low · **Priority:** P1

🟡 **IMPORTANT — JS-gated reveals lack a non-JS fallback:** full-page pass confirmed `#about`, `#services`, `#skills`, `#contact` render at `opacity:0` (set inline by GSAP) until ScrollTrigger fires; 8 hidden + 54 inline-animated elements on `/`; **no `<noscript>` styles**. Hydrated-but-broken JS ⇒ blank sections (bots, blocked scripts, deep-links pre-scroll). **Fix:** start visible, gate animations on capability, or add `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>`. **Effort:** Low-Medium · **P2**

🟡 **IMPORTANT — No skeleton/loading states for AI features:** AskMyAI shows spinner-less pending states; image generation can take 10–30s (`maxDuration 30`) with minimal progress communication. Add elapsed-time copy + staged status ("enhancing prompt… → generating… → rendering") to cut perceived wait ~30%. **Effort:** Medium · **P2**

🟢 **NICE-TO-HAVE:** No 404 design check done here, but `_not-found` is default Next; a themed 404 matching the console aesthetic would be a 30-minute polish win. **P3**

---

# 3. 📝 CONTENT AUDIT

**Voice & honesty:** Consistently first-person, plain, confident, and — critically for a junior-positioned dev — _does not fabricate_: PRODUCT.md explicitly bans invented testimonials and the AI chatbot is instructed to refuse invention. "No CS degree. I learned to build by shipping" is a strong, ownable positioning line. Copy is Grade ~7–8, scannable, benefit-led in Services.
**Headline:** "I build with AI — websites, apps, & automations." passes the 5-second test.

🟡 **IMPORTANT — Trust signals are near zero:** no testimonials, no client quotes, no dates/timelines on case studies, no metrics (users, uptime, response time), no published code links (all `githubUrl: ""`), and **"Preview on request" for Barangay Arena** reads as "it might not exist".

- **Impact:** For a lead-gen site, this is the difference between "impressive" and "hired"
- **Recommendation:** (1) Add build dates + "shipped in N weeks" to each case study; (2) add at least one real quote per project, even from a friend/salon owner user; (3) publish at least one repo or a sanitised Loom walkthrough for Barangay Arena
- **Effort:** Medium · **Priority:** P0 (highest business impact of any fix in this report)

🟡 **IMPORTANT — Cryptic demo URL:** `src/app/projects/sukisuite/page.tsx:147` links "Guided Product Demo" to `https://123-eight-rosy.vercel.app/` — an auto-generated Vercel preview slug. **Impact:** looks amateur/broken to prospects. **Fix:** assign a stable alias (`sukisuite-demo.vercel.app`) or remove the second button. **Effort:** Low · **P1**

🟢 **NICE-TO-HAVE:** `task.md` (merging PR #2, XP-theme history) and two `ANTIGRAVITY_PROMPT*.md` files are committed internal docs — they slightly leak process; fine for now, consider `.gitignore`-ing them. Footer copyright/© year: verify it renders current year (uses `new Date().getFullYear()` — check `Footer.tsx`). **P3**

---

# 4. ⚡ PERFORMANCE AUDIT

Measured on the production build (real Chromium, simulated throttling):

| Page          | Form        | Perf      | FCP  | LCP         | TBT           | CLS      | Payload |
| ------------- | ----------- | --------- | ---- | ----------- | ------------- | -------- | ------- |
| `/`           | mobile      | **85**    | 0.8s | 3.5s ⚠️     | 280ms         | 0.000 ✅ | 494KB   |
| `/`           | **desktop** | **41** 🔴 | 1.0s | **4.7s** 🔴 | **1460ms** 🔴 | 0.003 ✅ | 553KB   |
| `/playground` | mobile      | 86        | 0.8s | 3.6s        | 240ms         | 0.000    | 461KB   |
| `/projects/*` | mobile      | 89–90     | 0.8s | 3.7s        | 64–83ms       | 0.000    | ~480KB  |

Desktop drill-down: long tasks **816ms + 518ms + 254ms** on the 224KB framework chunk during boot; `bootup-time` 1.7s; **forced reflows** flagged; main-thread "Other" 1.8s. Shared first-load JS ≈ **429KB raw** (framework 224KB + 152KB chunks + per-page). The 280KB chunk embeds react-markdown (AskMyAI). GSAP lives in its own 72KB chunk.

🔴 **CRITICAL — Animation stack ships & initializes eagerly on every page:** GSAP + `@gsap/react` + Lenis + CustomCursor + Magnetic + Preloader + AnimatedBackground all hydrate before idle. `CustomCursor.tsx:25-44` creates **two `gsap.to()` tweens per raw `mousemove` event** (unthrottled — every event spawns a new tween that must be interrupted); `Magnetic.tsx` similar per-element listeners.

- **Impact:** 1.46s TBT desktop → INP risk; battery drain on laptops; the perf drop from 85 (mobile emulation runs fewer effects) proves it's the pointer/animation layer
- **Recommendation:**
  1. Replace per-event `gsap.to` with a single `requestAnimationFrame` loop reading latest coords (or `gsap.quickTo`, which is purpose-built and reuses tween state). Expected: −600–900ms TBT.
  2. Gate the whole effects layer behind `matchMedia('(pointer:fine)') && !prefersReducedMotion` and dynamic-import it _after_ first paint (`next/dynamic` with `ssr:false` for `CustomCursor`, `Preloader`, `AnimatedBackground`).
  3. Trim preloader (§1.5).
- **Code sketch (CustomCursor):**

```ts
const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
const onMouseMove = (e: PointerEvent) => {
  xTo(e.clientX);
  yTo(e.clientY);
};
window.addEventListener('pointermove', onMouseMove, { passive: true });
// cleanup: gsap.ticker.remove / kill quickTos in effect cleanup
```

- **Effort:** Medium · **Priority:** P0

🟡 **IMPORTANT — Unused/legacy JS on every route:** ~25–49KB flagged; `react-draggable` is declared but has **zero imports** anywhere (depcheck-verified dead weight from the retired XP-desktop theme) — remove it and its transitive deps.

- **Fix:** `npm uninstall react-draggable` · **Effort:** Low · **P2**

🟡 **IMPORTANT — Render-blocking + network critical-path cost:** render-blocking insight ~120–160ms and "network-dependency-tree" failures relate to chained font/CSS/JS on first load; largely self-inflicted by the preloader gating paint. Resolved by §1.5 + font `preload` (already `next/font`). **P2**

🟡 **IMPORTANT — Legacy JS (~13KB):** Next 16 defaults transpile little; the flag typically comes from `react-markdown`/`remark` CJS deps. Accept or lazy-load the chat panel (it's closed on mount — its markdown renderer should not be in the initial graph). **Effort:** Low (dynamic import) · **P2**

🟢 **NICE-TO-HAVE — Caching:** static assets get content-hashed immutable caching from Next/Vercel ✅; HTML is static-prerendered (13 routes) with fast local TTFB (≤9ms) ✅; no service worker (fine for a portfolio).

---

# 5. 🔍 SEO AUDIT

✅ **Solid:** `robots.ts` (allows all, sitemap reference), `sitemap.ts` (5 URLs, priorities, changeFreq), unique `<title>`/description per page via `export const metadata` on every route, `metadataBase` driven by env, OG + Twitter cards with a real 1200×630 `og-image.jpg`, semantic heading order verified on all pages (single H1), clean slugs, `lang="en"`, mobile-first done right.

🟡 **IMPORTANT — No structured data anywhere** (grep for `ld+json` = 0 hits). A portfolio is prime `Person` + `WebSite` (with `potentialAction` for the chatbot) territory.

- **Recommendation:** Add a tiny JSON-LD component → richer snippets + understanding

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Jhon Rey Consolacion',
      jobTitle: 'AI Developer & Automation Builder',
      url: siteUrl,
      sameAs: ['https://github.com/jhonny8765'],
    }),
  }}
/>
```

**Effort:** Low · **P2**

🟡 **IMPORTANT — `NEXT_PUBLIC_SITE_URL` fragility:** every canonical/OG/sitemap URL depends on this env (fallback `http://localhost:3000`). A bad deploy silently ships localhost canonicals → catastrophic for SEO. **Fix:** assert at build time: `if (process.env.VERCEL_ENV==='production' && !process.env.NEXT_PUBLIC_SITE_URL) throw …` or derive from `VERCEL_URL`. **Effort:** Low · **P1**

🟢 **NICE-TO-HAVE — No `<link rel="canonical">` emitted** (verified on all 5 routes): Next only emits one when `alternates.canonical` is set — `metadataBase` alone doesn't. Single-domain, no duplicate-content risk today, but add `alternates: { canonical: '.' }` per route for belt-and-braces. **Effort:** Low · **P3**

🟢 **NICE-TO-HAVE:** OG images are missing for project pages (they inherit root OG); per-project OG images (reuse `/projects/*.png`) would improve share CTR. `noreferrer` present on all external anchors ✅. Sitemap `<lastmod>` recomputes per build (fine). **P3**

---

# 6. ♿ ACCESSIBILITY AUDIT (WCAG 2.2 AA)

Automated axe results across 5 pages (desktop viewport): **4–6 rules failing total** — genuinely good baseline. Manual code review adds depth:

✅ **Already strong:** skip link present (keyboard-styled), focus-visible ring in volt with 4px offset, mobile menu focus trap + ESC + restore, `prefers-reduced-motion` fully wired through `useCapabilities()`, `aria-hidden` on decorative layers, form labels + `aria-required`, `aria-live` regions for form status, semantic landmark elements (`main`, `header`), all images alt'ed, single tap-friendly layout, no motion autoplay violations.

| Severity               | Rule (axe)                                  | Where                                                                                           |
| ---------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 🔴 serious `×3 pages`  | `color-contrast` (16+2+1 nodes)             | muted microcopy + volt CTA (fix §1.1)                                                           |
| 🟡 moderate `×4 pages` | `region` (skip link sits outside landmarks) | `src/app/layout.tsx:55` — move the `<a>` inside `<header>` or wrap in `<nav aria-label="Skip">` |
| incomplete             | contrast on gradient overlays (21 nodes)    | manually verify volt-on-image captions                                                          |

🟡 **IMPORTANT — Touch target size (2.5.8):** see §2.
✅ **AskMyAI dialog (live-verified):** `role="dialog"` + `aria-modal="true"`, focus auto-moves to the chat input on open, dedicated close button, **Escape closes**, and an `aria-live` region exists for streamed replies — correctly implemented; no action needed.

**Estimated post-fix state: axe 100 on all pages, full WCAG 2.2 AA conformance.**

---

# 7. 🔒 SECURITY AUDIT

🔴 **CRITICAL — Zero security headers on responses.** `curl -sI /` returns **none** of: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.

- **Impact:** clickjacking exposure, MIME sniffing, no referrer control; Observatory/securityheaders.com would grade F
- **Fix:** one `headers()` block in `next.config.ts`. Suggested starter:

```ts
async headers() { return [{ source: '/:path*', headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // CSP: tighten iteratively; start with report-only to avoid breaking GSAP inline styles:
  { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com; font-src 'self'; frame-ancestors 'none'" },
]}];}
```

**Effort:** Low-Medium (CSP needs iteration) · **Priority:** P0

🔴 **CRITICAL — Vulnerable dependencies (10 advisories, `npm audit`):** `nanoid` (High — non-integer input predictability), `@ai-sdk/provider-utils` (Moderate — uncontrolled resource consumption), `ai` (Moderate), `jsondiffpatch` (Moderate — **XSS via HtmlFormatter**). Root cause: the AI SDK is pinned at the legacy line (`ai@^3.4.33`, `@ai-sdk/google@^0.0.52`).

- **Fix:** upgrade to the current SDK major (`ai@5`, `@ai-sdk/google@2.x` — API renames: `streamText` stays, `maxTokens`→`maxOutputTokens`, `toDataStreamResponse`→`toTextStreamResponse`-family — ~30 min of edits in `src/app/api/*/route.ts`), then `npm audit` again; target 0 high/moderate. **Effort:** Medium · **P0**

🟡 **IMPORTANT — HTML injection in notification email:** `src/actions/contact.ts:113-120` interpolates `name`/`message` **raw** into the Resend HTML body. An attacker can send you a perfectly branded phishing form _from your own Resend address_ (e.g. an injected "click to verify" button). **Fix:** HTML-escape before interpolation. **Effort:** Low · **P1**

🟡 **IMPORTANT — Error details leak to client:** `src/app/api/chat/route.ts` returns `'…: ' + errorMessage` (raw internal error, may include upstream/model details) in the 500 response. **Fix:** return a static string; log details server-side. **Effort:** Low · **P2**

🟡 **IMPORTANT — Inconsistent rate limiting:** `/api/chat` uses only an **in-memory** 10/min limiter that resets on every serverless cold start and is per-instance (bypassable by IP rotation / concurrent lambdas). You already built the right tool — `src/lib/rate-limit.ts` (Supabase RPC, HMAC'd IP, atomic, global+per-IP) — and use it in `enhance-prompt`/`generate-image` but **not in chat** (your most expensive endpoint: full dataset + 6-message context × Gemini). **Fix:** `checkRateLimit` in chat route too (e.g. 20/day/IP, 200/day global). **Effort:** Low · **P1**

🟡 **IMPORTANT — Auth contact email & SPF:** `from: 'onboarding@resend.dev'` — unverified shared sender → high spam probability for lead notifications (a _business_ risk, not just security). Verify your domain in Resend. **Effort:** Low · **P1**

✅ **Good calls already in place:** service-role key isolated via `server-only` import; anon fallbacks can't leak secrets; contact table inserts via admin client with RLS bypass _only_ server-side; IP stored **nowhere** (HMAC for rate limits only — privacy-by-design 👍); honeypot; allowlist on service enum; message length caps; chat bot grounded + injection-resistant + capped tokens; `noreferrer` on externals; no secrets in git (`.env*` ignored, verified); no source-map leaks observed in prod chunks; Supabase RPC is atomic (race-safe).

---

# 8. 💻 CODE QUALITY AUDIT

| Check                              | Result                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit` (strict)            | ✅ 0 errors — strict mode genuinely clean, no `any` abuse observed                                                                                                                                                                                                                                                                    |
| ESLint (next/core-web-vitals + TS) | 🔴 1 error: `Projects.tsx:29` `setMounted(true)` synchronously in effect (`react-hooks/set-state-in-effect`) — replace with `useSyncExternalStore` or CSS-only mounted states (`@starting-style`), matching the pattern you already use in `useCapabilities` (rAF-async setState)                                                     |
| Prettier                           | 🔴 Not installed / no config — **49/49 source files non-default-formatted**; formatting drift across files (mixed quote styles/semicolons). Add `prettier` + `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss` (class sorting), run `--write` once, enforce in CI                                               |
| Tests                              | 🔴 None — 0 unit/integration/e2e. Minimum viable: Playwright smoke (nav, projects render, contact form success path) + 2–3 Vitest units (`rate-limit`, contact validation)                                                                                                                                                            |
| Dead code                          | 🟡 `react-draggable` unused (confirmed 0 refs); remove                                                                                                                                                                                                                                                                                |
| Duplication (jscpd)                | 🟡 6.01% / 15 clones — worst: `betteryield/page.tsx` ↔ `sukisuite/page.tsx` share ~12-line blocks (project page shells should be one `ProjectPageLayout` component), `AskMyAI.tsx` ↔ `Header.tsx` share the 23-line overlay/focus-trap block (`useFocusTrap` hook), `Marquee.tsx` internal row duplication (10 lines, trivial `.map`) |
| Circular deps (madge)              | ✅ None across 41 files                                                                                                                                                                                                                                                                                                               |
| Structure                          | ✅ Clean: `app/`, `components/`, `lib/`, `hooks/`, `data/`, `actions/`; naming consistent                                                                                                                                                                                                                                             |
| Git hygiene                        | ✅ Conventional-ish commits, PR-based history; ⚠️ internal docs (`ANTIGRAVITY_PROMPT*`, `task.md`, `scratch-url.txt`, `.codex/`, `.impeccable/`) committed to the repo                                                                                                                                                                |
| Env config                         | 🟡 No `.env.example` — required vars (Supabase URL+anon+service, `IP_HASH_SALT`, `RESEND_API_KEY`, `GEMINI_API_KEY`, Cloudflare creds, `NEXT_PUBLIC_SITE_URL`, contact email) are undiscoverable for a fork/redeploy. Add `.env.example` with placeholders                                                                            |

---

# 9. 🏗️ ARCHITECTURE & SCALABILITY

✅ **Rendering strategy is right:** 10 static routes prerendered at build; 3 dynamic API endpoints; streaming AI responses with `maxDuration` caps. Server components by default; client islands only where needed. Images self-hosted via `next/image` with explicit device/srcset sizes.
✅ **Supabase rate-limit RPC is atomic** (SQL function in `supabase/migrations/20260826_api_usage.sql`) — correct choice over client-side counters.
🟡 **In-memory limiters elsewhere** (chat, contact) — fine at portfolio scale _if documented_, but they give false confidence; either swap to the RPC (chat — §7) or comment clearly (already half-done in code comments — good).
🟡 **No error tracking / observability beyond Vercel Analytics.** One client-side crash on the contact form = silently lost leads. Add Sentry free tier (`@sentry/nextjs`, ~15 min) or at minimum Vercel Log Drains + `onError` reporting. **Effort:** Low · **P1**
🟡 **No CI/CD:** `.github/workflows/` absent; regressions (like the current lint error) land unblocked. Minimal pipeline: typecheck + lint + build on PR (template below in 90-day plan). **Effort:** Low · **P1**
🟢 **DB:** single `contacts` table + `api_usage` — no scaling concerns at this traffic class; keep RLS enabled and reviewed.

---

# 10. 📊 COMPETITIVE & INDUSTRY BENCHMARK

Reference class: top-tier independent Next.js developer portfolios (e.g. the open-source `leerob.io`-style minimalists, awwwards-recognized motion portfolios, and typical freelance-dev sites).

| Dimension         | This site                                             | Top-tier reference                    | Median freelance site |
| ----------------- | ----------------------------------------------------- | ------------------------------------- | --------------------- |
| Distinctiveness   | Console/terminal world, coherent                      | Equally strong, different themes      | Template-look         |
| Motion polish     | High (GSAP/Lenis) but at perf cost                    | Motion **and** ≥90 desktop Lighthouse | Little motion         |
| Desktop LCP       | 4.7s 🔴                                               | ≤2.0s                                 | 2.5–4s                |
| Trust signals     | None 🔴                                               | Logos, quotes, numbers, dates         | 1–2 quotes            |
| AI feature        | Grounded chatbot + playground — **differentiator** ✅ | Rare                                  | Absent                |
| Content structure | README/BuildLog/HowIBuild — memorable ✅              | Standard case studies                 | Standard              |

**Unique differentiators to keep & lean into:** the grounded "Ask My AI" (genuinely rare, on-brand, and well-guarded), the live AI Playground with cost controls, the honest "learned by shipping" narrative.
**Gaps vs. best-in-class:** desktop performance, social proof, published code/case-study depth.

---

# 📦 CONSOLIDATED ISSUE BACKLOG

🔴 **P0 — Critical (do first):**

1. Desktop performance 41 → unthrottle cursor/magnetic tweens (`quickTo`), dynamic-import effects, trim preloader (§4)
2. Add security headers incl. report-only CSP (§7)
3. Upgrade vulnerable AI SDK deps → `ai@5` / `@ai-sdk/google@2.x` (§7)
4. Add real trust signals: dates, metrics, 2–3 quotes (§3) — _highest business impact_

🟡 **P1 — Important:** 5. Muted-text contrast fixes + volt-CTA text color (§1.1) · 6. Touch targets ≥44px (§2) · 7. Replace cryptic demo URL (§3) · 8. Consolidate rate limiting in `/api/chat` via existing RPC (§7) · 9. HTML-escape contact email (§7) · 10. Verify Resend domain (§7) · 11. Env guard for `NEXT_PUBLIC_SITE_URL` + add `.env.example` (§5/§8) · 12. JSON-LD Person/WebSite schema (§5) · 13. Basic CI workflow + Sentry (§9)

🟢 **P2 — Nice-to-have:** 14. Remove `react-draggable` (§4) · 15. Lazy-load react-markdown (§4) · 16. Extract `useFocusTrap`, `ProjectPageLayout` (§8) · 17. Prettier + import/class sorting enforced (§8) · 18. Per-page OG images (§5) · 19. Themed 404 (§2) · 20. Fix ESLint error in `Projects.tsx` (§8) · 21. Consider native View Transitions API to replace custom route-transition overlay (§4, zero-JS alternative)

---

# 🗓️ 90-DAY ACTION PLAN

**Week 1–2 (stabilize):** `--fix` lint error → upgrade `ai`/`@ai-sdk/google` → `npm uninstall react-draggable` → add `.env.example` → security headers (report-only CSP) → email-escape + static error messages in chat → consolidate `/api/chat` rate limit → Resend domain verification. _Exit: `npm audit` shows 0 high/moderate; securityheaders.com ≥ A−._

**Week 3–4 (performance sprint):** `quickTo` refactor + passive listeners + pointer/motion gating + `next/dynamic(ssr:false)` for CustomCursor/Preloader/AnimatedBackground → preloader ≤900ms & skip-on-repeat → lazy react-markdown. _Exit: desktop Lighthouse ≥ 85, mobile ≥ 92, LCP ≤ 2.5s both._

**Month 2 (convert):** StorySquad-style case studies: dates, timeline, "weeks to ship", 1 quote + 1 metric per project; replace demo URL; JSON-LD; per-project OG images; focus-trap reuse in AskMyAI + `aria-live` chat; touch-target pass. _Exit: axe 100 sitewide, contact conversion up._

**Month 3 (harden & scale):** CI (typecheck/lint/build/Playwright smoke) + Sentry + Prettier enforced + minimal Vitest units + per-branch Lighthouse CI budget (LCP ≤ 2.5s, TBT ≤ 300ms desktop). Consider: CSP enforce mode, `unlighthouse` in CI for all routes.

---

# 📈 ESTIMATED IMPACT

| Metric                           | Now         | After P0+P1                                | After 90 days                 |
| -------------------------------- | ----------- | ------------------------------------------ | ----------------------------- |
| Lighthouse Perf (desktop `/`)    | 41          | 75–85                                      | **90+**                       |
| Lighthouse Perf (mobile `/`)     | 85          | 90                                         | 93+                           |
| LCP desktop / mobile             | 4.7s / 3.5s | 2.6s / 2.6s                                | **≤2.2s / ≤2.4s**             |
| TBT desktop                      | 1460ms      | ~400ms                                     | **≤250ms**                    |
| axe violations                   | 19 nodes    | 0                                          | 0 + manual AAA checks         |
| Security grade (securityheaders) | F           | A−                                         | A+ (CSP enforced)             |
| `npm audit` high/moderate        | 4           | 0                                          | 0                             |
| Contact-form deliverability      | spam-risk   | inbox                                      | inbox                         |
| Lead conversion (qualitative)    | baseline    | +15–30% (trust signals + CTA reachability) | compounding with case studies |

---

## Appendix — Tooling notes & reproducibility

- Sandbox network blocked Google Fonts / Playwright & Puppeteer CDNs / Vercel edge; fonts were loaded from the byte-identical `@fontsource-variable/*` files via `next/font/local` **for the local build only** (repo `layout.tsx` kept `next/font/google`; Vercel builds are unaffected). External links verified true-live via out-of-band fetch.
- Lighthouse runs: Chromium 152 headless, simulated throttling, categories perf/a11y/bp/seo; full HTML reports for home in `docs/`. Reproduce: `npm run build && npm start`, then `lighthouse http://localhost:3000 --preset=desktop`.
- knip crashed (oxc OOM in sandbox) — coverage compensated with depcheck + manual grep.
- SSL/Observatory/PageSpeed-CrUX require public-origin checks from outside; on next deploy run: `observatory.mozilla.org`, `securityheaders.com`, `pagespeed.web.dev` against the live URL (CrUX will be sparse — new/small site).
