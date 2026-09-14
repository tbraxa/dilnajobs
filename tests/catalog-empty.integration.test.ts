import { describe, expect, it } from "vitest";
import { searchJobs } from "@/lib/jobs/search";

const url = process.env.DATABASE_URL;

describe.skipIf(!url)("empty catalog query", () => {
  it("returns [] and does not throw when nothing matches", async () => {
    const rows = await searchJobs({ city: "NeexistujiciMestoXYZ987", sort: "newest" });
    expect(rows).toEqual([]);
  });
});
