import { describe, expect, it } from "vitest";
import { isCsrfSafeRequest } from "./csrf";

const base = {
  method: "POST",
  pathname: "/ucet/profil",
  origin: "https://fairjobs.cz",
  host: "fairjobs.cz",
  forwardedHost: null,
  secFetchSite: "same-origin",
};

describe("CSRF mutation gate", () => {
  it("accepts same-origin browser mutations", () => {
    expect(isCsrfSafeRequest(base)).toBe(true);
  });

  it("accepts the external host supplied by a trusted proxy", () => {
    expect(
      isCsrfSafeRequest({
        ...base,
        host: "internal.vercel",
        forwardedHost: "fairjobs.cz",
      }),
    ).toBe(true);
  });

  it("rejects cross-site browser mutations", () => {
    expect(
      isCsrfSafeRequest({
        ...base,
        origin: "https://attacker.example",
        secFetchSite: "cross-site",
      }),
    ).toBe(false);
  });

  it("fails closed when a browser mutation has no origin", () => {
    expect(isCsrfSafeRequest({ ...base, origin: null })).toBe(false);
  });

  it("does not interfere with ticket- or signature-authenticated APIs", () => {
    expect(
      isCsrfSafeRequest({
        ...base,
        pathname: "/api/cv/local-upload",
        origin: null,
        secFetchSite: "cross-site",
      }),
    ).toBe(true);
  });
});
