# ADR 002 — No mandatory candidate account in v1

- Status: accepted
- Date: 2026-09-14

## Context

Shop-floor candidates will not create accounts to send a CV. Forcing login kills conversion and collects accounts we would then have to protect (ASVS L2, GDPR).

## Decision

Apply with **name + phone** (required), **email + CV + short message** (optional), plus explicit GDPR consent.

No candidate session, no candidate dashboard, no “save job” account.

## Consequences

- Duplicate applications are possible; we rate-limit by IP hash + job and warn the candidate.
- Employers contact by phone. Email is a courtesy.
- Right of access/erasure is a manual ops process in v1 (documented in SECURITY.md / GDPR page).
- We do not build candidate login “just in case.”
