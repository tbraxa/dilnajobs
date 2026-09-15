import "server-only";

import { log } from "./logging";
import { env } from "./env";

export function captureException(err: unknown, context: Record<string, unknown> = {}) {
  const message = err instanceof Error ? err.message : String(err);
  log("error", "exception", { message, ...context });
  if (!env.SENTRY_DSN) return;
  void import("@sentry/nextjs")
    .then((Sentry) => {
      Sentry.captureException(err, { extra: context });
    })
    .catch(() => {
      /* STUB: SDK load failed. Already logged. */
    });
}
