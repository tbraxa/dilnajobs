import { describe, expect, it } from "vitest";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
const adminUrl = process.env.DATABASE_ADMIN_URL;

describe.skipIf(!url || !adminUrl)("RLS applications isolation", () => {
  it("employer sees only own applications", async () => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const employers = await admin.query<{ id: string; company_name: string }>(
      "select id, company_name from employers order by company_name",
    );
    const novak = employers.rows.find((r) => r.company_name.includes("Novák"));
    const morava = employers.rows.find((r) => r.company_name.includes("Morava"));
    expect(novak && morava).toBeTruthy();
    await admin.end();

    const app = new Client({ connectionString: url });
    await app.connect();

    const open = await app.query("select count(*)::int as n from applications");
    expect(open.rows[0].n).toBe(0);

    await app.query("begin");
    await app.query("select set_config('app.employer_id', $1, true)", [novak!.id]);
    const mine = await app.query("select employer_id from applications");
    expect(mine.rows.length).toBeGreaterThan(0);
    expect(mine.rows.every((r) => r.employer_id === novak!.id)).toBe(true);
    await app.query("rollback");

    await app.query("begin");
    await app.query("select set_config('app.employer_id', $1, true)", [morava!.id]);
    const theirs = await app.query("select employer_id from applications");
    expect(theirs.rows.every((r) => r.employer_id === morava!.id)).toBe(true);
    expect(theirs.rows.some((r) => r.employer_id === novak!.id)).toBe(false);
    await app.query("rollback");

    await app.query("begin");
    await app.query("select set_config('app.is_admin', 'true', true)");
    const asAdmin = await app.query<{ employer_id: string }>("select employer_id from applications");
    const ids = new Set(asAdmin.rows.map((r) => r.employer_id));
    expect(ids.has(novak!.id)).toBe(true);
    expect(ids.has(morava!.id)).toBe(true);
    await app.query("rollback");

    await app.end();
  });
});
