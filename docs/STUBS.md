# Stubs (v1)

Everything else is implemented against real Postgres. These integrations are **intentionally incomplete** and fail closed or log-only.

| Stub | Behaviour | Flip to production |
| --- | --- | --- |
| **Email** | No `RESEND_API_KEY` and no `SMTP_URL` → magic-link and application notices print to the server console. | Set `RESEND_API_KEY` + `EMAIL_FROM` (primary). Fallback: `SMTP_URL=smtp://user:pass@host:587`. |
| **S3 CVs** | If `S3_ACCESS_KEY` / `S3_SECRET_KEY` are empty, files go to `storage/cvs/`. Download still requires an employer session. | Set S3 env; `src/lib/storage/cv.ts` already has presign helpers. |
| **Stripe** | Missing either Stripe secret or webhook secret → checkout creates `orders.status = 'stub'`; no payment can be stranded without fulfillment. | Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`. Endpoint: `POST /api/stripe/webhook`. |
| **ARES IČO** | Checksum + format only. `verification_status` stays `pending` until ops marks verified. | Call ARES in `src/lib/ico.ts` `verifyIcoViaAres`. |
| **First-post review** | New jobs from the portal are `pending_review`. Moderate at `/admin/jobs`. `FEATURE_AUTO_PUBLISH_FIRST_JOB` default false. | Leave the flag false in production. |
| **Job expiry** | Catalog hides `expires_at < now()`. Heartbeat via `npm run worker` or `GET/POST /api/cron/job-expiry` (`CRON_SECRET`). | Vercel Hobby: daily 04:00 UTC. Hourly needs Pro / Cloud Scheduler. See `docs/OPS.md`. |
| **Sentry** | Empty `SENTRY_DSN` → no SDK init. `captureException` still writes structured logs. | Set `SENTRY_DSN`. |
| **SEO landings** | `/prace/[profese]/[mesto]` filters the same jobs table. No generated content mill. | Add unique intro copy per pair later. |

GoPay is **not** implemented. Search the repo for `STUB:` comments.
