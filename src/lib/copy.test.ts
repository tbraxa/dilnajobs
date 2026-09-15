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

  it("has no em dash or en dash in user-facing strings", () => {
    const hits: string[] = [];
    walk(copy, "", hits);
    expect(hits).toEqual([]);
    expect(salaryRange(40000, 50000)).not.toMatch(DASHES);
    expect(salaryFrom(40000)).not.toMatch(DASHES);
    expect(formatSalary(40000, 50000)).not.toMatch(DASHES);
  });
});
