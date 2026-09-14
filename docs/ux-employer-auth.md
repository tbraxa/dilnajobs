# Employer auth — accepted layout and fields

Locked visual language: cream paper (`#F2F0EA` / `#FAF9F6`), Satoshi display, Inter body, `#003DFF` square CTAs. See `docs/design-tokens-locked.md`.

`/firma/prihlaseni` uses a dedicated `.auth-shell`. It must **not** use marketing `PageHero`, `.detail-split`, or `.apply-panel` (those stretch inputs edge-to-edge).

## Layout

- Narrow cards, max-width **440–480px**, stacked: login first, registration below (`#registrace`).
- Desktop **≥900px**: optional left trust column (short bullets only). No technical jargon.
- Trust bullets (accepted): přímí zaměstnavatelé; přihlášení odkazem / heslo nepoužíváme; transparentní ceník.
- Inputs in auth cards: min-height ~44px, not hero-sized.

## Login card

| Element | Copy |
| --- | --- |
| Title | Přihlášení firmy |
| Field | Firemní e-mail |
| CTA | Poslat přihlašovací odkaz |
| Helper | Odkaz platí 15 minut. Heslo nepoužíváme. |
| Links | Založit účet · Ceník |

## Register card

### Firma

| Field | Required | Notes |
| --- | --- | --- |
| Název firmy | yes | Autofill from ARES |
| IČO | yes | 8 digits. Button **Načíst z ARES** → `GET /api/ares?ico=` (same-origin; CSP `connect-src 'self'`). |
| DIČ | no | Hint: „jen pokud jste plátci DPH“ |
| Město / sídlo | no | Autofill `sidlo.nazevObce` |

### Kontaktní osoba

| Field | Required | Storage |
| --- | --- | --- |
| Jméno | yes | `employer_users.first_name` |
| Příjmení | yes | `employer_users.last_name` |
| Telefon | yes | `employer_users.phone` |
| Firemní e-mail | yes | `employer_users.email` |

`employer_users.name` stays `"${firstName} ${lastName}"` so existing session lookups keep working. `employers.dic` is nullable.

CTA: **Založit účet a poslat odkaz**

Legal (tiny): souhlas s [obchodními podmínkami](/obchodni-podminky) a [zpracováním údajů](/gdpr). No checksum talk.

## Confirm page

`/firma/prihlaseni/overit` is the same compact card. Token is consumed only after the button.

## Copy bans (this surface)

Do not show: checksum, kontrolní součet, konzole serveru, lokální vývoj, stub, env var names.
