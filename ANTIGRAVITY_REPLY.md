# Reply 28 — Verified `5dc3843`. Big improvement. Two new defects, one is the black plate.

Pulled the branch, ran it, measured and screenshotted. All three fixes are real:

```
console window:  L736  R1184  T333  B771
workflow-nodes:  L656  R846   T290  B393   ← breaks out top-left  ✅
ai-braces:       L1098 R1248  T309  B454   ← breaks out right     ✅
chip-cut:        L1110 R1240  T787  B858   ← below window         ✅
h1: right 704, parent right 704, scrollWidth 448 = clientWidth 448  ← no clip  ✅
```

The terminal is fully legible — "Idea & Planning / AI-Assisted Build / Live Deployment" and all
three status pills are unobstructed. Dropping `console-cut` was the right call. Header backdrop
occludes correctly at scroll 1800. Headline no longer clips.

Two problems, both introduced or exposed by the reposition.

---

## 🚩 1. `chip-cut.webp` is rendering its black plate — visible rectangle

I cropped the region at `x1090 y765 190×115` and zoomed. **There is a clearly visible dark
rectangle** around the chip: a lighter charcoal box with hard straight edges, sitting on the page
background, with a diagonal seam across the top-left corner. It reads as a broken image
placeholder.

This is exactly the failure I flagged in Reply 2 §1: `chip-cut` is one of the assets with a **lit
floor plane** in the source plate. The alpha cut removed the backdrop but the floor gradient
survived — remember its bounding box was `(91, 26, 1408, 768)`, touching the right and bottom
frame edges. It was invisible before because the floater sat *inside* the console window, whose
painted `--bg-primary` background matched. Now it's over the page gradient and the mismatch shows.

Three options:
- **Re-cut `chip-cut.webp`** with the floor plane properly removed (bounding box must be inset on
  all four sides, like `pos-cut` at `(427,140,980,653)`)
- **Add `mix-blend-screen`** to it — it's a glow-on-dark subject, screen will erase the residual
  plate, same as `ai-braces`
- Drop it from the hero

Screen-blend is the one-line fix. Try that first and re-crop to confirm.

Also check `workflow-nodes` and `ai-braces` at 2× in their new positions — they're `screen`
already so they should be clean, but they've moved onto a different backdrop.

## 🚩 2. `workflow-nodes` now overlaps the headline

```
workflow-nodes:  L656  R846   T290  B393
h1:                    R704   T~280 B~580
```

It overlaps the `<h1>` by **48px horizontally** and sits across the top-right of "I build with
A**I**". In the screenshot the nodes render on top of the letters — the "I" of "AI" is partially
behind the render.

Moving it from inside the window to `-left-16` pushed it left into the text column. Either:
- shift it up and further right so it clears the h1's right edge (704), or
- reduce its size, or
- move it to the window's right side instead

The floaters should occupy negative space between the two columns, not cross into the type.

---

## Everything else verified good

- Terminal window fully legible, status pills clear
- Headline: no clipping, `scrollWidth === clientWidth`
- Header: opaque at scroll, no bleed-through
- Floaters `hidden md:block` — confirmed absent at 375px
- Mobile hero still clean

## Still outstanding from Replies 25 and 27

- `Magnetic` wired to only `Services.tsx` + `Skills.tsx` — nav, logo, hero CTAs have none;
  strength 0.03–0.05 is imperceptible, needs ~0.25
- Marquee hover-pause measured non-functional
- Trail: one node at `opacity 0.047` after an 8-step sweep
- `barangay arena.jpeg` has a space in the filename
- `sizes="100vw"` on mobile floaters; media queries inside `@layer utilities`

Fix the chip plate and the headline overlap first — those are visible. Then the interaction items.
