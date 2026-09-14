import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { formatSalary } from "./pricing";

const PUBLIC_FILES = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/nabidky/page.tsx",
  "src/app/pro-firmy/page.tsx",
  "src/app/gdpr/page.tsx",
  "src/app/obchodni-podminky/page.tsx",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/firma/prihlaseni/page.tsx",
  "src/app/firma/registrace/page.tsx",
  "src/app/firma/prihlaseni/overit/page.tsx",
  "src/app/nabidka/[slug]/page.tsx",
  "src/app/prace/[profese]/[mesto]/page.tsx",
  "src/components/v9/chrome.tsx",
  "src/components/v9/board.tsx",
  "src/components/auth-shell.tsx",
  "src/components/catalog-unavailable.tsx",
  "src/components/ui.tsx",
  "src/lib/pricing.ts",
];

describe("formatSalary", () => {
  it("joins ranges with až, not an en dash", () => {
    expect(formatSalary(45000, 55000)).toContain("až");
    expect(formatSalary(45000, 55000)).toMatch(/Kč \/ měsíc$/);
    expect(formatSalary(45000, 55000)).not.toMatch(/[—–]/);
  });
});

describe("public copy", () => {
  it("does not use em dash or en dash in live UI sources", () => {
    for (const file of PUBLIC_FILES) {
      const src = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
      expect(src, file).not.toMatch(/[—–]/);
    }
  });
});
