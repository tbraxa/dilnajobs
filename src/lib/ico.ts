/** Czech IČO: 8 digits + weighted checksum (ARES algorithm). */

import { lookupCompanyByIco, type AresLookupResult } from "./ares";

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

/**
 * ARES lookup for registration. Checksum-invalid → not ok.
 * Network/timeout → ok with pending/manual so registration is not blocked.
 */
export async function verifyIcoViaAres(ico: string): Promise<AresLookupResult> {
  return lookupCompanyByIco(ico);
}
