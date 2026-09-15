import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTRACT_TYPES } from "./catalog";
import { contractLabel, copy, salaryFrom, salaryRange, workModeLabel } from "./copy";
import { displayJobSalary, formatSalary } from "./pricing";

const DASHES = /[—–]/;
const OLD_BRAND = /DílnaJobs|DilnaJobs/;

function walk(value: unknown, path: string, hits: string[]) {
  if (typeof value === "string") {
    if (DASHES.test(value)) hits.push(`${path}: ${value}`);
    return;
  }
  if (typeof value === "function") {
    const sample = value("Acme");
    if (typeof sample === "string" && DASHES.test(sample)) hits.push(`${path}(): ${sample}`);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      walk(nested, path ? `${path}.${key}` : key, hits);
    }
  }
}

function collectFiles(dir: string, match: RegExp, acc: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(path, match, acc);
    else if (match.test(entry.name)) acc.push(path);
  }
  return acc;
}

describe("COPY-PACK v1.3", () => {
  it("keeps the locked homepage claim", () => {
    expect(copy.claim).toBe("Práce v Česku. Od firem.");
  });

  it("uses OpenJobs as the public brand", () => {
    expect(copy.brand).toBe("OpenJobs");
    expect(copy.footer).toBe("© 2026 OpenJobs · nabídky práce");
  });

  it("exposes pack contract and salary strings", () => {
    expect(copy.card.contractHpp).toBe("HPP");
    expect(copy.card.contractDpp).toBe("DPP");
    expect(copy.card.contractDpc).toBe("DPČ");
    expect(copy.card.contractIco).toBe("IČO / živnost");
    expect(copy.card.ctaOpen).toBe("Zobrazit nabídku");
    expect(copy.card.salaryNegotiable).toBe("mzda dohodou");
    expect(copy.card.salaryUnspecified).toBe("Mzda neuvedena");
    expect(copy.card.badgeAgency).toBe("Agentura");
    expect(copy.card.badgeVerified).toBe("Ověřeno");
    expect(workModeLabel("onsite")).toBe("Na místě");
    expect(workModeLabel("hybrid")).toBe("Hybrid");
    expect(workModeLabel("remote")).toBe("Na dálku");
    expect(copy.card.workModeRemote).toBe("Na dálku");
    expect(copy.card.workModeRemote).not.toBe("Remote");
    expect(copy.card.publishedToday).toBe("Zveřejněno dnes");
    expect(contractLabel("hpp")).toBe("HPP");
    expect(contractLabel("dpc")).toBe("DPČ");
    expect(contractLabel("ico")).toBe("IČO / živnost");
    expect(CONTRACT_TYPES.map((t) => t.label)).toEqual([
      copy.card.contractHpp,
      copy.card.contractDpp,
      copy.card.contractDpc,
      copy.card.contractIco,
    ]);
    expect(salaryRange(45000, 55000)).toMatch(/45\D000 až 55\D000 Kč/);
    expect(salaryFrom(40000)).toMatch(/od 40\D000 Kč/);
  });

  it("does not contain DílnaJobs in user-facing strings", () => {
    const hits: string[] = [];
    function findBrand(value: unknown, path: string) {
      if (typeof value === "string") {
        if (OLD_BRAND.test(value)) hits.push(`${path}: ${value}`);
        return;
      }
      if (typeof value === "function") {
        const sample = String(value("Acme"));
        if (OLD_BRAND.test(sample)) hits.push(`${path}(): ${sample}`);
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          findBrand(nested, path ? `${path}.${key}` : key);
        }
      }
    }
    findBrand(copy, "");
    expect(hits).toEqual([]);
  });

  it("has no DílnaJobs in app or component UI modules", () => {
    const files = [
      ...collectFiles("src/app", /\.(ts|tsx)$/),
      ...collectFiles("src/components", /\.(ts|tsx)$/),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (OLD_BRAND.test(text)) hits.push(file);
    }
    expect(hits).toEqual([]);
  });

  it("has no em dash or en dash in user-facing strings", () => {
    const hits: string[] = [];
    walk(copy, "", hits);
    expect(hits).toEqual([]);
    expect(salaryRange(40000, 50000)).not.toMatch(DASHES);
    expect(salaryFrom(40000)).not.toMatch(DASHES);
    expect(formatSalary(40000, 50000)).not.toMatch(DASHES);
    expect(formatSalary(null, null)).toBe(copy.card.salaryUnspecified);
    expect(displayJobSalary({ salaryMin: 40000, salaryMax: 50000 })).not.toMatch(DASHES);
    expect(displayJobSalary({ salaryType: "negotiable" })).toBe(copy.card.salaryNegotiable);
    expect(displayJobSalary({ salaryNote: "mzda dohodou" })).toBe(copy.card.salaryNegotiable);
    expect(displayJobSalary({ salaryType: "monthly" })).toBe(copy.card.salaryUnspecified);
    expect(displayJobSalary({ salaryMin: 40000 })).toMatch(/od 40\D000 Kč/);
  });

  it("has no em dash or en dash in app or component UI modules", () => {
    const files = [
      ...collectFiles("src/app", /\.(ts|tsx)$/),
      ...collectFiles("src/components", /\.(ts|tsx)$/),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (DASHES.test(text)) hits.push(file);
    }
    expect(hits).toEqual([]);
  });
});
