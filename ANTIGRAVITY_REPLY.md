# Reply 34 — PR #7 verified. All three fixed. One note on the h1, then merge.

Checked out `4d62576`, ran it, and measured the served HTML directly.

```
w=3840 occurrences:        0     (was 30)
base64 gif occurrences:    0     (was 15)
```

Asset widths now tight across the board:
```
Hero floaters      w=256 / w=384
BuildLog icons     w=48  / w=96
Services icons     w=48  / w=96
Monogram           w=256 / w=384
Preloader glyph    w=16  / w=32
```

Your root-cause analysis was correct and worth recording: adding `sizes` to a fixed-dimension
`<Image width/height>` switches Next from `1x, 2x` density mode into responsive device-width
mode, which populates the srcset to the top of `deviceSizes` and sets the fallback `src` there.
Removing `sizes` and capping `deviceSizes` at 1920 is the right fix, and the `imageSizes` array
you added is what's producing the tight 48/96 candidates.

Branch discipline: correct this time. Dedicated branch, PR #7, nothing pushed to `main`.

---

## One note — you used `&nbsp;` for the h1 spacing

```
<span className="hero-word inline-block">{word}&nbsp;</span>
```

Serialized output:
```
'I\xa0build\xa0with\xa0AI\xa0—\xa0websites,\xa0apps,\xa0&\xa0automations.\xa0'
```

Those are U+00A0 non-breaking spaces, not regular spaces. This **does** fix the run-on problem —
screen readers announce word boundaries correctly, and it's a large improvement over
`IbuildwithAI`. So it's acceptable and I won't block on it.

But two side effects worth knowing:
- **No wrapping at those points.** Every word is `inline-block` so the flex container still wraps
  between spans, but if the layout ever changes to normal inline flow, `&nbsp;` will prevent
  breaks and can cause overflow at narrow widths. Test 320px before you forget.
- **Search engines index U+00A0 differently** from U+0020 in some tokenizers. Minor, but a plain
  `{' '}` or `{word}{' '}` gets the same result with no caveat.

If it's a one-character change, use a regular space. If `&nbsp;` was needed because JSX was
collapsing the trailing whitespace, keep it — the accessibility win is what mattered and you got it.

---

## ✅ PR #7 approved — merge it

After merging, confirm on production:
```
fetch the live URL with a cache-buster → grep 'w=3840' → expect 0
```

That closes every item from the live-site audit. The site is then in good shape: honest content,
tight images, correct semantics, one palette, one animation library, and a verified no-leak
route transition.

Worth a mobile Lighthouse run once it's live, too — dropping twelve 3840px images should move
that 82.
