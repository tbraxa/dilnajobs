import "server-only";

import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { applications, employers, jobs } from "@/db/schema";
import { withEmployerRls } from "@/db/rls";

export const loadEmployerConsoleData = cache(async (employerId: string) => {
  return withEmployerRls(employerId, async (tx) => {
    const [company] = await tx
      .select()
      .from(employers)
      .where(eq(employers.id, employerId))
      .limit(1);
    const ownJobs = await tx
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, employerId))
      .orderBy(desc(jobs.updatedAt));
    const ownApplications = await tx
      .select()
      .from(applications)
      .where(eq(applications.employerId, employerId))
      .orderBy(desc(applications.createdAt));

    return {
      company,
      jobs: ownJobs,
      applications: ownApplications,
    };
  });
});

export type EmployerConsoleData = Awaited<ReturnType<typeof loadEmployerConsoleData>>;
export type EmployerJob = EmployerConsoleData["jobs"][number];
export type EmployerApplication = EmployerConsoleData["applications"][number];

export const jobStatusLabels: Record<string, string> = {
  draft: "Koncept",
  pending_review: "Čeká na kontrolu",
  published: "Zveřejněno",
  closed: "Uzavřeno",
  rejected: "Vráceno k úpravě",
};

export const applicationStatusLabels: Record<string, string> = {
  new: "Nová",
  reviewing: "Posouzení",
  interview: "Pohovor",
  hired: "Přijat",
  rejected: "Zamítnuta",
};

export function workModeLabel(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
}

export function planLabel(value: string) {
  if (value === "standard") return "Standard";
  if (value === "basic") return "Basic";
  if (value === "single") return "Jednorázový";
  return "Zkušební";
}
