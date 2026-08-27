# Reply 21 — Recovery verified. One metric missing, and I think the fix missed its target.

I confirmed independently: `origin/main` is at `d532a66`, PR #6 is open from
`rebuild/cinematic-hybrid`. Clean recovery — thank you for handling it properly.

The orb measurement is exactly the kind of evidence I wanted: three wraps with real translate
deltas. Parallax is alive, settled.

Two things before the visual pass.

---

## 🚩 1. You omitted mobile LCP — the only metric this fix was for

Your Lighthouse block lists CLS, TBT, Accessibility, Best Practices, SEO, and Performance.
**No LCP.** That was the entire purpose of the CSS-gating change, and it's the one number missing.

What's there is also not encouraging: mobile Performance went **83 → 80**, and TBT rose
**69 → 95 ms**. Both moved the wrong way. That's consistent with LCP not improving at all.

Paste the mobile LCP figure. If it's still ~4.0 s, see below.

## 🚩 2. I think you gated the wrong element

Your CSS gates `.hero-word`:

```css
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .hero-word { transform: translateY(100%); opacity: 0; }
}
```

But in Reply 18 you identified the LCP element yourself:

> The LCP element Lighthouse named is the `<p>` hero sub-headline
> ("I build websites, applications, and automations with AI…")

That paragraph is `.hero-text-item`, not `.hero-word`. `.hero-word` is the split **headline**.
And per your Round 19 note, `.hero-text-item` gets `opacity: 0` from GSAP's `fromTo` at runtime —
which means the actual LCP element is **still JS-gated** and still waits for GSAP to bootstrap.

You fixed the headline. LCP is the sub-headline.

Extend the same treatment to `.hero-text-item`: move its hidden start state into that media
query, and on mobile let GSAP animate `y` only, `from` a visible state. Then re-run and report
LCP specifically.

If `.hero-text-item` is also used outside the hero, scope it — but the principle stands: **on
mobile, nothing above the fold should start hidden via JavaScript.**

---

## Everything else is accepted

- BetterYield stack wired; pending-chip logic removed; Barangay Arena's pill untouched — correct
- Fun fact placed verbatim, nothing added — correct
- `grep -rn "TODO(jhonrey)" src/` → 0 results
- lint + build clean, 13 routes
- CLS 0.000 on both, desktop 99
- `.git/COMMIT_EDITMSG_CUSTOM` gone, tree clean

---

## Then hand it over

Once LCP is reported (and hopefully fixed), stop. I'm doing the visual pass on PR #6 — the five
components nobody has seen: the preloader, the How I Build pin, the cursor trail, `/playground`,
and the three case-study pages.

Two requests for that handoff:

1. **Note anything you're uncertain about visually.** You've built this whole layer blind. If
   there's a spot where you guessed at spacing, sizing, or whether a floater overlaps text — say
   so now. It'll save me hunting.
2. **Leave PR #6 unmerged.** Nothing lands on `main` until I've looked at it in a browser at
   1440px and 375px.

Good work getting `main` back cleanly. That was the right call, executed properly.
