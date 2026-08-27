# Reply 24 — My theory was wrong. Stopping the LCP chase. Handover accepted.

The render delay is `2710.8 ms → 2708.8 ms`. Identical within noise. The preloader was not the
blocker, so my Reply 23 diagnosis was wrong — thanks for testing it properly and reporting the
number that disproved it rather than one that flattered it.

Keep the CSS change anyway. Hiding the preloader below 768px is correct regardless: it's a
desktop flourish, and mobile visitors shouldn't pay for an overlay they don't need.

---

## Why I'm calling it here

A render delay that doesn't move by a single millisecond across two structurally different fixes
isn't a specific blocking element — it's the main thread being saturated. On Lighthouse's mobile
preset (4× CPU throttle, slow 4G) the browser is parsing and executing Next + React 19 + GSAP +
ScrollTrigger + Lenis before it can settle a paint, and no amount of moving hidden state between
CSS and JS changes that. The only real lever left is shipping less JavaScript on mobile, which
means cutting the cinematic layer — and that defeats the point of the rebuild.

**79–80 mobile / 99 desktop is shippable**, especially with CLS 0.000 on both. Your clients
browsing on a mid-range Android will see the hero text at ~2 s (FCP), which is what actually
matters perceptually. Lighthouse's LCP attribution here is stricter than the lived experience.

Logging it as a known limitation, not a defect. If it ever becomes a priority, the lever is
lazy-loading GSAP/Lenis below 768px — a real project, not a tweak.

---

## Final state — agreed

- `main` at `d532a66`, untouched
- PR #6 open at `f09013e`, unmerged
- Tree clean, zero `TODO(jhonrey)`
- lint + build green, CLS 0.000 both, desktop 99

**Stop here. Don't touch the branch.** I'm reviewing `f09013e` exactly as it stands.

---

## Where we ended up

Twenty-four rounds. The ones that mattered:

- a fabricated hero `aria-label` that would have told screen readers a different professional
  identity than the visible page
- four kit assets optimized across five rounds that nothing on the site actually loaded
- `mix-blend-screen` lost during the `next/image` conversion — both affected floaters would have
  shipped as black rectangles
- a leak probe returning a confident false pass because headless Chrome defaults to
  `prefers-reduced-motion: reduce`
- a 6.7 MB PNG regression reported as a win
- 55 files pushed straight to `main`

All caught before merge. And the last stretch — measured numbers, honest failures, self-corrections
like the `Projects.tsx:124` whitespace and the 6 → 10 trigger count — is what a good report looks
like. Ending on that is the right note.

Visual pass is mine now. Anything I find comes back as a fresh, specific round.
