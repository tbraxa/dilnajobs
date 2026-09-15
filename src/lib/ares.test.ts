import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupCompanyByIco } from "./ares";
import { makeValidIco } from "./ico";

const ico = makeValidIco("2707435");

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.ARES_DISABLED;
  delete process.env.ARES_TIMEOUT_MS;
});

describe("lookupCompanyByIco", () => {
  it("rejects checksum-invalid IČO without calling ARES", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await lookupCompanyByIco("12345678");
    expect(result).toMatchObject({ ok: false, source: "checksum", verificationStatus: "failed" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses pending/manual stub when ARES is disabled", async () => {
    process.env.ARES_DISABLED = "true";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await lookupCompanyByIco(ico);
    expect(result.ok).toBe(true);
    expect(result.source).toBe("stub");
    expect(result.verificationStatus).toBe("pending");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps a live ARES payload to verified", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          ico,
          obchodniJmeno: "Demo Firma s.r.o.",
          dic: "CZ" + ico,
          sidlo: { nazevObce: "Praha", nazevUlice: "Testovací", cisloDomovni: 1, psc: 11000 },
        }),
      })),
    );
    const result = await lookupCompanyByIco(ico);
    expect(result.ok).toBe(true);
    expect(result.verificationStatus).toBe("verified");
    expect(result.legalName).toBe("Demo Firma s.r.o.");
    expect(result.city).toBe("Praha");
  });

  it("falls back to pending on timeout", async () => {
    process.env.ARES_TIMEOUT_MS = "20";
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("aborted");
            err.name = "AbortError";
            reject(err);
          });
        });
      }),
    );
    const result = await lookupCompanyByIco(ico);
    expect(result.ok).toBe(false);
    expect(result.source).toBe("timeout");
    expect(result.verificationStatus).toBe("pending");
  });

  it("falls back to manual when ARES is 5xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 503, json: async () => ({}) })),
    );
    const result = await lookupCompanyByIco(ico);
    expect(result.ok).toBe(false);
    expect(result.verificationStatus).toBe("manual");
  });
});
