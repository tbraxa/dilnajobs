# Nav / CTA map

Source of truth for public labels. If a label changes, the URL must still match the action. Code: `src/lib/nav-cta.ts`.

**Inzerovat** always means create a listing: anonymous → `/firma/registrace`, signed-in employer → `/firma/nabidky/nova`. Never `/pro-firmy`.

## Header

| Label | URL |
| --- | --- |
| Logo DílnaJobs | `/` |
| Nabídky (mega) | see mega below |
| Pro firmy (mega) | see mega below |
| Jak to funguje | `/#jak` (plain link, no mega) |
| Hledat | `/#hledat` on homepage, `/nabidky` elsewhere |
| Inzerovat → | `/firma/registrace` or `/firma/nabidky/nova` |

## Mobile drawer

| Label | URL |
| --- | --- |
| Nabídky accordion | same destinations as Nabídky mega |
| Pro firmy accordion | same destinations as Pro firmy mega |
| Jak to funguje | `/#jak` |
| Hledat nabídky | `/#hledat` on homepage, `/nabidky` elsewhere |
| Inzerovat → | `/firma/registrace` or `/firma/nabidky/nova` |

## Homepage

Search is the product. Employer CTAs stay below the fold. IA: `docs/ux-candidate-first.md`.

| Label | URL |
| --- | --- |
| Hledat nabídky (search panel) | `GET /nabidky?q=&city=` |
| Quick chips (CNC, Svářeč, … / cities) | `/nabidky?profession=` or `?city=` |
| Všechny nabídky → | `/nabidky` |
| Vystavit nabídku (employer strip) | `/firma/registrace` |
| Zobrazit ceník → | `/pro-firmy#cenik` |

## `/pro-firmy`

| Label | URL |
| --- | --- |
| Vystavit nabídku → (hero) | `/firma/registrace` |
| Zobrazit ceník | `#cenik` |
| Package CTAs (Začít zdarma / Koupit inzerát / Vybrat …) | `/firma/registrace` |
| Začít zdarma → (bottom) | `/firma/registrace` |
| firmy@dilnajobs.cz | `mailto:firmy@dilnajobs.cz` |

## Nabídky mega

| Label | URL |
| --- | --- |
| CNC / Svářeči / Seřizovači / Elektrikáři / Údržba | `/nabidky?profession=…` |
| Kraje | `/nabidky?city=…` or `/nabidky` |
| Všechny nabídky | `/nabidky` |
| Hledat / filtry | `/nabidky#filtry` |

## Pro firmy mega

| Label | URL |
| --- | --- |
| Vystavit nabídku | `/firma/registrace` (or create-job if signed in) |
| Ceník | `/pro-firmy#cenik` |
| Přihlášení firmy | `/firma/prihlaseni` |
| Pro firmy | `/pro-firmy` |

## Footer

| Label | URL |
| --- | --- |
| Nabídky | `/nabidky` |
| Pro firmy | `/pro-firmy` |
| Vystavit nabídku | `/firma/registrace` |
| Přihlášení | `/firma/prihlaseni` |
| Osobní údaje | `/gdpr` |
| Podmínky | `/obchodni-podminky` |
| ahoj@dilnajobs.cz | `mailto:ahoj@dilnajobs.cz` |
