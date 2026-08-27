# Reply 22 — LCP didn't move, and I don't think it's hydration. One check, then hand over.

Handover notes are genuinely useful — specific, honest about what you couldn't see, and the
768–1024px floater question is exactly the kind of thing I'd have found the slow way. Thank you.

But the LCP explanation doesn't add up, and it's a 30-second check to settle.

---

## The numbers say the LCP element isn't the text anymore

FCP **2.05 s**, LCP **4.08 s**. You attribute the 2-second gap to hydration of the
Next/Lenis/GSAP bundles on a throttled CPU.

That doesn't follow. Both `.hero-word` and `.hero-text-item` now render **visible in the SSR
HTML** with no JS gate — so they paint at FCP. If the largest contentful element were text, LCP
would fire at or very near 2.05 s. A 2-second gap means **something else is now the largest
element**, and it's arriving late.

Most likely candidate: **one of the hero floater images.** `ai-braces.webp` is 78 KB,
`chip-cut.webp` 29 KB, and they're above the fold. On a throttled slow-4G profile an image that
size landing ~2 s after FCP is exactly this signature. Hydration delays *interactivity* (that's
TBT, which is only 104 ms — fine); it doesn't hold back a paint of already-visible text.

**One question:** what does Lighthouse name as the LCP element now? It's in the report under
"Largest Contentful Paint element." Paste that line.

If it's a floater image, two options:
- **Don't render the floaters below 768px at all.** They're desktop parallax art, they're not
  mouse-reactive on touch anyway, and at 375px they're likely overlapping the text (see your own
  handover note). Removing them from mobile fixes LCP and probably a layout problem at once.
- Or keep them and drop `priority`, so the text wins LCP.

I'd take the first. If the answer turns out to be something else entirely, tell me and we'll
leave it — 80 mobile / 99 desktop is shippable, and I'd rather not chase it blind.

---

## Everything else — accepted, and we're done

- Both hero elements CSS-gated correctly this time
- CLS 0.000 both, desktop 99, TBT 104 ms
- `main` at `d532a66`, PR #6 open with `56168ac`, tree clean
- Zero `TODO(jhonrey)` remaining

---

## Handover

After the LCP element line, **stop and don't touch the branch.** I'm doing the visual pass on
PR #6 against your five flagged areas:

1. Floaters at 768–1024px and 375px (plus: are they even needed on mobile?)
2. `HowIBuild` pin handoff
3. Cursor + trail decay on the project cards
4. Preloader wipe and the `hasSeenPreloader` suppression
5. `/playground` and `/projects/*` at 375px

Anything I find comes back as a fresh round with specifics. Don't pre-emptively fix things in the
meantime — I want to review the exact commit that's in the PR.

Good work on the last stretch. The reports since Reply 17 have been measured, honest about
failures, and self-correcting, and that's what got this over the line.
