import { describe, expect, it } from "vitest";
import {
  articleJsonLd,
  breadcrumbsJsonLd,
  collectionPageJsonLd,
  courseJsonLd,
  jobPostingJsonLd,
  siteJsonLd,
  webApplicationJsonLd,
} from "./structured-data";

describe("structured data", () => {
  it("publishes organization, website, and job search schema", () => {
    const schema = siteJsonLd() as Record<string, unknown>[];
    expect(schema.map((item) => item["@type"])).toEqual(["Organization", "WebSite"]);
    expect(JSON.stringify(schema)).toContain("search_term_string");
    expect(JSON.stringify(schema)).toContain("/nabidky");
  });

  it("builds collection, article, breadcrumb, and application shells", () => {
    const collection = collectionPageJsonLd({
      name: "Poradna",
      description: "Články",
      path: "/poradna",
      items: [{ name: "Článek", path: "/poradna/clanek", type: "Article" }],
    });
    const article = articleJsonLd({
      headline: "Článek",
      description: "Popis",
      path: "/poradna/clanek",
      image: "https://images.unsplash.com/photo-test",
      published: "2026-09-15T00:00:00+02:00",
    });
    const breadcrumbs = breadcrumbsJsonLd([
      { name: "FairJobs", path: "/" },
      { name: "Článek", path: "/poradna/clanek" },
    ]);
    const application = webApplicationJsonLd({
      name: "Kalkulačka",
      description: "Výpočet",
      path: "/nastroje/cisty-plat",
      features: ["Výpočet bez registrace"],
    });

    expect((collection as Record<string, unknown>)["@type"]).toBe("CollectionPage");
    expect((article as Record<string, unknown>)["@type"]).toBe("Article");
    expect((breadcrumbs as Record<string, unknown>)["@type"]).toBe("BreadcrumbList");
    expect((application as Record<string, unknown>)["@type"]).toBe("WebApplication");
  });

  it("publishes complete salary and location data for a job", () => {
    const schema = jobPostingJsonLd({
      companyName: "Ověřená firma s.r.o.",
      ico: "12345678",
      job: {
        id: "job-1",
        slug: "ucetni-praha",
        title: "Účetní",
        description: "Vedení účetnictví.",
        requirements: "Praxe dva roky.",
        benefits: "Pět týdnů dovolené.",
        profession: "accounting",
        city: "Praha",
        region: "Hlavní město Praha",
        employmentType: "full_time",
        workMode: "hybrid",
        salaryMin: 45000,
        salaryMax: 55000,
        salaryNote: null,
        publishedAt: new Date("2026-09-15T08:00:00Z"),
        expiresAt: new Date("2026-10-15T08:00:00Z"),
      },
    }) as Record<string, unknown>;

    expect(schema["@type"]).toBe("JobPosting");
    expect(schema.directApply).toBe(true);
    expect(schema.employmentType).toBe("FULL_TIME");
    expect(schema.industry).toBe("Účetnictví a finance");
    expect(schema.jobLocation).toBeTruthy();
    expect(JSON.stringify(schema.baseSalary)).toContain("55000");
  });

  it("uses telecommute schema only for fully remote work", () => {
    const schema = jobPostingJsonLd({
      companyName: "SoftForge Czech s.r.o.",
      ico: "12345678",
      job: {
        id: "job-2",
        slug: "vyvojar-na-dalku",
        title: "Vývojář TypeScript",
        description: "Vývoj aplikace.",
        requirements: null,
        benefits: null,
        profession: "it",
        city: "Praha",
        region: "Hlavní město Praha",
        employmentType: "full_time",
        workMode: "remote",
        salaryMin: 80000,
        salaryMax: 110000,
        salaryNote: null,
        publishedAt: null,
        expiresAt: null,
      },
    }) as Record<string, unknown>;

    expect(schema.jobLocationType).toBe("TELECOMMUTE");
    expect(schema.applicantLocationRequirements).toBeTruthy();
    expect(schema.jobLocation).toBeUndefined();
  });

  it("builds Course schema only from a complete provider-backed contract", () => {
    const schema = courseJsonLd({
      id: "course-1",
      slug: "ucetnictvi-v-praxi",
      title: "Účetnictví v praxi",
      provider: { name: "Ověřený poskytovatel", url: "https://provider.example" },
      mode: "hybrid",
      durationIso: "PT80H",
      priceCzk: 12000,
      isFree: false,
      location: { city: "Praha", region: "Hlavní město Praha", country: "CZ" },
      description: "Praktický kurz účetnictví.",
      ctaUrl: "https://provider.example/course",
      categoryTags: ["finance"],
      professionTags: ["accounting"],
      publishedAt: new Date("2026-09-15T08:00:00Z"),
      updatedAt: new Date("2026-09-16T08:00:00Z"),
    }) as Record<string, unknown>;

    expect(schema["@type"]).toBe("Course");
    expect(schema.provider).toEqual({
      "@type": "Organization",
      name: "Ověřený poskytovatel",
      url: "https://provider.example",
    });
    expect(JSON.stringify(schema)).toContain("CourseInstance");
    expect(JSON.stringify(schema)).toContain("12000");
  });
});
