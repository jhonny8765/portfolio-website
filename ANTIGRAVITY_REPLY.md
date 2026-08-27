# Reply 31 — Final review of `0531fed`. One blocker: the How I Build pin is active on mobile.

Checked all four remaining areas. Almost everything passes. One real bug that must be fixed
before merge.

---

## 🚩 BLOCKER — `HowIBuild` pins on a 375px phone

Measured at 375×812 with touch emulation:

```
pin-spacer count on mobile: 1        ← should be 0
pin-spacer height: 1147px
scroll test:
  scrollY 3789  sectionTop 815
  scrollY 4189  sectionTop 0    ← pinned
  scrollY 4589  sectionTop 0    ← still pinned, 400px of scroll consumed
  scrollY 4989  sectionTop 0    ← still pinned, 800px consumed
```

The section locks to the top of the viewport and eats ~1100px of scroll on a phone. The spec is
explicit — desktop pin, **mobile stacked cards, no pin** — and this is precisely the
"scroll-hijack on a phone" failure the whole reduced-motion/touch pass was meant to prevent. On a
real device it feels like the page has frozen.

The gate is missing or wrong in `HowIBuild.tsx`. It should be inside a
`gsap.matchMedia()` branch keyed to `(min-width: 768px)`, e.g.:

```js
mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
  // pin + scrub here
});
```

Note the reduced-motion gate **is** working — 0 spacers with `prefers-reduced-motion: reduce`,
and the hero renders at `opacity: 1`. So the pattern is right, it just isn't width-gated.

---

## ✅ Everything else passes

**`/playground`** — 200, `h1` "AI Playground", cinematic header with the `ai-braces` render,
console-framed generator at `/usr/bin/generator --engine=cloudflare`, textarea with 0/500
counter, Reset / Enhance with AI / Generate all present and correctly styled. No overflow, no
broken images. This looks genuinely premium — probably the second-best page after the Build Log.

**All three case studies** — 200 each, correct `h1` (SukiSuite / Barangay Arena / BetterYield),
no broken images, no horizontal overflow.

**`HowIBuild` pin on desktop** — behaves correctly:
```
scrollY 2696  top 772   ← approaching
scrollY 3096  top 0     ← pins
scrollY 3796  top 0     ← holds through the scrub
scrollY 4696  top -247  ← releases cleanly
```
900px spacer, one screen of hold. Not a hostage pin. Good.

**Route transitions** — `/` → `/playground` → back works, URL correct both ways, and:
```
pin-spacers: 9 during transition → 1 after round-trip
overlay after nav: opacity 1, transform translateY(900px)  ← parked offscreen, not stuck
```
No accumulation, no stuck overlay.

**Mobile** — no horizontal overflow at 375px.

**Reduced motion** — 0 pins, hero fully visible, static layout.

**Errors** — none across every route and interaction, apart from one benign
`ERR_CONNECTION_CLOSED` (dev-server HMR socket).

---

## To merge

Fix the mobile pin gate. Then verify by measuring, not asserting:

```
375×812 → document.querySelectorAll('.pin-spacer').length  === 0
1440×900 → === 1
```

That's the only thing standing between PR #6 and merge. Everything else on the homepage,
playground, case studies, transitions, and reduced-motion path is verified working.
