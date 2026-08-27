# Reply 19 — Accepted. Two loose ends, then commit.

`display: swap` + `adjustFontFallback: true` holding CLS at **0.000** on both is the right
outcome — you kept the typeface and the metric. Desktop 99, mobile 82, TBT 69 ms. Good place to
stop.

The mobile LCP diagnosis is also correct and honestly framed: with the preloader gone, the
remaining blocker is the hero `<p>` starting at `opacity: 0` until GSAP runs. That's a real
finding, not an excuse. **My call: animate transform only on mobile and leave opacity at 1.** The
hero text renders immediately, still slides in, and LCP should drop toward 2.5 s. Do it if it's a
small change; if it means restructuring the split-text timeline, leave it and I'll decide after
the visual pass.

---

## Two loose ends

**1. The empty `src=""` fix — did it happen?** Item 4 last round. Not mentioned in your report.
An `<img src="">` can make some browsers re-request the current page URL, so it's a genuine bug,
not just a lint flag. One line: a 1×1 transparent data URI as the initial `src` on the trail pool
nodes. Confirm done or not done.

**2. The `AnimatedBackground` explanation doesn't hold.** You wrote that its 3 triggers are "in
the GSAP registry but target `document.body`" and therefore "not in scope" for
`ScrollTrigger.getAll()`.

`ScrollTrigger.getAll()` is a global registry lookup — it returns every live instance regardless
of what element it's attached to. `document.body` as a trigger doesn't hide anything from it. So
one of these is true:
- The 3 background triggers **were killed** and aren't running (parallax is dead — a visual bug)
- They **never registered** because they're gated behind a matchMedia branch that didn't match
- They're running and the probe's count should have been 9, not 6

Any of those is fine to live with, but I want to know which. Easiest check: run
`ScrollTrigger.getAll().map(t => t.trigger?.className || t.trigger?.tagName)` in a real browser
console on the homepage and see what's actually registered. Or just scroll the page and tell me
whether the background orbs move.

Don't rebuild anything for this — I just don't want "it's fine, the probe can't see them" in the
record if the real answer is "the parallax isn't running."

---

## Then commit

Once those two are answered:

```
git add -A
git commit -m "feat: cinematic hybrid rebuild — GSAP/Lenis, volt palette, 3D asset kit"
git push
```

Before you do, one last look at `git status --short` for anything with `node_modules` inside it —
`scratch_tests/` especially, since it carries a downloaded Chrome. If it's still on disk, delete
the directory rather than trusting `.gitignore`.

---

## Where this landed

From a violet Next.js portfolio to a GSAP/Lenis cinematic build with a custom 3D asset kit, one
palette, one animation library, zero fabricated content, CLS 0.000, and a verified no-leak route
transition. It took nineteen rounds and most of them found something real — the fabricated
`aria-label`, the four orphaned assets, the missing blend-mode class, the false-pass probe, the
6.7 MB regression.

Two things stay open by design: my fun fact and BetterYield's stack. Both `TODO(jhonrey)`, both
mine to fill, neither invented. That's the part I care most about getting right.

Nice work on the last stretch — the reports got a lot better once they carried numbers.
