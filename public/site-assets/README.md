# Site asset pack (do not regenerate)

Drop this whole folder into the portfolio repo as:

```
public/site-assets/
```

Then paste `ANTIGRAVITY_PROMPT.md`. The prompt already points at these paths.

## Palette (locked)

- Background `#07080A`
- Accent `#E8F54A`
- Ink `#F4F1EA`

## Floating PNGs

Shot on near-black. In the site use:

```css
mix-blend-mode: screen;
pointer-events: none;
user-select: none;
```

| File                          | Where                             |
| ----------------------------- | --------------------------------- |
| `floating/console.png`        | Hero, top-right                   |
| `floating/ai-braces.png`      | Hero, mid-right                   |
| `floating/workflow-nodes.png` | Hero, top-left                    |
| `floating/chip.png`           | Hero, bottom-left                 |
| `floating/milk-tea.png`       | About / next-up                   |
| `floating/delivery-pin.png`   | Build log                         |
| `floating/pos.png`            | Build log / next-up               |
| `brand/monogram-jr.png`       | Header + About (if no real photo) |
| `brand/preloader-glyph.png`   | Preloader                         |
| `overlays/grain.svg`          | Full-page noise, ~4%              |
| `overlays/scanlines.svg`      | Full-page scan, ~3%               |
| `ui/marquee-sep.svg`          | Ticker separators                 |
| `manifest.json`               | Positions + rules for the agent   |

No video. No extra AI images. Project screenshots stay the ones already in `/public/projects`.
