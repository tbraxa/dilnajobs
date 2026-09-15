import "server-only";

import { and, desc, eq, gte, ilike, or, sql as dsql, count } from "drizzle-orm";
import { db } from "@/db/client";
import { employers, jobs } from "@/db/schema";
import { isMissingRelationError, type CatalogResult } from "@/lib/catalog-error";
import { PAGE_SIZE } from "@/lib/catalog";
import { log } from "@/lib/logging";
import { type SearchQuery } from "@/lib/search-params";

export type { SearchQuery };
export { parseSearch } from "@/lib/search-params";

function publishedFilters() {
  return [
    eq(jobs.status, "published"),
    or(dsql`${jobs.expiresAt} is null`, gte(jobs.expiresAt, new Date()))!,
  ];
}

function filterClauses(query: SearchQuery) {
  const filters = [...publishedFilters()];
  const category = query.category;
  const profession = query.profession;

  if (category && profession && profession !== category) {
    filters.push(or(eq(jobs.category, category), eq(jobs.profession, profession))!);
  } else if (category) {
    filters.push(or(eq(jobs.category, category), eq(jobs.profession, category))!);
  } else if (profession) {
    filters.push(or(eq(jobs.profession, profession), eq(jobs.category, profession))!);
  }

  const place = query.place || query.city;
  if (place) {
    const like = `%${place}%`;
    filters.push(or(ilike(jobs.city, like), ilike(jobs.region, like))!);
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
        ilike(employers.displayName, like),
        ilike(employers.legalName, like),
        ilike(jobs.category, like),
      )!,
    );
  }

  if (query.salaryMin != null) {
    filters.push(gte(jobs.salaryMin, query.salaryMin));
  }

  if (query.workMode) {
    filters.push(eq(jobs.workMode, query.workMode));
  }

  if (query.contract) {
    filters.push(or(eq(jobs.contractType, query.contract), eq(jobs.employmentType, query.contract))!);
  }

  return filters;
}

const jobSelect = {
  id: jobs.id,
  slug: jobs.slug,
  title: jobs.title,
  profession: jobs.profession,
  category: jobs.category,
  city: jobs.city,
  region: jobs.region,
  employmentType: jobs.employmentType,
  contractType: jobs.contractType,
  workMode: jobs.workMode,
  isAgency: jobs.isAgency,
  shiftNote: jobs.shiftNote,
  salaryMin: jobs.salaryMin,
  salaryMax: jobs.salaryMax,
  salaryNote: jobs.salaryNote,
  salaryType: jobs.salaryType,
  isTop: jobs.isTop,
  publishedAt: jobs.publishedAt,
  expiresAt: jobs.expiresAt,
  companyName: employers.displayName,
  companyLegalName: employers.legalName,
  companyCity: employers.city,
  verificationStatus: employers.verificationStatus,
};

export async function searchJobs(query: SearchQuery) {
  const filters = filterClauses(query);
  const order =
    query.sort === "salary"
      ? [desc(jobs.salaryMax), desc(jobs.isTop), desc(jobs.publishedAt)]
      : [desc(jobs.isTop), desc(jobs.publishedAt)];
  const page = Math.max(1, query.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  return db
    .select(jobSelect)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...filters))
    .orderBy(...order)
    .limit(PAGE_SIZE)
    .offset(offset);
}

export async function countSearchJobs(query: SearchQuery) {
  const filters = filterClauses(query);
  const [row] = await db
    .select({ n: count() })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...filters));
  return row?.n ?? 0;
}

export async function getPublishedJobBySlug(slug: string) {
  const [row] = await db
    .select({
      job: jobs,
      companyName: employers.displayName,
      companyLegalName: employers.legalName,
      companyCity: employers.city,
      ico: employers.ico,
      verificationStatus: employers.verificationStatus,
      companyAddress: employers.address,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(eq(jobs.slug, slug), ...publishedFilters()))
    .limit(1);
  return row ?? null;
}

export async function featuredJobs(limit = 6) {
  return db
    .select(jobSelect)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .where(and(...publishedFilters()))
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
