import "server-only";

import { sql as dsql } from "drizzle-orm";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { db } from "./client";
import type * as schema from "./schema";

export type EmployerTx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * Run queries as a given employer. Sets `app.employer_id` with SET LOCAL
 * (via set_config third arg = true) so RLS policies apply for this transaction only.
 */
export async function withEmployerRls<T>(
  employerId: string,
  fn: (tx: EmployerTx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(dsql`select set_config('app.employer_id', ${employerId}, true)`);
    return fn(tx);
  });
}

/** Cross-tenant operator reads/updates. SET LOCAL app.is_admin = true for this transaction only. */
export async function withAdminRls<T>(fn: (tx: EmployerTx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(dsql`select set_config('app.is_admin', 'true', true)`);
    return fn(tx);
  });
}
