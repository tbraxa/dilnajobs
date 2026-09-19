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
- Design SoT: `design-direction-v6-typesafe-wellfound.md` · `design-nabidky-v6-wellfound.md`
- Unauthenticated protected `/ucet/*` → `/ucet/prihlaseni`
- Guest apply stays; account optional
- SoT: `LAUNCH-SLICE-TODAY-SEEKER.md`

## Brand (display, soft-lock)
- Display name: **FairJobs**
- Target domain: fairjobs.cz (register ASAP; not done)
- Temp: dilnajobs.cz / repo tbraxa/dilnajobs
- Claim: „Práce v Česku. Od firem.“
- OpenJobs is dead


## Filter UX (hard)
- Listing-first on `/nabidky`.
- Default: horizontal chips / pill bar; depth in drawer or modal („Upravit filtry“).
- **Banned:** sticky filter pane eating ~half laptop viewport while SERP scrolls.
- Full product SoT: FULL-PRODUCT-SPEC.md

## Pricing route
- `/cenik` IN for final product (plus summary on `/pro-firmy`).


## Nav (2026-09-16)
- SoT: `UX-NAV-MEGA.md`
- Top: Nabídky · Průvodce (smart mega) · Pro firmy · Vytvořit životopis · **Přihlásit se** (`/ucet`) · Přihlášení firem
- Visual: Design v6 TypeSafe×Wellfound×Jobs.cz
- Mega: Poradna | Kurzy | Nástroje + rail (CV / firmy / featured)
- HP body above footer: Poradna + Kurzy + Nástroje required
- `/zivotopis` P1 = FairJobs-owned builder shell (not bounce-only partner)
