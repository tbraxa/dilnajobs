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
});
