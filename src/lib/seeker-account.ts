import "server-only";

import { and, desc, eq, inArray, sql as dsql } from "drizzle-orm";
import { withSeekerRls } from "@/db/rls";
import {
  applications,
  employers,
  favoriteCompanies,
  favoriteJobs,
  jobs,
  seekerUsers,
} from "@/db/schema";

export async function getFavoriteJobIds(seekerId: string, jobIds: string[]) {
  if (!jobIds.length) return new Set<string>();
  return withSeekerRls(seekerId, async (tx) => {
    const rows = await tx
      .select({ jobId: favoriteJobs.jobId })
      .from(favoriteJobs)
      .where(
        and(
          eq(favoriteJobs.seekerUserId, seekerId),
          inArray(favoriteJobs.jobId, jobIds),
        ),
      );
    return new Set(rows.map((row) => row.jobId));
  });
}

export async function getFavoriteCompanyIds(seekerId: string, employerIds: string[]) {
  if (!employerIds.length) return new Set<string>();
  return withSeekerRls(seekerId, async (tx) => {
    const rows = await tx
      .select({ employerId: favoriteCompanies.employerId })
      .from(favoriteCompanies)
      .where(
        and(
          eq(favoriteCompanies.seekerUserId, seekerId),
          inArray(favoriteCompanies.employerId, employerIds),
        ),
      );
    return new Set(rows.map((row) => row.employerId));
  });
}

export async function loadSeekerAccountData(seekerId: string) {
  return withSeekerRls(seekerId, async (tx) => {
    const [profileRows, savedJobs, savedCompanies, applicationHistory] = await Promise.all([
      tx
        .select()
        .from(seekerUsers)
        .where(eq(seekerUsers.id, seekerId))
        .limit(1),
      tx
        .select({
          id: jobs.id,
          slug: jobs.slug,
          title: jobs.title,
          city: jobs.city,
          region: jobs.region,
          workMode: jobs.workMode,
          employmentType: jobs.employmentType,
          salaryMin: jobs.salaryMin,
          salaryMax: jobs.salaryMax,
          salaryNote: jobs.salaryNote,
          companyName: employers.companyName,
          employerId: employers.id,
          savedAt: favoriteJobs.createdAt,
        })
        .from(favoriteJobs)
        .innerJoin(jobs, eq(jobs.id, favoriteJobs.jobId))
        .innerJoin(employers, eq(employers.id, jobs.employerId))
        .where(eq(favoriteJobs.seekerUserId, seekerId))
        .orderBy(desc(favoriteJobs.createdAt)),
      tx
        .select({
          id: employers.id,
          companyName: employers.companyName,
          city: employers.city,
          verificationStatus: employers.verificationStatus,
          savedAt: favoriteCompanies.createdAt,
          liveJobs: dsql<number>`(
            select count(*)::int
            from jobs j
            where j.employer_id = ${employers.id}
              and j.status = 'published'
              and (j.expires_at is null or j.expires_at > now())
          )`,
        })
        .from(favoriteCompanies)
        .innerJoin(employers, eq(employers.id, favoriteCompanies.employerId))
        .where(eq(favoriteCompanies.seekerUserId, seekerId))
        .orderBy(desc(favoriteCompanies.createdAt)),
      tx
        .select({
          id: applications.id,
          status: applications.status,
          createdAt: applications.createdAt,
          jobId: jobs.id,
          jobStatus: jobs.status,
          slug: jobs.slug,
          title: jobs.title,
          city: jobs.city,
          companyName: employers.companyName,
        })
        .from(applications)
        .innerJoin(jobs, eq(jobs.id, applications.jobId))
        .innerJoin(employers, eq(employers.id, applications.employerId))
        .where(eq(applications.seekerUserId, seekerId))
        .orderBy(desc(applications.createdAt)),
    ]);

    return {
      profile: profileRows[0] ?? null,
      savedJobs,
      savedCompanies,
      applicationHistory,
    };
  });
}
