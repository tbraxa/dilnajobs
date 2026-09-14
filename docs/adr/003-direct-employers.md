# ADR 003 — Direct employers only, IČO path, agencies banned

- Status: accepted
- Date: 2026-09-14

## Context

The product is a niche board for manufacturing firms hiring their own people. Agencies would dilute trust and copy a generalist marketplace we are not building.

## Decision

- Customers are **direct employers** (výrobní firmy, závody, servisní provozy s vlastními zaměstnanci).
- Registration requires a Czech **IČO** (checksum validated; ARES lookup is a stub with a verification path).
- **Agentury práce are forbidden** in Terms. `employers.is_agency` / rejection path exists for ops.
- **First job posting is reviewable** (`pending_review`) unless an explicit feature flag auto-publishes (seed data is pre-published).

## Consequences

- Sales and ToS must stay unambiguous: we do not onboard staffing agencies.
- IČO uniqueness is enforced. Duplicate company accounts are an ops merge, not self-serve.
- Unverified employers can draft; public catalog only shows `published` jobs.
