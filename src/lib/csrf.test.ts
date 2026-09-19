import { describe, expect, it } from "vitest";
import { isCsrfSafeRequest } from "./csrf";

const base = {
  method: "POST",
  pathname: "/ucet/prihlaseni/overit/akce",
  origin: "https://fairjobs.cz",
  host: "fairjobs.cz",
  forwardedHost: null,
  secFetchSite: "same-origin",
};

describe("CSRF mutation gate", () => {
  it("accepts a same-origin mutation", () => {
    expect(isCsrfSafeRequest(base)).toBe(true);
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

  it("rejects an origin with the wrong host", () => {
    expect(
      isCsrfSafeRequest({
        ...base,
        origin: "https://attacker.example",
        secFetchSite: null,
      }),
    ).toBe(false);
  });

  it("allows Stripe's signature-authenticated webhook", () => {
    expect(
      isCsrfSafeRequest({
        ...base,
        pathname: "/api/stripe/webhook",
        origin: null,
        secFetchSite: "cross-site",
      }),
    ).toBe(true);
  });
});
