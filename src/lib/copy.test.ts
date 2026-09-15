import { describe, expect, it } from "vitest";
import { copy, salaryFrom, salaryRange } from "./copy";
import { formatSalary } from "./pricing";

const DASHES = /[—–]/;

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

describe("COPY-PACK", () => {
  it("keeps the locked homepage claim", () => {
    expect(copy.claim).toBe("Práce v Česku. Od firem.");
  });

  it("uses OpenJobs as the public brand", () => {
    expect(copy.brand).toBe("OpenJobs");
  });

  it("does not contain DílnaJobs in user-facing strings", () => {
    const hits: string[] = [];
    function findBrand(value: unknown, path: string) {
      if (typeof value === "string") {
        if (value.includes("DílnaJobs") || value.includes("DilnaJobs")) hits.push(`${path}: ${value}`);
        return;
      }
      if (typeof value === "function") {
        const sample = String(value("Acme"));
        if (sample.includes("DílnaJobs") || sample.includes("DilnaJobs")) hits.push(`${path}(): ${sample}`);
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

  it("has no em dash or en dash in user-facing strings", () => {
    const hits: string[] = [];
    walk(copy, "", hits);
    expect(hits).toEqual([]);
    expect(salaryRange(40000, 50000)).not.toMatch(DASHES);
    expect(salaryFrom(40000)).not.toMatch(DASHES);
    expect(formatSalary(40000, 50000)).not.toMatch(DASHES);
  });
});
