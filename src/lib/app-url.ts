/**
 * Resolve the public origin without throwing at import / `next build`.
 *
 * Vercel often injects `APP_URL=""` (empty, not unset). `??` does not treat
 * that as missing, so `new URL(process.env.APP_URL || "")` throws
 * `ERR_INVALID_URL` while collecting `/_not-found`. Never pass an empty
 * string to `new URL`.
 *
 * After the first deploy, set `APP_URL` to the real domain (see docs/DEPLOY.md).
 */
export type AppUrlEnv = {
  APP_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
  VERCEL_URL?: string;
};

export const LOCAL_APP_URL = "http://localhost:3000";

function trimOrEmpty(value: string | undefined): string {
  return value?.trim() ?? "";
}

function httpOrigin(value: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveAppUrl(source: AppUrlEnv = process.env): string {
  const fromApp =
    httpOrigin(trimOrEmpty(source.APP_URL)) ??
    httpOrigin(trimOrEmpty(source.NEXT_PUBLIC_APP_URL));
  if (fromApp) return fromApp;

  const vercelHost = trimOrEmpty(source.VERCEL_URL).replace(/^https?:\/\//, "");
  if (vercelHost) {
    const fromVercel = httpOrigin(`https://${vercelHost}`);
    if (fromVercel) return fromVercel;
  }

  return LOCAL_APP_URL;
}

/** Safe `new URL(path, base)` — base is never empty. */
export function toAppUrl(path: string, source: AppUrlEnv = process.env): URL {
  return new URL(path, resolveAppUrl(source));
}

export function resolveAppHost(source: AppUrlEnv = process.env): string {
  return toAppUrl("/", source).host;
}
