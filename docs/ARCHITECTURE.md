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
  ├─ employer txn: SET LOCAL app.employer_id + RLS
  └─ admin txn: SET LOCAL app.is_admin = true + RLS
        │
        ▼
PostgreSQL 16
  tables + FORCE ROW LEVEL SECURITY on employer data
        │
        ├─ local disk or S3-compatible (CVs)
        └─ Resend / SMTP / Stripe / S3
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
| `/admin/prihlaseni` | public (allowlist) | operator magic-link request |
| `/admin` | admin cookie `dj_admin` | health rollup, counts, recent audit |
| `/admin/health` | admin | live deep health cards |
| `/admin/employers` | admin | verify / reject / flag agency |
| `/admin/jobs` | admin | publish / reject / unpublish |
| `/admin/applications` | admin | cross-tenant list (phone masked) |
| `/admin/audit` | admin | `audit_events` |
| `/admin/settings` | admin | read-only integration flags |
| `GET /api/health` | public | liveness |
| `GET /api/ready` | public | Postgres readiness |
| `GET /api/admin/health` | admin | deep health JSON |
| `POST /api/stripe/webhook` | Stripe signature | mark order paid, grant plan credits |
| `GET/POST /api/cron/job-expiry` | `CRON_SECRET` | expire ads + heartbeat |

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

Helper: `withEmployerRls()` in `src/db/rls.ts`. Operator queries use `withAdminRls()` (`SET LOCAL app.is_admin = 'true'`). Admin policies (migration `0004`) allow SELECT across tenants and UPDATE of employers/jobs. Public catalog does not set a GUC; policies allow `SELECT` of published jobs and `INSERT` of applications. Auth lookups (`employer_user_by_email`, `session_by_token_hash`) are `SECURITY DEFINER` so login works without opening `employer_users` to the public role.

An employer session cookie cannot satisfy admin routes. Admin magic-link tokens have `purpose = 'admin'` and are rejected by the employer login consumer.

`FORCE ROW LEVEL SECURITY` is on so the table owner (app role) cannot skip policies.

## Auth

Passwordless. Employer types email (+ IČO on first registration). Server stores `sha256(token)` in `magic_tokens` with `purpose = employer`, e-mails a single-use link (15 min). Session cookie `dj_session`: HttpOnly, SameSite=Lax, Secure in production, Path=/, 14 days.

Operator (`ADMIN_EMAILS`): separate magic-link (`purpose = admin`) and cookie `dj_admin`. Same cookie flags. No privilege escalation from `/firma`.

Candidates have no account in v1.

## Files

CVs are private. Object keys are `cv/<uuid>/<hex>.<ext>` — not guessable. Download is an authenticated employer route (short-lived S3 presign, or local stream). MIME allowlist + 5 MiB cap.

## Jobs / payments

pg-boss (or `npm run worker`) expires published jobs past `expires_at` and sends email stubs.

Stripe Checkout is behind `STRIPE_SECRET_KEY`. Missing key → documented stub order. Webhook `POST /api/stripe/webhook` verifies `Stripe-Signature` and calls `fulfill_paid_order`. GoPay is not used.

## Logging

JSON lines via `src/lib/logging.ts` plus `x-request-id`. No raw magic-link tokens, no CV bytes, no session secrets. Audit trail in `audit_events`. Optional Sentry behind `SENTRY_DSN`. Probes: [docs/OPS.md](OPS.md).
