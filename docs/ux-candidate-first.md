# Candidate-first IA

Product priority: **uchazeč looking for manufacturing work** first, employer posting second.

Live UI source of truth: [`design/preview-v9-groundup/`](../design/preview-v9-groundup/) ported in the App Router (`src/styles/v9.css`, `src/components/v9/`). White board, Inter only, accent `#003DFF` on primary actions. No mega menu, no dotted wallpaper, no cream-grid cascade, no JetBrains chrome.

We copy job-board IA (search first), not another brand’s orange/blue chrome.

## Homepage `/`

`/` is the board: sticky filter rail + job list in the first viewport.

1. Claim in the rail: práce ve výrobě, přímo od firem.
2. Search (`#hledat`): pozice + **Hledat** → `GET /nabidky?q=&city=`.
3. Profese as links. Město in the rail (sheet on mobile).
4. Listings on the right. Employer ceník lives on `/pro-firmy`, not below the homepage fold.

## `/nabidky`

Same shell as the homepage. Rail stays sticky. Empty copy stays human; **Upozornit mě** is a mailto until alerts exist.

## Consistency

- `html { scrollbar-gutter: stable; }`. Never `body { max-width: 100vw }`.
- Same header height and `.wrap` max-width + horizontal padding on every public route.
- Shared `SiteHeader` / `SiteFooter`. Fonts self-hosted Inter.

See also `docs/nav-cta-map.md` and `docs/design-tokens-locked.md`.
