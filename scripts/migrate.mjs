#!/usr/bin/env node
/**
 * Apply drizzle/*.sql in order. Idempotent via schema_migrations.
 * Does NOT run during `next build` (Vercel Hobby). Use:
 *   npm run db:migrate
 *   GitHub → Actions → Migrate → Run workflow
 *   or paste files from drizzle/ into the Neon SQL editor (sorted).
 *
 * Uses the `postgres` package already in production dependencies (no tsx, no drizzle-kit).
 */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

try {
  const { config } = await import("dotenv");
  config({ path: ".env.local" });
  config({ path: ".env" });
} catch {
  /* dotenv is optional when env is already set */
}

const DATABASE_URL = (process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL || "").trim();
if (!DATABASE_URL) {
  console.error("DATABASE_ADMIN_URL or DATABASE_URL is required");
  process.exit(1);
}

const local = /localhost|127\.0\.0\.1/.test(DATABASE_URL);
const sql = postgres(DATABASE_URL, {
  max: 1,
  prepare: false,
  ssl: local ? false : "require",
  connect_timeout: 20,
  onnotice: () => {},
});

const dir = path.join(process.cwd(), "drizzle");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

await sql`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`;

for (const file of files) {
  const already = await sql`select 1 from schema_migrations where id = ${file}`;
  if (already.length) {
    console.log(`skip ${file}`);
    continue;
  }
  const body = fs.readFileSync(path.join(dir, file), "utf8");
  await sql.begin(async (tx) => {
    await tx.unsafe(body);
    await tx`insert into schema_migrations (id) values (${file})`;
  });
  console.log(`applied ${file}`);
}

await sql.end({ timeout: 5 });
console.log("migrations up to date");
