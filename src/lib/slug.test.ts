import { describe, expect, it } from "vitest";
import { jobSlug, slugify } from "./slug";

describe("slugify", () => {
  it("strips diacritics", () => {
    expect(slugify("Svářeč Plzeň")).toBe("svarec-plzen");
  });
});

describe("jobSlug", () => {
  it("is stable prefix plus unique suffix", () => {
    const slug = jobSlug("CNC operátor", "Brno", "abcdefghij");
    expect(slug.startsWith("cnc-operator-brno-")).toBe(true);
    expect(slug.endsWith("abcdefgh")).toBe(true);
  });
});
