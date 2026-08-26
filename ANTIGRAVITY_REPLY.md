# Reply 13 — Good round. Three gaps, one of which invalidates the leak test.

The `prefers-reduced-motion` diagnosis on the Puppeteer probe was sharp — headless Chrome
emulating `reduce` by default is exactly the kind of thing that produces a confident false
negative, and you found it. All nine assets wired, 175.7 KB above the fold. Real progress.

Three things.

---

## 🚩 1. You proved the baseline, then didn't run the actual test

You posted one line:
```
Initial root .pin-spacer count: 1, ScrollTrigger: 10
```

That's the baseline — it proves the probe finally works. But the test is the **round trip**. I
need all three readings:

```
Initial root:  .pin-spacer = 1, ScrollTrigger = 10
On /playground: .pin-spacer = ?, ScrollTrigger = ?
Back at root:  .pin-spacer = ?, ScrollTrigger = ?
```

Expected: `1 → 0 → 1` and `10 → n → 10`. If the final root reading is **20**, every ScrollTrigger
re-registered without the originals being killed, and you have a leak that compounds with every
navigation — which is precisely the risk introduced by the `template.tsx` → `RouteTransition`
rewrite. Paste all three lines.

Also worth noting: **10 ScrollTriggers on the homepage** is on the high side. Once you have the
round-trip numbers, if it's stable at 10 that's fine — but if it climbs, that's the answer.

## 🚩 2. `chip-cut.webp` is now one file serving three sizes — and you shrank it to the smallest

Follow what happened to that file this round:

1. You resized it to **800px** @ q85 for the Arsenal header (my suggestion — correct)
2. Then the Hero pass resized **all four floaters to 450px** max edge, including `chip-cut`
3. It now also renders in `BuildLog` as the "currently learning" art

So the Arsenal header — which I explicitly said should be 800px because it's a large section
visual — is now being served a **450px** image. It will be visibly soft on any retina display.

One file can't be three sizes. Options:
- Commit `chip-cut.webp` (450px, floater) and `chip-cut-lg.webp` (800px, Arsenal header), or
- Keep one at 800px and let `next/image` `sizes` downscale it for the floater and BuildLog use.

The second is simpler and costs maybe 20 KB above the fold. Tell me which you're doing and report
the final dimensions for every context each asset appears in. Same question for
`preloader-glyph.webp` — it's now in `Preloader`, `Header`, and `AskMyAI` at presumably three
different display sizes, at 2.0 KB total. Is 2 KB enough pixels for the largest of those?

## 🚩 3. Confirm the blend modes survived the `next/image` conversion

Your grep shows the floaters are now `<Image>` components rather than raw `<img>`. `next/image`
renders into a wrapper with its own styles, and `mix-blend-mode: screen` applies to whichever
element carries the class — if the class landed on the outer wrapper instead of the `<img>`, or
if the wrapper creates a new stacking context, the blend silently stops working and
`ai-braces` / `workflow-nodes` will show their black plates.

Those two are the **only** assets still relying on `screen` (alpha min/max 255,255 — no cut).
Confirm in the DOM that the blend is applied to the image element itself and still composites
against the painted `--color-bg` inside the isolated wrapper.

---

## Two smaller checks

**a) BuildLog hierarchy.** You replaced the Lucide icons with kit renders — good, that was the
plan. But Reply 6 asked for the four items to be differentiated by **icon, render, and volt
opacity steps (100/70/50/40%)**, since the regex had flattened four hues into one. Confirm the
opacity ladder is there, otherwise the four entries still read as visually identical.

**b) Dead dependency.** If `lucide-react` icons were removed from `BuildLog`, `Services`,
`Skills`, `Preloader`, and `Header`, check whether it's still used anywhere. If it is, fine — if
not, uninstall it. Run `grep -rn "lucide-react" src/`.

**c) Header icon.** You put `preloader-glyph` in `Header.tsx:117` as the Ask My AI mark — correct
per spec. Confirm the header **logo** is the JR monogram, which is the other half of that spec
line.

---

## Then we're at the finish

Once #1–3 are answered, the remaining open items are:

- `/playground` + case-study restyle pass (last reported **Not started**; you've since edited
  `playground/page.tsx` for token fixes — is the cinematic header actually done?)
- Mobile / reduced-motion / Lighthouse pass (last reported **Not started**)
- My visual pass on the seven components you've never seen rendered

Give me the three round-trip probe lines, the `chip-cut` resolution decision, the blend
confirmation, and a straight yes/no on those two remaining phases. Then I'll run the site myself.
