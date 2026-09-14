import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CATALOG_UNAVAILABLE_DETAIL, CATALOG_UNAVAILABLE_TITLE } from "./catalog-unavailable";

const FORBIDDEN = /migrac|checksum|tabulk|env |konzol|lokáln/i;

describe("CatalogUnavailable copy", () => {
  it("is user-facing Czech without operator jargon", () => {
    expect(CATALOG_UNAVAILABLE_TITLE).toBe("Nabídky teď nejsou k dispozici");
    expect(CATALOG_UNAVAILABLE_DETAIL).toMatch(/ahoj@dilnajobs\.cz/);
    expect(CATALOG_UNAVAILABLE_TITLE).not.toMatch(FORBIDDEN);
    expect(CATALOG_UNAVAILABLE_DETAIL).not.toMatch(FORBIDDEN);
  });

  it("does not leave migration copy in the component source", () => {
    const src = readFileSync(new URL("./catalog-unavailable.tsx", import.meta.url), "utf8");
    expect(src).not.toMatch(/migrac/i);
    expect(src).not.toMatch(/tabulky/i);
  });
});
