# Architecture — DílnaJobs v1

Small Next.js App Router service. Boring boundaries. One PostgreSQL database.

## Runtime shape

```
Browser
  │  RSC / Server Actions (Origin-checked)
  ▼
Next.js 15 (Node)
  │  Drizzle + postgres.js
  ├─ public catalog (published jobs)
  ├─ apply insert (candidate, no account)
  └─ employer txn: SET LOCAL app.employer_id + RLS
        │
        ▼
PostgreSQL 16
  tables + FORCE ROW LEVEL SECURITY on employer data
        │
        ├─ local disk or S3-compatible (CVs)
        └─ pg-boss (expiry, email stub)
```

## Route map

| Path | Auth | Source |
| --- | --- | --- |
| `/` | public | featured published jobs |
| `/nabidky` | public | search / filter / sort from DB |
| `/nabidka/[slug]` | public | job + apply form |
| `/pro-firmy` | public | B2B + ceník |
| `/prace/[profese]/[mesto]` | public | SEO stub landing, same search |
| `/gdpr`, `/obchodni-podminky` | public | legal |
| `/firma/prihlaseni` | public | magic-link request |
| `/firma/prihlaseni/overit` | token | sets session cookie |
| `/firma` | employer | dashboard, own jobs |
| `/firma/nabidky/nova` | employer | create job |
| `/firma/nabidky/[id]/prihlasky` | employer | applications + CV download |

## Data

Employer-scoped: `employers`, `employer_users`, `jobs`, `applications`, `orders`, `audit_events`.

Two database roles:

- `DATABASE_ADMIN_URL` (`dilna`) — superuser for migrate, seed, worker expiry.
- `DATABASE_URL` (`dilna_app`) — non-superuser app role. RLS applies. Next.js uses only this.

Auth: `magic_tokens`, `sessions` (hashed secrets, never raw).

Catalog: `packages`. Rate limit log: `rate_limit_events`.

## RLS

See migration `drizzle/0001_init.sql`. Employer queries run inside a transaction:

```sql
SELECT set_config('app.employer_id', '<uuid>', true); -- SET LOCAL
```

Helper: `withEmployerRls()` in `src/db/rls.ts`. Public catalog does not set the GUC; policies allow `SELECT` of published jobs and `INSERT` of applications.

`FORCE ROW LEVEL SECURITY` is on so the table owner (app role) cannot skip policies.

## Auth

Passwordless. Employer types email (+ IČO on first registration). Server stores `sha256(token)` in `magic_tokens`, e-mails a single-use link (15 min). Session cookie `dj_session`: HttpOnly, SameSite=Lax, Secure in production, Path=/, 14 days.

Candidates have no account in v1.

## Files

CVs are private. Object keys are `cv/<uuid>/<hex>.<ext>` — not guessable. Download is an authenticated employer route (short-lived S3 presign, or local stream). MIME allowlist + 5 MiB cap.

## Jobs / payments

pg-boss (or `npm run worker`) expires published jobs past `expires_at` and sends email stubs.

Stripe Checkout or GoPay is behind env keys. Missing keys → documented stub order.

## Logging

JSON lines via `src/lib/logging.ts`. No raw magic-link tokens, no CV bytes, no session secrets. Audit trail in `audit_events`.
