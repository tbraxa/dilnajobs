# Employer auth — accepted layout and fields

Locked visual language: cream paper (`#F2F0EA` / `#FAF9F6`), Satoshi display, Inter body, `#003DFF` square CTAs. See `docs/design-tokens-locked.md`.

Czech B2B patterns this screen follows: StartupJobs (narrow card, one e-mail, no clutter), Teamio (IČO first), Fakturoid (Načíst z ARES → obchodní název / DIČ / adresa). **No password** — magic link only.

`/firma/prihlaseni` uses a dedicated `.auth-shell`. It must **not** use marketing `PageHero`, `.detail-split`, or `.apply-panel`.

## Layout

- Narrow cards, max-width **400–480px** (implemented 440px), stacked: login first, registration below (`#registrace`).
- Desktop **≥900px**: optional left trust column (short bullets only). No technical jargon.
- Trust bullets (accepted): přímí zaměstnavatelé; přihlášení odkazem / heslo nepoužíváme; transparentní ceník.
- Inputs: min-height ~44px, not hero-sized.

## Login card

| Element | Copy |
| --- | --- |
| Title | Přihlášení firmy |
| Field | Firemní e-mail *(one field)* |
| CTA | Poslat přihlašovací odkaz |
| Success | Zkontrolujte e-mail |
| Helper | Odkaz platí 15 minut. Heslo nepoužíváme. |
| Links | Založit účet · Ceník |

No password field.

## Register card

Order is locked. IČO is first.

### Firma

| Field | Required | Notes |
| --- | --- | --- |
| IČO | yes | 8 digits. Button **Načíst z ARES** → `GET /api/ares?ico=` fills obchodní název, DIČ, sídlo/adresa. |
| Obchodní název | yes | Autofill `obchodniJmeno` |
| DPH | yes | **Neplátce** / **Plátce**. Neplátce hides DIČ. |
| DIČ | no | Shown only for Plátce. Autofill from ARES when present. |
| Sídlo / adresa | no | Autofill `sidlo.textovaAdresa` (else obec). Stored in `employers.city`. |

### Kontaktní osoba

| Field | Required | Storage |
| --- | --- | --- |
| Jméno | yes | `employer_users.first_name` |
| Příjmení | yes | `employer_users.last_name` |
| Telefon | yes | `employer_users.phone` |
| Pracovní e-mail | yes | `employer_users.email` |

`employer_users.name` stays `"${firstName} ${lastName}"`. `employers.dic` is nullable (empty when Neplátce).

CTA: **Založit účet a poslat odkaz**  
Success: **Zkontrolujte e-mail**

Legal (tiny): souhlas s [obchodními podmínkami](/obchodni-podminky) a [zpracováním údajů](/gdpr).

No password. No checksum talk.

## Confirm page

`/firma/prihlaseni/overit` is the same compact card. Token is consumed only after the button.

## Copy bans (this surface)

Do not show: checksum, kontrolní součet, konzole serveru, lokální vývoj, stub, env var names, AI filler.
