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

Dev přihlášení firmy: na `/firma/prihlaseni` zadejte `novak@kovovyroba-novak.test`. Magic-link se vypíše do konzole serveru. Odkaz otevře potvrzovací stránku (prohlížeče odkazy přednačítají — token se spotřebuje až po kliknutí na **Vstoupit do firmy**).

Správa provozu (`/admin`, ne firemní portál): v `.env` nastavte `ADMIN_EMAILS=tomas@dilnajobs.test`, pak `npm run magic:admin` a potvrďte odkaz. Sondy: `GET /api/health` (živost), `GET /api/ready` (Postgres). Podrobnosti: [docs/OPS.md](docs/OPS.md).

Volitelné MinIO: `docker compose --profile storage up -d` a doplňte `S3_*` v `.env`.

## Stack

Next.js 15 App Router, TypeScript, Tailwind, PostgreSQL 16, Drizzle, passwordless magic-link pro firmy, S3-kompatibilní CVs.

Rozhodnutí: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), ADR [001](docs/adr/001-stack.md), [002](docs/adr/002-candidate-apply.md), [003](docs/adr/003-direct-employers.md). Co neděláme: [docs/anti-goals.md](docs/anti-goals.md). Bezpečnost: [SECURITY.md](SECURITY.md). Stuby: [docs/STUBS.md](docs/STUBS.md). Provoz a zdraví: [docs/OPS.md](docs/OPS.md). Nasazení: [docs/DEPLOY.md](docs/DEPLOY.md).

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
| `npm run magic:dev` | Dev magic-link pro `novak@kovovyroba-novak.test` |
| `npm run magic:admin` | Dev magic-link pro první adresu v `ADMIN_EMAILS` |
| `npm run worker` | Expirace inzerátů + heartbeat `job_expiry` |
| `npm run lint` / `typecheck` / `test` | CI kontroly |
| `npm run build` | produkční build |

## Produkční vs. stub

Hotové v1: veřejné stránky z DB, hledání/filtry/řazení, přihláška (Zod + rate limit), magic-link v dev, firma vidí jen svoje přihlášky (RLS), bezpečnostní hlavičky, audit log, liveness/readiness, admin konzole `/admin` (allowlist `ADMIN_EMAILS`).

Stuby (jasně označené v kódu i v [docs/STUBS.md](docs/STUBS.md)): e-mail bez Resend/SMTP, S3 pokud chybí klíče, Stripe Checkout pokud chybí `STRIPE_SECRET_KEY`, ARES ověření IČO, Sentry pokud chybí `SENTRY_DSN`.

## Phase 2: go-live checklist

Hotové v kódu: Stripe Checkout + webhook, Resend (SMTP záloha), liveness/readiness, admin `/admin`, Docker (Cloud Run) + Vercel cron, uptime JSON.

**Tomáš — ručně před spuštěním dilnajobs.cz**

1. Merge tohoto PR do `main` (PR #1 s MVP/admin už je sloučený).
2. Koupit / nasměrovat DNS `dilnajobs.cz` (+ `www`) na Vercel nebo Cloud Run.
3. Účet [Resend](https://resend.com): ověřit doménu, `RESEND_API_KEY`, `EMAIL_FROM`.
4. Účet [Stripe](https://stripe.com) (sandbox `sk_test_` / `whsec_`, webhook `https://dilnajobs.cz/api/stripe/webhook` → `checkout.session.completed`).
5. Postgres 16 (Neon / Cloud SQL) — `db:migrate`, `ADMIN_EMAILS`, `SESSION_SECRET` ≥ 32 znaků.
6. Uptime: import [monitoring/uptime.json](monitoring/uptime.json) do Better Stack / Checkly (`/api/health` 1 min, `/api/ready` 1 min, `/nabidky` 5 min).
7. `CRON_SECRET` + hourly expiry (Vercel Cron už v `vercel.json`, nebo Cloud Scheduler).
8. Volitelně Sentry + S3/R2 na CVčka (Cloud Run nesmí spoléhat na lokální disk).
9. IČO provozovatele do patičky / GDPR až bude právnická osoba.

Konfigurace a deploy: [docs/DEPLOY.md](docs/DEPLOY.md), [docs/OPS.md](docs/OPS.md).
