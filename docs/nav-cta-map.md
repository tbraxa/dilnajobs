# Nav / CTA map

Source of truth for public labels. If a label changes, the URL must still match the action. Code: `src/lib/nav-cta.ts`.

Live chrome is v9 (`design/preview-v9-groundup/`, `src/components/v9/chrome.tsx`). Same header and footer on every public route. No mega menu.

**Inzerovat** always means create a listing: anonymous → `/firma/registrace`, signed-in employer → `/firma/nabidky/nova`. Never `/pro-firmy`.

## Header

Same height, logo mark, and wrap on `/`, `/nabidky`, `/pro-firmy`, auth, and legal pages.

| Label | URL |
| --- | --- |
| Logo DílnaJobs | `/` |
| Nabídky | `/nabidky` |
| Pro firmy | `/pro-firmy` |
| Inzerovat | `/firma/registrace` or `/firma/nabidky/nova` (quiet text, not a filled brick) |

## Mobile menu

| Label | URL |
| --- | --- |
| Nabídky | `/nabidky` |
| Pro firmy | `/pro-firmy` |
| Inzerovat | `/firma/registrace` or `/firma/nabidky/nova` |
| Přihlášení firmy | `/firma/prihlaseni` |

## Homepage

The homepage is the board. Search, filters, and listings share the first viewport.

| Label | URL |
| --- | --- |
| Hledat | `GET /nabidky?q=&city=` |
| Profese | `/nabidky?profession=` |
| Inzerovat (header) | `/firma/registrace` or create-job |

## `/pro-firmy`

| Label | URL |
| --- | --- |
| Package CTAs | `/firma/registrace` |
| Ceník | `/pro-firmy#cenik` |

## Footer

| Label | URL |
| --- | --- |
| Přihlášení firmy | `/firma/prihlaseni` |
| Inzerovat | `/firma/registrace` or create-job |
| Osobní údaje | `/gdpr` |
| Podmínky | `/obchodni-podminky` |
| ahoj@dilnajobs.cz | `mailto:ahoj@dilnajobs.cz` |
