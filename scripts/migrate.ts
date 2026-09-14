import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_ADMIN_URL or DATABASE_URL is required");
  process.exit(1);
}

async function main() {
  const dir = path.join(process.cwd(), "drizzle");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

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

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
