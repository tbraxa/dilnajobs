# Candidate-first IA

Product priority: **uchazeč looking for manufacturing work** first, employer posting second. Visual identity stays DílnaJobs (cream / ink / `#003DFF`, Satoshi, square logo and CTAs). Information architecture follows a job-board search HQ (StartupJobs-like), not a marketing landing page.

## Homepage `/`

Above the fold is search, not a two-column hero board.

1. Short headline — výroba, přímo od firem, bez agentur.
2. Dominant search panel (`#hledat`): pozice + město + **Hledat nabídky** → `GET /nabidky?q=&city=`.
3. Quick chips under the panel: professions + top cities → filtered `/nabidky`.
4. Results strip immediately below (featured table / cards). Empty catalog still shows search + chips; copy stays human (no migration talk).
5. Jak to funguje (`/#jak`) and the employer / ceník strip sit **below** the fold.

Header **Hledat** on this page focuses `#hledat`. **Inzerovat** stays secondary (`/firma/registrace` or create-job).

## `/nabidky`

One sticky control surface (`#filtry`), not three stacked bars.

- Desktop: keyword + město + profese + řazení + Hledat stay visible while results scroll (sticky top bar on the `--max` board). A left filter rail would fight the single workshop column, so we do not split the page SJ-style.
- Chips live in the same HQ. Active filters show a status line and **Zrušit filtry**.
- Result count sits under the HQ.
- Mobile: keyword first; město / profese / řazení open in a sheet (`#filtry-sheet`).
- Empty results stay human. We do not fake an alert product — “upozornit mě” is a mailto until it exists.

## What we do not copy

Orange/blue StartupJobs chrome, their type, or their logo. Craft (spacing, density, hover, empty states) should feel as deliberate as theirs; the brand stays workshop cream and ink.

See also `docs/nav-cta-map.md` and `docs/design-tokens-locked.md`.
