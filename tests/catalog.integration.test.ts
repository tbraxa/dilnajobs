import { describe, expect, it } from "vitest";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
const adminUrl = process.env.DATABASE_ADMIN_URL;

describe.skipIf(!url || !adminUrl)("public catalog + apply insert", () => {
  it("lists published jobs and persists an application", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();
    const jobs = await app.query<{ id: string }>(
      "select id from jobs where status = 'published' limit 1",
    );
    expect(jobs.rows.length).toBe(1);

    const drafts = await app.query("select count(*)::int as n from jobs where status <> 'published'");
    expect(drafts.rows[0].n).toBe(0);

    const phone = `+42077${String(Date.now()).slice(-7)}`;
    await app.query(
      `insert into applications (job_id, employer_id, full_name, phone, consent_gdpr)
       values ($1, $2, $3, $4, true)`,
      [jobs.rows[0].id, "00000000-0000-0000-0000-000000000000", "Test Apply", phone],
    );
    await app.end();

    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const saved = await admin.query("select full_name from applications where phone = $1", [phone]);
    expect(saved.rows[0]?.full_name).toBe("Test Apply");
    await admin.query("delete from applications where phone = $1", [phone]);
    await admin.end();
  });
});
