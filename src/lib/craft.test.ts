import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companyInitial, companyMarkClass, isNewJob, jobMediaClass, publishedLabel } from "./craft";
import { copy } from "./copy";
import { PHOTOS, UNSPLASH_HOST } from "./photos";

const FORBIDDEN = [
  "#E03145",
  "#e03145",
  "Fraunces",
  "#003DFF",
  "#003dff",
  "#4F46E5",
  "#4f46e5",
  "#635BFF",
  "#635bff",
  "#FF385C",
  "#ff385c",
  "#F4EDE3",
  "#f4ede3",
];

describe("Enterprise Clean Craft tokens", () => {
  it("locks CTA, link, verified, ink and border in craft CSS", () => {
    const css = readFileSync("src/app/craft.css", "utf8");
    expect(css).toContain("--accent: #222222");
    expect(css).toContain("--link: #0047FF");
    expect(css).toContain("--success: #008A05");
    expect(css).toContain("--ink: #0A0A0A");
    expect(css).toContain("--border: #EBEBEB");
    expect(css).toContain("--bg-hero: #F5F5F6");
    expect(css).toContain("--bg-listings: #F7F7F8");
    expect(css).toContain("--bg-employer: #0A0A0A");
    expect(css).toContain("--shadow-card:");
    expect(css.toLowerCase()).toContain("inter");
    expect(css).not.toContain(":global(");
    expect(css).toMatch(/\.job-card\s*\{[^}]*overflow:\s*visible/);
    expect(css).toContain(".job-card-media-inner");
    expect(css).toMatch(/\.job-card-media-inner\s*\{[^}]*overflow:\s*hidden/);
    expect(css).toContain("font-size: 1.25rem");
    expect(css).toContain("font-weight: 700");
    expect(css).toMatch(/\.badge-verified svg[\s\S]*overflow:\s*visible/);
    expect(css).toMatch(/\.filter-chip \.chip-icon[\s\S]*min-width:\s*16px/);
    expect(css).not.toMatch(/img,\s*svg\s*\{[^}]*max-width:\s*100%/);
    expect(css).toMatch(/\.why-icon\s*\{[^}]*width:\s*44px/);
    expect(css).toMatch(/\.why-icon svg\s*\{[^}]*width:\s*20px/);
    expect(css).toMatch(/\.why-icon svg[\s\S]*max-width:\s*20px/);
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) 360px");
    expect(css).toContain(".facts-strip");
    expect(css).toContain(".apply-panel");
    expect(css).toContain(".sticky-apply");
    expect(css).not.toContain(".filters-sticky");
    expect(css).toContain(".serp-row-search");
    expect(css).toContain(".serp-row-chips");
    expect(css).toContain(".serp-sheet");
    expect(css).toContain(".serp-field");
    expect(css).not.toContain(".search-shell-compact");
    expect(css).not.toMatch(/\.serp-chrome\s*\{[^}]*height:\s*56px/);
    expect(css).toMatch(/a\.job-row/);
    expect(css).toMatch(/\.job-row-inner\s*\{[^}]*grid-template-columns:\s*96px minmax\(0, 1fr\) auto/);
    expect(css).toMatch(/\.job-row-media\s*\{[^}]*overflow:\s*visible/);
    expect(css).toMatch(/\.job-row-media-inner\s*\{[^}]*overflow:\s*hidden/);
    expect(css).toMatch(/\.footer-inner\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto/);
    expect(css).toContain("0 12px 28px rgba(10, 10, 10, 0.10)");
    for (const token of FORBIDDEN) {
      expect(css).not.toContain(token);
    }
  });

  it("keeps Unsplash photo IDs from preview-v3.1", () => {
    expect(UNSPLASH_HOST).toBe("images.unsplash.com");
    expect(PHOTOS.officeTall.id).toBe("photo-1497366216548-37526070297c");
    expect(PHOTOS.warehouse.id).toBe("photo-1586528116311-ad8dd3c8310d");
    expect(PHOTOS.workshop.id).toBe("photo-1504917595217-d4dc5ebe6122");
    expect(PHOTOS.teamMeeting.id).toBe("photo-1521737711867-e3b97375f902");
    expect(PHOTOS.officeWide.src).toContain(UNSPLASH_HOST);
    expect(PHOTOS.cityStreet.id).toBe("photo-1504917595217-d4dc5ebe6122");
    const mosaic = readFileSync("src/components/hero-mosaic.tsx", "utf8");
    expect(mosaic).toContain("PHOTOS.workshop.src");
    expect(mosaic).not.toContain("PHOTOS.cityStreet");
    expect(mosaic).not.toContain("photo-1467260200982-5ba258642c12");
    expect(readFileSync("src/components/craft-marks.tsx", "utf8")).toContain("width={20}");
  });

  it("maps company marks and category media without text-only cards", () => {
    expect(companyInitial("Acme s.r.o.")).toBe("A");
    expect(companyMarkClass("Acme s.r.o.")).toMatch(/^co-/);
    expect(jobMediaClass("it")).toBe("media-it");
    expect(jobMediaClass("logistics")).toBe("media-logi");
    expect(jobMediaClass("manufacturing")).toBe("media-mfg");
  });

  it("keeps a lean placeholder price block on /pro-firmy", () => {
    const page = readFileSync("src/app/pro-firmy/page.tsx", "utf8");
    const card = readFileSync("src/components/job-card.tsx", "utf8");
    expect(page).toContain('id="cenik"');
    expect(page).toContain("/firma/registrace");
    expect(page).not.toContain("startCheckout");
    expect(page).not.toContain("Stripe");
    expect(card).toContain("job-card-media-inner");
    expect(copy.employers.sectionPricing).toBe("Ceny");
    expect(copy.employers.pricingHelper).toBe(
      "Ceny bez DPH. Orientace pro firmy. Platbu domluvíte po registraci.",
    );
  });

  it("keeps /nabidky filters compact instead of a sticky half-screen panel", () => {
    const page = readFileSync("src/app/nabidky/page.tsx", "utf8");
    const filters = readFileSync("src/components/job-filters.tsx", "utf8");
    const card = readFileSync("src/components/job-card.tsx", "utf8");
    expect(page).not.toContain("filters-sticky");
    expect(page).toContain("JobFilters");
    expect(filters).toContain("serp-row-search");
    expect(filters).toContain("serp-row-chips");
    expect(filters).toContain("serp-sheet");
    expect(filters).toContain("ctaEditFilters");
    expect(filters).toContain("serp-field");
    expect(card).toContain("job-row-media-inner");
  });

  it("prints pack published labels", () => {
    const today = new Date();
    expect(publishedLabel(today)).toBe(copy.card.publishedToday);
    expect(isNewJob(today)).toBe(true);
    const twoDays = new Date(today);
    twoDays.setDate(today.getDate() - 2);
    expect(publishedLabel(twoDays)).toBe(copy.card.publishedDaysAgo(2));
  });
});
