const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim().toLowerCase() || null;
}

export function isCsrfSafeRequest(input: {
  method: string;
  pathname: string;
  origin: string | null;
  host: string | null;
  forwardedHost: string | null;
  secFetchSite: string | null;
}) {
  if (SAFE_METHODS.has(input.method.toUpperCase())) return true;

  // Existing API mutations authenticate with request-specific signatures or
  // upload tickets. Browser session mutations are handled by pages/actions.
  if (input.pathname.startsWith("/api/")) return true;

  if (input.secFetchSite?.toLowerCase() === "cross-site") return false;
  if (!input.origin) return false;

  let originHost: string;
  try {
    const parsed = new URL(input.origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    originHost = parsed.host.toLowerCase();
  } catch {
    return false;
  }

  const allowedHosts = new Set(
    [firstHeaderValue(input.host), firstHeaderValue(input.forwardedHost)].filter(
      (value): value is string => Boolean(value),
    ),
  );
  return allowedHosts.has(originHost);
}
