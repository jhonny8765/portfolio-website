# Reply 23 — Found it. The preloader is still covering the hero on mobile.

Thank you for the full LCP node — that's the piece that cracks it. But your reading of it is
wrong, and the numbers say exactly where to look.

---

## What the data actually says

```
timeToFirstByte:     14.7 ms
elementRenderDelay:  2710.8 ms
```

Two things follow from this:

**1. It's not the font.** You attribute the delay to "web-font download + font swaps." But you
configured `display: swap` with `adjustFontFallback: true` — that means the text paints
*immediately* in a metric-matched fallback and never blocks. That's the whole point of the fix,
and it's confirmed by **CLS 0.000**: if a font swap were reflowing that paragraph, CLS would not
be zero. The font is exonerated by your own numbers.

**2. There's no load delay and no resource load time** — only render delay. For a text node
that means the element was in the DOM, unstyled-hidden or **obscured**, and simply not eligible
to count as a contentful paint for 2.7 seconds.

## The cause: the preloader still paints on mobile

Your mobile preloader skip is **JavaScript-gated** — `matchMedia` evaluated in an effect. On the
server there is no `window`, so the preloader renders into the SSR HTML and covers the viewport.
It's only removed *after* React hydrates and the effect runs.

LCP doesn't fire for an element hidden behind a full-screen overlay. So the sequence on a
throttled mobile CPU is:

```
2.05 s  FCP        — preloader paints
        ...        — bundle parse + hydration
4.08 s  LCP        — effect runs, preloader unmounts, hero <p> finally counts
```

`4.08 − 2.05 ≈ 2.0 s`, and `elementRenderDelay` of 2.7 s from TTFB. That fits precisely.

This is the same class of bug I flagged in Reply 18 — you moved the *hero text* to CSS gating,
which was right, but the **preloader itself is still JS-gated**. It's the overlay, not the text,
that's blocking.

## The fix

Hide the preloader with CSS, so it never paints below 768px regardless of JS timing:

```css
@media (max-width: 767px) {
  .preloader-root { display: none !important; }
}
```

Add the class to the preloader's outermost element. Keep the JS `matchMedia` guard too — belt and
braces, so the animation timeline also doesn't run — but **CSS must own the visibility**, because
CSS applies at first paint and JS does not.

While you're there, confirm the same isn't true of the grain/scanline overlay or the
`RouteTransition` wipe — any full-viewport element that renders in SSR and is only dismissed by
JS will do this. `RouteTransition` in particular: if its overlay starts opaque and is cleared on
mount, it has the identical problem.

Expected result: mobile LCP drops to roughly FCP (~2.1 s) and Performance should clear 90.

---

## Then stop

Make that one change, re-run mobile Lighthouse, paste LCP and Performance. Push to
`rebuild/cinematic-hybrid`. Nothing else.

If LCP doesn't move, paste the new LCP node and we'll stop chasing it — 80 mobile is shippable
and I'd rather spend the remaining effort on the visual pass.

`main` stays at `d532a66`, PR #6 stays unmerged.
