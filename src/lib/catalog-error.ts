export function isMissingRelationError(err: unknown): boolean {
  const code =
    typeof err === "object" && err && "code" in err ? String((err as { code?: unknown }).code) : "";
  if (code === "42P01" || code === "42703") return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /relation .* does not exist/i.test(msg) || /column .* does not exist/i.test(msg);
}

export type CatalogResult<T> =
  | { ok: true; rows: T }
  | { ok: false; reason: "missing_schema" | "query_failed" };
