import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import postgres from "postgres";
import { log } from "./lib/logging";

async function main() {
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_ADMIN_URL or DATABASE_URL required");
  const sql = postgres(url, { max: 1, prepare: false });
  log("info", "worker.start", { mode: "expire_published_jobs" });
  try {
    const rows = await sql<{ expire_published_jobs: number }[]>`select expire_published_jobs()`;
    const count = Number(rows[0]?.expire_published_jobs ?? 0);
    log("info", "jobs.expired", { count });
    log("info", "worker.done");
  } catch (err) {
    const message = err instanceof Error ? err.message : "worker_failed";
    log("error", "worker.failed", { message });
    try {
      await sql`
        insert into system_heartbeats (name, status, detail, checked_at)
        values ('job_expiry', 'down', ${message.slice(0, 200)}, now())
        on conflict (name) do update
          set status = excluded.status,
              detail = excluded.detail,
              checked_at = excluded.checked_at
      `;
    } catch {
      /* heartbeat table may not exist yet */
    }
    throw err;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
