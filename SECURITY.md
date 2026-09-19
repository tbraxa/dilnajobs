# Security

FairJobs handles candidate CVs and phone numbers (special-category-adjacent employment data) and employer accounts. Target: **OWASP ASVS L2** for v1 controls we can actually enforce in code.

## Threat model (light)

| Asset | Threat | Control in v1 |
| --- | --- | --- |
| Session | theft / XSS | HttpOnly SameSite cookies (`dj_session`, `fj_seeker_session`, `dj_admin`), CSP nonces, no `document.cookie` |
| Admin | employer session used as operator | Separate cookie + `ADMIN_EMAILS` allowlist + `purpose` on magic tokens; RLS `app.is_admin` |
| Magic link | stuffing / replay | hashed token, 15 min, single use, rate limit per e-mail and IP |
| Applications / CVs | IDOR, public bucket | unguessable keys, private storage, employer RLS, auth’d download |
| Jobs | agency spam, XSS in description | IČO path, first-post review, HTML not rendered as markup (text) |
| Apply / login | abuse | rate limits, Zod, honeypot field |
| CSRF | forged mutation | Middleware Origin / Fetch Metadata gate, Next Origin check, SameSite=Lax, `allowedOrigins` |
| SQL | injection | Drizzle parameterized queries; `SET LOCAL` via bound `set_config` |
| Secrets | leak to client | no `NEXT_PUBLIC_` secrets; `.env.example` has placeholders only |

Trust boundary: Next.js server is the only database client. Browsers never get a DB URL or S3 secret.

## ASVS L2 checklist (v1)

- [x] V2 — no passwords; magic-link with hashed secrets, TTL, one-time use
- [x] V3 — session cookie flags; logout drops server row + cookie
- [x] V4 — employer access via `app.employer_id` + FORCE RLS; operator via `app.is_admin` (not the employer cookie)
- [x] V5 — Zod on apply, auth, job create, query params
- [x] V7 — structured logs; no secrets; `audit_events`
- [x] V8 — private CVs; MIME allowlist; size cap; no guessable URLs
- [x] V9 — communication: HSTS in production; Secure cookies in production
- [x] V13 — Server Actions CSRF; rate limits on apply / magic-link / upload
- [x] V14 — security headers (CSP, frame deny, nosniff, referrer, permissions)
- [ ] V6 — encryption at rest: rely on Postgres/S3 provider (document in deploy)
- [ ] V10 — malicious file content scanning (ClamAV etc.) not in v1
- [ ] V11 — separate WAF; deploy concern

## GDPR notes

- Legal basis for apply: **consent** + steps prior to contract (employer may hire).
- Data: name, phone, optional e-mail, optional CV, optional message, IP hash, timestamp, job id.
- Retention v1: applications kept until employer deletes or 12 months after job expiry (ops job stub).
- Candidate can manage profile and favorites in `/ucet`; erasure requests go to `soukromi@fairjobs.cz`.
- Do not log raw IP or CV contents. IP is SHA-256 with `SESSION_SECRET` pepper.

## Reporting

E-mail security issues to `security@fairjobs.cz`. Do not open public GitHub issues with exploit details.
