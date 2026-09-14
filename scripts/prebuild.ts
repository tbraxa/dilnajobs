/**
 * Production `next build` helper (Vercel): apply SQL migrations, optionally seed.
 * Docker image builds set SKIP_DB_MIGRATE=1 — they have no live Postgres.
 * Seed is off unless SEED_ON_DEPLOY=true (first deploy only; never truncates if data exists).
 */
import { spawnSync } from "node:child_process";
import { runMigrations } from "./migrate";

function truthy(v: string | undefined): boolean {
  const s = v?.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function run(cmd: string, args: string[]) {
  const result = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  await runMigrations();
  if (truthy(process.env.SEED_ON_DEPLOY)) {
    console.log("SEED_ON_DEPLOY=true — seeding if the catalog is empty");
    run("npx", ["tsx", "scripts/seed.ts"]);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
