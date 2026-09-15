# Competitive Research: Enterprise Dual-Sided Job Marketplace (Czech-first MVP)

**Scope:** Indeed, LinkedIn Jobs, Glassdoor, ZipRecruiter, StepStone, Welcome to the Jungle / Otta, Wellfound, Jobs.cz, Prace.cz, StartupJobs.cz, Profesia.sk, Greenhouse / Lever public boards  
**Date:** 2026-09-15  
**Ambition:** Airbnb-of-jobs, all professions, CZ-first  

---

## 1) Top 10 MUST-copy UX/IA patterns

| # | Pattern | Evidence | Why copy |
|---|---|---|---|
| 1 | **Preference-first discovery** (titles, pay, commute, remote, schedule, hide-rules) | Indeed preferences + filters: https://www.indeed.com/help/job-seekers/articles/32603395892109-adding-or-editing-job-search-preferences ; https://www.indeed.com/career-advice/finding-a-job/tips-on-how-to-get-better-search-results-on-indeed.com | Reduces noise before search; match chips on job cards train both sides. Critical for all-professions marketplace. |
| 2 | **On-platform apply with stored profile + short screening questions** | LinkedIn Easy Apply: https://www.linkedin.com/help/linkedin/answer/a512388 ; https://www.linkedin.com/help/linkedin/answer/a517777 | Conversion collapses when users leave to ATS. Keep apply on-site; allow 3–8 knockout questions. |
| 3 | **Salary as first-class filter and listing field** | Indeed pay filter/preferences; Prace.cz claims +30% views / +8% replies with wage listed: https://www.prace.cz/firmy/ ; Profesia salary compare CTA: https://www.profesia.sk/ | In CZ, wage omission kills relevance. Upcoming EU/CZ pay transparency pressure makes this a moat, not a nice-to-have. |
| 4 | **Rich company pages (culture, media, team, values) tied to every job** | WTTJ: https://www.welcometothejungle.com/en ; https://www.welcometothejungle.com/en/jobs ; Jobs.cz employer gallery: https://www.jobs.cz/ ; StartupJobs company profile in ad price: https://www.startupjobs.cz/pro-firmy | Airbnb of jobs means choosing the *place*, not only the *role*. Company object must be as strong as job object. |
| 5 | **Two-way matching: seeker prefs + employer invite-to-apply** | ZipRecruiter invite/matching narrative: https://careercloud.com/ziprecruiter-review/ ; WTTJ “let jobs come to you”: https://www.welcometothejungle.com/en/jobs ; Wellfound “companies come find you”: https://wellfound.com/ | Dual-sided liquidity: passive seekers + active employers. Pure inbound boards lose Airbnb dynamics. |
| 6 | **Structured job taxonomy: department / workplace type / location** | Greenhouse Airbnb board: https://job-boards.greenhouse.io/airbnb ; API metadata (`Workplace Type`, location): `https://boards-api.greenhouse.io/v1/boards/airbnb/jobs` ; Lever URL filters `?department=` / `?location=`: e.g. https://jobs.lever.co/quenchwater?location=Boston%2C+MA | Seekers browse by team and work mode. Flat keyword search alone fails at scale. |
| 7 | **Application status + response expectation** | ZipRecruiter “Be Seen First” + hearing-back framing: https://www.ziprecruiter.com/ ; Otta/WTTJ “jobs that don’t get ghosted”: https://us.welcometothejungle.com/ | Trust = knowing what happens after apply. Ghosting destroys marketplace NPS. |
| 8 | **Tiered employer packages: duration + bump + logo + CV credits + email blast** | Profesia.sk MINI/STANDARD/PREMIUM + CV unlock: https://www.profesia.sk/en/price-list ; Prace.cz Start/Basic/Plus/Ultimate + topování: https://www.prace.cz/firmy/ ; StartupJobs Start/Extra/Premium: https://www.startupjobs.cz/pro-firmy | CZ buyers already understand this SKU. Copy the IA; undercut on price and outcome metrics. |
| 9 | **One-post, multi-surface distribution + light ATS hub** | Alma Career Teamio as post/manage hub for Jobs.cz + Prace.cz: https://www.prace.cz/firmy/ ; https://cz.teamio.com/ ; ZipRecruiter multi-board distribution model | Employers hate re-posting. MVP needs one console even if inventory is only yours at first. |
| 10 | **Public, filterable careers board with clear workplace labels** | Greenhouse default board UX: https://job-boards.greenhouse.io/airbnb ; Voyse summary of GH segmentation: https://www.voyse.co.uk/insights/how-to-improve-your-greenhouse-careers-page/ | Enterprise employers will demand branded boards later. Design job schema (dept, office, hybrid/remote) compatible with Greenhouse/Lever from day one. |

---

## 2) Top 10 anti-patterns to avoid

1. **External apply redirect as default**  
   LinkedIn “Apply” vs Easy Apply split: https://www.linkedin.com/help/linkedin/answer/a512388  
   *Effect:* Drop-off, duplicate profiles, zero status tracking. Use external apply only as explicit fallback.

2. **Glassdoor-style “give to get” content walls**  
   https://help.glassdoor.com/s/article/Give-to-get-policy?language=en_US ; user backlash examples widely reported  
   *Effect:* Junk reviews, distrust. For MVP, never gate core salary/company truth behind forced submissions.

3. **One-click apply without quality signals**  
   ZipRecruiter 1-Click + SmartRecruiters critique of spam applications: https://www.smartrecruiters.com/resources/glossary/1-click-apply/  
   *Effect:* Employer spam, seeker black hole. Require intent note or 2–3 screens + response SLA.

4. **Opaque pricing and “promote or die” free posts**  
   LinkedIn free post 14-day pause / promote pressure: https://www.linkedin.com/help/linkedin/answer/a517777  
   *Effect:* SME hostility. CZ MVP needs clear SKUs like Profesia/Prace, not dark-pattern paywalls mid-hire.

5. **Keyword dump job titles and multi-role ads**  
   Prace.cz FAQ: one ad = one position; bad taxonomy kills matching: https://www.prace.cz/firmy/  
   *Effect:* Wrong audience, low reply quality. Enforce one role per listing.

6. **Culture-less job text walls on ATS templates**  
   Greenhouse default limitations: https://www.voyse.co.uk/insights/how-to-improve-your-greenhouse-careers-page/  
   *Effect:* Brand evaporates at decision moment. Always attach company media block.

7. **Salary hidden + no estimate**  
   Indeed estimates help; Prace.cz quantifies harm of omission: https://www.prace.cz/firmy/  
   *Effect:* Filter exclusion and distrust. Require range or show market estimate with label.

8. **Infinite scroll of low-relevance inventory**  
   WTTJ explicitly pivoted away from “scroll hoping”: https://www.welcometothejungle.com/en/jobs  
   *Effect:* Seeker fatigue. Prefer ranked shortlists + explain “why matched.”

9. **CV database pay-per-unlock without seeker consent UX**  
   Profesia/Prace CV credit model: https://www.profesia.sk/en/price-list ; https://www.prace.cz/firmy/  
   *Effect:* Feels like spam farm if seekers did not opt into outreach. Dual-sided trust needs explicit visibility modes (open / anonymized / invite-only).

10. **Niche-only product pretending to be all-professions**  
   StartupJobs is strong but tech/innov skewed: https://www.startupjobs.cz/ ; Prace.cz owns blue-collar/service: https://www.prace.cz/firmy/  
   *Effect:* Wrong IA for “all professions.” Segment UX by role class (manual / service / office / tech / healthcare) without fragmenting brand.

---

## 3) Best-in-class seeker journey (steps)

Synthesized from Indeed prefs, LinkedIn Easy Apply, WTTJ matching, Wellfound direct-to-hiring-manager, Otta insights, StartupJobs filters.

1. **Land → intent in 10 seconds:** keyword + location + work mode (onsite/hybrid/remote) + “I need a job this month” vs “browsing.”  
   Refs: https://www.indeed.com/ ; https://www.startupjobs.cz/
2. **Create lightweight profile:** CV upload / LinkedIn-Google import; preferred titles; min pay; max commute; schedule; languages.  
   Refs: https://www.indeed.com/help/job-seekers/articles/32603395892109-adding-or-editing-job-search-preferences ; https://www.welcometothejungle.com/en/jobs
3. **See ranked matches with “why” chips:** pay fit, distance, skills overlap, culture tags; filters remain available.  
   Refs: https://www.welcometothejungle.com/en/jobs ; https://us.welcometothejungle.com/
4. **Open job + company side-by-side:** salary range, shift, address map, team photos/video, benefits, response-time badge.  
   Refs: https://www.welcometothejungle.com/en ; https://www.jobs.cz/
5. **Apply in-flow (≤90 seconds):** stored CV + 3 screening answers + optional 280-char “why me.” No redirect.  
   Refs: https://www.linkedin.com/help/linkedin/answer/a512388 ; https://www.ziprecruiter.com/
6. **Confirmation + status timeline:** Received → Viewed → Screening → Interview → Decision; ETA for first response.  
   Refs: ZipRecruiter applied/status UX (product narrative): https://www.4cornerresources.com/career-advice/how-to-use-ziprecruiter/
7. **Passive mode:** profile discoverable to employers; invites with one-tap accept/decline.  
   Refs: https://wellfound.com/ ; https://www.welcometothejungle.com/en/jobs
8. **Alerts that respect prefs:** email/push only for high-match new roles; one weekly digest option.  
   Refs: Profesia email agent: https://www.profesia.sk/en/price-list ; StepStone “discovered by employers”: https://www.stepstone.de/
9. **Post-apply coaching (light):** interview tips, salary check, similar roles. Keep optional.  
   Refs: https://www.profesia.sk/ ; https://www.stepstone.de/
10. **Mutual review after hire/decline window:** short ratings (communication, accuracy of ad, punctuality) to feed trust. Airbnb dual-review logic adapted carefully for employment law.

---

## 4) Best-in-class employer journey (steps)

Synthesized from LinkedIn post flow, ZipRecruiter dashboard, Teamio/Prace, StartupJobs, Wellfound free post + paid boost, Greenhouse schema.

1. **Company claim / create:** legal name, IČO (CZ), logo, locations, 3 culture photos, 5 benefits, pitch (500 chars).  
   Refs: https://www.startupjobs.cz/pro-firmy ; https://www.jobs.cz/
2. **Post job wizard (structured, not free text only):** title taxonomy, one role, workplace type, exact address, wage range (required or strongly forced), contract type, shifts, must-haves vs nice-to-haves.  
   Refs: https://www.prace.cz/firmy/ ; LinkedIn AI draft + screening: https://www.linkedin.com/help/linkedin/answer/a517545
3. **Screening pack:** 3–8 questions, knockout rules, auto-reject templates (GDPR-safe).  
   Refs: https://www.linkedin.com/help/linkedin/answer/a517777
4. **Choose commercial SKU:** Free trial / Basic listing / Boosted (top + email) / Talent unlock credits. Transparent price.  
   Refs: https://www.profesia.sk/en/price-list ; https://www.startupjobs.cz/pro-firmy ; https://www.prace.cz/firmy/
5. **Go live <15 minutes** with performance preview (expected views/replies by city+role).  
   Refs: Prace “online do 15 minut”: https://www.prace.cz/firmy/
6. **Inbox dashboard:** applicants ranked (invite / applied / knockout), QuickRate to train matching, message templates, calendar slots.  
   Refs: ZipRecruiter dashboard + rating: https://careercloud.com/ziprecruiter-review/ ; https://technologyadvice.com/blog/human-resources/ziprecruiter-vs-indeed/
7. **Proactive sourcing:** invite matching seekers (opted-in); show anonymized profiles until unlock or mutual interest.  
   Refs: Wellfound Reach narrative: https://wellfound.com/ ; Profesia CV browse-then-unlock: https://www.profesia.sk/en/price-list
8. **Pipeline stages + SLA nudges:** platform reminds employer to respond within N days; seeker sees status. Ghosting penalties (visibility demotion).
9. **Hire outcome capture:** hired / filled / cancelled; optional success fee or credit refund path (StartupJobs satisfaction voucher model): https://www.startupjobs.cz/pro-firmy
10. **Always-on employer brand:** company page stays live; evergreen talent pool; XML/API for agencies and ATS later (Greenhouse/Lever-compatible fields).

---

## 5) Monetization options realistic for CZ MVP

Market anchors (ex-VAT, public pages):

| Product | Anchor | URL |
|---|---|---|
| StartupJobs listing | 7 000–9 999 Kč / 30 days | https://www.startupjobs.cz/pro-firmy |
| StartupJobs top / social boost | 3 999 / 7 999 Kč | same |
| Prace.cz packages | from ~2 070 Kč/ad; Start/Basic/Plus/Ultimate ladder; Supermax 5 600 Kč / 3 days | https://www.prace.cz/firmy/ |
| Profesia.sk | €129 / €149 / €249 per month ad + CV credits; packages with volume discounts | https://www.profesia.sk/en/price-list |
| Alma Career multi-portal | Jobs.cz + Prace + Práce za rohem combo (Ultimate 60 days) | https://www.prace.cz/firmy/ ; Teamio PDF refs via Alma Career |
| Wellfound | Free unlimited posts; paid promote / AI sourcing / managed recruit | https://wellfound.com/ |
| LinkedIn | Free limited post then promote | https://www.linkedin.com/help/linkedin/answer/a517777 |
| StepStone (DE reference) | High-ticket Pro ads (~€1.4k–2.5k) | https://join.com/en/job-boards/stepstone/pricing |

**Realistic CZ MVP mix (priority order):**

1. **Paid job slots (core):** 2 490–4 990 Kč / 30 days for general roles; 5 990–8 990 Kč for scarce/tech. Undercut Jobs.cz, compete with Prace/StartupJobs on outcome (replies/quality), not vanity inventory.  
2. **Boost add-ons:** topování, homepage logo, email blast to matching seekers (copy Prace/Profesia IA).  
3. **Credit packs:** annual multi-slot discounts (Profesia credit model) for SMEs with recurring hire.  
4. **Seeker→employer interest unlock / contact credits** only with explicit seeker openness. Avoid pure spam database branding.  
5. **Featured employer / branding** (monthly) once company pages exist.  
6. **Success / placement fee (optional later):** 5–8% of first-year salary or flat hire bounty for hard-to-fill; hard for early trust, keep as pilot with staffing agencies.  
7. **Do not depend on seeker subscriptions** for MVP. CZ seekers expect free search; Glassdoor/LinkedIn Premium are secondary markets.  
8. **Free limited post** as liquidity pump (Wellfound-style) with clear upgrade, not LinkedIn “pause after 14 days” hostility.

Regulatory note for pricing/UX: Czech transposition of EU Pay Transparency pushes disclosure of minimum pay before negotiation (draft trajectory toward 2027). Product that *requires* salary ranges early wins compliance narrative.  
Refs: https://www.paygap.com/articles/pay-transparency-within-the-eu-the-czech-republic ; https://advokatnidenik.cz/2026/09/01/novelu-zakoniku-prace-s-pravidly-odmenovani-vlada-schvalila/

---

## 6) Five concrete principles for “Airbnb of jobs”

1. **Two products, one trust graph:** Job listing and Company (host) are equal objects. Seekers book a *workplace stay*, not a PDF. (WTTJ company-first: https://www.welcometothejungle.com/en)

2. **Mutual accountability with delayed dual reviews:** After hire or closed process, both sides rate communication, accuracy, professionalism. Publish aggregates; demote chronic ghosters. Adapt Airbnb double-blind timing carefully for labor law and GDPR.

3. **Identity + verification layers:** Employer: IČO/ARES verified. Seeker: phone + email; optional ID for high-trust roles. Fake hosts destroy marketplaces.

4. **Structured inventory beats keyword sludge:** Mandatory fields (pay band, location precision, workplace type, shift, contract) enable search like Airbnb’s beds/dates/price. (Prace wage effect + Greenhouse workplace metadata)

5. **Liquidity via invites, not only ads:** Seekers can be “available” with calendar/notice period; employers invite like booking requests; seekers accept/decline. (Wellfound + WTTJ passive discovery + ZipRecruiter invite-to-apply)

---

## 7) Ruthless production MVP recommendation

### IN SCOPE (ship)

- CZ Czech UI, SK secondary language later  
- Seeker: register, CV parse, prefs (pay, city/radius, remote, job type, seniority), search + match feed, save, alerts  
- Job detail with **required salary range** (or labeled estimate + employer prompt to fix)  
- Company page v1: logo, pitch, 3 photos, benefits, locations, all open roles  
- On-platform apply + 5 screening Qs + application tracker (5 stages)  
- Employer: verified company, post wizard, applicant inbox, message, stage moves, basic analytics (views, applies, time-to-first-response)  
- Monetization: paid 30-day listing + top boost + 14-day free trial (1 live job)  
- Admin: spam/fraud queue, GDPR export/delete, ARES company check  
- Taxonomy covering all professions (ISCO-inspired categories), not tech-only  
- Mobile-responsive web first (no native apps)

### OUT OF SCOPE (explicitly cut)

- Native iOS/Android apps  
- Full ATS (interview scorecards, offer letters, e-sign, multi-office workflows)  
- Greenhouse/Lever deep sync (keep schema compatible only)  
- AI sourcing agents / Wellfound Reach clone  
- Glassdoor-scale review corpus and give-to-get walls  
- Multi-country posting marketplace (beyond CZ inventory; SK read-only later)  
- CV database mass unlock as primary revenue in v1  
- Salary negotiation tools, assessments, video interview suite  
- Programmatic job aggregation from Indeed/others (garbage inventory, legal mess)  
- “Autopilot recruiter” human services  
- Complex credit accounting / annual enterprise contracts automation (manual sales OK)

### MVP success bar (8–12 weeks post-launch)

- 200+ paid or trial employers with ≥1 live job  
- Median employer first response <5 days  
- ≥40% of live jobs show explicit wage range  
- Seeker apply completion ≥50% of started applies  
- Measurable hire or “process advanced to interview” events logged

### Positioning vs CZ incumbents

| Competitor | Steal | Beat |
|---|---|---|
| Jobs.cz / Prace.cz / Teamio (Alma Career) | Package IA, topování, Teamio-like console simplicity | Modern match UX, mandatory transparency, dual-sided invites, less “portal spam” feel |
| StartupJobs.cz | Media-rich ads, startup discounts, satisfaction voucher | All professions, clearer SME pricing below 7k Kč entry |
| Profesia.sk | Credit packs, CV opt-in unlock, branding SKUs | Better seeker status UX; CZ-first; no content walls |
| LinkedIn / Indeed | Easy Apply, prefs, scale patterns | Local trust, wage-first, company storytelling, CZ payment/faktura |
| WTTJ / Otta / Wellfound | Matching narrative, culture pages, free post → paid tools | Broader professions; CZ language/market; simpler monetization |

---

## Source index (primary pages visited or cited)

- https://www.indeed.com/  
- https://www.indeed.com/help/job-seekers/articles/32603395892109-adding-or-editing-job-search-preferences  
- https://www.indeed.com/career-advice/finding-a-job/tips-on-how-to-get-better-search-results-on-indeed.com  
- https://www.linkedin.com/help/linkedin/answer/a512388  
- https://www.linkedin.com/help/linkedin/answer/a517777  
- https://www.linkedin.com/help/linkedin/answer/a517545  
- https://www.ziprecruiter.com/  
- https://careercloud.com/ziprecruiter-review/  
- https://www.stepstone.de/  
- https://www.welcometothejungle.com/en  
- https://www.welcometothejungle.com/en/jobs  
- https://us.welcometothejungle.com/  
- https://wellfound.com/  
- https://www.jobs.cz/  
- https://www.prace.cz/firmy/  
- https://www.startupjobs.cz/  
- https://www.startupjobs.cz/pro-firmy  
- https://www.profesia.sk/  
- https://www.profesia.sk/en/price-list  
- https://job-boards.greenhouse.io/airbnb  
- https://boards-api.greenhouse.io/v1/boards/airbnb/jobs  
- https://www.voyse.co.uk/insights/how-to-improve-your-greenhouse-careers-page/  
- https://jobs.lever.co/quenchwater?location=Boston%2C+MA  
- https://cz.teamio.com/  
- https://join.com/en/job-boards/stepstone/pricing  

---

*End of report.*
