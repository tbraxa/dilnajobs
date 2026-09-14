# Locked DílnaJobs visual tokens

**Live UI source of truth:** [`design/preview-v9-groundup/`](../design/preview-v9-groundup/) (white board, Inter, `#003DFF`). Ported as [`src/styles/v9.css`](../src/styles/v9.css) + [`src/components/v9/`](../src/components/v9/).

[`design/preview-locked/`](../design/preview-locked/) is the archived cream-grid / mega-menu v8. Do not load `preview.css` or `preview-cascade.css` on public routes.

Refresh the live port from v9 `styles.css` into `src/styles/v9.css`, keeping the self-hosted `@font-face` block (CSP is `font-src 'self'` — do not `@import` Google Fonts).

## Live v9 `:root`

Source: [`design/preview-v9-groundup/styles.css`](../design/preview-v9-groundup/styles.css) after Copy pack v1.1.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` / `--paper` | `#ffffff` | Page ground |
| `--bg-soft` / `--paper-2` | `#f8f9fb` | Recessed fills, auth, ceník band |
| `--ink` | `#111827` | Type |
| `--ink-2` | `#374151` | Secondary type |
| `--muted` | `#6b7280` | Helpers, footer |
| `--line` | `#e5e7eb` | Hairlines |
| `--blue` / `--accent` | `#003DFF` | Primary actions, logo cells 1+4 |
| `--font` / `--display` | Inter | Body and headlines |
| `--header-h` | `56px` | `.header-inner` |
| `--max` | `1120px` | `.wrap` |
| `--radius` | `8px` | Cards, controls |

`html { scrollbar-gutter: stable; }`. Never `body { max-width: 100vw }`. Same `.wrap` padding (`min(1120px, calc(100% - 32px))`) on every public route.

## Fonts (live)

Self-hosted Inter under `/fonts/Inter-*.woff2`. Preload latin + latin-ext in `layout.tsx`. `font-display: block` so the board does not flash a fallback. Never Space Grotesk. Do not `@import` Fontshare or Google Fonts.

## Archived v8 tokens

The cream / Satoshi / JetBrains set below is **not** the live UI. Kept so the static v8 preview stays readable.

## `:root` (from archived `preview-locked/styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#F2F0EA` | Archived page ground |
| `--cream-alt` | `#FAF9F6` | Archived panels |
| `--cream-deep` | `#E6E3DA` | Archived recessed fills |
| `--ink` | `#0B0D12` | Archived type |
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
| `--font-display` | Satoshi | Archived headlines |
| `--font-body` | Inter | Archived body |
| `--font-mono` | JetBrains Mono | Archived micro |
| `--r` | `0px` | Square controls |
| `--header-h` | `60px` | Archived header |
| `--strip-h` | `36px` | Archived top strip |
| `--max` | `1180px` | Archived board width |

`--green` / `--green-dim` alias `--blue` so leftover class names do not go neon.

## Fonts (locked)

| Role | Face | Where |
| --- | --- | --- |
| Display / logo / headlines | **Satoshi** only | `.logo`, `h1`–`h3`, `.display` — no `system-ui`, no Inter fallback |
| Body / UI | **Inter** only | `body`, `.btn`, form controls |
| Micro labels | **JetBrains Mono** only | `.eyebrow`, `.strip-code`, `.mod-tag`, `.filter-label` |

Self-hosted Inter under `/fonts/Inter-*.woff2`. Preload in `layout.tsx`. Never Space Grotesk. Do not `@import` Fontshare or Google Fonts (CSP `font-src 'self'`).

Portal leftover aliases (`--paper`, `--line`, `--accent`) map to the live v9 white/ink/blue values. They are not a second palette.

## Live surfaces (v9)

**Body** is white `--paper`. No dotted wallpaper, no LIVE strip, no mega menu.

**Header** is 56px, white, hairline. Logo mark is a 15px 2×2 of spans (cells 1+4 blue, 2+3 ink). Seeker actions: Pro firmy quiet + Inzerovat outline. Employer: Přihlásit se ghost + Založit účet firmy primary.

**Board** is claim + helper + `.search-bar` + chips, then `.board-layout` (thin/full `.filters` + `.job-row` list). Same wrap as header.

**Auth** is `.auth-page` / `.auth-card`. Inputs 44px. Magic link only. No preview_note in production.

**Pricing** (`/pro-firmy`) is hero + 3 benefits + 3 `.price-card` plans (Jednorázový / Firemní / Provoz).

## Controls

| Class | Fill | Type |
| --- | --- | --- |
| `.btn-accent` | `#003DFF` | white |
| `.btn-outline` | transparent | ink |
| `.btn-ghost` | transparent | muted |

## Forbidden

- Space Grotesk, purple shadcn, neon green
- Mega menus, dotted wallpaper, JetBrains micro chrome on public pages
- `body { max-width: 100vw }`
- Loading Fontshare or Google Fonts at runtime without updating `src/middleware.ts` `font-src`

## Route map

| Preview HTML (`design/preview-v9-groundup/`) | Next.js |
| --- | --- |
| `index.html` | `src/app/page.tsx` |
| `nabidky.html` | `src/app/nabidky/page.tsx` |
| `pro-firmy.html` | `src/app/pro-firmy/page.tsx` |
| `firma-prihlaseni.html` | `src/app/firma/prihlaseni/page.tsx` |
| `firma-registrace.html` | `src/app/firma/registrace/page.tsx` |
| header / footer | `src/components/v9/chrome.tsx` |
| `styles.css` | `src/styles/v9.css` |

