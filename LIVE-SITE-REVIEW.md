# Live site deep dive — jhonreyconsolacion.vercel.app

Reviewed the deployed production build. **The rebuild shipped correctly.** All five routes live,
all nine assets serving, all content honest. Notes below are ordered by whether they'd cost you
a client.

> Scope note: the sandbox blocks direct browser egress to the live domain, so this pass is a
> content/markup/SEO audit of the deployed HTML, not a repeat of the interaction testing. The
> animation and interaction verification from rounds 25–32 was done against this exact commit
> running locally, so those results carry over.

---

## ✅ Confirmed live and correct

| Route | Status | Title |
|---|---|---|
| `/` | ✅ | Jhon Rey Consolacion \| AI Developer & Automation Builder |
| `/playground` | ✅ | AI Playground \| Jhon Rey Consolacion |
| `/projects/sukisuite` | ✅ | SukiSuite Case Study |
| `/projects/barangay-arena` | ✅ | Barangay Arena Case Study |
| `/projects/betteryield` | ✅ | BetterYield Case Study |
| `/sitemap.xml` | ✅ | all 5 URLs, correct priorities |

**Per-route metadata is working** — each case study has its own `<title>`. That was a gap in the
original audit and it's fixed.

**All nine kit assets serving** through `_next/image`: preloader-glyph, monogram, console-cut,
ai-braces, workflow-nodes, chip-cut, delivery-pin, milk-tea, pos.

**Content honesty holds end to end:**
- Barangay Arena → "Preview on request", no dead link, on both the card and the case study
- BetterYield → `Next.js React Tailwind CSS Supabase`, the confirmed stack
- Fun fact → exactly as supplied, nothing embellished
- Build Log → all four facts intact, Kidapawan named
- Preloader boot sequence, marquee ticker, `jhonrey@system:~/log$` framing all rendering

**The BetterYield case study is the strongest page on the site.** "Verified Product Surface",
seven products, the four named branches — that's specific, checkable, and exactly what a client
evaluating you wants to see.

---

## 🔴 One thing to fix — the hero floaters are shipping at 3840px

```
workflow-nodes.webp &w=3840&q=75
ai-braces.webp      &w=3840&q=75
chip-cut.webp       &w=3840&q=75
pos-cut.webp        &w=3840&q=75
milk-tea-cut.webp   &w=3840&q=75
```

These render at 150–190px. Next is generating and serving the **3840px** variant because the
`sizes` attribute still resolves to `100vw` for them — the fix from round 29 landed on some
floaters but not these. Compare the ones that are right: `delivery-pin-cut` and the Build Log
chip are served at `&w=96`.

That's five oversized images on your highest-traffic page, and it's the likely remaining drag on
mobile LCP.

Fix in `Hero.tsx` and `BuildLog.tsx` — give every one an explicit `sizes`:
```jsx
sizes="(min-width: 768px) 190px, 0px"
```
Then confirm by viewing source: the URLs should read `&w=256` or `&w=384`, never `&w=3840`.

## 🟡 Two smaller items

**1. The h1 has no spaces in the accessible text.** The rendered heading reads:
```
IbuildwithAI—websites,apps,&automations.
```
The split-text spans have no whitespace between words, so screen readers and search engines see
one run-on string. Visually it's fine (flex gap creates the spacing), but semantically it's
mangled. Add `{' '}` between word spans, or a space inside each span.

**2. The trail pool ships 15 base64 placeholder images** in the initial HTML
(`![](<Base64-Image-Removed>)` × 15). They're the transparent-pixel `src` from the round-27 fix —
harmless, but they add bytes to every page load and clutter the DOM. Consider rendering pool
nodes only after first pointer movement on a fine-pointer device.

---

## Design read

**What's working:** the console/terminal metaphor is coherent everywhere — `build-console.sh` in
the hero, `~/projects/status.sh` in the Build Log, `/usr/bin/generator --engine=cloudflare` in
the playground, `Connect_` and "Initiate Handshake" on the contact form. That consistency is what
makes it read as designed rather than themed. Volt-on-black with mono type is a real identity,
not a template.

**The strongest sequence** is Build Log → How I Build → Proof of Work. It answers "what is he
doing right now", "how does he work", and "what has he shipped" in that order, which is exactly
the question order a client has.

**One structural thought:** "Ask My AI" is your single most differentiating feature and it's a
hero button competing with "Explore Projects". Most visitors won't grasp that it's a grounded
chatbot trained on your portfolio. A one-line subtitle under the CTA — something factual like
"answers grounded in this portfolio" — would convert more of them into trying it. That's a
content decision, not a bug.

---

## Verdict

Ship-ready. Fix the `&w=3840` images this week — it's a five-minute change with a real mobile
performance payoff. The h1 spacing is worth doing for SEO. Everything else is polish you can take
your time on.

For a self-taught developer's portfolio, the engineering on display here — grounded AI chat, a
rate-limited image playground, custom 3D asset kit, GSAP choreography — is the argument. The site
demonstrates the claim instead of making it.
