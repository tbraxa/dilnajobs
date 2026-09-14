import { describe, expect, it } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";
import { GET as readyGet } from "@/app/api/ready/route";
import { GET as adminHealthGet } from "@/app/api/admin/health/route";
import { rollupStatus, type HealthCheck } from "@/lib/health-types";

function check(name: string, status: HealthCheck["status"], extra: Partial<HealthCheck> = {}): HealthCheck {
  return { name, status, checkedAt: "2026-01-01T00:00:00.000Z", ...extra };
}

describe("GET /api/health", () => {
  it("returns liveness 200 without touching dependencies", async () => {
    const res = await healthGet();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: "ok" });
  });
});

describe("GET /api/ready", () => {
  it("returns 200 when Postgres answers SELECT 1", async () => {
    const res = await readyGet();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; postgres: { ok: boolean } };
    expect(body.status).toBe("ok");
    expect(body.postgres.ok).toBe(true);
  });
});

describe("GET /api/admin/health", () => {
  it("rejects missing admin cookie", async () => {
    const res = await adminHealthGet(new Request("http://localhost:3000/api/admin/health"));
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "unauthorized" });
  });
});

describe("health rollup", () => {
  it("is down when postgres fails even if others look fine", () => {
    expect(
      rollupStatus([check("postgres", "down", { critical: true }), check("mailer", "ok")]),
    ).toBe("down");
  });

  it("is down when auth fails", () => {
    expect(rollupStatus([check("postgres", "ok", { critical: true }), check("auth", "down", { critical: true })])).toBe(
      "down",
    );
  });

  it("is degraded when an optional check is down or unconfigured", () => {
    expect(rollupStatus([check("postgres", "ok"), check("auth", "ok"), check("mailer", "unconfigured")])).toBe(
      "degraded",
    );
    expect(rollupStatus([check("postgres", "ok"), check("auth", "ok"), check("object_storage", "down")])).toBe(
      "degraded",
    );
  });

  it("is ok when every check is ok", () => {
    expect(rollupStatus([check("postgres", "ok"), check("auth", "ok"), check("mailer", "ok")])).toBe("ok");
  });
});
