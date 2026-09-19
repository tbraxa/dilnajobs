# Path locks (Product)

Date: 2026-09-19 (seeker auth unlocked for launch)
Authority under: FULL-PRODUCT-SPEC.md · LAUNCH-SLICE-TODAY-SEEKER.md

## 1. Apply surface
- Primary: inline on `/nabidka/[slug]` (same-page section; sticky mobile CTA OK).
- Deep link: `/nabidka/[slug]/prihlaseni` with the same form.
- No modal.

## 2. Public trust block
- Cards: display name + verified badge only.
- Detail company block: display name (+ legal name if different), verified badge when verified, IČO shown.
- No fake verified badges; pending = honest pending/none.

## 3. Employer auth routes
- `/firma/prihlaseni` login (nav „Přihlášení firem“)
- `/firma/registrace` register (IČO required)
- App: `/firma/...` (dashboard, jobs, applications)
- Unauthenticated protected `/firma/*` (except prihlaseni/registrace) → `/firma/prihlaseni`
- Legacy `/prihlaseni` and `/registrace` are **retired** (do not ship)

## 4. Seeker auth routes (UNLOCKED 2026-09-19)
- `/ucet/prihlaseni` · `/ucet/registrace`
- App: `/ucet` / `/ucet/prehled`, `/ucet/profil`, `/ucet/oblibene`, `/ucet/prihlasky`
- Unauthenticated protected `/ucet/*` → `/ucet/prihlaseni`
- Guest apply stays; account optional

## Brand (display, soft-lock)
- Display name: **FairJobs**
- Target domain: fairjobs.cz
- Temp: dilnajobs.cz / repo tbraxa/dilnajobs
- Claim: „Práce v Česku. Od firem.“

## Filter UX (hard)
- Listing-first on `/nabidky`.
- Default: horizontal chips / pill bar; depth in drawer or modal.
- **Banned:** sticky filter pane eating ~half laptop viewport while SERP scrolls.

## Pricing route
- `/cenik` IN for final product (plus summary on `/pro-firmy`).

## Nav
- Top: Nabídky · Průvodce · Pro firmy · Vytvořit životopis · **Přihlásit se** (`/ucet`) · Přihlášení firem
