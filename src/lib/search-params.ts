import { searchSchema } from "./validation";

export type WorkModeFilter = "onsite" | "hybrid" | "remote";

export type SearchQuery = {
  q?: string;
  profession?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  workMode?: WorkModeFilter;
  employmentType?: "full_time" | "part_time" | "shift";
  page?: number;
  sort?: "newest" | "salary";
};

function one(input: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = input[key];
  if (Array.isArray(value)) return [...value].reverse().find((item) => item.trim().length > 0);
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function parseSearch(input: Record<string, string | string[] | undefined>): SearchQuery {
  const raw = {
    q: one(input, "q"),
    profession: one(input, "profession"),
    city: one(input, "city") ?? one(input, "place"),
    salaryMin: one(input, "salaryMin") ?? one(input, "mzda"),
    salaryMax: one(input, "salaryMax"),
    workMode: one(input, "workMode") ?? one(input, "mode"),
    employmentType: one(input, "employmentType") ?? one(input, "contract"),
    page: one(input, "page"),
    sort: one(input, "sort"),
  };
  const parsed = searchSchema.safeParse(raw);
  if (!parsed.success) return { sort: "newest" };
  return parsed.data;
}

export function searchHasFilters(query: SearchQuery) {
  return Boolean(
    query.q ||
      query.profession ||
      query.city ||
      query.salaryMin ||
      query.salaryMax ||
      query.workMode ||
      query.employmentType,
  );
}

export function jobsHref(query: SearchQuery, patch: Partial<SearchQuery> = {}) {
  const next = { ...query, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.profession) params.set("profession", next.profession);
  if (next.city) params.set("city", next.city);
  if (next.salaryMin) params.set("salaryMin", String(next.salaryMin));
  if (next.salaryMax) params.set("salaryMax", String(next.salaryMax));
  if (next.workMode) params.set("workMode", next.workMode);
  if (next.employmentType) params.set("employmentType", next.employmentType);
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  if (next.page && next.page > 1) params.set("page", String(next.page));
  const value = params.toString();
  return value ? `/nabidky?${value}` : "/nabidky";
}
