import { describe, expect, it } from "vitest";
import { LOCAL_APP_URL, resolveAppHost, resolveAppUrl, toAppUrl } from "./app-url";

describe("resolveAppUrl", () => {
  it("does not throw when APP_URL is empty (Vercel first deploy)", () => {
    expect(resolveAppUrl({ APP_URL: "", NEXT_PUBLIC_APP_URL: "" })).toBe(LOCAL_APP_URL);
    expect(() => new URL(resolveAppUrl({ APP_URL: "" }))).not.toThrow();
  });

  it("treats whitespace-only APP_URL as missing", () => {
    expect(resolveAppUrl({ APP_URL: "   " })).toBe(LOCAL_APP_URL);
  });

  it("prefers a valid APP_URL origin (strips path and trailing slash)", () => {
    expect(resolveAppUrl({ APP_URL: "https://dilnajobs.cz/app/" })).toBe("https://dilnajobs.cz");
  });

  it("falls back to NEXT_PUBLIC_APP_URL when APP_URL is empty", () => {
    expect(
      resolveAppUrl({ APP_URL: "", NEXT_PUBLIC_APP_URL: "https://preview.example" }),
    ).toBe("https://preview.example");
  });

  it("uses https://VERCEL_URL when APP_URL is empty", () => {
    expect(
      resolveAppUrl({ APP_URL: "", VERCEL_URL: "dilnajobs-git-main.vercel.app" }),
    ).toBe("https://dilnajobs-git-main.vercel.app");
  });

  it("strips a protocol accidentally stored in VERCEL_URL", () => {
    expect(resolveAppUrl({ VERCEL_URL: "https://foo.vercel.app" })).toBe("https://foo.vercel.app");
  });

  it("ignores invalid APP_URL and keeps falling back", () => {
    expect(resolveAppUrl({ APP_URL: "not-a-url", VERCEL_URL: "ok.vercel.app" })).toBe(
      "https://ok.vercel.app",
    );
  });
});

describe("toAppUrl / resolveAppHost", () => {
  it("builds redirects without calling new URL('')", () => {
    const url = toAppUrl("/firma/prihlaseni", { APP_URL: "" });
    expect(url.href).toBe(`${LOCAL_APP_URL}/firma/prihlaseni`);
  });

  it("exposes host for Next serverActions.allowedOrigins", () => {
    expect(resolveAppHost({ APP_URL: "" })).toBe("localhost:3000");
    expect(resolveAppHost({ APP_URL: "https://dilnajobs.cz" })).toBe("dilnajobs.cz");
  });
});
