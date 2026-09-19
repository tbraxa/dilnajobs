"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { favoriteCompanies, favoriteJobs, jobs, employers, seekerUsers } from "@/db/schema";
import { withSeekerRls } from "@/db/rls";
import { audit } from "@/lib/audit";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";
import { getSeekerSession, safeAccountNext } from "@/lib/seeker-auth";
import { normalizePhone, seekerProfileSchema } from "@/lib/validation";

export type FavoriteActionResult =
  | { ok: true; saved: boolean }
  | { ok: false; loginUrl?: string; error?: string };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function favoriteRateLimit(sessionId: string) {
  await enforceRateLimit({
    bucket: "seeker-favorite:session",
    key: sessionId,
    limit: 60,
    windowMs: 60 * 60 * 1000,
  });
}

export async function toggleFavoriteJobAction(
  jobId: string,
  returnTo: string,
): Promise<FavoriteActionResult> {
  if (!UUID_PATTERN.test(jobId)) {
    return { ok: false, error: "Neplatná nabídka." };
  }
  const session = await getSeekerSession();
  if (!session) {
    const next = safeAccountNext(returnTo, "/nabidky");
    return { ok: false, loginUrl: `/ucet/prihlaseni?next=${encodeURIComponent(next)}` };
  }
  try {
    await favoriteRateLimit(session.sessionId);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { ok: false, error: "Změn bylo příliš mnoho. Zkuste to za chvíli." };
    }
    throw error;
  }

  const saved = await withSeekerRls(session.userId, async (tx) => {
    const [job] = await tx.select({ id: jobs.id }).from(jobs).where(eq(jobs.id, jobId)).limit(1);
    if (!job) return null;
    const [existing] = await tx
      .select({ jobId: favoriteJobs.jobId })
      .from(favoriteJobs)
      .where(
        and(
          eq(favoriteJobs.seekerUserId, session.userId),
          eq(favoriteJobs.jobId, jobId),
        ),
      )
      .limit(1);
    if (existing) {
      await tx
        .delete(favoriteJobs)
        .where(
          and(
            eq(favoriteJobs.seekerUserId, session.userId),
            eq(favoriteJobs.jobId, jobId),
          ),
        );
      return false;
    }
    await tx.insert(favoriteJobs).values({ seekerUserId: session.userId, jobId }).onConflictDoNothing();
    return true;
  });
  if (saved === null) return { ok: false, error: "Nabídku už nelze uložit." };

  await audit({
    actorType: "seeker",
    actorId: session.userId,
    action: saved ? "favorite.job.added" : "favorite.job.removed",
    resourceType: "job",
    resourceId: jobId,
  });
  revalidatePath("/nabidky");
  revalidatePath("/ucet/prehled");
  revalidatePath("/ucet/oblibene");
  return { ok: true, saved };
}

export async function toggleFavoriteCompanyAction(
  employerId: string,
  returnTo: string,
): Promise<FavoriteActionResult> {
  if (!UUID_PATTERN.test(employerId)) {
    return { ok: false, error: "Neplatná firma." };
  }
  const session = await getSeekerSession();
  if (!session) {
    const next = safeAccountNext(returnTo, "/nabidky");
    return { ok: false, loginUrl: `/ucet/prihlaseni?next=${encodeURIComponent(next)}` };
  }
  try {
    await favoriteRateLimit(session.sessionId);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { ok: false, error: "Změn bylo příliš mnoho. Zkuste to za chvíli." };
    }
    throw error;
  }

  const saved = await withSeekerRls(session.userId, async (tx) => {
    const [company] = await tx
      .select({ id: employers.id })
      .from(employers)
      .where(eq(employers.id, employerId))
      .limit(1);
    if (!company) return null;
    const [existing] = await tx
      .select({ employerId: favoriteCompanies.employerId })
      .from(favoriteCompanies)
      .where(
        and(
          eq(favoriteCompanies.seekerUserId, session.userId),
          eq(favoriteCompanies.employerId, employerId),
        ),
      )
      .limit(1);
    if (existing) {
      await tx
        .delete(favoriteCompanies)
        .where(
          and(
            eq(favoriteCompanies.seekerUserId, session.userId),
            eq(favoriteCompanies.employerId, employerId),
          ),
        );
      return false;
    }
    await tx
      .insert(favoriteCompanies)
      .values({ seekerUserId: session.userId, employerId })
      .onConflictDoNothing();
    return true;
  });
  if (saved === null) return { ok: false, error: "Firmu teď nelze uložit." };

  await audit({
    actorType: "seeker",
    actorId: session.userId,
    action: saved ? "favorite.company.added" : "favorite.company.removed",
    resourceType: "employer",
    resourceId: employerId,
  });
  revalidatePath("/ucet/prehled");
  revalidatePath("/ucet/oblibene");
  return { ok: true, saved };
}

export async function updateSeekerProfileAction(formData: FormData) {
  const session = await getSeekerSession();
  if (!session) return { ok: false as const, error: "Přihlaste se znovu." };
  const parsed = seekerProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    desiredRole: formData.get("desiredRole"),
    bio: formData.get("bio"),
  });
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Zkontrolujte profil.",
    };
  }
  try {
    await enforceRateLimit({
      bucket: "seeker-profile:session",
      key: session.sessionId,
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { ok: false as const, error: "Změn bylo příliš mnoho. Zkuste to za chvíli." };
    }
    throw error;
  }

  await withSeekerRls(session.userId, async (tx) => {
    await tx
      .update(seekerUsers)
      .set({
        name: parsed.data.name,
        phone: parsed.data.phone ? normalizePhone(parsed.data.phone) : null,
        city: parsed.data.city ?? null,
        desiredRole: parsed.data.desiredRole ?? null,
        bio: parsed.data.bio ?? null,
        updatedAt: new Date(),
      })
      .where(eq(seekerUsers.id, session.userId));
  });
  await audit({
    actorType: "seeker",
    actorId: session.userId,
    action: "seeker.profile.updated",
    resourceType: "seeker",
    resourceId: session.userId,
  });
  revalidatePath("/ucet/prehled");
  revalidatePath("/ucet/profil");
  return { ok: true as const };
}
