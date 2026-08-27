# tools/ — automated audit harness

`audit.mjs` runs a real Chromium browser against the site and **measures** 40 checks —
navigation, images, interactions, mobile, accessibility, reduced motion, and content honesty.

It exists because every defect in this project's rebuild reached production the same way: someone
read the code, concluded it was fine, and reported success. This script clicks the buttons.

## Setup (once)

```bash
npm i -D playwright
npx playwright install chromium
```

## Usage

```bash
# local dev server
npm run dev
node tools/audit.mjs

# the live production site  ← the important one
node tools/audit.mjs https://jhonreyconsolacion.vercel.app

# save a machine-readable report
node tools/audit.mjs https://jhonreyconsolacion.vercel.app --json audit.json
```

Exit code is `0` if everything passes, `1` if anything fails — so it works in CI.

## What it checks

| # | Group | Checks |
|---|---|---|
| 1 | Navigation | Work / Services / Skills scroll **and** leave no overlay covering the page |
| 2 | Route transitions | Wipe covers on real navigation, retracts on landing and on back |
| 3 | Images | No `w=3840`, no broken sources, nothing >3× its rendered size |
| 4 | Interactions | Magnetic responds, marquee runs and pauses on hover, Ask My AI opens and closes on Escape |
| 5 | Scroll pin | Exactly one on desktop |
| 6 | Routes | All 4 sub-routes 200 with no horizontal overflow |
| 7 | Mobile 375px | No overflow, no pin, no cursor, menu closes, scroll lock released |
| 8 | A11y / reduced motion | No pin, hero visible, alt text, button names, no empty `src`, skip link, h1 word spacing |
| 9 | Content honesty | No `TODO(jhonrey)`, no "Pending confirmation", Barangay Arena labelled correctly |
| 10 | Runtime | Zero page errors |

## Proven to catch real regressions

Run against the commit that shipped the solid-yellow-screen bug (`2a01a94`):

```
37/40 passed

FAILURES
  ✗ "Work" does not leave overlay covering the page
      got: overlayTop=0px covering=true, scrollY=4101
      want: covering=false and scrollY>0
  ✗ "Services" ... covering=true
  ✗ "Skills"   ... covering=true
```

Against the fix (`10a4c48`): **40/40**.

Note the nuance — "Work actually scrolls" **passed** in both runs. The page did scroll; it was
just invisible under a full-screen overlay. A check that only asserted "navigation works" would
have missed it. That's why every check prints its observed value.

## Design rules

1. **Measure, don't assert.** Every check prints what it saw, so a failure can't be summarised away.
2. **Scroll elements into view before hovering.** A `mouseenter` never fires on an element outside
   the viewport — this produced a false "marquee pause broken" result twice during the rebuild.
3. **Set `prefers-reduced-motion: no-preference` explicitly** where animation is under test.
   Headless Chrome defaults to `reduce`, which silently disables GSAP `matchMedia` branches and
   produced a false "no ScrollTrigger leaks" pass.
4. **Test the deployed URL, not just localhost.** The yellow-screen bug was in code that had been
   reviewed, built, and merged.

## Adding a check

```js
check(
  'short name',
  observedValue === expectedValue,   // boolean
  `observed: ${observedValue}`,      // always print the real value
  'what it should be'
);
```

## Suggested CI

```yaml
# .github/workflows/audit.yml
name: UI audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm start & npx wait-on http://localhost:3000
      - run: node tools/audit.mjs http://localhost:3000
```
