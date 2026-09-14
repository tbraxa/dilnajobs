# ADR 001 — Next.js App Router, PostgreSQL, S3 CVs, passwordless employers

- Status: accepted
- Date: 2026-09-14

## Context

v1 is a small job board with a public catalog, unauthenticated apply, and an employer portal. We need a stack a two-person team can operate, with ASVS L2-oriented defaults.

## Decision

- **Next.js 15 App Router + TypeScript.** RSC for catalog pages. Mutations via Server Actions (Origin check) plus a few Route Handlers (magic-link verify, CV download).
- **PostgreSQL 16 + Drizzle ORM.** SQL migrations in `drizzle/` are the source of truth (including RLS). Drizzle schema mirrors tables for typed queries.
- **S3-compatible object storage for CVs.** Interface in `src/lib/storage/cv.ts`. Local filesystem when keys are absent (dev).
- **Passwordless magic-link for employers.** HttpOnly Secure SameSite cookies. No passwords to store, reset, or leak.

## Consequences

- Node runtime (not edge) because of `postgres` and pg-boss.
- Employer auth is e-mail-channel security: rate-limit links, hash tokens, short TTL.
- CV access is application-layer + unguessable keys, not a public bucket.
