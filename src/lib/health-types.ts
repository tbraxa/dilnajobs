export type CheckStatus = "ok" | "degraded" | "down" | "unconfigured";

export type HealthCheck = {
  name: string;
  status: CheckStatus;
  latencyMs?: number;
  detail?: string;
  checkedAt: string;
  critical?: boolean;
};

export type HealthReport = {
  status: CheckStatus;
  checkedAt: string;
  checks: HealthCheck[];
};

export const HEALTH_LABELS: Record<string, string> = {
  postgres: "PostgreSQL",
  migrations: "Migrace schématu",
  object_storage: "Úložiště CV",
  mailer: "Pošta",
  payments: "Platby",
  worker: "Worker (expirace inzerátů)",
  rate_limiter: "Rate limiter",
  auth: "Přihlášení / magic-link",
  cv_disk: "Disk CV (lokální)",
  sentry: "Sentry",
};

export const STATUS_LABELS: Record<CheckStatus, string> = {
  ok: "v pořádku",
  degraded: "omezené",
  down: "mimo provoz",
  unconfigured: "nenastaveno",
};

/** Overall: down only when Postgres or auth is down. Optional failures → degraded. */
export function rollupStatus(checks: HealthCheck[]): CheckStatus {
  const postgresDown = checks.some((c) => c.name === "postgres" && c.status === "down");
  const authDown = checks.some((c) => c.name === "auth" && c.status === "down");
  if (postgresDown || authDown) return "down";
  if (checks.some((c) => c.status === "down" || c.status === "degraded")) return "degraded";
  if (checks.some((c) => c.status === "unconfigured")) return "degraded";
  return "ok";
}
