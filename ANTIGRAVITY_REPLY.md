# Reply 20 — You pushed to `main`. Also: both TODOs are now resolved with real values.

Stop before doing anything else and read §1.

---

## 🚩 1. You committed the entire rebuild directly to `main`

> `bef5740` on `main`, 55 files, 2222 insertions … Committed and pushed.

A 55-file, 2222-line rebuild of a live production site went straight to `main` with **zero
components ever visually verified**. `main` is what Vercel deploys. If auto-deploy is on, the
preloader, the pin, the cursor trail, the case studies, and the playground — five things nobody
has looked at — are live on `jhonreyconsolacion.vercel.app` right now.

Check immediately: has Vercel deployed `bef5740`? If yes, open the site before anything else.

Then move the work onto a branch so it can be reviewed properly:

```bash
git branch rebuild/cinematic-hybrid          # save the current state
git log --oneline -3                         # note the commit BEFORE bef5740
git reset --hard <commit-before-bef5740>     # main returns to the last known-good state
git push --force-with-lease origin main      # only if bef5740 is already on the remote
git checkout rebuild/cinematic-hybrid
git push -u origin rebuild/cinematic-hybrid
```

Then open a PR from `rebuild/cinematic-hybrid` → `main`. Do not merge until the visual pass is
done. If you're unsure about the reset, **stop and tell me** — a botched force-push is worse than
a premature deploy, and I'd rather do that step myself.

Also: you created `.git/COMMIT_EDITMSG_CUSTOM`. Delete it. Don't write files into `.git/` — use
`git commit -F -` with stdin, or a temp file outside the repo.

## 🚩 2. Your "definitive" 10 was measured against a stale build too

You corrected 6 → 10 and attributed the 6 to a stale server. But read your own sequence:

1. `npm run build`
2. `taskkill /PID 1968 /F && npm start` — kills the old server, starts the new one
3. `node probe-triggers.js` — **immediately**, in the same breath

You then **edited `Hero.tsx`** for the mobile branch... before that build. So the probe ran on a
build that included the Hero change but you never rebuilt after. More importantly: `npm start`
needs several seconds to bind, and you probed with no wait. Getting a full result at all suggests
it hit *something* — but you've now been burned twice by exactly this, and the 6 → 10 correction
was itself caused by not restarting the server.

Also, your own table doesn't add up. You list rows 1–10, then write:
> 3 + 2 + 4 + **1 (missing from count)** = 10

"Missing from count" isn't an accounting entry. And the table shows **5** `AnimatedSection`
triggers (BuildLog, Services, Skills, Contact, Projects), not 4 — but only 4 `AnimatedSection`
instances were in the earlier breakdown. So which is it: 4 or 5 sections wrapped?

I'm not asking for another probe run. Just answer one question: **when you scroll the homepage in
a real browser, do the background orbs move?** Yes or no. That settles whether the parallax is
alive, which is all I actually needed.

## ✅ 3. Mobile LCP — your diagnosis is right, and the fix is simpler than you think

You're correct that the ceiling is now GSAP bootstrap, not the preloader. And you identified the
real solution yourself: **don't let JS own the initial hidden state.**

Do it with CSS, gated by a media query — no JS involved:

```css
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .hero-word { transform: translateY(100%); opacity: 0; }
}
```

Below 768px the hero text is simply **never hidden** — it paints with the HTML, LCP fires
immediately, and GSAP animates `y` only. No `gsap.set`, no bootstrap dependency. That should take
mobile LCP from 4.0 s to somewhere near FCP (2.1 s) and push Performance well past 83.

This is a small change and worth doing. If it fights the split-text structure, say so and we'll
leave it.

---

## 4. Both `TODO(jhonrey)` items are resolved — real, confirmed values

Jhon Rey has supplied both. These are verified facts. Use them exactly; do not embellish.

**BetterYield stack** — in `src/data/portfolioData.ts`:
```ts
techStack: ["Next.js", "React", "Tailwind CSS", "Supabase"],
```
Confirmed directly by him. Consequences:
- Remove the conditional "pending" pill logic that keyed off the `"[Pending confirmation]"`
  string, in `Projects.tsx` **and** on `/projects/betteryield`. BetterYield now renders normal
  stack chips.
- **Leave Barangay Arena's `"preview-on-request"` pill exactly as it is.** Don't clean up both.
- Delete the associated `TODO(jhonrey)`.

Verified detail from the live site, if the case study is thin: four branches — Magpet, Arakan,
Antipas, Tulunan (North Cotabato) — serving Regions 11 & 12, with branch-aware availability,
category filtering, and phone/Maps integration. Do not invent product names, prices, or
client counts.

**Fun fact** — he is self-taught, no CS degree, learned by shipping. Use this in
`AboutReadme.tsx`:

> **Fun fact:** No CS degree. I learned to build by shipping — every tool on this page was
> something I figured out mid-project.

Replace the TODO comment with the copy and remove the TODO. One or two lines, no more. **Do not
extend beyond this fact** — no age, no bootcamp, no late-nights narrative. Self-taught, learned
by shipping. That is the entire claim.

---

## Order of operations

1. Check whether `bef5740` deployed. Report yes/no.
2. Move the work to `rebuild/cinematic-hybrid`, restore `main`, open a PR. Ask first if unsure.
3. Delete `.git/COMMIT_EDITMSG_CUSTOM`.
4. Answer: do the orbs move when you scroll?
5. Wire the stack + fun fact.
6. CSS-gate the hero hidden state; re-run mobile Lighthouse.
7. `npm run lint && npm run build`, then `grep -rn "TODO(jhonrey)" src/` — should be empty.

Nothing merges to `main` until I've done the visual pass.
