# DílnaJobs / dilnajobs.cz - LOCKED Production MVP Spec

**Status:** LOCKED for production MVP  
**Working brand:** DílnaJobs · dilnajobs.cz (rebrand later)  
**Repo:** tbraxa/dilnajobs  
**Stack (given):** Next.js, Postgres with RLS, Vercel, magic-link employer auth  
**Date locked:** 2026-09-15  
**Owner:** Tomáš Braxatoris  

This document is the single source of truth for what ships in the first production MVP. Anything not listed under IN MVP is out of scope until explicitly unlocked.

---

## 1. Problem statement

Czech job seekers struggle to find clear, trustworthy openings across professions. Listings are often vague, spammy, or agency-driven. Employers struggle to reach serious applicants without drowning in low-signal boards or paying for opaque packages.

DílnaJobs is a dual-sided Czech job marketplace for **all professions**. It applies Airbnb-style trust and listing clarity to hiring:

- **Verified companies** (host analog): IČO / ARES where possible, direct employers preferred.
- **High-quality structured listings**: salary, location, contract type, requirements, and role clarity as first-class fields, not buried prose.
- **Clear dual-sided value**: seekers get scannable truth; employers get qualified applies with minimal friction.
- **Trust signals**: verification badge, structured completeness, anti-spam posting rules.
- **Less listing spam**: required fields, verification gate, no agency flood in MVP policy.

MVP success = a live responsive web product where a seeker can discover and apply, and an employer can register, verify, and post/edit jobs on a real Postgres path (plus a seed/demo path for demos and local work).

---

## 2. Target users

### 2.1 Job seeker (uchazeč)

- Anyone looking for work in Czechia across professions (blue-collar, white-collar, trade, office, services, tech, healthcare support, etc.).
- Prefers phone-first or short apply; may not want an account.
- Needs: working search + filters, readable job detail, one clear apply path, confidence the company is real.

**MVP behavior:** No mandatory seeker account. Apply with name + phone (+ optional e-mail + optional CV). Aligns with ADR-002.

### 2.2 Employer (zaměstnavatel)

- Direct hiring company (not recruitment agencies as primary customers; see ADR-003).
- Needs: register/login via magic link, post and edit structured jobs, see applications, company verification via IČO/ARES where possible.

**MVP behavior:** Employer is authenticated. Company profile tied to IČO. Jobs and applications isolated by Postgres RLS.

---

## 3. Scope lock

### IN MVP (must ship)

| Capability | Notes |
|------------|--------|
| Public search + filters that work | Query + primary filters return correct, paginated results from DB (or seed in demo mode) |
| Job detail | Structured listing page, SEO-friendly URL |
| Apply flow | Seeker apply without account; employer receives application |
| Employer register / login | Magic-link e-mail auth |
| Employer post / edit job | Structured form; publish and update |
| Company verification via IČO / ARES | Lookup and store legal name + status where ARES available; badge when verified |
| Seed demo + real DB path | `SEED`/`DEMO` mode for demos; production uses real Postgres |
| Responsive web | Mobile and desktop usable; tap targets adequate |

### OUT of MVP (explicitly deferred)

- In-app chat
- AI matching / AI recruiter
- Native iOS / Android apps
- Multi-language (Czech only for MVP UI/copy)
- Complex ATS sync
- Social feed
- Mega-menu content marketing site (no large editorial IA; keep nav lean)

Also remain out unless unlocked: payments depth beyond a simple placeholder if needed, candidate accounts, native apps, agency self-serve, complex analytics product.

---

## 4. Airbnb principles → product rules

| Airbnb idea | DílnaJobs MVP rule |
|-------------|--------------------|
| Verified hosts | Verified companies via IČO/ARES; badge on listing and company |
| Structured listings | Required fields before publish (title, location, contract type, description structure, salary or explicit “dohodou”) |
| Dual-sided value | Seeker: clarity + fast apply. Employer: verified presence + inbox of applies |
| Trust signals | Verification badge, listing completeness, “direct employer” framing |
| Reduce spam | Rate limits on post/apply; required IČO; ToS ban agencies; first-post review queue optional but allowed |

---

## 5. Page inventory and acceptance criteria

Routes below are the MVP surface. Lean nav only (no mega-menu content marketing).

### 5.1 Public

#### `/` - Home

**Purpose:** Land seekers on real jobs fast; clear employer CTA.  
**Acceptance:**

- Shows a small set of live (or seed) jobs immediately (at least 3 when data exists).
- Primary CTA to `/nabidky` (or equivalent search).
- Secondary CTA to employer entry (`/pro-firmy` or register).
- Responsive; no broken empty states when zero jobs (honest empty copy).
- No mega-menu content blocks required.

#### `/nabidky` - Search / listing index

**Purpose:** Working public search and filters.  
**Acceptance:**

- Text search against title / company / key fields works.
- At least these filters work: **profese/kategorie**, **kraj (or město/region)**, **mzda od** (or salary band), plus clear “reset filters”.
- Results update correctly (URL query params preferred for shareability).
- Pagination or “load more” works.
- Empty filter result shows clear Czech message.
- Cards show: title, company, location, salary signal, verification badge if verified.

#### `/nabidka/[slug]` - Job detail

**Purpose:** Airbnb-quality listing clarity.  
**Acceptance:**

- Structured sections visible without hunting: salary, location, contract type, requirements (bullets), description, company block.
- Verified company badge when applicable.
- Primary apply CTA visible above the fold on mobile.
- 404 for unknown slug.
- Shareable URL stable after edit (slug policy documented in open decisions if needed).

#### Apply (on job detail or `/nabidka/[slug]/prihlaseni`)

**Purpose:** Zero-friction seeker apply.  
**Acceptance:**

- Fields: jméno (required), telefon (required), e-mail (optional), CV upload (optional), short message (optional, capped).
- Consent checkbox for contact / GDPR (required).
- Submit creates Application row linked to Job; employer can see it.
- Success state: clear confirmation + “Ozvou se vám z firmy.” (or equivalent native Czech).
- Rate limited; basic validation (phone format CZ-friendly).
- Optional CV stored privately (presigned upload or equivalent); not public URL.

#### `/pro-firmy` - Employer landing (lean)

**Purpose:** Explain outcomes and drive register / post.  
**Acceptance:**

- Outcomes-first copy (not feature dump).
- CTA to register / post job.
- No mega-menu content marketing site; page stays short.

### 5.2 Employer (authenticated)

#### Register + magic-link login

**Purpose:** Employer account without password friction.  
**Acceptance:**

- Enter work e-mail → receive magic link → session cookie (HttpOnly, Secure, SameSite).
- Register collects: contact name, e-mail, company IČO (required), optional phone.
- Unauthenticated users cannot access employer dashboard routes.

#### Company verification (IČO / ARES)

**Purpose:** Trust gate analogous to verified hosts.  
**Acceptance:**

- On register or company setup: IČO input triggers ARES lookup when service available.
- Store: IČO, legal name, address fields available from ARES, verification status (`pending` | `verified` | `failed` | `manual`).
- If ARES down: allow save as `pending` / `manual`; do not block entire product.
- Verified badge shown on public job when status = `verified`.
- RLS: employer users only see/edit own company.

#### Post job

**Purpose:** Structured, anti-spam listings.  
**Acceptance:**

- Wizard or single form ≤ ~4 logical steps/sections.
- Required before publish: title, category/profession, location (město/kraj), contract type, description, salary amount **or** explicit “mzda dohodou”, apply settings default to on-platform apply.
- Draft save allowed.
- Publish creates public job visible in search when status = `published`.
- Completeness check warns before publish if critical fields missing.

#### Edit job

**Purpose:** Keep listings accurate.  
**Acceptance:**

- Owner can edit fields and re-publish.
- Unpublish / close job supported (at least status → `closed` or `unpublished`).
- Cannot edit another employer’s job (RLS enforced).

#### Applications inbox (minimal)

**Purpose:** Close the dual-sided loop.  
**Acceptance:**

- List applications for employer’s jobs: name, phone (click-to-call), e-mail if any, CV download if present, timestamp, job title.
- Mark as read optional but nice; not a blocker if status `new`/`seen` exists in schema.
- No chat in MVP.

### 5.3 System / ops (not full pages, but required)

- Seed script or seed mode populates demo companies + jobs + sample application.
- Production path uses real Postgres; migrations applied on deploy.
- Health-friendly deploy on Vercel; env for DB, auth secret, ARES, storage.

---

## 6. Data entities (MVP)

Minimal relational model. Names illustrative; implement with Drizzle/Prisma as in repo.

### Company

- `id`, `ico` (unique), `legal_name`, `display_name`, `address` (json or fields), `verification_status`, `ares_raw` (optional json), `created_at`, `updated_at`

### EmployerUser

- `id`, `email` (unique), `name`, `company_id`, `role` (`owner` | `member` sufficient), `created_at`, `last_login_at`

### Job

- `id`, `company_id`, `slug` (unique), `title`, `category`, `description`, `requirements` (text/array), `salary_min`, `salary_max`, `salary_currency` (CZK), `salary_type` (`monthly` | `hourly` | `negotiable`), `location_city`, `location_region`, `contract_type`, `status` (`draft` | `published` | `closed`), `published_at`, `created_at`, `updated_at`

### Application

- `id`, `job_id`, `applicant_name`, `phone`, `email` (nullable), `message` (nullable), `cv_storage_key` (nullable), `consent_at`, `status` (`new` | `seen`), `created_at`

### Auth / session

- Magic-link tokens (or provider-managed): one-time, expiry, bound to e-mail.
- Session store or signed cookie session referencing `EmployerUser`.

### Seed / demo

- Deterministic seed IDs for demo companies/jobs; flag or env `DEMO_SEED=true` for local/preview.

**RLS:** Employer-scoped policies on Company (own), Job (own company), Application (via job ownership). Public read for `published` jobs and verified public company fields only.

---

## 7. Success metrics (launch week)

Measure from go-live day 0 through day 7.

| Metric | Launch-week target | Why |
|--------|--------------------|-----|
| Public search usability | ≥ 90% of smoke-tested filter combos return correct results | Core seeker promise |
| Apply completion | ≥ 5 real or invited test applies end-to-end on production | Dual-sided loop works |
| Employer activation | ≥ 3 employers complete magic-link login + 1 published job each (can include founder-seeded real companies) | Supply side alive |
| Verification | ≥ 80% of published jobs show verified company **or** explicit pending state (no silent fake badges) | Trust |
| Uptime / errors | No Sev-1 outage > 1h; apply and auth error rate < 5% of attempts in logs | Production bar |
| Mobile | Core flows (search → detail → apply; login → post job) pass on a mid-range phone viewport | Responsive claim |
| Spam control | 0 unverified mass-post incidents; rate limits observed | Airbnb anti-spam |

Instrumentation MVP: basic event logs or analytics for `search`, `job_view`, `apply_submit`, `employer_login`, `job_publish`. Fancy funnel product is out.

---

## 8. Two-week build / go-live plan

Assume weekdays; adjust for Czech holidays if needed. Ship ASAP on existing repo; prefer finishing vertical slices over polishing OUT scope.

### Week 1 - Vertical slice to staging

**Day 1 - Lock + schema**

- Confirm this spec in repo (`docs/` or `/workspace` copy).
- Finalize Postgres schema + RLS policies for Company, EmployerUser, Job, Application.
- Migrations runnable locally and on staging DB.

**Day 2 - Auth + company**

- Magic-link employer register/login end-to-end on staging.
- Company create with IČO field; session guards on `/firma/*` routes.

**Day 3 - ARES + verification**

- ARES client (with timeout/fallback).
- Verification status + public badge wiring.
- Manual/pending path when ARES fails.

**Day 4 - Job post/edit**

- Employer post job (structured fields) + edit + publish/close.
- Slug generation; draft vs published.

**Day 5 - Public search + detail**

- `/nabidky` search + filters + query params from real DB.
- `/nabidka/[slug]` structured detail.
- Seed script for demo path verified.

**Day 6 - Apply flow**

- Apply form + persistence + employer inbox list.
- Optional CV upload to private storage; consent field.
- Rate limit apply + auth endpoints.

**Day 7 - Hardening slice**

- Empty states, validation messages in Czech, mobile pass on core pages.
- Fix RLS gaps; basic CSP/headers check.
- Staging demo script (seed + walkthrough).

### Week 2 - Production cut + launch

**Day 8 - Production env**

- Vercel production project, env secrets, production Postgres.
- Domain dilnajobs.cz DNS + HTTPS.
- Run migrations; disable unsafe demo flags in prod.

**Day 9 - Content + seed real supply**

- Seed or manually add real/partner jobs if available; otherwise high-quality demo clearly labeled only on preview.
- Lean `/` and `/pro-firmy` copy pass (native Czech, no calques).

**Day 10 - QA gate**

- Acceptance checklist from Section 5 green on production.
- Cross-browser smoke; mobile apply + employer post.
- Privacy notes / consent copy reviewed.

**Day 11 - Soft launch**

- Invite first employers; monitor auth e-mail delivery and apply submissions.
- Fix P0 only.

**Day 12 - Public push**

- Announce to first seeker/employer channels (founder-led).
- Watch metrics from Section 7.

**Day 13 - Stabilize**

- Patch filter bugs, ARES edge cases, slug collisions.
- Confirm backups / restore note for Postgres.

**Day 14 - Launch-week review**

- Score metrics; list P1 backlog.
- Freeze MVP scope; anything new goes to post-MVP decisions.

---

## 9. Open decisions for Tomáš (max 5)

1. **Brand (first):** Keep public name **DílnaJobs** through MVP launch, or soft-launch under a clearer all-professions name while keeping dilnajobs.cz / repo? (Rebrand later is already allowed; decide what users see on day 0.)
2. **Agency policy enforcement:** Hard block at register (reject known agency signals) vs ToS + manual review only for MVP?
3. **Salary field strictness:** Require numeric salary for publish, or allow “mzda dohodou” without friction (recommended default: allow dohodou but show it clearly on cards)?
4. **CV storage provider:** Which S3-compatible bucket in production (and AV scan now vs later)?
5. **First-post moderation:** Auto-publish after IČO verified, or manual approve first job per company?

---

## 10. Non-negotiables (LOCKED)

- Ship on **tbraxa/dilnajobs** (Next.js, Postgres RLS, Vercel, magic-link employer auth).
- **All professions** in taxonomy/filters (not manufacturing-only product lock for MVP positioning), even if early content leans technical.
- Seekers apply **without** mandatory account.
- Employers are the authenticated side.
- **No** chat, AI matching, native apps, multi-language, complex ATS sync, social feed, or mega-menu content marketing site in MVP.
- Czech UI copy; clear and precise.
- Airbnb-quality: verified companies, structured listings, trust signals, anti-spam posture.

---

## 11. Definition of Done (MVP)

Production on dilnajobs.cz (or agreed production URL) where:

1. Seeker can search, filter, open a job, and apply successfully.
2. Employer can magic-link login, verify company via IČO/ARES (or pending path), post and edit a job, and see applications.
3. Seed/demo path works for demos; production uses real DB.
4. Responsive web passes mobile core flows.
5. Launch-week metrics instrumentation exists at a basic level.
6. OUT-of-scope items are not started.

**Spec status: LOCKED.** Changes require an explicit unlock by Tomáš.
