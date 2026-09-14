import { describe, expect, it, vi } from "vitest";
import { isValidIco, lookupAresCompany, makeValidIco, normalizeIco, parseAresSubject } from "./ico";

describe("IČO", () => {
  it("accepts a well-formed number", () => {
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

describe("parseAresSubject", () => {
  it("reads name, city and DIČ", () => {
    expect(
      parseAresSubject({
        ico: "27082440",
        obchodniJmeno: "Alza.cz a.s.",
        dic: "27082440",
        sidlo: { nazevObce: "Praha", textovaAdresa: "Jankovcova 1522/53, Praha 7" },
      }),
    ).toEqual({
      ico: "27082440",
      companyName: "Alza.cz a.s.",
      city: "Praha",
      address: "Jankovcova 1522/53, Praha 7",
      dic: "CZ27082440",
    });
  });

  it("rejects a payload without a company name", () => {
    expect(parseAresSubject({ ico: "27082440" })).toBeNull();
  });
});

describe("lookupAresCompany", () => {
  it("asks for eight digits before calling the network", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(lookupAresCompany("123")).resolves.toEqual({
      ok: false,
      error: "Zadejte osm číslic IČO.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("maps a 404 to a not-found error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 404 })),
    );
    await expect(lookupAresCompany("12345678")).resolves.toEqual({
      ok: false,
      error: "IČO v ARES nenašli. Zkontrolujte číslo.",
      notFound: true,
    });
    vi.unstubAllGlobals();
  });
});
