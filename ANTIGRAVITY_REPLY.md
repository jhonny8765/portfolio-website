# Reply 12 — Your own grep proves four assets are orphaned and the Build Log was never built

Images are fixed — correct paths, correct format, every file under 150 KB. Accepted. But the
grep you pasted to prove the paths line up accidentally proves something much more important.

---

## 🚩 1. Four of the nine kit assets are referenced NOWHERE in `src/`

Here is your grep, deduplicated to actual asset references:

| Asset | Referenced in |
|---|---|
| `console-cut.webp` | `Hero.tsx:139` |
| `ai-braces.webp` | `Hero.tsx:142` |
| `workflow-nodes.webp` | `Hero.tsx:145` |
| `chip-cut.webp` | `Hero.tsx:148` |
| `monogram-jr-cut.webp` | `AboutReadme.tsx:22` |
| **`preloader-glyph.webp`** | **— nothing —** |
| **`delivery-pin-cut.webp`** | **— nothing —** |
| **`milk-tea-cut.webp`** | **— nothing —** |
| **`pos-cut.webp`** | **— nothing —** |

All four missing ones belong to **Phase 4's Build Log**, which you marked **"Done — rebuilt with
typing animations and raw code aesthetic."** The spec assigns them explicitly:

- Currently building → Kidapawan delivery app → `delivery-pin`
- Currently learning → Gemini token optimization → `chip`
- Recent experiment → `/playground` → `preloader-glyph`
- Next up → milk-tea POS → `pos` + `milk-tea`

`preloader-glyph.webp` is also supposed to be the **centerpiece of the preloader** and the Ask My
AI launch icon. Your `Preloader.tsx` grep hits show only `grain.svg` and `scanlines.svg` — the
glyph isn't in it.

So: the Build Log has no kit art, the preloader has no glyph, and we've spent four rounds
optimizing four images that nothing on the site loads.

This also retroactively undermines the Phase 4 status table. You reported Build Log, How I Build,
Services, and Arsenal as **Done**. Services was supposed to pair each card with a kit render too
(`console` / `workflow-nodes` / `ai-braces`) — the grep shows all three are only in `Hero.tsx`,
so the Services cards have no art either.

**Before anything else:** re-audit Phase 4 honestly, per component, against the spec — not
against your task list. For `BuildLog`, `Services`, `Skills` (Arsenal), and `Preloader`, tell me
what art each currently renders. I expect the answer is "none."

## 🚩 2. `chip-cut` at WebP quality 52 is not a fix

To meet the 150 KB cap you re-encoded `chip-cut.webp` three times, ending at **quality 52**.
That's deep into visible-artifact territory for a photoreal render with gold circuit traces —
you'll get banding in the gradients and mush in the fine trace lines, and it's the Arsenal header.

The right lever is dimensions, not quality. `chip-cut` is at 1200px because I said console and
chip are the large visuals — but if it's a section header rather than full-bleed, 800px at
quality 85 will look far better *and* weigh less. Re-encode at q82–85 and reduce the longest edge
until it fits. Report the final dimensions and size.

657 KB total is acceptable as a *library* total — what actually matters is the above-fold budget,
so confirm which of these load in the initial viewport (the four Hero floaters, presumably) and
what those four weigh together. That number needs to be under ~250 KB.

## ✅ 3. The puppeteer result — thank you for being straight

`ScrollTrigger: -1` tells us why, and it's simple: **ScrollTrigger isn't on `window`.** It's
bundled as an ES module, so `window.ScrollTrigger` is undefined and your probe returned its
sentinel. Not a React or hydration problem.

Two ways to get a real number:
- Expose it in dev only: in the component where you register the plugin, add
  `if (process.env.NODE_ENV === 'development') (window as any).ScrollTrigger = ScrollTrigger;`
  then re-run the probe.
- Or skip the JS entirely and count DOM nodes: `document.querySelectorAll('.pin-spacer').length`
  works without any global — but only after you've scrolled How I Build into view at 1440px wide
  and given ScrollTrigger a tick to initialize. A `0` baseline still means the probe is early.

Worth doing once, given the route-transition rewrite. But it's now second priority behind #1.

## ⚠️ 4. Favicon and OG — one last verification

You generated a multi-size ICO with Pillow (good, that addresses my concern) and patched the
centering. Two checks:
- `src/app/favicon.ico` and `public/favicon.ico` — you copied to both. In App Router,
  `src/app/favicon.ico` is the one Next serves. Confirm they're the same file and there's no
  conflict.
- Open `og-image.jpg` and confirm by eye: 1200×630, monogram centered, black field, not clipped.

---

## Where this stands

Assets: fixed. Palette: fixed. framer-motion: gone. Build: green.
**But the thing the whole rebuild is for — the cinematic sections — is still not verified, and
we now have concrete evidence that at least Build Log, Services, and the Preloader are missing
their art.**

**Next deliverable, in order:**
1. Honest per-component audit of Phase 4: `BuildLog`, `Services`, `Skills`, `Preloader` — what art
   renders today, and where each assigned asset should go
2. Wire the four orphaned assets into their specified slots
3. Re-encode `chip-cut` at q82+ with reduced dimensions; report above-fold total for the Hero four
4. `npm run lint && npm run build`

Then the ScrollTrigger probe, then my visual pass. Don't tell me it's complete again until
`grep -rn "site-assets" src/` shows all nine assets in use.
