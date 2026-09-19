import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
const adminUrl = process.env.DATABASE_ADMIN_URL;
const seekerA = randomUUID();
const seekerB = randomUUID();
const applicationId = randomUUID();
let jobId = "";
let employerId = "";

describe.skipIf(!url || !adminUrl)("seeker favorites RLS", () => {
  beforeAll(async () => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const job = await admin.query<{ id: string; employer_id: string }>(
      "select id, employer_id from jobs where status = 'published' limit 1",
    );
    jobId = job.rows[0]!.id;
    employerId = job.rows[0]!.employer_id;
    await admin.query(
      `insert into seeker_users (id, email, name)
       values ($1, $2, 'Seeker A'), ($3, $4, 'Seeker B')`,
      [
        seekerA,
        `seeker-a-${seekerA}@example.test`,
        seekerB,
        `seeker-b-${seekerB}@example.test`,
      ],
    );
    await admin.query(
      "insert into favorite_jobs (seeker_user_id, job_id) values ($1, $2)",
      [seekerA, jobId],
    );
    await admin.query(
      "insert into favorite_companies (seeker_user_id, employer_id) values ($1, $2)",
      [seekerB, employerId],
    );
    await admin.query(
      `insert into applications (
        id, job_id, employer_id, full_name, phone, consent_gdpr, seeker_user_id
      ) values ($1, $2, $3, 'Seeker A', '777123456', true, $4)`,
      [applicationId, jobId, employerId, seekerA],
    );
    await admin.end();
  });

  afterAll(async () => {
    if (!adminUrl) return;
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    await admin.query("delete from applications where id = $1", [applicationId]);
    await admin.query("delete from seeker_users where id = any($1::uuid[])", [
      [seekerA, seekerB],
    ]);
    await admin.end();
  });

  it("hides favorites without a seeker scope", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();
    const jobs = await app.query("select * from favorite_jobs");
    const companies = await app.query("select * from favorite_companies");
    const applications = await app.query("select * from applications where seeker_user_id is not null");
    expect(jobs.rowCount).toBe(0);
    expect(companies.rowCount).toBe(0);
    expect(applications.rowCount).toBe(0);
    await app.end();
  });

  it("isolates each seeker's favorites", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();

    await app.query("begin");
    await app.query("select set_config('app.seeker_id', $1, true)", [seekerA]);
    expect((await app.query("select * from favorite_jobs")).rowCount).toBe(1);
    expect((await app.query("select * from favorite_companies")).rowCount).toBe(0);
    expect((await app.query("select * from applications")).rowCount).toBe(1);
    await app.query("rollback");

    await app.query("begin");
    await app.query("select set_config('app.seeker_id', $1, true)", [seekerB]);
    expect((await app.query("select * from favorite_jobs")).rowCount).toBe(0);
    expect((await app.query("select * from favorite_companies")).rowCount).toBe(1);
    expect((await app.query("select * from applications")).rowCount).toBe(0);
    await app.query("rollback");

    await app.end();
  });
});
