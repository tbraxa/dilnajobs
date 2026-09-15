import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CONTRACT_TYPES } from "./catalog";
import { contractLabel, copy, salaryFrom, salaryRange, workModeLabel } from "./copy";
import { displayJobSalary, formatSalary } from "./pricing";

const DASHES = /[—–]/;
const OLD_BRAND = /DílnaJobs|DilnaJobs/;
const PREVIOUS_PUBLIC_BRAND = /OpenJobs/;

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

  it("uses FairJobs as the public brand", () => {
    expect(copy.brand).toBe("FairJobs");
    expect(copy.domain).toBe("fairjobs.cz");
    expect(JSON.stringify(copy)).not.toContain("dilnajobs.cz");
    expect(JSON.stringify(copy)).not.toContain("OpenJobs");
    expect(copy.footer).toBe("© 2026 FairJobs · nabídky práce");
    expect(copy.footer).not.toContain("fairjobs.cz");
    expect(copy.nabidky.emptyNoResultsTitle).toBe("Žádné nabídky pro tyto filtry");
    expect(copy.nabidky.emptyNoResultsBody).toBe(
      "Upravte pozici, místo nebo mzdu a zkuste to znovu.",
    );
    expect(copy.nabidky.filtersCategory).toBe("Obor");
    expect(copy.nabidky.filtersPlace).toBe("Místo");
    expect(copy.nabidky.helper).toBe("Upravte filtry podle pozice, místa a mzdy.");
    expect(copy.nabidky.helper.toLocaleLowerCase("cs")).toContain("pozice");
    expect(copy.nabidky.helper.toLocaleLowerCase("cs")).not.toContain("kategorie");
    expect(copy.nabidky.ctaEditFilters).toBe("Upravit filtry");
    expect(readFileSync("src/components/job-filters.tsx", "utf8")).not.toMatch(/Kategorie|Lokalita/);
    expect(readFileSync("src/components/job-filters.tsx", "utf8")).toContain("ctaEditFilters");
    expect(readFileSync("src/components/site-chrome.tsx", "utf8")).toContain("copy.footer");
    expect(readFileSync("src/components/site-chrome.tsx", "utf8")).not.toContain("fairjobs.cz");
    expect(readFileSync("src/app/nabidky/page.tsx", "utf8")).toContain("copy.nabidky.helper");
    expect(readFileSync("src/app/nabidky/page.tsx", "utf8")).toContain("emptyNoResultsTitle");
    expect(readFileSync("src/app/nabidky/page.tsx", "utf8")).toContain("emptyNoResultsBody");
    expect(copy.home.metaTitle).toBe("FairJobs · nabídky práce");
    expect(copy.employers.sectionWhy).toBe("Proč FairJobs");
    expect(readFileSync("src/components/site-chrome.tsx", "utf8")).toContain("Fair<span>Jobs</span>");
    expect(readFileSync("src/app/gdpr/page.tsx", "utf8")).toContain("copy.domain");
    expect(readFileSync("src/app/layout.tsx", "utf8")).toContain("applicationName: copy.brand");
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
    expect(copy.nabidky.ctaFilters).toBe("Filtry");
    expect(copy.nabidky.ctaEditFilters).toBe("Upravit filtry");
    expect(copy.nabidky.ctaFiltersDone).toBe("Hotovo");
    expect(copy.nabidky.filtersSalaryAny).toBe("Bez minima");
    expect(copy.nabidky.filtersCount(1)).toBe("1 filtr");
    expect(copy.nabidky.filtersCount(3)).toBe("3 filtry");
    expect(copy.nabidky.filtersCount(5)).toBe("5 filtrů");
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

  it("does not contain DílnaJobs or OpenJobs in user-facing strings", () => {
    const hits: string[] = [];
    function findBrand(value: unknown, path: string) {
      if (typeof value === "string") {
        if (OLD_BRAND.test(value) || PREVIOUS_PUBLIC_BRAND.test(value)) hits.push(`${path}: ${value}`);
        return;
      }
      if (typeof value === "function") {
        const sample = String(value("Acme"));
        if (OLD_BRAND.test(sample) || PREVIOUS_PUBLIC_BRAND.test(sample)) hits.push(`${path}(): ${sample}`);
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

  it("has no DílnaJobs or OpenJobs in app or component UI modules", () => {
    const files = [
      ...collectFiles("src/app", /\.(ts|tsx)$/),
      ...collectFiles("src/components", /\.(ts|tsx)$/),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (OLD_BRAND.test(text) || PREVIOUS_PUBLIC_BRAND.test(text)) hits.push(file);
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
