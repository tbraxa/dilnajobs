import "server-only";

import { and, desc, eq, gte, ilike, or, sql as dsql } from "drizzle-orm";
import { db } from "@/db/client";
import { employers, jobs } from "@/db/schema";
import { isMissingRelationError, type CatalogResult } from "@/lib/catalog-error";
import { log } from "@/lib/logging";
import { parseSearch, type SearchQuery } from "@/lib/search-params";

export type { SearchQuery };
export { parseSearch };

export async function searchJobs(query: SearchQuery) {
  const filters = [
    eq(jobs.status, "published"),
    or(dsql`${jobs.expiresAt} is null`, gte(jobs.expiresAt, new Date()))!,
  ];

  if (query.profession) {
    filters.push(eq(jobs.profession, query.profession));
  }
  if (query.city) {
    filters.push(ilike(jobs.city, query.city));
  }
  if (query.q) {
    const like = `%${query.q}%`;
    filters.push(
      or(ilike(jobs.title, like), ilike(jobs.description, like), ilike(jobs.city, like))!,
    );
  }

  const order =
    query.sort === "salary"
      ? [desc(jobs.salaryMax), desc(jobs.isTop), desc(jobs.publishedAt)]
      : [desc(jobs.isTop), desc(jobs.publishedAt)];

  return db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      profession: jobs.profession,
      city: jobs.city,
      region: jobs.region,
      employmentType: jobs.employmentType,
      shiftNote: jobs.shiftNote,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryNote: jobs.salaryNote,
      isTop: jobs.isTop,
      publishedAt: jobs.publishedAt,
      expiresAt: jobs.expiresAt,
      companyName: employers.companyName,
      companyCity: employers.city,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...filters))
    .orderBy(...order)
    .limit(100);
}

export async function getPublishedJobBySlug(slug: string) {
  const [row] = await db
    .select({
      job: jobs,
      companyName: employers.companyName,
      companyCity: employers.city,
      ico: employers.ico,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(
      and(
        eq(jobs.slug, slug),
        eq(jobs.status, "published"),
        or(dsql`${jobs.expiresAt} is null`, gte(jobs.expiresAt, new Date())),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function featuredJobs(limit = 6) {
  return searchJobs({ sort: "newest" }).then((rows) => rows.slice(0, limit));
}

async function wrapCatalog<T>(fn: () => Promise<T>): Promise<CatalogResult<T>> {
  try {
    return { ok: true, rows: await fn() };
  } catch (err) {
    const reason = isMissingRelationError(err) ? "missing_schema" : "query_failed";
    log("error", "catalog.query_failed", {
      reason,
      message: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, reason };
  }
}

export function loadSearchJobs(query: SearchQuery) {
  return wrapCatalog(() => searchJobs(query));
}

export function loadFeaturedJobs(limit = 6) {
  return wrapCatalog(() => featuredJobs(limit));
}

export function loadPublishedJobBySlug(slug: string) {
  return wrapCatalog(() => getPublishedJobBySlug(slug));
}
