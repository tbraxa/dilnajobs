# Deploy: FairJobs

Two supported hosts. Same Next.js app. Postgres is required either way.

## Environment (production)

Required:

| Variable | Notes |
| --- | --- |
| `APP_URL` | Public origin, no trailing slash (`https://dilnajobs.cz`). **Optional on the first Vercel build** — empty/`unset` falls back to `https://$VERCEL_URL` then `http://localhost:3000` so `next build` does not throw `ERR_INVALID_URL`. Set this to the real domain after DNS and redeploy (magic-link, Stripe return URLs, origin checks). |
| `DATABASE_URL` | `dilna_app` role, RLS on |
| `DATABASE_ADMIN_URL` | superuser — migrate/seed only, not the web process |
| `SESSION_SECRET` | ≥32 chars |
| `ADMIN_EMAILS` | operator allowlist |

Recommended:

| Variable | Notes |
| --- | --- |
| `RESEND_API_KEY` | magic-link + apply notices |
| `EMAIL_FROM` | verified domain in Resend |
| `STRIPE_SECRET_KEY` | `sk_test_…` until go-live |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` for `/api/stripe/webhook` |
| `CRON_SECRET` | Bearer token for `/api/cron/job-expiry` |
| `SENTRY_DSN` | optional |
| `S3_*` | optional; else local disk (not for Cloud Run) |

Never commit secrets. No `NEXT_PUBLIC_` secrets.

Blank Vercel dashboard fields are stored as `""`, not unset. Empty strings are treated as missing (defaults apply). Do not leave numeric keys like `SESSION_DAYS` / `MAGIC_LINK_MINUTES` / `CV_MAX_BYTES` as empty if you set them — omit the key, or set a positive integer. Redeploy **latest `main`**; do not retry an old failed deployment SHA.

## Vercel

1. Import the GitHub repo. Framework: Next.js (no extra `vercel.json` build config).
2. Attach a Postgres instance (Neon / RDS / Cloud SQL via VPC). **Do not run migrations inside `next build`** — that broke Vercel Hobby. After the app is live:
   - GitHub → Actions → **Migrate** → Run workflow (repo secrets `DATABASE_URL` and/or `DATABASE_ADMIN_URL`), or
   - locally: `DATABASE_URL=… npm run db:migrate` (`node scripts/migrate.mjs`, idempotent), or
   - Neon SQL editor: run `drizzle/*.sql` in filename order.
   Until tables exist, `/` shows a Czech setup message instead of a 500.
3. First Vercel deploy can succeed with only `DATABASE_URL` + `SESSION_SECRET` (≥32 chars). Optional `SEED_ON_DEPLOY=true` is only for `npm run db:seed` (skips if employers already exist). After DNS, set `APP_URL=https://dilnajobs.cz` (no trailing slash) and redeploy.
4. Redeploy **latest `main`**. Do not retry an old failed SHA. Empty catalog (no ads) is a valid empty state.
5. Set remaining env vars above. `vercel.json` schedules `GET /api/cron/job-expiry` once daily at **04:00 UTC** (`0 4 * * *`). Hobby plans only allow at most one cron run per day; Vercel Pro is required for hourly. Set `CRON_SECRET` — Vercel sends `Authorization: Bearer $CRON_SECRET`. The catalog already hides `expires_at < now()`, so a daily sweep is enough on Hobby.
6. Stripe webhook URL: `https://<prod>/api/stripe/webhook` (raw body, signature verified).
7. `/api/health` and `/api/ready` are serverless: liveness has no DB; ready is `SELECT 1` with a 1.5s timeout. The web process does **not** run the expiry worker.

## Cloud Run

```bash
docker build -t dilnajobs .
# push to Artifact Registry, then:
gcloud run deploy dilnajobs \
  --image … \
  --region europe-west1 \
  --port 8080 \
  --set-env-vars APP_URL=https://dilnajobs.cz,NODE_ENV=production \
  --set-secrets DATABASE_URL=dilna-db-url:latest,SESSION_SECRET=dilna-session:latest
```

Image is Next.js `standalone` (`NEXT_OUTPUT=standalone` at build). Cloud SQL: use the Unix socket in `DATABASE_URL` or Auth Proxy. Run `npm run db:migrate` against Cloud SQL once before traffic hits `/`.

**Expiry:** Cloud Scheduler → HTTP `POST https://…/api/cron/job-expiry` with `Authorization: Bearer $CRON_SECRET` (hourly is fine here; Vercel Hobby cannot). Alternatively a Cloud Run Job:

```bash
gcloud run jobs execute dilnajobs-expiry --command npm --args=run,worker
```

The Job needs `tsx` + source or the same `expire_published_jobs()` SQL; the HTTP cron on the web service is the simpler path.

CVs: do not use `storage/cvs/` on Cloud Run (ephemeral). Set S3/R2.

## Health after deploy

- Monitor `GET /api/health` (1 min) and `GET /api/ready` (1 min). Config: `monitoring/uptime.json`.
- `/api/ready` failing while `/api/health` is 200 means Postgres, not the Node process.
