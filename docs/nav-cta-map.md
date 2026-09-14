# Nav / CTA map

Source of truth for public labels: [`docs/copy/COPY-PACK.md`](copy/COPY-PACK.md) (v1.1). Live HTML: [`design/preview-v9-groundup/`](../design/preview-v9-groundup/). Code: `src/lib/nav-cta.ts`, `src/components/v9/chrome.tsx`.

**Inzerovat** always means create a listing: anonymous → `/firma/registrace`, signed-in employer → `/firma/nabidky/nova`. Never `/pro-firmy`.

Header height is 56px and `.wrap` padding is identical on every public route. Actions change by page, matching the HTML.

## Header (seeker: `/`, `/nabidky`, job detail)

| Label | URL | Treatment |
| --- | --- | --- |
| Logo DílnaJobs | `/` | mark + wordmark |
| Nabídky | `/nabidky` | main nav, active on seeker board |
| Pro firmy | `/pro-firmy` | `.link-quiet` |
| Inzerovat | `/firma/registrace` or create-job | `.btn.btn-outline.btn-sm` |

## Header (employer: `/pro-firmy`)

| Label | URL | Treatment |
| --- | --- | --- |
| Nabídky | `/nabidky` | main nav |
| Pro firmy | `/pro-firmy` | main nav, active |
| Přihlásit se | `/firma/prihlaseni` | `.btn.btn-ghost.btn-sm` |
| Založit účet firmy | `/firma/registrace` | `.btn.btn-primary.btn-sm` |

## Header (auth)

| Page | Action |
| --- | --- |
| `/firma/prihlaseni` | Nabídky + Pro firmy, ghost **Registrace firmy** |
| `/firma/registrace` | Nabídky + Pro firmy, ghost **Přihlášení firem** |

## Mobile menu (seeker)

| Label | URL |
| --- | --- |
| Nabídky | `/nabidky` |
| Pro firmy | `/pro-firmy` |
| Přihlášení firem | `/firma/prihlaseni` |
| Inzerovat nabídku | `/firma/registrace` or create-job |

## Homepage

Claim: **Práce ve výrobě. Přímo od firem.** Search bar (Pozice + Město + Hledat), chips, thin filters, job rows.

| Label | URL |
| --- | --- |
| Hledat | `GET /nabidky?q=&city=` |
| Chips / Obor | `/nabidky?profession=` |
| Inzerovat (header) | `/firma/registrace` or create-job |

## `/pro-firmy`

Ceník: Jednorázový 2 490 Kč, Firemní 6 990 Kč / měsíc, Provoz na míru.

| Label | URL |
| --- | --- |
| Založit účet firmy / Vybrat / Domluvit se / Vystavit nabídku | `/firma/registrace` |
| Ceník | `/pro-firmy#cenik` |

## Footer

HTML footer plus legal links.

| Label | URL |
| --- | --- |
| Nabídky | `/nabidky` |
| Pro firmy | `/pro-firmy` |
| Přihlášení | `/firma/prihlaseni` |
| Osobní údaje | `/gdpr` |
| Podmínky | `/obchodni-podminky` |
