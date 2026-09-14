# DílnaJobs

Česká nástěnka práce pro výrobní a dílenské profese: CNC, svářeči, seřizovači, průmysloví elektrikáři, údržba. Cílová doména: [dilnajobs.cz](https://dilnajobs.cz).

Přímí zaměstnavatelé. Uchazeč se hlásí jménem a telefonem — účet není povinný.

## Rychlý start

```bash
cp .env.example .env
cp .env.example .env.local
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000).

Dev přihlášení firmy: na `/firma/prihlaseni` zadejte `novak@kovovyroba-novak.test`. Magic-link se vypíše do konzole serveru (e-mail je v1 stub).

Volitelné MinIO: `docker compose --profile storage up -d` a doplňte `S3_*` v `.env`.

## Stack

Next.js 15 App Router, TypeScript, Tailwind, PostgreSQL 16, Drizzle, passwordless magic-link pro firmy, S3-kompatibilní CVs.

Rozhodnutí: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), ADR [001](docs/adr/001-stack.md), [002](docs/adr/002-candidate-apply.md), [003](docs/adr/003-direct-employers.md). Co neděláme: [docs/anti-goals.md](docs/anti-goals.md). Bezpečnost: [SECURITY.md](SECURITY.md). Stuby: [docs/STUBS.md](docs/STUBS.md).

## Ceník (bez DPH)

| Balíček | Cena | Rozsah |
| --- | --- | --- |
| Zkušební | 0 Kč | 10 inzerátů / rok |
| Jednorázový | 2 990 Kč | 1 inzerát, 30 dní |
| Basic | 8 900 Kč / rok | 40 inzerátů |
| Standard | 19 900 Kč / rok | neomezeně |
| Top 7 dní | 1 350 Kč | zvýraznění existujícího inzerátu |

## Skripty

| Příkaz | Účel |
| --- | --- |
| `npm run dev` | Next.js (Turbopack) |
| `npm run db:migrate` | SQL migrace |
| `npm run db:seed` | ≥8 CZ výrobních nabídek |
| `npm run worker` | pg-boss (expirace + e-mail stub) |
| `npm run lint` / `typecheck` / `test` | CI kontroly |
| `npm run build` | produkční build |

## Produkční vs. stub

Hotové v1: veřejné stránky z DB, hledání/filtry/řazení, přihláška (Zod + rate limit), magic-link v dev, firma vidí jen svoje přihlášky (RLS), bezpečnostní hlavičky, audit log.

Stuby (jasně označené v kódu i v [docs/STUBS.md](docs/STUBS.md)): SMTP, S3 pokud chybí klíče, Stripe/GoPay checkout, ARES ověření IČO, první inzerát ke schválení operátorem.
