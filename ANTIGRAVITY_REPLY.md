# Reply 17 — Report accepted. Four fixes, then done.

This is the first report I trust end to end: scores that differ between mobile and desktop, a
non-zero CLS, an honest "tree is not clean," and a correction of your own earlier claim. That's
what measurement looks like. Thank you.

Note for the record: last round you listed `Projects.tsx:124` as
`{/* TODO(jhonrey): Add section description */}`. It's whitespace. That confirms the earlier
close-out was written from expectation rather than from the file — which is exactly why I kept
asking for raw output. No action needed now; just don't go back to summaries.

---

## Fix these four, in order

**1. Desktop CLS 0.125 — the only failing Core Web Vital**

You diagnosed it: hero layout shift during the preloader fade. Mobile is 0.000, desktop is 0.125,
which means it's the wide-viewport hero layout moving as the preloader releases. Likely causes,
in order of probability:
- Split-text spans reflowing when the headline font swaps in → set `font-display: optional` or
  preload the display font in `layout.tsx`
- Floaters getting `<Image>` intrinsic dimensions after the wipe → explicit `width`/`height` or
  an aspect-ratio box on each floater wrapper
- The preloader unmounting and the hero laying out fresh → reserve the hero's height before the
  wipe so nothing reflows

Target under 0.1. This is the highest-value fix on the list.

**2. Mobile LCP 4.2 s**

Mobile Performance 76 is entirely this. The LCP element is almost certainly the hero headline
blocked behind the preloader — the browser can't paint the hero until the wipe completes, so
your ~1.2–2.0 s preloader is directly added to LCP.

Options, cheapest first:
- Shorten the preloader on mobile specifically (0.8 s, or skip it under 768px — it's a desktop
  cinema flourish and mobile users pay for it in seconds)
- Render the hero text underneath the preloader rather than after it, so LCP fires during the wipe
- Confirm the display font is preloaded, not fetched after CSS parse

Tell me which LCP element Lighthouse actually named — that removes the guesswork.

**3. `AnimatedSection` registering 2 ScrollTriggers each**

Your own breakdown: 4 components × 2 triggers = 8 of the 10, because both the `no-preference`
and `reduce` matchMedia branches register. That's not how `gsap.matchMedia()` should behave —
only the matching branch should activate. Either the `reduce` branch is creating a ScrollTrigger
it doesn't need, or both branches run and one is dead weight.

Worth fixing: it halves the trigger count and removes 4 dead scroll listeners. Check whether the
`reduce` branch needs a ScrollTrigger at all — if reduced motion means "just show it," use a
plain `gsap.set()` with no trigger.

**4. Clean the tree**

`scratch_probe.js`, `parse-lh.js`, `localhost_*.report.html` — delete them. Also confirm
`scratch_tests/` is gone (it carries `node_modules` and a downloaded Chrome), along with any
`.py` files, `workspace-extracted/`, and the `.zip`. Then paste `git status --short`.

Don't commit until that's clean. Everything else in the tree — new components, `site-assets/` —
is expected and should go in.

---

## Not fixing

- **Accessibility 96 / Best Practices 96** — fine. Tell me what the two flags are so I know
  whether they're the custom cursor and the `<img>` trail pool (both intentional), but don't
  chase 100.
- **TBT 210 ms mobile** — acceptable for a GSAP site. Leave it.
- **`/playground` has no GSAP** — noted, and consistent. It got the chrome restyle without scroll
  animation, which is the right call for a tool page.

---

## Then you're done

After those four: `npm run lint && npm run build`, re-run Lighthouse to confirm CLS and mobile
LCP moved, paste `git status --short`, and stop.

I'll take the five never-verified components from here — playground, the How I Build pin, the
cursor trail, the preloader, and the three case-study pages. That's a visual pass, not a code
pass, and it needs my eyes rather than another probe.

Good work on the last stretch.
