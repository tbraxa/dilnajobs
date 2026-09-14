# Stubs (v1)

Everything else is implemented against real Postgres. These integrations are **intentionally incomplete** and fail closed or log-only.

| Stub | Behaviour | Flip to production |
| --- | --- | --- |
| **Email / SMTP** | Magic-link and application notices print to server logs. `SMTP_URL` is unused. | Implement `src/lib/email/index.ts` with a provider. Keep tokens out of logs. |
| **S3 CVs** | If `S3_ACCESS_KEY` / `S3_SECRET_KEY` are empty, files go to `storage/cvs/`. Download still requires an employer session. | Set S3 env; `src/lib/storage/cv.ts` already has presign helpers. |
| **Stripe / GoPay** | Missing secrets → `FEATURE_PAYMENTS=false`. Checkout creates `orders.status = 'stub'` and tells the employer to contact us. | Set `STRIPE_SECRET_KEY` or GoPay keys; `src/lib/payments/index.ts`. |
| **ARES IČO** | Checksum + format only. `verification_status` stays `pending` until ops marks verified. | Call ARES in `src/lib/ico.ts` `verifyIcoViaAres`. |
| **First-post review** | New jobs from the portal are `pending_review`. Seed jobs are `published`. `FEATURE_AUTO_PUBLISH_FIRST_JOB` is a kill-switch, default false. | Ops UI or e-mail queue (not in v1). |
| **Employer notify on apply** | Public role cannot SELECT `employer_users`. Apply logs an e-mail stub instead. | Notify from a worker with admin URL. |
| **pg-boss worker** | Expiry can be run with `npm run worker`. Catalog also hides `expires_at < now()`. | Always-on worker process in deploy. |
| **SEO landings** | `/prace/[profese]/[mesto]` filters the same jobs table. No generated content mill. | Add unique intro copy per pair later. |

Search the repo for `STUB:` comments.
