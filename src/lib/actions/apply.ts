"use server";

import "server-only";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { applications, jobs } from "@/db/schema";
import { audit } from "@/lib/audit";
import { clientIp } from "@/lib/auth";
import { hashIp } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { log } from "@/lib/logging";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { applySchema } from "@/lib/validation";

export type ActionState = { ok: true } | { ok: false; error: string };

export async function applyToJob(formData: FormData): Promise<ActionState> {
  const raw = {
    jobId: String(formData.get("jobId") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    consentGdpr: formData.get("consentGdpr") === "on" || formData.get("consentGdpr") === "true" ? true : undefined,
    website: String(formData.get("website") ?? ""),
    cvObjectKey: String(formData.get("cvObjectKey") ?? "") || undefined,
    cvFileName: String(formData.get("cvFileName") ?? "") || undefined,
    cvContentType: String(formData.get("cvContentType") ?? "") || undefined,
  };

  if (raw.website) {
    return { ok: true };
  }

  const parsed = applySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte formulář." };
  }

  const ip = await clientIp();
  try {
    await enforceRateLimit({ bucket: "apply:ip", key: ip, limit: 8, windowMs: 60 * 60 * 1000 });
    await enforceRateLimit({
      bucket: "apply:job",
      key: `${parsed.data.jobId}:${parsed.data.phone}`,
      limit: 2,
      windowMs: 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return { ok: false, error: "Z této sítě už přišlo moc přihlášek. Zkuste to později." };
    }
    throw err;
  }

  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, parsed.data.jobId), eq(jobs.status, "published")))
    .limit(1);

  if (!job || (job.expiresAt && job.expiresAt < new Date())) {
    return { ok: false, error: "Tato nabídka už není otevřená." };
  }

  const applicationId = randomUUID();
  try {
    await db.insert(applications).values({
      id: applicationId,
      jobId: job.id,
      employerId: job.employerId,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message: parsed.data.message,
      consentGdpr: true,
      cvObjectKey: parsed.data.cvObjectKey,
      cvFileName: parsed.data.cvFileName,
      cvContentType: parsed.data.cvContentType,
      ipHash: hashIp(ip),
    });
  } catch (err) {
    log("error", "application.insert_failed", { jobId: job.id });
    return { ok: false, error: "Přihlášku se teď nepodařilo uložit. Zkuste to znovu." };
  }

  await audit({
    actorType: "candidate",
    employerId: job.employerId,
    action: "application.created",
    resourceType: "application",
    resourceId: applicationId,
    metadata: { jobId: job.id, hasCv: Boolean(parsed.data.cvObjectKey) },
    ipHash: hashIp(ip),
  });

  // Employer e-mail is a stub: the public role cannot SELECT employer_users (RLS).
  await sendEmail({
    to: "employer-stub@dilnajobs.cz",
    subject: `Nová přihláška: ${job.title}`,
    text: `${parsed.data.fullName} se hlásí na ${job.title}. Telefon: ${parsed.data.phone}.`,
  });

  log("info", "application.created", { jobId: job.id });
  return { ok: true };
}
