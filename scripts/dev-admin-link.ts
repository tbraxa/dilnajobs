import { createHash, randomBytes } from "node:crypto";
import { config as loadEnv } from "dotenv";
import postgres from "postgres";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

async function main() {
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = allowlist[0];
  if (!email) {
    console.error("ADMIN_EMAILS is empty. Set it in .env / .env.local (e.g. tomas@dilnajobs.test).");
    process.exit(1);
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("no db");
  const sql = postgres(url, { max: 1 });
  await sql`
    insert into magic_tokens (email, token_hash, purpose, expires_at)
    values (${email}, ${tokenHash}, 'admin', now() + interval '15 minutes')
  `;
  console.log(`Admin login for ${email}:`);
  console.log(`http://localhost:3000/admin/prihlaseni/overit?token=${token}`);
  await sql.end({ timeout: 2 });
}

main();
