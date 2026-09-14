import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("v9 public chrome", () => {
  it("locks scrollbar-gutter and forbids body max-width 100vw", () => {
    const css = readFileSync(new URL("../styles/v9.css", import.meta.url), "utf8");
    expect(css).toContain("scrollbar-gutter: stable");
    expect(css).not.toMatch(/body\s*\{[^}]*max-width:\s*100vw/);
    expect(css).toContain("--header-h: 56px");
    expect(css).toContain("--max: 1120px");
  });

  it("is the live layout stylesheet, not the cream-grid cascade", () => {
    const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    expect(layout).toMatch(/@\/styles\/v9\.css/);
    expect(layout).not.toMatch(/preview\.css/);
    expect(layout).not.toMatch(/preview-cascade/);
    expect(layout).not.toMatch(/PreviewHeader/);
    expect(layout).toMatch(/SiteHeader/);
    expect(layout).toMatch(/#ffffff/);
    expect(layout).not.toMatch(/Satoshi/);
  });

  it("ports copy-pack v9 classes, not the older rail snapshot", () => {
    const css = readFileSync(new URL("../styles/v9.css", import.meta.url), "utf8");
    expect(css).toContain(".header-inner");
    expect(css).toContain(".search-bar");
    expect(css).toContain(".job-row");
    expect(css).toContain(".auth-page");
    expect(css).toContain(".price-card");
    expect(css).toContain(".logo-mark span");
    expect(css).not.toContain(".header-row");
    const chrome = readFileSync(new URL("../components/v9/chrome.tsx", import.meta.url), "utf8");
    expect(chrome).toContain("header-inner");
    expect(chrome).toContain("menu-toggle");
    expect(chrome).not.toContain("nav-toggle");
    const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
    expect(home).toContain("Práce ve výrobě. Přímo od firem.");
    const firms = readFileSync(new URL("../app/pro-firmy/page.tsx", import.meta.url), "utf8");
    expect(firms).toContain("2 490 Kč");
    expect(firms).toContain("6 990 Kč");
    expect(firms).not.toContain("2 990 Kč");
    expect(firms).not.toContain("8 900 Kč");
  });
});
