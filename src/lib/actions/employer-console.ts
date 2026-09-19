"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applications, employers, jobs } from "@/db/schema";
import { withEmployerRls } from "@/db/rls";
import { audit } from "@/lib/audit";
import { getSession } from "@/lib/auth";
import { applicationStatusSchema, employerProfileSchema } from "@/lib/validation";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function updateApplicationStatusAction(
  applicationId: string,
  jobId: string,
  formData: FormData,
) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  await enforceRateLimit({
    bucket: "employer-application:session",
    key: session.sessionId,
    limit: 120,
    windowMs: 60 * 60 * 1000,
  });

  const status = applicationStatusSchema.safeParse(formData.get("status"));
  if (!status.success) return;

  await withEmployerRls(session.employerId, async (tx) => {
    await tx
      .update(applications)
      .set({ status: status.data })
      .where(
        and(
          eq(applications.id, applicationId),
          eq(applications.jobId, jobId),
          eq(applications.employerId, session.employerId),
        ),
      );
  });

  await audit({
    actorType: "employer_user",
    actorId: session.userId,
    employerId: session.employerId,
    action: "application.status_changed",
    resourceType: "application",
    resourceId: applicationId,
    metadata: { status: status.data },
  });

  revalidatePath("/firma");
  revalidatePath("/firma/prihlasky");
  revalidatePath(`/firma/nabidky/${jobId}/prihlasky`);
}

export async function updateJobLifecycleAction(
  jobId: string,
  intent: "close" | "renew",
) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  await enforceRateLimit({
    bucket: "employer-job-lifecycle:session",
    key: session.sessionId,
    limit: 30,
    windowMs: 60 * 60 * 1000,
  });

  const now = new Date();
  await withEmployerRls(session.employerId, async (tx) => {
    const [job] = await tx
      .select({ id: jobs.id, status: jobs.status })
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, session.employerId)))
      .limit(1);
    if (!job) return;

    await tx
      .update(jobs)
      .set(
        intent === "close"
          ? { status: "closed", updatedAt: now }
          : {
              status: "pending_review",
              expiresAt: new Date(now.getTime() + 30 * 86_400_000),
              updatedAt: now,
            },
      )
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, session.employerId)));
  });

  await audit({
    actorType: "employer_user",
    actorId: session.userId,
    employerId: session.employerId,
    action: intent === "close" ? "job.closed" : "job.renewed",
    resourceType: "job",
    resourceId: jobId,
  });

  revalidatePath("/firma");
  revalidatePath("/firma/nabidky");
}

export async function updateEmployerProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  await enforceRateLimit({
    bucket: "employer-profile:session",
    key: session.sessionId,
    limit: 20,
    windowMs: 60 * 60 * 1000,
  });

  const parsed = employerProfileSchema.safeParse({
    companyName: formData.get("companyName"),
    city: formData.get("city"),
  });
  if (!parsed.success) redirect("/firma/nastaveni?chyba=1");

  await withEmployerRls(session.employerId, async (tx) => {
    await tx
      .update(employers)
      .set({
        companyName: parsed.data.companyName,
        city: parsed.data.city || null,
        updatedAt: new Date(),
      })
      .where(eq(employers.id, session.employerId));
  });

  await audit({
    actorType: "employer_user",
    actorId: session.userId,
    employerId: session.employerId,
    action: "employer.profile_updated",
    resourceType: "employer",
    resourceId: session.employerId,
  });

  revalidatePath("/firma");
  revalidatePath("/firma/nastaveni");
  redirect("/firma/nastaveni?ulozeno=1");
}
