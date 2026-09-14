# DílnaJobs preview v9 — ground-up

**Status (2026-09-14):** Tomáš approved the direction (“Směr sedí, doladíme detaily”).  
**Next.js App Router port is paused** until he signs off this HTML as final. Do not restyle `src/app` / cream-grid / mega-menu to chase v9.

Static HTML only in this folder.

This is a new information architecture and visual system. It is not a restyle of `design/preview-locked/` (cream grid, mega menus, marketing hero-board).

## Who it is for

Primary: a job seeker looking for manufacturing work (CNC, svářeč, seřizovač…). Employer posting is secondary.

## IA

Homepage **is** the board. `nabidky.html` uses the same shell.

- One short claim above search: *Práce ve výrobě. Přímo od firem.*
- Left rail: keyword, město, Hledat, profession filters (sticky on desktop).
- Right column: job rows start in the first viewport (title, company, city, shift, salary).
- Header is plain links: Nabídky · Pro firmy · **Inzerovat → `firma-registrace.html`**. No mega menu, no LIVE strip.
- Mobile: sticky search, filters in a sheet, denser list rows.

Client-side filter in `app.js` so CNC + město actually hide/show the demo rows.

## Visual

White board, Inter, black type, **one** accent `#003DFF` on primary actions. No JetBrains Mono, no dotted wallpaper. Logo mark stays the 2×2 squares.

## Pages

| File | Role |
| --- | --- |
| `index.html` | Search board |
| `nabidky.html` | Same board (canonical filter URL) |
| `pro-firmy.html` | Quiet employer + ceník |
| `firma-prihlaseni.html` | Magic-link login |
| `firma-registrace.html` | ARES-first signup (preview; ARES is not called) |

Open `index.html` in a browser (Google Fonts Inter, or system fallbacks).
