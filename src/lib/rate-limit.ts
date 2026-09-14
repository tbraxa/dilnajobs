import "server-only";

import { and, gt, sql as dsql } from "drizzle-orm";
import { db } from "@/db/client";
import { rateLimitEvents } from "@/db/schema";
import { hashRateKey } from "./crypto";

export class RateLimitError extends Error {
  constructor() {
    super("rate_limited");
    this.name = "RateLimitError";
  }
}

export async function enforceRateLimit(input: {
  bucket: string;
  key: string;
  limit: number;
  windowMs: number;
}): Promise<void> {
  const keyHash = hashRateKey(input.bucket, input.key);
  const since = new Date(Date.now() - input.windowMs);

  const [row] = await db
    .select({ n: dsql<number>`count(*)::int` })
    .from(rateLimitEvents)
    .where(
      and(
        dsql`${rateLimitEvents.bucket} = ${input.bucket}`,
        dsql`${rateLimitEvents.keyHash} = ${keyHash}`,
        gt(rateLimitEvents.createdAt, since),
      ),
    );

  if ((row?.n ?? 0) >= input.limit) {
    throw new RateLimitError();
  }

  await db.insert(rateLimitEvents).values({ bucket: input.bucket, keyHash });
}
