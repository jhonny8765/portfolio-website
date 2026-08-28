# 🛠️ Implementation Plan — Portfolio Improvement Roadmap

Derived from `AUDIT_REPORT.md` (21 issues) + `docs/STEP2-LIBRARY-RECOMMENDATIONS.md`.
Sized for a **solo developer**. Each phase is independently shippable — merge after each one.
**Golden rule: one phase = one PR. Never bundle phases.**

---

## Effort / Impact model

- **Effort:** S < 1h · M = 1h–½ day · L = ½–1.5 days
- Every phase ends with a **Gate** (measurable exit criteria) — if the gate fails, don't proceed.

---

## ▶️ PHASE 0 — Safety Net (½ day)

_Enables fearless changes in every later phase._

| #   | Task                                                                                                                                                                                                                                         | Files / Action                                                            | Effort |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| 0.1 | Add `.env.example` (8 vars: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SALT`, `RESEND_API_KEY`, `GEMINI_API_KEY`, Cloudflare `CLOUDFLARE_*` + contact email) | new file                                                                  | S      |
| 0.2 | Minimal CI: on PR → `tsc --noEmit` + `eslint` + `next build`                                                                                                                                                                                 | new `.github/workflows/ci.yml`                                            | M      |
| 0.3 | Prettier: `npm i -D prettier prettier-plugin-tailwindcss`, minimal config, **one** `--write` commit (pure formatting, no logic)                                                                                                              | repo-wide                                                                 | M      |
| 0.4 | Build-time env guard                                                                                                                                                                                                                         | `src/app/layout.tsx` (throw if prod build missing `NEXT_PUBLIC_SITE_URL`) | S      |

**Gate:** CI green on a dummy PR; `npx prettier --check .` passes; repo cloneable + bootable from README + `.env.example` alone.

---

## ▶️ PHASE 1 — Quick Wins (< 1 day, zero risk)

_All 10 quick wins from the audit. Pure deletions/single-line fixes._

| #    | Task                                                                                                                                       | Files / Change                                                                                              | Audit ref |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | --------- |
| 1.1  | Remove dead dep                                                                                                                            | `npm uninstall react-draggable`                                                                             | §8        |
| 1.2  | Volt CTA contrast + missing hover state                                                                                                    | `src/app/projects/sukisuite/page.tsx:139-144` → `text-[var(--color-bg)] hover:bg-[var(--color-volt-light)]` | §1A       |
| 1.3  | Demo URL → stable alias (Vercel dashboard) or remove 2nd button                                                                            | `src/app/projects/sukisuite/page.tsx:147`                                                                   | §3B       |
| 1.4  | HTML-escape `name`/`message` before email interpolation (add 6-line `escapeHtml`)                                                          | `src/actions/contact.ts:113-120`                                                                            | §7C       |
| 1.5  | Static 500 message (stop leaking `error.message`)                                                                                          | `src/app/api/chat/route.ts` return                                                                          | §7D       |
| 1.6  | Fix ESLint error: replace `setMounted(true)`-in-effect with rAF-async or CSS `@starting-style` pattern (same pattern as `useCapabilities`) | `src/components/Projects.tsx:27-30`                                                                         | §8        |
| 1.7  | Muted-text contrast floor: `text-white/40`→`text-white/60` on small copy; `text-white/20` → `/50` on playground placeholder                | `Hero.tsx`, `HowIBuild.tsx`, `playground/page.tsx`                                                          | §6A       |
| 1.8  | JSON-LD `Person`+`WebSite`                                                                                                                 | small component in `src/app/layout.tsx`                                                                     | §5A       |
| 1.9  | `alternates: { canonical: '.' }` per route                                                                                                 | page `metadata` exports                                                                                     | §5C       |
| 1.10 | `<noscript>` reveal fallback style block                                                                                                   | `src/app/layout.tsx`                                                                                        | §1B       |

**Gate:** `eslint` = 0 errors · axe re-run: 0 `color-contrast` on `/playground` & `/sukisuite` · `npm audit` unchanged or better · build green.

---

## ▶️ PHASE 2 — Security & Dependencies (½–1 day)

_P0 security. Slightly higher risk (API changes) — test AI flows manually._

| #   | Task                                                                                                                                                                                                                                                        | Files / Action                                                                                           | Risk mitigations                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | **Security headers** incl. report-only CSP                                                                                                                                                                                                                  | `next.config.ts` → `headers()` (block from AUDIT_REPORT §7; start `Content-Security-Policy-Report-Only`) | report-only can't break anything; browser console tells you what to whitelist (GSAP inline styles need `'unsafe-inline'` for style-src initially) |
| 2.2 | **AI SDK upgrade 2 majors**: `npm i ai@latest @ai-sdk/google@latest` → run `npx @ai-sdk/codemod@latest migrate` → fix remaining: `maxTokens`→`maxOutputTokens`, response helpers, client `AskMyAI.tsx` (if `useChat`: `m.content`→`m.parts`, `UIMessage[]`) | `src/app/api/chat/route.ts`, `src/app/api/enhance-prompt/route.ts`, `src/components/AskMyAI.tsx`         | codemod does 80%; smoke-test chat + enhance + image endpoints locally before merge                                                                |
| 2.3 | **Rate-limit `/api/chat` via existing Supabase RPC** (e.g. 20/day/IP, 200/day global) — reuse `checkRateLimit` from `src/lib/rate-limit.ts`                                                                                                                 | `src/app/api/chat/route.ts`                                                                              | copy the exact pattern from `generate-image/route.ts`                                                                                             |
| 2.4 | Verify Resend domain + change `from:` to verified sender                                                                                                                                                                                                    | Resend dashboard + `src/actions/contact.ts`                                                              | send test, check inbox not spam                                                                                                                   |
| 2.5 | `npm ls jsondiffpatch nanoid` → confirm gone; full `npm audit` → **target 0 high/moderate**                                                                                                                                                                 | —                                                                                                        | if stragglers: `npm overrides`                                                                                                                    |

**Gate:** securityheaders.com ≥ **A−** (local check: `curl -sI` shows all 6 headers) · `npm audit --audit-level=moderate` exits 0 · AskMyAI chat + playground generate still work end-to-end locally.

---

## ▶️ PHASE 3 — Performance Sprint (1–1.5 days)

_The big one: desktop 41 → target 85+. Sequence matters — do A→B→C._

**3A. Stop the bleeding — pointer handlers (½ day)**

- `src/components/CustomCursor.tsx` + `Magnetic.tsx`: replace per-event `gsap.to()` with **`gsap.quickTo()`** (created once per element, reused), switch to `{ passive: true }` `pointermove` listeners. _(Code sketch in AUDIT_REPORT §4.)_
- Verify no layout reads in handlers (no `getBoundingClientRect` mid-move — Magnetic: cache rect on `mouseenter`, not every move).

**3B. Gate the effects layer (½ day)**

- `next/dynamic({ ssr: false })` for `CustomCursor`, `Preloader`, `AnimatedBackground` in `src/app/layout.tsx`; render them only when `matchMedia('(pointer:fine)') && !prefers-reduced-motion` (use existing `useCapabilities`).
- Lazy-load react-markdown: dynamic-import `AskMyAI` panel content (it's closed on mount).

**3C. Fix the LCP (½ day)**

- Preloader: hard cap ~900ms total, skip entirely on repeat visits (`sessionStorage`), keep `< noscript >` hero visible under it.
- Optionally: native **View Transitions** replace `RouteTransition` overlay (removes transition JS entirely) — _can be its own follow-up PR._

**Gate:** Lighthouse local (prod build): **desktop `/` ≥ 85, mobile ≥ 92** · LCP ≤ 2.5s · TBT ≤ 300ms · CLS stays ≤ 0.01. Re-run saved reports to `docs/` for before/after.

---

## ▶️ PHASE 4 — Accessibility & Mobile Polish (½ day)

| #   | Task                                                                                                                                                    | Where                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 4.1 | Touch targets ≥44px via padding (`min-h-[44px] inline-flex items-center` or `py-2`): email link, Live badges, Read Case Study, Back to Portfolio, Reset | `Projects.tsx`, `Footer.tsx`, project pages, `playground/page.tsx` |
| 4.2 | Move skip link inside `<header>` landmark (fixes axe `region` ×4 pages)                                                                                 | `src/app/layout.tsx`                                               |
| 4.3 | Manual pass: volt-on-image captions (21 "incomplete" axe nodes) — add scrim or darken behind text                                                       | hero floating area                                                 |
| 4.4 | Playground loading: staged status text (enhancing → generating → rendering) + elapsed timer                                                             | `ImageGenerator.tsx`                                               |
| 4.5 | Verify 200% zoom: no clipped text (custom scrollbar + fixed overlays are the usual suspects)                                                            | manual                                                             |

**Gate:** axe rerun = **100 on all 5 routes** · all interactive elements ≥44×44 or exempt · 200% zoom usable.

---

## ▶️ PHASE 5 — Conversion & Content (½–1 day, highest business impact)

| #   | Task                                                                                                                                                               | Where / Note                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 5.1 | **Case-study enrichment**: each project gets date shipped, "built in N weeks", 1 real quote (salon owner / tournament organizer / branch manager), 1 honest metric | `src/app/projects/*/page.tsx` + `portfolioData.ts` — no fabrication, per `PRODUCT.md` |
| 5.2 | Barangay Arena: publish a Loom/GIF walkthrough or sanitized repo link (kills "Preview on request" doubt)                                                           | `Projects.tsx` card + project page                                                    |
| 5.3 | Per-project OG images (reuse `/projects/*.png`)                                                                                                                    | project page `metadata.openGraph.images`                                              |
| 5.4 | GitHub links: publish at least one project repo (README with screenshots)                                                                                          | `portfolioData.ts` `githubUrl`                                                        |
| 5.5 | (Optional, from STEP 2) `sonner` toasts for contact/playground feedback; `nuqs` for shareable playground URLs                                                      | new deps, both tiny                                                                   |
| 5.6 | Themed 404 matching console aesthetic                                                                                                                              | `src/app/not-found.tsx`                                                               |

**Gate:** every project page shows date + quote + metric · OG preview correct in a social debugger · contact form notification lands in inbox.

---

## ▶️ PHASE 6 — Hardening & Scale (½–1 day)

| #   | Task                                                                                                                                                         | Note                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| 6.1 | Sentry (`@sentry/nextjs` wizard, free tier) or Log Drains                                                                                                    | sourcemaps hidden                     |
| 6.2 | Tests: 3 Vitest units (`rate-limit` logic, contact validation, `escapeHtml`) + Playwright smoke (nav renders, projects load, contact submits, AskMyAI opens) | add to CI                             |
| 6.3 | Lighthouse CI budget in workflow: perf ≥85 desktop, a11y 100, first-load JS ≤200KB gzip                                                                      | fails PRs that regress                |
| 6.4 | Prometheus-style check: flip CSP from `Report-Only` → enforced after 2 clean weeks                                                                           | monitor report endpoint/console first |
| 6.5 | Refactors (cosmetic, optional): extract `ProjectPageLayout` (kills biggest code clone), `useFocusTrap` hook shared by Header/AskMyAI                         | only if touching those files anyway   |

**Gate:** CI blocks a deliberately-broken PR · Sentry receives a test event · audit re-run shows all metrics at target.

---

## 📅 Suggested calendar (solo, part-time)

| Week | Phase | Cumulative outcome                                        |
| ---- | ----- | --------------------------------------------------------- |
| 1    | 0 + 1 | CI live, 10 quick wins shipped, axe contrast nearly clean |
| 2    | 2     | Security A−, 0 vulns, rate limits consistent              |
| 3–4  | 3     | **Desktop 85+/mobile 92+, LCP ≤2.5s site-wide**           |
| 5    | 4     | axe 100 everywhere, WCAG 2.2 AA conformant                |
| 6    | 5     | Trust signals live — site converts, not just impresses    |
| 7–8  | 6     | Self-defending pipeline; done                             |

## 🔁 Regression watchdog (every phase)

Run before each merge: `tsc --noEmit` · `eslint` · `next build` · axe on 5 routes · Lighthouse `/` mobile+desktop · `npm audit --audit-level=moderate`.

## Risk notes

1. **Phase 2.2** is the only task that can break user-visible features (AI chat streaming). Do it isolated; keep a revert-ready commit; the codemod + smoke tests keep it safe.
2. Fonts workaround from the audit was **sandbox-only** — Vercel builds fetch Google Fonts normally; nothing to do.
3. Everything else is additive or subtractive (deletions/single-line switches) — inherently easy to review and roll back.
