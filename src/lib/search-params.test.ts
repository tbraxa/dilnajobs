import { describe, expect, it } from "vitest";
import { hasActiveFilters, toNabidkyHref } from "./search-params";

describe("toNabidkyHref", () => {
  it("clears profession when the key is present as undefined", () => {
    expect(toNabidkyHref({ profession: "cnc", city: "Brno", sort: "newest" }, { profession: undefined })).toBe(
      "/nabidky?city=Brno",
    );
  });

  it("toggles a profession onto an empty query", () => {
    expect(toNabidkyHref(undefined, { profession: "welder" })).toBe("/nabidky?profession=welder");
  });

  it("omits default newest sort", () => {
    expect(toNabidkyHref({ sort: "newest" })).toBe("/nabidky");
  });
});

describe("hasActiveFilters", () => {
  it("ignores default newest sort", () => {
    expect(hasActiveFilters({ sort: "newest" })).toBe(false);
  });

  it("detects keyword, profession, or city", () => {
    expect(hasActiveFilters({ q: "Fanuc", sort: "newest" })).toBe(true);
    expect(hasActiveFilters({ profession: "cnc", sort: "newest" })).toBe(true);
    expect(hasActiveFilters({ city: "Brno", sort: "newest" })).toBe(true);
  });

  it("treats salary sort as an active filter", () => {
    expect(hasActiveFilters({ sort: "salary" })).toBe(true);
  });
});
