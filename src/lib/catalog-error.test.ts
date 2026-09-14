import { describe, expect, it } from "vitest";
import { isMissingRelationError } from "./catalog-error";

describe("isMissingRelationError", () => {
  it("detects Postgres undefined_table", () => {
    expect(isMissingRelationError({ code: "42P01", message: 'relation "jobs" does not exist' })).toBe(
      true,
    );
    expect(
      isMissingRelationError(Object.assign(new Error('relation "employers" does not exist'), { code: "42P01" })),
    ).toBe(true);
  });

  it("ignores unrelated failures", () => {
    expect(isMissingRelationError(new Error("timeout"))).toBe(false);
    expect(isMissingRelationError({ code: "57014" })).toBe(false);
  });
});
