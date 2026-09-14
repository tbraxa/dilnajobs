# Candidate-first IA

Product priority: **uchazeč looking for manufacturing work** first, employer posting second. Visual identity stays DílnaJobs (cream / ink / `#003DFF`, Satoshi, square logo and CTAs). Information architecture follows a job-board search HQ (StartupJobs-like), not a marketing landing page. We copy IA and craft, not their orange/blue chrome.

## Homepage `/`

`/` is search, then results — close to `/nabidky`, not a hero board.

1. One-line headline under the nav: výroba, přímo od firem.
2. Search **row** immediately under it (`#hledat`): pozice + město + **Hledat nabídky** → `GET /nabidky?q=&city=`.
3. Quick chips, then the job list in the **same first viewport**. No second “Aktuální nabídky” heading, no live-panel marketing column.
4. Jak to funguje (`/#jak`) and employer / ceník sit **below** the fold.

Header **Hledat** focuses `#hledat`. **Inzerovat** is outline / secondary.

## `/nabidky`

Same job as the homepage: filters and results share the first viewport.

- Desktop: **left filter rail** + right job list inside the `--max` cream board (SJ split, workshop materials). Rail is sticky. Fields: pozice, město, profese, řazení, chips, **Zrušit filtry**.
- A full-width sticky search *bar* would stack on top of the list and push results down; the rail keeps jobs at the top of the column.
- Mobile: keyword + Hledat first; město / profese / řazení in `#filtry-sheet`.
- Result count in the list header. Empty copy stays human; **Upozornit mě** is a mailto until alerts exist.

## What we do not copy

Orange/blue StartupJobs chrome, their type, or their logo. No fake “saved jobs” product.

See also `docs/nav-cta-map.md` and `docs/design-tokens-locked.md`.
