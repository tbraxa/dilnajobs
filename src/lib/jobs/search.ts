import "server-only";

import { and, count, desc, eq, gte, ilike, lte, or, sql as dsql } from "drizzle-orm";
import { db } from "@/db/client";
import { employers, jobs } from "@/db/schema";
import { isMissingRelationError, type CatalogResult } from "@/lib/catalog-error";
import { log } from "@/lib/logging";
import { parseSearch, type SearchQuery } from "@/lib/search-params";

export type { SearchQuery };
export { parseSearch };

export const JOBS_PAGE_SIZE = 10;

function searchFilters(query: SearchQuery) {
  const filters = [
    eq(jobs.status, "published"),
    or(dsql`${jobs.expiresAt} is null`, gte(jobs.expiresAt, new Date()))!,
  ];

  if (query.profession) {
    filters.push(eq(jobs.profession, query.profession));
  }
  if (query.city) {
    const place = `%${query.city}%`;
    filters.push(or(ilike(jobs.city, place), ilike(jobs.region, place))!);
  }
  if (query.q) {
    const like = `%${query.q}%`;
    filters.push(
      or(
        ilike(jobs.title, like),
        ilike(jobs.description, like),
        ilike(jobs.city, like),
        ilike(jobs.region, like),
        ilike(employers.companyName, like),
      )!,
    );
  }

  if (query.salaryMin) {
    filters.push(or(gte(jobs.salaryMin, query.salaryMin), gte(jobs.salaryMax, query.salaryMin))!);
  }
  if (query.salaryMax) {
    filters.push(or(lte(jobs.salaryMin, query.salaryMax), lte(jobs.salaryMax, query.salaryMax))!);
  }

  if (query.employmentType) {
    filters.push(eq(jobs.employmentType, query.employmentType));
  }

  if (query.workMode) {
    filters.push(eq(jobs.workMode, query.workMode));
  }

  return filters;
}

const jobCardSelect = {
  id: jobs.id,
  slug: jobs.slug,
  title: jobs.title,
  profession: jobs.profession,
  city: jobs.city,
  region: jobs.region,
  employmentType: jobs.employmentType,
  workMode: jobs.workMode,
  shiftNote: jobs.shiftNote,
  salaryMin: jobs.salaryMin,
  salaryMax: jobs.salaryMax,
  salaryNote: jobs.salaryNote,
  isTop: jobs.isTop,
  publishedAt: jobs.publishedAt,
  expiresAt: jobs.expiresAt,
  companyName: employers.companyName,
  companyCity: employers.city,
  verificationStatus: employers.verificationStatus,
  isAgency: employers.isAgency,
};

export async function searchJobs(query: SearchQuery) {
  const filters = searchFilters(query);
  const order =
    query.sort === "salary"
      ? [desc(jobs.salaryMax), desc(jobs.isTop), desc(jobs.publishedAt)]
      : [desc(jobs.isTop), desc(jobs.publishedAt)];
  const page = Math.max(1, query.page ?? 1);

  return db
    .select(jobCardSelect)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...filters))
    .orderBy(...order)
    .limit(JOBS_PAGE_SIZE)
    .offset((page - 1) * JOBS_PAGE_SIZE);
}

export async function countSearchJobs(query: SearchQuery) {
  const [row] = await db
    .select({ value: count() })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...searchFilters(query)));
  return row?.value ?? 0;
}

export async function getPublishedJobBySlug(slug: string) {
  const [row] = await db
    .select({
      job: jobs,
      companyName: employers.companyName,
      companyCity: employers.city,
      ico: employers.ico,
      verificationStatus: employers.verificationStatus,
      isAgency: employers.isAgency,
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
  return db
    .select(jobCardSelect)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...searchFilters({ sort: "newest" })))
    .orderBy(desc(jobs.isTop), desc(jobs.publishedAt))
    .limit(limit);
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

export function loadSearchJobCount(query: SearchQuery) {
  return wrapCatalog(() => countSearchJobs(query));
}

export function loadFeaturedJobs(limit = 6) {
  return wrapCatalog(() => featuredJobs(limit));
}

export function loadPublishedJobBySlug(slug: string) {
  return wrapCatalog(() => getPublishedJobBySlug(slug));
}
