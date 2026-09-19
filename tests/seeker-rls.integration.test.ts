import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
const adminUrl = process.env.DATABASE_ADMIN_URL;
const seekerA = randomUUID();
const seekerB = randomUUID();
const applicationA = randomUUID();
const applicationB = randomUUID();
const scopedApplication = randomUUID();
let jobId = "";
let employerId = "";

describe.skipIf(!url || !adminUrl)("seeker RLS isolation", () => {
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
      `insert into applications
        (id, job_id, employer_id, full_name, phone, email, consent_gdpr, seeker_user_id)
       values
        ($1, $2, $3, 'Seeker A', '777111222', 'a@example.test', true, $4),
        ($5, $2, $3, 'Seeker B', '777333444', 'b@example.test', true, $6)`,
      [applicationA, jobId, employerId, seekerA, applicationB, seekerB],
    );
    await admin.end();
  });

  afterAll(async () => {
    if (!adminUrl) return;
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    await admin.query("delete from applications where id = any($1::uuid[])", [
      [applicationA, applicationB, scopedApplication],
    ]);
    await admin.query("delete from seeker_users where id = any($1::uuid[])", [
      [seekerA, seekerB],
    ]);
    await admin.end();
  });

  it("hides seeker-owned data without a seeker scope", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();
    expect((await app.query("select * from favorite_jobs")).rowCount).toBe(0);
    expect((await app.query("select * from favorite_companies")).rowCount).toBe(0);
    expect(
      (
        await app.query(
          "select * from applications where id = any($1::uuid[])",
          [[applicationA, applicationB]],
        )
      ).rowCount,
    ).toBe(0);
    await app.end();
  });

  it("isolates favorites and application history by seeker", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();

    await app.query("begin");
    await app.query("select set_config('app.seeker_id', $1, true)", [seekerA]);
    expect((await app.query("select * from favorite_jobs")).rowCount).toBe(1);
    expect((await app.query("select * from favorite_companies")).rowCount).toBe(0);
    expect(
      (
        await app.query(
          "select seeker_user_id from applications where id = any($1::uuid[])",
          [[applicationA, applicationB]],
        )
      ).rows,
    ).toEqual([{ seeker_user_id: seekerA }]);
    await app.query("rollback");

    await app.query("begin");
    await app.query("select set_config('app.seeker_id', $1, true)", [seekerB]);
    expect((await app.query("select * from favorite_jobs")).rowCount).toBe(0);
    expect((await app.query("select * from favorite_companies")).rowCount).toBe(1);
    expect(
      (
        await app.query(
          "select seeker_user_id from applications where id = any($1::uuid[])",
          [[applicationA, applicationB]],
        )
      ).rows,
    ).toEqual([{ seeker_user_id: seekerB }]);
    await app.query("rollback");

    await app.end();
  });

  it("requires the application owner to match the active seeker scope", async () => {
    const app = new Client({ connectionString: url });
    await app.connect();
    await expect(
      app.query(
        `insert into applications
          (id, job_id, employer_id, full_name, phone, consent_gdpr, seeker_user_id)
         values ($1, $2, $3, 'Spoofed', '777555666', true, $4)`,
        [scopedApplication, jobId, employerId, seekerA],
      ),
    ).rejects.toMatchObject({ code: "42501" });

    await app.query("begin");
    await app.query("select set_config('app.seeker_id', $1, true)", [seekerA]);
    await app.query(
      `insert into applications
        (id, job_id, employer_id, full_name, phone, consent_gdpr, seeker_user_id)
       values ($1, $2, $3, 'Scoped', '777555666', true, $4)`,
      [scopedApplication, jobId, employerId, seekerA],
    );
    await app.query("commit");
    await app.end();
  });
});
