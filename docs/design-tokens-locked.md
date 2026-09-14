# Locked DílnaJobs visual tokens

Source of truth: [`design/preview-locked/`](../design/preview-locked/) (static v8).

Marketing CSS in the App Router is that stylesheet, copied into [`src/styles/preview.css`](../src/styles/preview.css) after self-hosted `@font-face` rules (CSP is `font-src 'self'` — do not `@import` Fontshare or Google Fonts).

To refresh the port: copy `design/preview-locked/styles.css` over the stylesheet body in `src/styles/preview.css`, keeping only the `@font-face` block at the top. Diff those two files; they must stay equal after the font faces.

Next.js markup must keep the locked class names (`hero-board`, `employer-strip`, `filter-chip`, `btn-accent`, `mod is-dark` / `is-blue-bg`, …). Do not restyle marketing routes with Tailwind paper/steel utilities.

## `:root` (from `styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#F2F0EA` | Page ground |
| `--cream-alt` | `#FAF9F6` | Panels, header, table head |
| `--cream-deep` | `#E6E3DA` | Recessed fills |
| `--ink` | `#0B0D12` | Type, primary buttons, employer strip |
| `--ink-soft` | `#161A22` | Soft charcoal |
| `--muted` | `#5A5F6A` | Secondary type |
| `--muted-2` | `#8B909A` | Micro labels |
| `--border` | `#D2D0C8` | Hairlines |
| `--border-strong` | `#0B0D12` | Strong outlines |
| `--blue` | `#003DFF` | Accent fill only |
| `--blue-dim` | `#002FCC` | Accent hover |
| `--blue-soft` | `#E8EDFF` | Icon tiles, drawer |
| `--steel` | `#3D4554` | Workshop steel (not body type) |
| `--white` | `#FFFFFF` | Type on blue/ink |
| `--font-display` | Satoshi | Headlines (`h1`–`h3`) |
| `--font-body` | Inter | UI / body |
| `--font-mono` | JetBrains Mono | Micro only (`.eyebrow`, `.strip-code`, `.mod-tag`, `.filter-label`) |
| `--r` | `0px` | Square controls |
| `--header-h` | `60px` | `.site-header` |
| `--strip-h` | `36px` | `.top-strip` |
| `--max` | `1180px` | Board width |

`--green` / `--green-dim` alias `--blue` so leftover class names do not go neon.

Portal Tailwind aliases (`--paper`, `--line`, `--accent`) must map to the cream/ink/blue values above. They are not a second palette.

## Surfaces

**Body** — cream + 24px radial dot grid:

```css
background: var(--cream);
background-image: radial-gradient(circle, rgba(10,10,10,0.055) 1px, transparent 1px);
background-size: 24px 24px;
```

**LIVE strip** (`.top-strip`) — blue fill, white type, JetBrains `.strip-code` “LIVE”. Never a black strip.

**Header** (`.site-header`) — 60px, cream/blur. `.logo-mark` is **four distinct dots** (2×2, 7px rounds, 4px gap, two blue / two ink) — never a fused square. Mega triggers with chevrons: Nabídky / Pro firmy / Jak to funguje. `.mega-panel` is content-width (`--max: 1180px`), aligned to `.header-inner` borders — not viewport edge-to-edge.

**Hero** (`.hero-board`) — split `.hero-main` + `.hero-live`. Headline: “Práce ve výrobě. Přímo od **firem**.” Dual CTAs: `.btn-primary` + `.btn-secondary`, both `.btn-square`.

**Jobs** — desktop `.jobs-table` (Profese / Kraj / Mzda / Směny / go), mobile `.jobs-cards` / `.job-card`. Tags use `.chip`; “Nové” is `.chip.is-blue`.

**Employer strip** (`.employer-strip`) — ink/charcoal fill, **white type**, blue `.btn-accent` “Zobrazit ceník”. Never blue text on black. Secondary CTA is white outline, not blue type.

**Pricing** (`/pro-firmy`, `.modular-grid`) — Basic `.mod.is-dark` (ink + white), Standard `.mod.is-blue-bg` (blue fill + white type). Accent CTA is `.btn-accent` (blue fill, white text).

## Controls

| Class | Fill | Type | Radius |
| --- | --- | --- | --- |
| `.btn-primary` | ink | white | `.btn-square` → 0 |
| `.btn-secondary` | transparent | ink (white on employer strip) | 0 |
| `.btn-accent` | `#003DFF` | **white** | 0 |
| `.btn-ghost` | transparent | ink | 0 |
| `.filter-chip` | cream-alt | muted | 2px |
| `.filter-chip.is-active` | `#003DFF` | **white** | 2px |
| `.chip.is-blue` | `#003DFF` | **white** | 2px |

## Forbidden

- Space Grotesk, purple shadcn, neon green
- Blue type on black / charcoal (`employer-strip`, `.mod.is-dark`)
- Replacing locked class names with Tailwind `bg-paper` / `text-steel` marketing layouts
- Loading Fontshare or Google Fonts at runtime without updating `src/middleware.ts` `font-src`

## Route map

| Preview HTML | Next.js |
| --- | --- |
| `index.html` | `src/app/page.tsx` |
| `nabidky.html` | `src/app/nabidky/page.tsx` |
| `nabidka.html` | `src/app/nabidka/[slug]/page.tsx` |
| `pro-firmy.html` | `src/app/pro-firmy/page.tsx` |
| header / footer / mega | `src/components/preview/chrome.tsx` |
| `icons.svg` | `src/components/preview/sprite.tsx` |
| `mega-menu.js` | hover/drawer behaviour in `chrome.tsx` |
