import { createHash, randomBytes } from "node:crypto";
import { config as loadEnv } from "dotenv";
import postgres from "postgres";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("no db");
  const sql = postgres(url, { max: 1 });
  await sql`
    insert into magic_tokens (email, token_hash, expires_at)
    values ('novak@kovovyroba-novak.test', ${tokenHash}, now() + interval '15 minutes')
  `;
  console.log(`http://localhost:3000/firma/prihlaseni/overit?token=${token}`);
  await sql.end({ timeout: 2 });
}

main();
