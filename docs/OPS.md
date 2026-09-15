# Operations — DílnaJobs

How to know the service is up, what is stubbed, and how the operator signs into `/admin`.

## Uptime monitors

Hit these from the load balancer / uptime robot. They are **public**.

| Probe | Meaning | Success | Failure |
| --- | --- | --- | --- |
| `GET /api/health` | Liveness. Process is up. **No database, no I/O.** | `200` `{ "status": "ok" }` | Process down (connection error) |
| `GET /api/ready` | Readiness. `SELECT 1` against Postgres, timeout ≤ 1.5 s. | `200` `{ "status": "ok", "postgres": { "ok": true, "latencyMs": n } }` | `503` if Postgres is down or slow |

Do **not** point public monitors at `/api/admin/health`. That route requires the operator cookie `dj_admin`, is rate-limited (60/min per IP), and enumerates internals.

Importable check list: [`monitoring/uptime.json`](../monitoring/uptime.json).

### Suggested schedule (Better Stack / Checkly / any HTTP monitor)

| Check | Interval | Expect |
| --- | --- | --- |
| `GET /api/health` | 1 min | `200` `{ "status": "ok" }` |
| `GET /api/ready` | 1 min | `200` and `postgres.ok === true` (timeout 5 s) |
| `GET /nabidky` | 5 min | `200` HTML containing `OpenJobs` |

Ready is a short `SELECT 1`. It does not assume a background worker. Expired ads are already hidden in the catalog even if expiry cron is late.

## Deep health (admin only)

`GET /api/admin/health` and the page `/admin/health` return a structured report. Each check:

```json
{ "name": "postgres", "status": "ok|degraded|down|unconfigured", "latencyMs": 4, "detail": "…", "checkedAt": "…" }
```

No connection strings, tokens, or secret values appear in `detail`.

### Status meaning

| Status | Meaning |
| --- | --- |
| **ok** | Check passed. |
| **degraded** | Optional piece is failing, stale, or last error is set. Service can still serve catalog/apply. |
| **down** | Check failed. Overall rollup is **down** only when **postgres** or **auth** is down. |
| **unconfigured** | Integration is a documented stub (missing env). Expected in local dev. |

Overall rollup: `ok` if every check is ok; `degraded` if something is unconfigured/degraded/optionally down; `down` if Postgres or the magic-link/auth subsystem is down.

### Checks

| Name | What it does |
| --- | --- |
| postgres | `SELECT 1` |
| migrations | `schema_migrations` contains 0001–0004 |
| object_storage | S3 keys present, **or** write+delete a probe file under `storage/cvs/` |
| cv_disk | Same path as local CV storage (only when S3 is off) |
| mailer | Resend / SMTP configured? last send error? else console stub |
| payments | Stripe Checkout + webhook secret vs stub |
| worker | `system_heartbeats.job_expiry` — `npm run worker` or `/api/cron/job-expiry`. Missing → unconfigured. Older than 26 h → degraded. |
| rate_limiter | can read `rate_limit_events` |
| auth | `magic_tokens` readable + `employer_user_by_email` + `SESSION_SECRET` length |
| sentry | `SENTRY_DSN` present vs log-only |

## Error tracking

- Structured JSON logs (`src/lib/logging.ts`) include `requestId` (`x-request-id` from middleware, echoed on the response).
- Failed apply / magic-link / CV upload / payment stub: `captureException` + `audit_events` where the failure is security-relevant.
- **Sentry:** set `SENTRY_DSN`. If empty, Sentry is not initialized (`src/instrumentation.ts`) and `captureException` only logs. No PII / tokens in extras.

## Admin dashboard

Path `/admin` is the **platform operator** console (Tomáš). It is not the employer portal `/firma`.

### Auth

- Allowlist: `ADMIN_EMAILS` (comma-separated, lowercased). Empty list → nobody can sign in.
- Magic-link only to those addresses. Unknown addresses still get a generic “if you are on the list…” response (no enumeration).
- Cookie `dj_admin`: HttpOnly, SameSite=Lax, Secure in production, Path=/. Separate from employer `dj_session`. An employer session cannot call admin APIs.
- Confirm page + POST `/admin/prihlaseni/overit/akce` (Origin check) so prefetch cannot burn the token.
- RLS: `withAdminRls()` runs `SET LOCAL app.is_admin = 'true'`. Policies on employers/jobs/applications/orders/audit allow admin SELECT (and UPDATE on employers/jobs). Documented in `drizzle/0004_admin_ops.sql`. The app role still cannot skip FORCE RLS.

### Local bootstrap

```bash
# .env and .env.local
ADMIN_EMAILS=tomas@dilnajobs.test

npm run db:migrate   # applies 0004_admin_ops.sql
npm run db:seed
npm run magic:admin  # prints http://localhost:3000/admin/prihlaseni/overit?token=…
```

Open the URL, click **Vstoupit do správy**. Seed also has a pending employer and a `pending_review` job so the lists are not empty.

Alternatively request a link at `/admin/prihlaseni` with `tomas@dilnajobs.test` and copy it from the server console (email stub).

### Worker / cron (job expiry)

Catalog already hides `expires_at < now()`. The worker still marks rows `expired` and writes a heartbeat.

**Local / Cloud Run Job**

```bash
npm run worker
```

Uses `DATABASE_ADMIN_URL` if set, otherwise `DATABASE_URL`. Calls SQL `expire_published_jobs()` (migration `0005`).

**Serverless (Vercel Cron, Cloud Scheduler)**

`GET` or `POST /api/cron/job-expiry` with `Authorization: Bearer $CRON_SECRET`.

Vercel: `vercel.json` runs `/api/cron/job-expiry` once daily at 04:00 UTC (`0 4 * * *`). **Hobby** allows at most one cron invocation per day — hourly (`0 * * * *`) will fail the deploy. Use **Pro** (or Cloud Scheduler) if you need hourly. Set `CRON_SECRET` in the project env. The public catalog already hides expired ads even if the sweep is daily.

Cloud Scheduler example:

```bash
gcloud scheduler jobs create http dilnajobs-expiry \
  --schedule="0 * * * *" \
  --uri="https://dilnajobs.cz/api/cron/job-expiry" \
  --http-method=GET \
  --headers="Authorization=Bearer $CRON_SECRET" \
  --time-zone="Europe/Prague"
```

## What not to expose

- Never put `/api/admin/*` on a public health check.
- Never log raw magic-link tokens, session cookies, CVs, or `DATABASE_URL`.
- `robots.txt` disallows `/admin/`, `/firma/`, `/api/`. Admin pages send `noindex`.
