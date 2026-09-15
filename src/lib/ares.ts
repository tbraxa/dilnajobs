import { isValidIco, normalizeIco } from "./ico";

export type AresAddress = {
  street?: string;
  city?: string;
  zip?: string;
  region?: string;
  raw?: Record<string, unknown>;
};

export type AresLookupResult = {
  ok: boolean;
  source: "ares" | "timeout" | "unavailable" | "not_found" | "checksum" | "stub";
  verificationStatus: "pending" | "verified" | "failed" | "manual";
  legalName?: string;
  dic?: string;
  city?: string;
  address?: AresAddress;
  raw?: unknown;
  stub?: boolean;
};

const ARES_URL = "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty";

function timeoutMs(): number {
  const raw = process.env.ARES_TIMEOUT_MS;
  const n = raw ? Number(raw) : 4000;
  return Number.isFinite(n) && n > 0 ? n : 4000;
}

function aresDisabled(): boolean {
  const v = (process.env.ARES_DISABLED ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function readSidlo(sidlo: unknown): AresAddress | undefined {
  if (!sidlo || typeof sidlo !== "object") return undefined;
  const s = sidlo as Record<string, unknown>;
  const streetParts = [s.nazevUlice, s.cisloDomovni, s.cisloOrientacni].filter((p) => p != null && String(p).trim());
  return {
    street: streetParts.length ? streetParts.map(String).join(" ") : undefined,
    city: typeof s.nazevObce === "string" ? s.nazevObce : undefined,
    zip: s.psc != null ? String(s.psc) : undefined,
    region: typeof s.nazevKraje === "string" ? s.nazevKraje : undefined,
    raw: s,
  };
}

/**
 * Live ARES lookup with timeout. Failures never block registration:
 * checksum-invalid → failed; HTTP/timeout → pending/manual.
 *
 * TODO: cache ARES responses; map inactive subjects to failed more strictly.
 */
export async function lookupCompanyByIco(icoRaw: string): Promise<AresLookupResult> {
  const ico = normalizeIco(icoRaw);
  if (!isValidIco(ico)) {
    return { ok: false, source: "checksum", verificationStatus: "failed" };
  }

  if (aresDisabled()) {
    return {
      ok: true,
      source: "stub",
      verificationStatus: "pending",
      stub: true,
    };
  }

  const controller = new AbortController();
  const ms = timeoutMs();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(`${ARES_URL}/${ico}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "dilnajobs.cz MVP (employer verification)",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (res.status === 404) {
      return { ok: false, source: "not_found", verificationStatus: "failed", stub: false };
    }
    if (!res.ok) {
      return { ok: false, source: "unavailable", verificationStatus: "manual", stub: false };
    }

    const raw = (await res.json()) as Record<string, unknown>;
    const legalName = typeof raw.obchodniJmeno === "string" ? raw.obchodniJmeno : undefined;
    const dic = typeof raw.dic === "string" ? raw.dic : undefined;
    const address = readSidlo(raw.sidlo);

    if (!legalName) {
      return {
        ok: false,
        source: "ares",
        verificationStatus: "manual",
        raw,
        address,
      };
    }

    return {
      ok: true,
      source: "ares",
      verificationStatus: "verified",
      legalName,
      dic,
      city: address?.city,
      address,
      raw,
    };
  } catch (err) {
    const aborted = err instanceof Error && (err.name === "AbortError" || /aborted/i.test(err.message));
    return {
      ok: false,
      source: aborted ? "timeout" : "unavailable",
      verificationStatus: aborted ? "pending" : "manual",
      stub: false,
    };
  } finally {
    clearTimeout(timer);
  }
}
