# ADR 002 — Candidate account remains optional

- Status: amended
- Date: 2026-09-14
- Amended: 2026-09-19

## Context

Shop-floor candidates will not create accounts to send a CV. Forcing login kills conversion and collects accounts we would then have to protect (ASVS L2, GDPR).

## Decision

Apply with **name + phone** (required), **email + CV + short message** (optional), plus explicit GDPR consent.

An account is never required to apply. Seekers may optionally use passwordless
login for a profile, saved jobs, and saved companies under `/ucet`.

## Consequences

- Duplicate applications are possible; we rate-limit by IP hash + job and warn the candidate.
- Employers contact by phone. Email is a courtesy.
- Signed-in applicants can manage profile and favorites. Application erasure
  remains an ops request because the employer also controls its hiring record.
- The anonymous conversion path remains a launch invariant.
