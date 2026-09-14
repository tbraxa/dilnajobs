import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

function skipRequested(): boolean {
  const v = process.env.SKIP_DB_MIGRATE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function isUnreachable(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.message} ${"code" in err ? String((err as { code?: string }).code) : ""}` : String(err);
  return /ECONNREFUSED|ENOTFOUND|ENETUNREACH|ETIMEDOUT|timeout|getaddrinfo|connect ECONNREFUSED/i.test(
    msg,
  );
}

export async function runMigrations(): Promise<"applied" | "skipped"> {
  if (skipRequested()) {
    console.log("db:migrate skipped (SKIP_DB_MIGRATE)");
    return "skipped";
  }

  const DATABASE_URL = process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL;
  if (!DATABASE_URL?.trim()) {
    console.warn("db:migrate skipped: DATABASE_URL / DATABASE_ADMIN_URL missing");
    return "skipped";
  }

  const dir = path.join(process.cwd(), "drizzle");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new Client({ connectionString: DATABASE_URL, connectionTimeoutMillis: 15_000 });
  try {
    await client.connect();
  } catch (err) {
    if (isUnreachable(err) && !process.env.VERCEL) {
      console.warn("db:migrate skipped: database unreachable (ok for image builds)");
      return "skipped";
    }
    throw err;
  }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const file of files) {
      const applied = await client.query("select 1 from schema_migrations where id = $1", [file]);
      if (applied.rowCount) {
        console.log(`skip ${file}`);
        continue;
      }
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query("insert into schema_migrations (id) values ($1)", [file]);
        await client.query("commit");
        console.log(`applied ${file}`);
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }
  } finally {
    await client.end().catch(() => undefined);
  }
  return "applied";
}

async function main() {
  await runMigrations();
}

const invokedDirectly = process.argv[1]?.includes("migrate");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
