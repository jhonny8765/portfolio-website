# Phase 3 — Performance Sprint: Results & Measurement Notes

Full interactive reports live next to this file (`phase3-before/after-*.html`).
All numbers: `next build` + `next start`, Lighthouse 12, this repo's sandbox.

## Headline (simulated throttling, `/`)

| Metric       | Before | After   | Gate      |
| ------------ | ------ | ------- | --------- |
| Perf desktop | 54     | 60–68   | ≥ 85 ⚠️   |
| Perf mobile  | 89     | 90      | ≥ 92 ⚠️   |
| LCP desktop  | 4606ms | 4325ms  | ≤ 2500 ⚠️ |
| LCP mobile   | 3697ms | ~3650ms | ≤ 2500 ⚠️ |
| TBT desktop  | 415ms  | ~280ms  | ≤ 300 ✅  |
| TBT mobile   | 76ms   | ~84ms   | ≤ 300 ✅  |
| CLS both     | 0.000  | 0.000   | ≤ 0.01 ✅ |

## Why the sim scores understate the result (important)

The sandbox CPU is shared and heavily contended. Evidence:

- **Same build, no code changes, back-to-back desktop sim runs: 54 → 64 → 68 → 62 → 60.** ±7pts of pure environment noise.
- **Observed (unthrottled trace) metrics are excellent**: desktop LCP ≈ 240ms
  (TTFB 10ms + elementRenderDelay 228ms), mobile ≈ 210ms, FCP ≈ 100ms.
  Lantern's simulation inflates the observed main-thread boot (~3.2s on this
  contended box; ~1–1.5s on normal hardware) 4× into the LCP/TTI estimates.
- Mobile with **applied devtools throttling** (no simulation): **perf 96** ✅.

Observed improvements that ARE code-attributable:

| Cause                                                      | Before | After  |
| ---------------------------------------------------------- | ------ | ------ |
| LCP render delay (hero text was JS-gated behind GSAP boot) | 818ms  | 228ms  |
| LCP image resource-load delay (floater not prioritised)    | 105ms  | 0ms    |
| Hero entrance chain                                        | ~3.0s  | ~1.4s  |
| Desktop TBT (sim)                                          | 415ms  | ~280ms |

**Recommendation:** re-run Lighthouse on real hardware (your laptop/charging,
no other apps): `npm run build && npm start`, then DevTools → Lighthouse →
Desktop/Mobile. Expect materially higher than the sandbox numbers above; the
85/92 gate decision should be taken from that run, not from CI/sandbox CPU.

## What changed (all kept, gates or not)

- **3A pointer handlers**: CustomCursor + Magnetic now use `gsap.quickTo()`
  (allocated once, not 2 tweens per pointermove), passive listeners; Magnetic
  caches the element's un-transformed center per hover (no
  `getBoundingClientRect()` per move), invalidated on scroll/resize.
- **3B effects layer**: new `EffectsLayer` — `next/dynamic({ ssr:false })` for
  CustomCursor / Preloader / AnimatedBackground behind
  `matchMedia('(pointer:fine)') && !prefers-reduced-motion`; GSAP-heavy chunks
  leave the initial parse path. `AnimatedBackground` stays route-scoped to `/`.
  `react-markdown` (+unified/remark chain) dynamic-imported inside AskMyAI
  (panel is closed at mount).
- **3C LCP fixes**:
  - Preloader capped ~3s → ~0.95s (still: once per session, desktop-only,
    reduced-motion/mobile skip, mount-gated).
  - **Hero text/console/floater entrances rewritten from GSAP to pure CSS
    keyframes** (`hero-rise`, `hero-word-rise`, `hero-fade` in globals.css,
    per-element `--hero-delay` inline vars). SSR text now paints at first
    paint; the LCP element no longer waits for JS boot + GSAP.
  - First floater image (`workflow-nodes.webp`, the measured LCP) gets
    `next/image priority` → resourceLoadDelay eliminated.

## Known remaining opportunities (deferred)

- Below-fold section lazy-hydration (defer section `useGSAP` + ScrollTrigger
  setup until near viewport) — real win, but interacts with ScrollTrigger
  measurement; needs careful QA. Candidate for a follow-up perf PR.
- Native View Transitions replacing the RouteTransition overlay (plan 3C
  optional follow-up).
