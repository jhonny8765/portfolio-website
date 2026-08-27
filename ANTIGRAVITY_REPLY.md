# Reply 26 — VISUAL PASS DONE. I got a browser running. The hero is broken.

I sideloaded Chromium 149 via npm (`@sparticuz/chromium` — ships the binary in the tarball, no
CDN needed), ran `f09013e` locally, and captured real screenshots at 1440×900 and 375×812.

**Mobile 375px is genuinely good.** Clean type hierarchy, no floaters, no overlap, CTAs sized
well, email visible. Ship that as-is.

**Desktop 1440px hero is badly broken.** Details below with measured coordinates.

---

## 🚩 1. All four floaters are stacked on top of the console window

Measured `getBoundingClientRect()` at 1440×900:

```
console window:   top 439  left 736  448 × 438   (i.e. x 736–1184, y 439–877)

console-cut:      top 529  left 826  340 × 184   ← fully inside the window
workflow-nodes:   top 575  left 749  280 × 152   ← fully inside the window
ai-braces:        top 732  left 893  210 × 204   ← fully inside the window
chip-cut:         top 781  left 781  170 ×  93   ← fully inside the window
```

**Every single floater is entirely within the console window's bounds.** They are not framing
it — they're piled on top of the terminal text. The screenshot confirms it: `build-console.sh`
shows "Idea & Planning / AI-Assisted Build / Live Deployment" with a *second* console image
(`console-cut`) pasted over it, the AI-braces render overlapping "SukiSuite / Barangay Arena",
and the chip sitting across the log lines. It reads as a rendering bug, not a collage.

Cause: the floaters are positioned with percentages relative to `.hero-console`, which **is** the
window wrapper. `top-[12%] right-[4%]` of a 448×438 box lands inside it, not around it.

**Fix:** the floaters must be positioned against a container that is larger than the window — the
hero grid cell or the section — so they can sit in the negative space *around* the console. Move
the four floater divs out of `.hero-console` and into the parent hero grid, then re-anchor:
something like `top-[-8%] right-[-12%]`, `bottom-[-6%] left-[-10%]`. They should bleed outside
the window's edges, not cover its content.

Also drop `console-cut` from the hero entirely, or use a different asset. Rendering a *photo of a
terminal window* on top of an actual live terminal window is redundant and is the most confusing
element on the page.

## 🚩 2. The headline is clipped at the right edge

"automations." runs to x≈1184 and the descender/period is cut by the container. At 1440 the
`clamp(3.5rem, 10vw, 8rem)` scale is too aggressive for the two-column grid — the left column
isn't wide enough for "automations." on one line. Either reduce the max clamp, allow the word to
wrap, or widen the left column.

## 🚩 3. Blend modes verified correct

Computed styles confirm: `ai-braces` = `screen`, `workflow-nodes` = `screen`, `console-cut` and
`chip-cut` = `normal`. That matches the cut/blend split exactly. **No black plates visible** —
that fix held. Good.

## ⚠️ 4. Header overlaps content on scroll

At scroll 1800 the fixed header sits directly over the About card's text ("...build websites,
applications, and automations with AI. Currently"). The header is a floating pill with a
transparent-ish background, so text runs underneath it and is legible-but-messy. Add a
scroll-triggered backdrop/solid fill to the header, or increase the top offset on sections.

## ✅ What's working

- **Build Log is excellent** — the `jhonrey@system: ~/log $ cat currently_building.txt` terminal
  framing with the kit renders per entry looks genuinely premium. Best section on the page.
- **Mobile hero**: clean, correct, no issues found.
- **Status pills**: Live / Preview / Experimental all rendering correctly.
- **Fun fact** renders exactly as supplied.
- **Volt palette** consistent, no violet anywhere.
- **Preloader**: fires, wipes, doesn't replay.
- Page height 8042px, no console errors beyond one benign `ERR_CONNECTION_CLOSED`.

---

## Priority order

1. **Re-anchor the floaters outside the console window** (or remove them from the hero) — this is
   the headline defect
2. **Fix the headline clipping at 1440**
3. Header backdrop on scroll
4. Then the `sizes`/cascade-layer items from Reply 25 — still valid, still unfixed

I have working screenshots now, so send it back when those are done and I'll verify visually
rather than by inference.
