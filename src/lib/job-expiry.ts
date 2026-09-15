import { sql } from "@/db/client";

/** Public listings close after this many days. Cron + catalog hide `expires_at < now()`. */
export const LISTING_TTL_DAYS = 30;

export async function expirePublishedJobs(): Promise<number> {
  const rows = await sql<{ expire_published_jobs: number }[]>`select expire_published_jobs()`;
  return Number(rows[0]?.expire_published_jobs ?? 0);
}

export async function markExpiryFailed(message: string) {
  await sql`
    insert into system_heartbeats (name, status, detail, checked_at)
    values ('job_expiry', 'down', ${message.slice(0, 200)}, now())
    on conflict (name) do update
      set status = excluded.status,
          detail = excluded.detail,
          checked_at = excluded.checked_at
  `;
}
