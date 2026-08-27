# Reply 20 — Both TODOs resolved. Real values below. Plus two loose ends from last round.

Jhon Rey has confirmed both outstanding items. These are verified facts, not placeholders —
use them exactly as written and do not embellish either one.

---

## 1. BetterYield tech stack — confirmed

Replace the `["[Pending confirmation]"]` placeholder in `src/data/portfolioData.ts`:

```ts
techStack: ["Next.js", "React", "Tailwind CSS", "Supabase"],
```

Confirmed directly by Jhon Rey. This matches the pattern already used for the other entries.

**Consequences to handle:**
- Remove the conditional "pending" pill logic in `Projects.tsx` that keyed off the
  `"[Pending confirmation]"` string, so BetterYield now renders normal stack chips like
  SukiSuite and Barangay Arena. Check the case-study page at `/projects/betteryield` for the
  same conditional.
- Delete the `TODO(jhonrey)` comment attached to the BetterYield stack.
- **Barangay Arena's `"preview-on-request"` is unchanged** — that pill logic stays exactly as
  it is. Don't remove both while you're in there.

**Verified detail you may use** (observed on the live site, all factual): the catalog covers
crop nutrition, plant protection, and fertilizer lines across **four branches** — Magpet,
Arakan, Antipas, and Tulunan in North Cotabato — serving farmers across Regions 11 and 12, with
branch-aware availability, category filtering, and phone/Maps integration. The existing
description already says most of this; only add detail if the case-study page has a gap. Do not
invent product names, prices, client counts, or outcomes.

## 2. Fun fact — confirmed

Jhon Rey is **self-taught — no CS degree; he learned to build by shipping real projects.**

Use one of these in `AboutReadme.tsx`, in his voice. Pick the first unless it fits the layout
badly:

> **Fun fact:** No CS degree. I learned to build by shipping — every tool on this page was
> something I figured out mid-project.

> **Fun fact:** I'm self-taught. Everything here I learned by building it, usually while a real
> user was waiting on the other end.

Replace the `{/* TODO(jhonrey): one real fun fact — do not fabricate */}` comment with the copy
and remove the TODO. Keep it to one or two lines — the section shouldn't turn into a bio.

**Do not extend beyond this fact.** No "started coding at age X," no bootcamp, no story about
late nights. Self-taught, learned by shipping. That's the whole claim.

---

## 3. Still outstanding from Reply 19

**a) Empty `src=""` on the trail pool.** Asked twice, still unconfirmed. `<img src="">` makes
some browsers re-request the current page URL — a real bug. Set a 1×1 transparent data URI as the
initial `src`, or don't render pool nodes until first hover. Confirm done or not done.

**b) The `AnimatedBackground` trigger question.** Your explanation — that its 3 parallax triggers
are "in the registry but not in scope for `getAll()`" because they target `document.body` — isn't
how `ScrollTrigger.getAll()` works. It's a global registry lookup; the trigger element is
irrelevant. So either those triggers were killed, never registered behind a matchMedia gate, or
the count should be 9.

Simplest possible check: **load the homepage and scroll. Do the background orbs move?** If yes,
they're registered and the probe undercounted. If no, the parallax is dead and that's a visual
bug to fix. One sentence either way.

---

## Then commit

After the two TODOs are wired and a/b are answered:

```
npm run lint && npm run build
git status --short
git add -A
git commit -m "feat: cinematic hybrid rebuild — GSAP/Lenis, volt palette, 3D asset kit"
```

Confirm `scratch_tests/` is deleted from disk, not just gitignored — it carries `node_modules`
and a downloaded Chrome binary.

That closes every open item. Zero `TODO(jhonrey)` should remain in the codebase after this —
verify with `grep -rn "TODO(jhonrey)" src/` and paste the (empty) result.
