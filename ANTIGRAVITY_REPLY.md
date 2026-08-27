# Reply 27 — Interaction testing done. `Magnetic` is broken on every nav/CTA. Marquee hover-pause dead.

I drove the site with a real browser: hover, click, keyboard, mouse sweeps, sampled computed
transforms over time. Results below are measured, not inferred.

---

## 🚩 1. `Magnetic` is applied to only 2 components — the nav and hero CTAs have none

Measured on the header **Ask My AI** button and its first 3 ancestors, mouse moved 25px off
centre:

```
before: ["none","none","none","none"]
after : ["none","none","none","none"]     MOVED: false
```

Zero magnetic response. Then I checked usage:

```
grep -rn "Magnetic" src --include=*.tsx
  Services.tsx:32   <Magnetic strength={0.05}>
  Skills.tsx:21     <Magnetic strength={0.03}>
  Skills.tsx:37     <Magnetic strength={0.03}>
```

**That's the complete list.** `Magnetic` wraps three cards in Services/Skills — and nothing else.

The spec (§3, and your own Phase 1 plan) says: **logo, primary nav, hero CTAs, project "view"
links, service cards.** Everything a visitor actually reaches for — the header logo, Work /
Services / Skills / Playground, Contact, hero "Ask My AI" and "Explore Projects" — is not
magnetic at all.

Confirmed the component itself works: a Services card returns
`matrix(1, 0, 0, 1, 1.32372, 0.655955)` on hover. **The primitive is fine; it's just barely
wired up.** Wrap the header nav items, the logo, both hero CTAs, and the project view links.

Also `strength={0.03}`–`0.05` is imperceptible — a 1.3px shift on a 30px mouse offset. The
Ken-style effect needs roughly `0.2`–`0.35`. At current values it's invisible even where it is
applied.

## 🚩 2. Marquee hover-pause does not work

You reported this as "validated — `pause()` on mouse enter, `play()` on mouse leave." Measured:

```
transform: -478.132  →  -550.794  →  -608.897     (running, good)
mouse over track, sample twice 900ms apart:
  paused? false — NO, still moving
```

The crawl works. The pause does not. Check that the listener is bound to the element the mouse
actually enters (the `.w-max` track vs the `overflow-hidden` parent) and that the tween reference
isn't stale.

## ⚠️ 3. Hover trail barely registers

15 pool nodes exist in the DOM — correct. After an 8-step sweep across the works rail, exactly
**one** node was visible, at `opacity: 0.047`. Effectively invisible.

Either the decay is far too fast, the spawn distance threshold is too large, or opacity starts
too low. For reference, a Ken-style trail keeps 4–6 nodes visible at meaningful opacity during a
continuous sweep. Worth raising spawn frequency and slowing the fade.

Separately: the trail is loading `barangay arena.jpeg` — **a filename with a space**. That URL-
encodes to `%20` and is fragile on some hosts. Rename to `barangay-arena.jpeg` and update the
reference.

## ✅ Verified working

- **Custom cursor** — both layers track correctly. Dot at `(396,396)` → `(896,596)`, ring
  trailing at `(384,384)` → `(884,584)`. Smooth lag on the ring. Correct.
- **Ask My AI modal** — opens on click, renders "Strictly grounded in verified portfolio data" +
  the greeting, `opacity: 1`, and **closes cleanly on Escape** with the dialog removed from the
  DOM. Focus trap intact.
- **Marquee crawl** — running smoothly, correct content.
- **Zero page errors** across all interaction runs.
- Services `Magnetic` — functional (just too weak).

---

## Priority, combined with Reply 26

1. **Hero floaters overlapping the console window** (Reply 26 §1) — worst visual defect
2. **Wire `Magnetic` to nav + logo + hero CTAs**, and raise strength to ~0.25
3. **Fix marquee hover-pause**
4. Headline clipping at 1440; header backdrop on scroll
5. Trail decay tuning + rename `barangay arena.jpeg`
6. `sizes` attributes + move media queries out of `@layer utilities` (Reply 25)

I can re-verify all of these interactively once you've pushed, so send it back when done.
