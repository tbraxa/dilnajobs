# Employer auth — accepted layout and fields

Locked visual language: cream paper (`#F2F0EA` / `#FAF9F6`), Satoshi display, Inter body, `#003DFF` square CTAs. See `docs/design-tokens-locked.md`.

Czech B2B patterns: StartupJobs (narrow one-email login), Teamio / Fakturoid (IČO first + ARES). **No password** — magic link only.

Do **not** use marketing `PageHero`, `.detail-split`, or `.apply-panel`. Do **not** stack login and registration on one page.

Public auth pages keep the same `PreviewHeader` / `PreviewFooter` as the homepage (root layout). Do not swap in Tailwind `SiteHeader`. Body paint is cream `#F2F0EA` from first byte — see `docs/nav-cta-map.md`.

## Routes

| Path | Purpose |
| --- | --- |
| `/firma/prihlaseni` | Login only |
| `/firma/registrace` | Registration only (ARES-first) |
| `/firma/prihlaseni#registrace` | Client redirect → `/firma/registrace` |
| `/firma/prihlaseni/overit` | Confirm magic link (button consumes token) |

## Layout

- One narrow card per page, max-width **460–480px**.
- Desktop **≥900px**: left trust column (3 short bullets) + right card. Mobile: card only.
- Inputs: min-height ~44px (IČO ~52px). Square buttons.

### Login trust

Přímí zaměstnavatelé, bez agentur · Přihlášení odkazem. Heslo nepoužíváme. · Transparentní ceník.

### Registration trust

Přímí zaměstnavatelé, bez agentur · Odpovědi jdou k vám — jméno a telefon · Ceník bez DPH, zkušební inzerát zdarma.

## Login (`/firma/prihlaseni`)

| Element | Copy |
| --- | --- |
| Title | Přihlášení firmy |
| Field | Firemní e-mail *(one field)* |
| CTA | Poslat přihlašovací odkaz |
| Success | Zkontrolujte e-mail |
| Helper | Odkaz platí 15 minut. Heslo nepoužíváme. |
| Links | Založit účet firmy → `/firma/registrace` · Ceník |

No password field.

## Registration (`/firma/registrace`)

Progressive disclosure. Default path for a busy HR/owner:

1. **IČO first** — large field + primary CTA **Načíst z ARES** (full-width under the field). Optional **Vyplnit ručně**.
2. On ARES success: fill obchodní název, sídlo, DIČ if present. Quiet note: *Údaje z ARES jsme doplnili. Zkontrolujte je.*
3. Reveal/confirm company fields (editable).
4. Reveal **Kontaktní osoba**.
5. Legal checkbox + submit.

If ARES fails: reveal all fields. Error: *ARES teď neodpověděl. Vyplňte údaje ručně.* Never checksum / konzole / stub.

ARES: `GET /api/ares?ico=` (same-origin).

### Firma

| Field | Required | Notes |
| --- | --- | --- |
| IČO | yes | 8 digits, numeric. Always visible. |
| Obchodní název | yes | Autofill `obchodniJmeno`. |
| DPH | yes | Segmented **Neplátce** / **Plátce**. |
| DIČ | no | Only when Plátce. Autofill when ARES returns it. |
| Sídlo / adresa | no | One field. Autofill `sidlo.textovaAdresa` (else obec). Stored in `employers.city` — no extra columns. |

### Kontaktní osoba

| Field | Required | Storage |
| --- | --- | --- |
| Jméno | yes | `employer_users.first_name` (side by side with příjmení on desktop) |
| Příjmení | yes | `employer_users.last_name` |
| Telefon | yes | `employer_users.phone`. Placeholder `+420 `. |
| Pracovní e-mail | yes | `employer_users.email` |

`employer_users.name` stays `"${firstName} ${lastName}"`. `employers.dic` is nullable (empty when Neplátce).

| Element | Copy |
| --- | --- |
| Title | Založení účtu firmy |
| CTA | Založit účet a poslat odkaz |
| Helper under CTA | Na e-mail pošleme přihlašovací odkaz. Heslo nepoužíváme. |
| Success | Zkontrolujte e-mail |
| Link | Už máte účet? Přihlásit se → `/firma/prihlaseni` |

Legal (tiny): souhlas s [obchodními podmínkami](/obchodni-podminky) a [zpracováním údajů](/gdpr).

## Copy bans (this surface)

Do not show: checksum, kontrolní součet, konzole serveru, lokální vývoj, stub, env var names, AI filler.
