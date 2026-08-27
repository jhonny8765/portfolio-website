# Reply 16 — Close-out accepted with reservations. Three claims need evidence, two items missing.

The no-fabrication compliance is noted and appreciated — the two TODOs left intact is the right
outcome. Reduced-motion coverage across the six components looks right.

But this report is summary-only again, and three of its claims are hard to believe.

---

## 🚩 1. Lighthouse 100/100/100/100 — I don't accept this without the report

A GSAP + Lenis site with a preloader, split text, a pinned section, custom cursor, marquee, and
~176 KB of above-fold WebP scoring a **perfect 100 on mobile Performance** would be genuinely
exceptional. Combined with 100 Accessibility, 100 Best Practices, and 100 SEO — all four, first
try, on a site nobody has visually inspected — this reads as a number you expect rather than one
you measured.

Specific reasons for doubt:
- You said "the headless audit" but never showed the command or output. Was this
  `npm run build && npm start`, or the dev server? Dev-server Lighthouse is meaningless.
- **Mobile vs. desktop**: I asked for both. You gave one set of four numbers. Mobile Performance
  is throttled hard and is almost always well below desktop.
- **Accessibility 100** is checkable and I have doubts: the preloader, the custom cursor hiding
  the native one, `aria-hidden` split-text spans, and the 15-node trail pool are all things
  Lighthouse's axe run flags or that its automated checks simply can't see.
- **CLS**: split text + a preloader clip-wipe + late-loading floaters is the classic CLS
  signature. Exactly 0 would be a nice result, not a default.

Paste the actual Lighthouse output — the command you ran, mobile and desktop separately, and the
raw metric values (FCP, LCP, TBT, CLS, SI). If you can't run it properly, say so; I'd rather have
"couldn't measure" than four 100s I can't trust.

## 🚩 2. The ScrollTrigger baseline changed from 9 to 10

Last round: `9 → 0 → 9`. This round: `10 → 0 → 10`.

The delta is fine on its own — you added animations to case studies and the playground, so a new
trigger on the homepage is plausible. But you reported it as the same passing test without noting
the change, which means you're pasting the conclusion rather than reading the numbers.

Which component added the 10th trigger? And I asked for the probe to be **re-run including
`/playground`** now that it's animated — last time it reported 0 triggers there because the page
had none. Confirm `/playground` now registers and tears down its own triggers.

## 🚩 3. "Above-the-fold weight 175.7 KB (console, braces, workflow, chip, delivery, milk-tea)"

That's **six** assets. The above-fold set is the four Hero floaters — `console`, `ai-braces`,
`workflow-nodes`, `chip`. `delivery-pin` and `milk-tea` live in the **Build Log**, well below the
fold, and should be lazy-loaded, not counted in the initial paint.

Two possibilities: either you listed them wrong, or they're actually loading eagerly in the Hero
viewport — in which case they need `loading="lazy"` and the real above-fold number is lower.
Also, 175.7 KB was the number from *before* you re-encoded `chip-cut` to 800×436 / 28.9 KB, so
the figure is stale either way. Recompute and list exactly which files load in the initial
viewport.

---

## Two deliverables you skipped

**`git status`.** Item 6 on the close-out list. You need to confirm the tree is clean and that
`scratch_tests/` (which contains `node_modules` and a Puppeteer Chrome download), the `.py`
scripts, `workspace-extracted/`, and `src/app/test/` are all gone — not gitignored, **gone**.
Paste the output. This is the last thing standing between you and a 300 MB commit.

**The never-seen-rendered list.** Item 7. Last time it was seven components. After 5b and 5c —
which added playground and case-study animations you also haven't viewed — what's the current
list? This tells me where to focus, and it's the most useful thing you can hand me right now.

---

## Also

- `src/components/Projects.tsx:124` — `{/* TODO(jhonrey): Add section description */}` is new and
  I didn't ask for it. Is the works rail missing a section intro that used to exist? If you
  removed copy during the rebuild, say what it was. If it's a slot you invented, remove the TODO;
  I don't need a prompt to write marketing copy for my own projects section.

---

**Final ask, then I'll take it from here:**
1. Real Lighthouse output — mobile + desktop, production build, raw metrics
2. Which component owns the 10th ScrollTrigger + `/playground` probe result
3. Corrected above-fold list and weight
4. `git status`
5. Updated never-seen-rendered list
6. What `Projects.tsx:124` is about

No more code changes. After that I'm running the site myself, and anything I find on the visual
pass we'll handle in a fresh round.
