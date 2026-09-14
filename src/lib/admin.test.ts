import { describe, expect, it } from "vitest";
import { maskPhone } from "@/lib/mask";

describe("maskPhone", () => {
  it("keeps the first three and last three characters", () => {
    expect(maskPhone("+420777111222")).toBe("+42•••222");
  });

  it("strips spaces before masking", () => {
    expect(maskPhone("+420 777 111 222")).toBe("+42•••222");
  });

  it("hides very short values entirely", () => {
    expect(maskPhone("12345")).toBe("•••");
  });
});
