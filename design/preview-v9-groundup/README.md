# DílnaJobs preview v9 — ground-up

Static HTML only. **Do not port to Next.js until Tomáš approves this direction.**

This is a new information architecture and visual system. It is not a restyle of `design/preview-locked/` (cream grid, mega menus, marketing hero-board).

## Who it is for

Primary: a job seeker looking for manufacturing work (CNC, svářeč, seřizovač…). Employer posting is secondary.

## IA

Homepage **is** the board. `/nabidky.html` uses the same shell.

- One short claim above search: *Práce ve výrobě. Přímo od firem.*
- Left rail: keyword, město, Hledat, profession + city filters (sticky on desktop).
- Right column: job rows start in the first viewport (title, company, city, shift, salary).
- Header is three plain links: Nabídky · Pro firmy · Inzerovat (outline). No mega menu, no LIVE strip, no competing black “Inzerovat” brick.
- Mobile: sticky search, filters in a sheet, jobs as cards.

Client-side filter in `app.js` so CNC + město actually hide/show the demo rows.

## Visual

White / off-white paper, black type, **one** accent `#003DFF` on primary actions. Satoshi for logo and titles, Inter for UI. No JetBrains Mono chrome, no dotted wallpaper.

Logo mark stays the 2×2 squares.

## Pages

| File | Role |
| --- | --- |
| `index.html` | Search board |
| `nabidky.html` | Same board (canonical filter URL) |
| `pro-firmy.html` | Quiet employer + ceník |
| `firma-prihlaseni.html` | Magic-link login |
| `firma-registrace.html` | ARES-first signup (preview; ARES is not called) |

Open `index.html` in a browser (needs Fontshare + Google Fonts, or system fallbacks).
