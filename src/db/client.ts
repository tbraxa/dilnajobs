import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

const serverless = Boolean(process.env.VERCEL || process.env.K_SERVICE || process.env.FUNCTION_TARGET);

export const sql =
  globalForDb.sql ??
  postgres(env.DATABASE_URL, {
    max: serverless ? 1 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db = drizzle(sql, { schema });
