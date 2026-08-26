# Reply 15 — NO. Do not invent the stack or the fun fact. Plan otherwise approved.

Your plan contains this:

> - **BetterYield Stack**: I will **invent a plausible stack** … unless you specify one now
> - **Fun Fact**: I will **invent a fun fact** to replace the `TODO(jhonrey)`

**No. Absolutely not. Do not do either.** Delete both lines from the plan before you execute it.

You have written the word "invent" twice in a plan for a site whose first rule — stated in
`PRODUCT.md`, in the prompt's §2 non-negotiables, and in four of my replies — is **invent
nothing**. You already shipped a fabricated hero `aria-label` once. This would be the same
failure, deliberately, with my plan approval as cover.

Concretely:

**BetterYield stack** — stays `["[Pending confirmation]"]`. That string is not a bug or a
placeholder you're meant to fill; it is the honest, correct value. A guessed stack on a public
portfolio is a lie a client can check. Leave the pending pill exactly as it renders now, on both
the works rail and the case-study page. The `TODO(jhonrey)` comment stays in the code as a note
to me.

**Fun fact** — the `TODO(jhonrey): one real fun fact — do not fabricate` comment stays, and the
block stays visually empty. I will fill it in myself, or it ships without one. A portfolio with
no fun fact is fine. A portfolio with a fabricated personal detail is not.

**Also remove this line from Phase 5b:**
> "Ensure the BetterYield stack is updated"

There is nothing to update.

And delete this from Phase 5c:
> `[MODIFY] src/data/portfolioData.ts` — Resolve the `TODO(jhonrey)` comments

`portfolioData.ts` is the source of truth for verified facts. Do not write speculative content
into it. Neither TODO gets "resolved" by you — they get **left alone**.

---

## To be completely clear about the standing rule

For the rest of this build: if you find yourself about to write any sentence describing me — my
work, my background, my tools, my personality — that you did not read out of this repository,
**stop and leave a `TODO(jhonrey)` instead.** That applies to case-study copy, playground
headers, alt text, meta descriptions, and aria labels. Especially aria labels.

If a section looks empty without invented content, that's the correct outcome. Empty is honest;
filled is a liability.

---

## The rest of the plan — approved

Phase 5b and 5c are otherwise well-scoped. Execute as written, minus the two fabrication items,
with these additions:

- **Case studies:** restyle and animate only. Do not rewrite or "improve" the existing copy —
  it's the one place with real project detail, and it's all verified.
- **Playground:** confirm explicitly, after the restyle, that enhance and generate still work and
  that the 429 path still returns its original copy and `Retry-After`. Chrome only.
- **Lighthouse:** `npx lighthouse` needs the production build (`npm run build && npm start`), not
  the dev server — dev-server numbers are meaningless. Run it against port 3000 in production mode.
- **Cleanup:** when you remove `scratch_tests/`, note that it contains `node_modules` and a
  Puppeteer-downloaded Chrome. Delete the directory rather than gitignoring it, and confirm the
  repo has no `.py` files, no `workspace-extracted/`, no `src/app/test/`.

Approved to proceed on that basis. Then the 7-item close-out report from my last message.
