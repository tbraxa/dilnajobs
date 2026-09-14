import { describe, expect, it } from "vitest";
import { isPublicAuthPath, NAV, postListingHref } from "./nav-cta";

describe("postListingHref", () => {
  it("sends anonymous employers to registration, not the marketing page", () => {
    expect(postListingHref(false)).toBe("/firma/registrace");
    expect(postListingHref(false)).not.toBe("/pro-firmy");
  });

  it("sends a signed-in employer to job create", () => {
    expect(postListingHref(true)).toBe("/firma/nabidky/nova");
  });
});

describe("isPublicAuthPath", () => {
  it("covers login, register, and magic-link verify", () => {
    expect(isPublicAuthPath("/firma/prihlaseni")).toBe(true);
    expect(isPublicAuthPath("/firma/registrace")).toBe(true);
    expect(isPublicAuthPath("/firma/prihlaseni/overit")).toBe(true);
    expect(isPublicAuthPath("/")).toBe(false);
    expect(isPublicAuthPath("/pro-firmy")).toBe(false);
    expect(isPublicAuthPath("/firma")).toBe(false);
  });
});

describe("NAV", () => {
  it("keeps ceník on an anchor, not a separate marketing dump", () => {
    expect(NAV.cenik).toBe("/pro-firmy#cenik");
    expect(NAV.howItWorks).toBe("/#jak");
    expect(NAV.nabidkyFilters).toBe("/nabidky#filtry");
    expect(NAV.homeSearch).toBe("/#hledat");
  });
});
