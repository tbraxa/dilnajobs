/** Czech IČO: 8 digits + weighted check digit (ARES algorithm). */

export function normalizeIco(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function isValidIco(raw: string): boolean {
  const ico = normalizeIco(raw);
  if (!/^\d{8}$/.test(ico)) return false;
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += Number(ico[i]) * (8 - i);
  }
  const mod = sum % 11;
  const last = Number(ico[7]);
  if (mod === 0) return last === 1;
  if (mod === 1) return last === 0;
  return last === 11 - mod;
}

export function makeValidIco(firstSeven: string): string {
  if (!/^\d{7}$/.test(firstSeven)) throw new Error("need 7 digits");
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += Number(firstSeven[i]) * (8 - i);
  }
  const mod = sum % 11;
  const last = mod === 0 ? 1 : mod === 1 ? 0 : 11 - mod;
  return firstSeven + String(last);
}

export type AresCompany = {
  ico: string;
  companyName: string;
  city: string | null;
  dic: string | null;
};

const ARES_SUBJECT_URL = "https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function parseAresSubject(payload: unknown): AresCompany | null {
  const p = asRecord(payload);
  if (!p) return null;
  const ico = typeof p.ico === "string" ? normalizeIco(p.ico) : "";
  const companyName = typeof p.obchodniJmeno === "string" ? p.obchodniJmeno.trim() : "";
  if (!/^\d{8}$/.test(ico) || !companyName) return null;

  let city: string | null = null;
  const sidlo = asRecord(p.sidlo);
  if (sidlo && typeof sidlo.nazevObce === "string" && sidlo.nazevObce.trim()) {
    city = sidlo.nazevObce.trim();
  }

  let dic: string | null = null;
  if (typeof p.dic === "string" && p.dic.trim()) {
    const compact = p.dic.replace(/\s+/g, "").toUpperCase();
    dic = compact.startsWith("CZ") ? compact : `CZ${compact}`;
  }

  return { ico, companyName, city, dic };
}

export async function lookupAresCompany(
  icoRaw: string,
): Promise<{ ok: true; company: AresCompany } | { ok: false; error: string; notFound?: boolean }> {
  const ico = normalizeIco(icoRaw);
  if (!/^\d{8}$/.test(ico)) {
    return { ok: false, error: "Zadejte osm číslic IČO." };
  }

  try {
    const res = await fetch(`${ARES_SUBJECT_URL}${encodeURIComponent(ico)}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "DílnaJobs/1.0 (+https://dilnajobs.cz)",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 404) {
      return { ok: false, error: "IČO v ARES nenašli. Zkontrolujte číslo.", notFound: true };
    }
    if (!res.ok) {
      return { ok: false, error: "ARES teď neodpověděl. Vyplňte údaje ručně." };
    }
    const company = parseAresSubject(await res.json());
    if (!company) {
      return { ok: false, error: "ARES vrátil neúplné údaje. Vyplňte je ručně." };
    }
    return { ok: true, company };
  } catch {
    return { ok: false, error: "ARES teď neodpověděl. Vyplňte údaje ručně." };
  }
}

/**
 * Registration gate: format + check digit only.
 * HTTP lookup is `/api/ares` (autofill). Ops still marks `verification_status`.
 */
export async function verifyIcoViaAres(ico: string): Promise<{
  ok: boolean;
  legalName?: string;
  stub: true;
}> {
  if (!isValidIco(ico)) return { ok: false, stub: true };
  return { ok: true, stub: true };
}
