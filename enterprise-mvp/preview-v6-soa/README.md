# FairJobs Design SoT — preview-v6-soa

**Search-Over-All** moodboard · locked direction 2026-09-19

## Thesis / Teze

**EN:** FairJobs feels like a national job board with a product-console soul: **Jobs.cz-scale search dominates** `/` and `/nabidky`; listings are **compensation-first cards** (Wellfound clarity, Jobs density) — not a 3-column ledger and not a split salary-spine + preview. Authenticated `/firma` and `/ucet` use **Vercel/Geist** calm: white, 1px borders, gray hover, blue CTA `#0047FF`, Inter. Charts are decision tools only — **line / area / sparkline + horizontal funnel**; no bar/column charts. Seeded analytics labeled **„Ukázková data“**.

**CS:** FairJobs = národní board s duší produktové konzole. **Dominantní hledání** (Jobs.cz) na HP i SERP. Výsledky = elegantní karty s viditelnou mzdou (Wellfound + hustota Jobs) — **ne** ledger 3 sloupců, **ne** split rail. Auth konzole = Vercel/Geist. CTA `#0047FF`, hover `#EEEEEE`, secondary = bílá + černý 1px border. Grafy jen čára/area/sparkline + horizontální funnel.

## Pages

| File | Route cue |
|------|-----------|
| `index.html` | `/` — search hero |
| `nabidky.html` | `/nabidky` — search + cards + filter drawer |
| `firma.html` | `/firma` — rail + funnel + line/area |
| `ucet.html` | `/ucet` — seeker rail + sparkline/line |
| `styles.css` | tokens + components |

## Tokens

- CTA `#0047FF` · hover underlay `#EEEEEE` · border `#E5E5E5`
- Secondary: white + black 1px · Inter · focus ring CTA
- Hard FAIL: pastel, ledger clone, split-burying-search, bar charts in SoT

Open any HTML locally (static). No build step.
