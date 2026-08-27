# Reply 18 — Two fixes have side effects you didn't flag. Then we're done.

Desktop CLS `0.125 → 0.000` and TBT `210 → 73 ms` are real wins, and the trigger count is down to
6. Good. But two of the four fixes traded one problem for a worse one, and the mobile LCP
explanation doesn't hold up.

---

## 🚩 1. The mobile preloader skip is not working, and your explanation is wrong

You wrote:

> Lighthouse mobile emulates a 400px-wide viewport which isn't `< 768px` by `innerWidth`

400 **is** less than 768. Lighthouse's mobile preset emulates a Moto G Power at **412×823 CSS
px** — squarely under your threshold. If the skip had fired, it would have fired for that audit.
It didn't, which means the gate is broken. Mobile LCP only moved 4.2 → 4.0 s, consistent with the
preloader still running.

The likely cause is SSR. `window.innerWidth` doesn't exist on the server, so depending on how you
wrote it you get one of:
- the component returning `null` on the server and mounting the preloader **after** hydration —
  which makes LCP worse, not better
- a hydration mismatch
- the check running before layout and reading 0 or a stale value

Fix it with CSS or `matchMedia`, not `innerWidth`:
```
const isMobile = window.matchMedia('(max-width: 767px)').matches
```
evaluated in `useLayoutEffect`, or simplest and most robust — hide the preloader with a CSS media
query so it never paints on small screens regardless of JS timing.

Then re-run mobile Lighthouse and confirm LCP actually drops. If it lands near 2.5 s, mobile
Performance should clear 90.

## 🚩 2. `display: optional` means most first-time visitors never see your display font

You flagged this as a trade-off "you've already accepted" — I didn't accept it, and I want to be
explicit about what it costs.

With `optional`, the font is used **only if it's already cached**. Every first-time visitor —
which is nearly every prospective client arriving from a link — gets the system fallback for the
hero headline. The spec's typography rule was "a display serif or sharp grotesque for the hero,
**not Inter for headlines**." `display: optional` means most visitors see exactly the generic
system font we were avoiding, on the largest text on the page.

You fixed CLS by removing the font. Better options, in order:

1. **`preload` the font file** in `layout.tsx` (`next/font` does this when the font is used in the
   initially-rendered tree) and keep `display: swap`. If it loads before first paint there's no
   swap and no shift.
2. **`size-adjust` / fallback metric matching** — `next/font` supports `adjustFontFallback`, which
   matches the fallback's metrics to the real font so the swap causes little or no reflow. This is
   the purpose-built solution for exactly this problem.
3. **Reserve the headline's height** with an explicit `min-height` or aspect box so a swap can't
   shift anything below it.

Try 1 + 2 together. If CLS stays under 0.1 with `swap`, keep the font. Only fall back to
`optional` if that genuinely fails — and tell me, because then it's a design decision about
whether to change the typeface rather than hide it.

---

## Minor

**Your Fix 3 arithmetic was confused in-flight** ("Wait — let me recount"), but the final answer
of 6 checks out: 4 AnimatedSection + 3 AnimatedBackground − 1... actually that's 8. You reported
`AnimatedSection × 4 = 4`, `AnimatedBackground = 3`, `HowIBuild = 1`, which sums to **8**, not 6.
The measured count is 6. Which two components did I lose track of, or is `AnimatedBackground`
registering 1 rather than 3 now? Just confirm the breakdown matches the measurement — I don't
need it changed, only reconciled.

**The two 96s** — the empty `src=""` on the trail pool is worth a second look. An `<img>` with an
empty `src` is a real spec violation (some browsers re-request the current page URL). Set
`src` to a 1×1 transparent data URI, or don't render pool nodes until first hover. Small, cheap,
removes a legitimate flag. The cursor `<div>` is fine as-is.

---

## Then stop

1. Fix the mobile preloader gate with `matchMedia`/CSS, re-run mobile Lighthouse, report LCP
2. Retry the font with `swap` + preload + `adjustFontFallback`; keep `optional` only if CLS fails
3. Reconcile the trigger breakdown
4. Empty `src=""` → data URI
5. `npm run lint && npm run build`, `git status --short`

That's the last round. After that I'm opening the site and doing the visual pass on the five
unverified components — playground, the How I Build pin, the cursor trail, the preloader, and the
three case-study pages.
