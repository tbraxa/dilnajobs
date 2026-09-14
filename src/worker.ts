import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import postgres from "postgres";
import { log } from "./lib/logging";

async function main() {
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_ADMIN_URL or DATABASE_URL required");
  const sql = postgres(url, { max: 1, prepare: false });
  log("info", "worker.start", { mode: "inline-stub" });
  const result = await sql`
    update jobs
    set status = 'expired'
    where status = 'published' and expires_at is not null and expires_at < now()
    returning id
  `;
  log("info", "jobs.expired", { count: result.length });
  await sql.end({ timeout: 5 });
  log("info", "worker.done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
