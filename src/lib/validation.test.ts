import { describe, expect, it } from "vitest";
import { applySchema } from "./validation";
import { facetCount, nabidkyHref, parseSearch } from "./search-params";

describe("applySchema", () => {
  it("requires name, phone and GDPR consent", () => {
    const parsed = applySchema.safeParse({
      jobId: "11111111-1111-4111-8111-111111111111",
      fullName: "Jan Novák",
      phone: "+420 777 123 456",
      consentGdpr: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.phone).toBe("+420777123456");
  });

  it("rejects missing consent", () => {
    const parsed = applySchema.safeParse({
      jobId: "11111111-1111-4111-8111-111111111111",
      fullName: "Jan Novák",
      phone: "777123456",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("parseSearch", () => {
  it("keeps profession and city filters", () => {
    expect(parseSearch({ profession: "welder", city: "Ostrava", sort: "salary" })).toEqual({
      profession: "welder",
      city: "Ostrava",
      place: "Ostrava",
      sort: "salary",
      page: 1,
    });
  });

  it("maps category, place and salaryMin from URL params", () => {
    expect(parseSearch({ category: "it", place: "Praha", salaryMin: "40000", q: "vývojář" })).toEqual({
      q: "vývojář",
      category: "it",
      place: "Praha",
      city: "Praha",
      salaryMin: 40000,
      page: 1,
      sort: "newest",
    });
  });

  it("accepts mesto and mode aliases from the craft preview", () => {
    expect(parseSearch({ mesto: "Brno", mode: "remote" })).toMatchObject({
      place: "Brno",
      workMode: "remote",
      page: 1,
      sort: "newest",
    });
  });

  it("drops unknown profession instead of throwing", () => {
    expect(parseSearch({ profession: "astronaut" })).toEqual({ sort: "newest", page: 1 });
  });
});

describe("nabidkyHref and facetCount", () => {
  it("writes category, place, salary and mode to the query string", () => {
    expect(
      nabidkyHref(
        { page: 1, sort: "newest" },
        { category: "it", place: "Praha", salaryMin: 40000, workMode: "hybrid" },
      ),
    ).toBe("/nabidky?place=Praha&category=it&salaryMin=40000&mode=hybrid");
  });

  it("clears a facet when the patch is undefined", () => {
    expect(
      nabidkyHref(
        { category: "it", place: "Brno", salaryMin: 40000, workMode: "remote", page: 1, sort: "newest" },
        { salaryMin: undefined, page: 1 },
      ),
    ).toBe("/nabidky?place=Brno&category=it&mode=remote");
  });

  it("counts drawer facets including place, and ignores free-text query", () => {
    expect(facetCount({ q: "účetní" })).toBe(0);
    expect(facetCount({ q: "účetní", place: "Praha" })).toBe(1);
    expect(facetCount({ category: "it", salaryMin: 40000, workMode: "hybrid", contract: "hpp" })).toBe(4);
    expect(facetCount({ category: "manufacturing", profession: "manufacturing" })).toBe(1);
    expect(facetCount({ category: "manufacturing", profession: "welder" })).toBe(2);
  });
});
