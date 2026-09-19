const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const SIGNATURE_AUTHENTICATED_PATHS = new Set(["/api/stripe/webhook"]);

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
  if (SIGNATURE_AUTHENTICATED_PATHS.has(input.pathname)) return true;

  const fetchSite = input.secFetchSite?.toLowerCase();
  if (fetchSite === "cross-site") return false;

  if (!input.origin) {
    // Non-browser clients do not send Origin. Browser cross-site submissions are
    // rejected above through Sec-Fetch-Site; same-origin HTML forms send Origin.
    return true;
  }

  let originHost: string;
  try {
    const parsed = new URL(input.origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    originHost = parsed.host.toLowerCase();
  } catch {
    return false;
  }

  const allowed = new Set(
    [firstHeaderValue(input.host), firstHeaderValue(input.forwardedHost)].filter(
      (value): value is string => Boolean(value),
    ),
  );
  return allowed.has(originHost);
}
