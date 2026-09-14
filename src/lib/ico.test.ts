import { describe, expect, it } from "vitest";
import { isValidIco, makeValidIco, normalizeIco } from "./ico";

describe("IČO", () => {
  it("accepts a checksum-valid number", () => {
    const ico = makeValidIco("2691930");
    expect(ico).toHaveLength(8);
    expect(isValidIco(ico)).toBe(true);
  });

  it("rejects a flipped check digit", () => {
    const ico = makeValidIco("2691930");
    const bad = ico.slice(0, 7) + (ico[7] === "0" ? "1" : "0");
    expect(isValidIco(bad)).toBe(false);
  });

  it("strips spaces", () => {
    const ico = makeValidIco("1234567");
    expect(isValidIco(normalizeIco(`${ico.slice(0, 4)} ${ico.slice(4)}`))).toBe(true);
  });
});
