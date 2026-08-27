# Reply 37 — 🔴 CRITICAL: clicking Work / Services / Skills turns the whole site solid yellow, permanently

Jhon Rey reported this. I reproduced it in a browser on `main` @ `2a01a94`. It is a hard site
breakage — the page becomes an unusable full-screen yellow rectangle with no way back except a
manual reload.

**This shipped to production and none of us caught it, because nobody ever clicked the nav.**

---

## Reproduction

Click "Work" in the header. Measured overlay state:

```
BEFORE click   : transform matrix(1,0,0,1,0,900)   bg rgb(232,245,74)  z 200
AFTER click    : transform matrix(1,0,0,1,0,0)     bg rgb(232,245,74)  z 200
3 seconds later: transform matrix(1,0,0,1,0,0)     bg rgb(232,245,74)  z 200   ← still covering
URL: http://localhost:3000/#projects
```

The overlay wipes up to cover the viewport and **never retracts**. Screenshot attached: a solid
`#E8F54A` screen with only the custom cursor visible. Same for Services and Skills.

## Root cause

`TransitionLink.tsx`:

```js
const handleTransition = (e) => {
  e.preventDefault();
  if (pathname === href) return;        // ← href is "/#projects", pathname is "/"
  ...
  tl.to(overlay, { y: "0%", ... onComplete: () => router.push(href) });
};
```

The guard compares `pathname` (`"/"`) against `href` (`"/#projects"`). Those never match for a
hash link, so the guard doesn't fire. The overlay animates to cover the screen and calls
`router.push("/#projects")`.

`RouteTransition.tsx` retracts the overlay in a `useEffect` keyed on `[pathname]`. But a hash-only
navigation **does not change `pathname`** — it stays `"/"`. The effect never re-runs. The overlay
stays at `y: 0%` forever.

So: three of your five nav links permanently white-out the site.

## The fix

`TransitionLink` should only intercept **real route changes**. Anything that is a hash link, or
resolves to the current pathname, must fall through to normal browser behaviour:

```js
const handleTransition = (e) => {
  const [targetPath, hash] = href.split('#');
  const normalizedTarget = targetPath || '/';

  // Same-page hash link → let the browser/Lenis handle the scroll, no overlay
  if (normalizedTarget === pathname || href.startsWith('#')) {
    return;                    // do NOT preventDefault
  }

  e.preventDefault();
  // ...existing overlay + router.push
};
```

Two extra safeguards worth adding, because this class of bug is severe:

1. **A failsafe in `RouteTransition`** — on mount and on every pathname change, force the overlay
   back to `y: 100%`. Also add a timeout so if navigation ever fails, the overlay retracts after
   ~1.5s rather than trapping the user.
2. **`pointer-events-none` is already set** — good, that's why the cursor still moved. But the
   content underneath is invisible, so it's still a total breakage.

## Also verify after fixing

- "Work" / "Services" / "Skills" scroll smoothly to their sections with **no overlay flash**
- "Playground" (a real route change) still plays the wipe and retracts
- Back button from `/playground` retracts correctly
- The mobile menu versions of these three links — same component, same bug
- `Contact` in the header uses a plain `<a href="#contact">`, so it should already be fine —
  confirm

---

## On the other screenshot Jhon Rey sent

The "Proof of Work" section with SukiSuite and Barangay Arena side by side is **rendering
correctly** — that's the horizontal works rail, and both cards look right. The apparent
"cut off" on the right is just the rail extending beyond the viewport, which is intended.

One genuine nit visible there: the header pill overlaps the "Proof of Work" heading — the
heading's top is clipped behind it. Increase `scroll-mt` on that section so anchored scrolling
clears the fixed header.

---

## Process note

This is the second time a defect reached production that a single click would have found. The
image-size regression and this one share a cause: **verification by reading code and HTML instead
of operating the UI.**

For this fix specifically: click every nav link in a real browser, on the real deployment, before
reporting it fixed. Not localhost, not a source diff. Click all five, plus the mobile menu, plus
the back button.

Fix on a branch, PR it, and I'll verify against production before it merges.
