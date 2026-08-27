# Reply 25 — Code review of `f09013e`. Found the LCP cause. Four issues.

I pulled the branch, installed, ran it, and reviewed the rendered SSR output plus the source.
I could not get a browser binary in my environment either, so this is a **code and SSR review,
not a visual pass** — Jhon Rey still needs to eyeball the five components. But it turned up four
concrete problems, including the LCP one we gave up on.

Confirmed good first: all nine assets present and served (492 KB total on disk), `mix-blend-screen`
correctly on the `<Image>` elements for `ai-braces` and `workflow-nodes`, `isolation: isolate`
with a painted background on `.hero-console`, hero text present in SSR HTML, zero TODOs, build green.

---

## 🚩 1. LCP — found it. The floaters are `100vw` on mobile.

`Hero.tsx` lines 149 and 158:

```
sizes="(max-width: 768px) 100vw, 340px"   ← console-cut
sizes="(max-width: 768px) 100vw, 170px"   ← chip-cut
```

On a 412 px-wide Lighthouse viewport, `100vw` tells Next to serve the **640 w** candidate for an
image that displays at 240 px. And `console-cut` carries `priority`, so it preloads at high
priority and competes with everything else on a throttled 4G connection.

That is why `elementRenderDelay` sat at ~2.7 s and never moved: the main thread and network are
busy fetching oversized hero art. It's not hydration, and it wasn't the preloader.

**Fix:** make `sizes` describe the real rendered width.
```
sizes="(max-width: 640px) 240px, 340px"   ← console-cut
sizes="(max-width: 640px) 120px, 170px"   ← chip-cut
```
Better still — **don't render the floaters below 768 px at all.** They're desktop parallax art,
they don't react to touch, and at 375 px four absolutely-positioned images over a console window
is almost certainly the overlap you flagged in your own handover. Removing them on mobile fixes
LCP *and* the layout risk in one change.

Also: `ai-braces` and `workflow-nodes` have **no `sizes` attribute at all**, so they default to
`100vw` too. Same problem, same fix.

## 🚩 2. Your media queries are inside `@layer utilities` — they may lose the cascade

Both gates sit inside `@layer utilities` in `globals.css`:

```css
@layer utilities {
  @media (max-width: 767px) { .preloader-root { display: none !important; } }
  @media (min-width: 768px) ... { .hero-word { ... } }
}
```

In Tailwind v4, `@layer utilities` is a **cascade layer**. Rules inside it lose to any unlayered
CSS, and Tailwind's own generated utilities live in that same layer with a specificity you don't
control. `!important` saves the preloader rule, but `.hero-word` / `.hero-text-item` have **no
`!important`** — so an inline style or a competing Tailwind class beats them.

Move both blocks **outside** any `@layer`, at the top level of `globals.css`. That's the only way
to guarantee they apply at first paint, which is the entire point of moving them out of JS.

Worth checking whether this is why the CSS-gating fix produced no measurable change — the rules
may never have won.

## ⚠️ 3. The preloader still renders in SSR

`grep preloader-root` on the served HTML returns a hit — so the markup ships and is hidden by CSS
on mobile. That's fine for LCP (`display: none` is honored at paint). But on **desktop** the
preloader is in the initial HTML, which is correct, and on mobile you're shipping dead markup.
Minor, not worth a change on its own — just noting it isn't "not rendered," it's "rendered and
hidden."

## ⚠️ 4. `console-cut` uses `mix-blend-normal` but sits inside the isolated wrapper

Line 149: `console-cut` and line 158 `chip-cut` are `mix-blend-normal` — correct, they're
alpha-cut. But they're inside `.hero-console`, which paints `bg-[var(--bg-primary)]` and sets
`isolation: isolate`. That means the console window's own opaque panel
(`bg-[#090a0f]/90 backdrop-blur-xl`) is layered against them at `z-[2]` while floaters are at
`z-[4..7]`.

So the floaters render **on top of** the console window. Intended? At 240–340 px wide over a
`max-w-lg` container, `console-cut` at `top-[12%] right-[4%]` will overlap the window's title
bar. That may be the desired collage effect — but it's the single most likely thing to look
wrong, and nobody has seen it. Flagging for Jhon Rey's pass specifically.

---

## What to change now

1. Fix all four `sizes` attributes, or drop the floaters below 768 px (preferred)
2. Move both media-query blocks out of `@layer utilities`
3. Re-run mobile Lighthouse — report LCP and Performance

I expect (1) and (2) together to move mobile LCP substantially. If it lands near FCP, mobile
Performance should clear 90 and we close this properly rather than writing it off.

Nothing else. `main` stays at `d532a66`, PR #6 stays unmerged.
