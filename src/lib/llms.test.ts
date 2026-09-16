import { describe, expect, it } from "vitest";
import { GET } from "@/app/llms.txt/route";

describe("GET /llms.txt", () => {
  it("describes only public FairJobs sources as plain text", async () => {
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("# FairJobs");
    expect(body).toContain("/nabidky");
    expect(body).toContain("/poradna");
    expect(body).toContain("/kurzy");
    expect(body).toContain("/nastroje/cisty-plat");
    expect(body).toContain("Do not infer salary");
    expect(body).not.toContain("SESSION_SECRET");
  });
});
