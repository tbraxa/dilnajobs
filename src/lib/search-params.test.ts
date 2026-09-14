import { describe, expect, it } from "vitest";
import { toNabidkyHref } from "./search-params";

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
