"use server";

import { eq, sql as dsql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { withEmployerRls } from "@/db/rls";
import { employers, jobs } from "@/db/schema";
import { jobCreateSchema } from "@/lib/validation";
import { jobSlug } from "@/lib/slug";
import { randomToken } from "@/lib/crypto";
import { PLAN_LIMITS } from "@/lib/pricing";
import { env } from "@/lib/env";
import { audit } from "@/lib/audit";
import { cityByLabel } from "@/lib/catalog";

export type JobFormState = { ok: false; error: string } | null;

export async function createJobAction(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");

  const parsed = jobCreateSchema.safeParse({
    title: formData.get("title"),
    profession: formData.get("profession"),
    city: formData.get("city"),
    region: formData.get("region"),
    employmentType: formData.get("employmentType"),
    shiftNote: String(formData.get("shiftNote") ?? "") || undefined,
    salaryMin: formData.get("salaryMin") ? Number(formData.get("salaryMin")) : undefined,
    salaryMax: formData.get("salaryMax") ? Number(formData.get("salaryMax")) : undefined,
    salaryNote: String(formData.get("salaryNote") ?? "") || undefined,
    description: formData.get("description"),
    requirements: String(formData.get("requirements") ?? "") || undefined,
    benefits: String(formData.get("benefits") ?? "") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Zkontrolujte inzerát." };
  }

  const cityMeta = cityByLabel(parsed.data.city);
  const region = parsed.data.region || cityMeta?.region || parsed.data.city;
  const limit = PLAN_LIMITS[session.planCode] ?? 10;

  try {
    await withEmployerRls(session.employerId, async (tx) => {
      const [employer] = await tx
        .select()
        .from(employers)
        .where(eq(employers.id, session.employerId))
        .limit(1);
      if (!employer || employer.isAgency) {
        throw new Error("Agentury neregistrujeme.");
      }
      if (limit !== null && employer.adsPostedYear >= limit) {
        throw new Error("Vyčerpali jste limit inzerátů v aktuálním balíčku.");
      }

      const idPart = randomToken(6);
      const slug = jobSlug(parsed.data.title, parsed.data.city, idPart);
      const autoPublish = env.FEATURE_AUTO_PUBLISH_FIRST_JOB;
      const status = autoPublish ? "published" : "pending_review";
      const now = new Date();

      await tx.insert(jobs).values({
        employerId: session.employerId,
        slug,
        title: parsed.data.title,
        profession: parsed.data.profession,
        city: parsed.data.city,
        region,
        employmentType: parsed.data.employmentType,
        shiftNote: parsed.data.shiftNote,
        salaryMin: parsed.data.salaryMin,
        salaryMax: parsed.data.salaryMax,
        salaryNote: parsed.data.salaryNote,
        description: parsed.data.description,
        requirements: parsed.data.requirements,
        benefits: parsed.data.benefits,
        status,
        publishedAt: autoPublish ? now : null,
        expiresAt: new Date(now.getTime() + 30 * 86400000),
      });

      await tx
        .update(employers)
        .set({ adsPostedYear: dsql`${employers.adsPostedYear} + 1` })
        .where(eq(employers.id, session.employerId));
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Inzerát se nepodařilo uložit.";
    return { ok: false, error: message };
  }

  await audit({
    actorType: "employer_user",
    actorId: session.userId,
    employerId: session.employerId,
    action: "job.created",
    metadata: { title: parsed.data.title, review: !env.FEATURE_AUTO_PUBLISH_FIRST_JOB },
  });

  redirect("/firma");
}

export async function startCheckoutAction(packageCode: string) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  const { startCheckout } = await import("@/lib/payments");
  const result = await startCheckout({
    employerId: session.employerId,
    email: session.email,
    packageCode,
  });
  if (result.kind === "redirect") redirect(result.url);
  if (result.kind === "activated") redirect("/firma?objednavka=aktivovano");
  redirect("/firma?objednavka=stub");
}
