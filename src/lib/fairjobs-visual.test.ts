import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GUIDE_NAV_COLUMNS, PUBLIC_DESTINATION_HUBS } from "./public-navigation";

const read = (path: string) => readFileSync(path, "utf8");

describe("new FairJobs visual system", () => {
  it("contains no rejected DílnaJobs or Craft visual tokens", () => {
    const files = [
      "src/app/globals.css",
      "src/app/fairjobs.css",
      "src/app/page.tsx",
      "src/app/nabidky/page.tsx",
      "src/app/nabidka/[slug]/page.tsx",
      "src/app/pro-firmy/page.tsx",
      "src/app/firma/prihlaseni/page.tsx",
      "src/app/firma/registrace/page.tsx",
    ];
    const rejected =
      /workshop-grid|#f2f0ea|--paper|bg-paper|text-steel|search-shell|hero-visual|shadow-card|coral|cream|fraunces|preview-v9/i;

    expect(files.filter((file) => rejected.test(read(file)))).toEqual([]);
    expect(read("src/app/fairjobs.css")).not.toMatch(/yellow|#ffd84d|text-transform:\s*uppercase/i);
  });

  it("locks the national destination navigation", () => {
    const nav = [
      read("src/components/fairjobs-navigation.tsx"),
      read("src/lib/public-navigation.ts"),
    ].join("\n");
    for (const label of ["Nabídky", "Průvodce", "Pro firmy", "Vytvořit životopis", "Přihlášení firem"]) {
      expect(nav).toContain(label);
    }
    for (const hub of ["Poradna", "Kurzy", "Nástroje"]) {
      expect(nav).toContain(hub);
    }
    expect(GUIDE_NAV_COLUMNS.every((column) => column.links.length <= 5)).toBe(true);
    expect(GUIDE_NAV_COLUMNS[2].links).toEqual([
      ["Čistý plat", "/nastroje/cisty-plat"],
      ["Orientace ve mzdě", "/nastroje/mzda-obor"],
      ["Přehled kalkulaček", "/nastroje"],
    ]);
    expect(PUBLIC_DESTINATION_HUBS.map(({ label, href }) => [label, href])).toEqual([
      ["Poradna", "/poradna"],
      ["Kurzy", "/kurzy"],
      ["Nástroje", "/nastroje"],
    ]);
  });

  it("keeps destination modules on the homepage", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("Z poradny");
    expect(home).toContain("Kurzy a rekvalifikace");
    expect(home).toContain("Nástroje FairJobs");
    const courseModule = home.match(/<section className="fj-courses-module">([\s\S]*?)<\/section>/)?.[1] ?? "";
    expect(courseModule).toContain("Kurzy připravujeme");
    expect(courseModule).not.toContain("Katalog připravujeme");
    expect(home).toContain(">2026<");
  });

  it("contains no fake window or floating sticker chrome", () => {
    const source = [
      read("src/app/page.tsx"),
      read("src/app/pro-firmy/page.tsx"),
      read("src/app/firma/prihlaseni/page.tsx"),
      read("src/app/firma/registrace/page.tsx"),
      read("src/components/employer-dashboard-preview.tsx"),
      read("src/components/fairjobs-pricing.tsx"),
      read("src/components/fairjobs-navigation.tsx"),
      read("src/app/fairjobs.css"),
    ].join("\n");
    expect(source).not.toMatch(/preview-topbar|pricing-browserbar|cover-proof|auth-photo-tag|mega-feature|Katalog připravujeme|2024/);
  });

  it("keeps long dashes out of rendered component copy", () => {
    const files = [
      "src/app/page.tsx",
      "src/app/nabidky/page.tsx",
      "src/app/nabidka/[slug]/page.tsx",
      "src/app/pro-firmy/page.tsx",
      "src/app/firma/prihlaseni/page.tsx",
      "src/app/firma/registrace/page.tsx",
      "src/components/fairjobs-chrome.tsx",
      "src/components/fairjobs-navigation.tsx",
      "src/components/fairjobs-job-row.tsx",
      "src/components/job-search-panel.tsx",
    ];

    expect(files.filter((file) => /[\u2013\u2014]/.test(read(file)))).toEqual([]);
  });
});
