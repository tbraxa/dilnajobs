"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { withAdminRls } from "@/db/rls";
import { employers, jobs } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";
import { audit } from "@/lib/audit";
import { hashIp } from "@/lib/crypto";
import { clientIp } from "@/lib/auth";
import { captureException } from "@/lib/observability";
import { getRequestId } from "@/lib/request-id";

const uuid = z.string().uuid();

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/prihlaseni");
  return session;
}

function readId(formData: FormData): string | null {
  const parsed = uuid.safeParse(String(formData.get("id") ?? ""));
  return parsed.success ? parsed.data : null;
}

export type AdminActionState = { ok: true } | { ok: false; error: string } | null;

async function runModeration(
  action: string,
  resourceType: "employer" | "job",
  resourceId: string,
  fn: () => Promise<void>,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  const requestId = await getRequestId();
  const ip = await clientIp();
  try {
    await fn();
    await audit({
      actorType: "admin",
      action,
      resourceType,
      resourceId,
      ipHash: hashIp(ip),
      metadata: { requestId, email: session.email },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/employers");
    revalidatePath("/admin/jobs");
    return { ok: true };
  } catch (err) {
    captureException(err, { event: action, requestId, resourceId });
    return { ok: false, error: "Akci se teď nepodařilo dokončit." };
  }
}

export async function verifyEmployerAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("employer.verified", "employer", id, async () => {
    await withAdminRls(async (tx) => {
      await tx
        .update(employers)
        .set({ verificationStatus: "verified", isAgency: false })
        .where(eq(employers.id, id));
    });
  });
}

export async function rejectEmployerAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("employer.rejected", "employer", id, async () => {
    await withAdminRls(async (tx) => {
      await tx.update(employers).set({ verificationStatus: "rejected" }).where(eq(employers.id, id));
    });
  });
}

export async function flagAgencyAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("employer.flagged_agency", "employer", id, async () => {
    await withAdminRls(async (tx) => {
      await tx
        .update(employers)
        .set({ isAgency: true, verificationStatus: "rejected" })
        .where(eq(employers.id, id));
    });
  });
}

export async function publishJobAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("job.published", "job", id, async () => {
    await withAdminRls(async (tx) => {
      await tx
        .update(jobs)
        .set({ status: "published", publishedAt: new Date() })
        .where(eq(jobs.id, id));
    });
  });
}

export async function rejectJobAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("job.rejected", "job", id, async () => {
    await withAdminRls(async (tx) => {
      await tx.update(jobs).set({ status: "unpublished" }).where(eq(jobs.id, id));
    });
  });
}

export async function unpublishJobAction(formData: FormData): Promise<void> {
  const id = readId(formData);
  if (!id) return;
  await runModeration("job.unpublished", "job", id, async () => {
    await withAdminRls(async (tx) => {
      await tx.update(jobs).set({ status: "unpublished" }).where(eq(jobs.id, id));
    });
  });
}
