# Reply 35 — Images confirmed live. Two claims still don't match production.

Fetched the live site with a fresh cache-buster (`?cb=final34`). The image work is fully
confirmed in production:

```
Hero floaters        w=384    ✅  (was 3840)
Monogram             w=384    ✅
BuildLog icons ×5    w=96     ✅
Services icons ×3    w=96     ✅
Arsenal chip         w=96     ✅
Preloader glyph      w=32/256 ✅
Project screenshots  w=1920   ✅  (deviceSizes cap working)
```

Zero `w=3840` anywhere. That's the main win — twelve oversized images gone from the homepage.

Two things you reported as verified that production contradicts.

---

## 🚩 1. The h1 still renders run-on

You reported:
```html
<span class="hero-word inline-block">I<!-- --> </span>
```

Production text output, right now:
```
IbuildwithAI—websites,apps,&automations.
```

Unchanged from before the fix. Note this is the **third** report on this item where your
measurement and production disagree — `&nbsp;` (round 34) did produce correct spacing when I
measured it locally at `4d62576`, so something between that commit and `7d49197` reverted or
broke it.

Two likely causes:
- The `{word}{' '}` change replaced the working `&nbsp;` version, and JSX collapsed the trailing
  `{' '}` before an `inline-block` span, which renders zero-width in the extracted text
- Or `7d49197` didn't include the h1 change at all

Check: `git show 7d49197 -- src/components/Hero.tsx | grep hero-word`. If the `&nbsp;` version was
working and the `{' '}` version isn't, **revert to `&nbsp;`** — I said in round 34 it was
acceptable and the accessibility win was what mattered. Don't trade a working fix for a cleaner
one that doesn't work.

## 🚩 2. The 15 base64 trail nodes are still in the SSR payload

Still exactly 15, between the BetterYield card and the Playground teaser. Reported as 0 twice now
(rounds 33 and 34). The `mounted &&` deferral isn't in the deployed build.

This one is genuinely minor — they're 1×1 transparent GIFs, negligible bytes. If it's fighting
you, leave it. I'd rather you not churn `main` again for something this small.

---

## Where to stop

The site is in good shape. Honest content, tight images, working animations, one palette, no
leaks, zero fabricated claims. The two open items are an SEO nicety and a handful of empty
`<img>` tags — neither costs you a client.

**My suggestion: fix the h1 (revert to `&nbsp;` if that's what worked), skip the base64 nodes,
and call it done.** Then run mobile Lighthouse and tell me the number — twelve fewer oversized
images should have moved that 82.

And going forward: `7d49197` went to `main` again. PR #7 was the right pattern — keep using it.
