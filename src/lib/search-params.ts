import { searchSchema } from "./validation";
import { isCategoryDb } from "./catalog";

export type WorkModeFilter = "onsite" | "hybrid" | "remote";
export type ContractFilter = "hpp" | "dpp" | "dpc" | "ico";

export type SearchQuery = {
  q?: string;
  category?: string;
  profession?: string;
  place?: string;
  city?: string;
  salaryMin?: number;
  workMode?: WorkModeFilter;
  contract?: ContractFilter;
  page?: number;
  sort?: "newest" | "salary";
};

function one(input: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = input[key];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function parseSearch(input: Record<string, string | string[] | undefined>): SearchQuery {
  const raw = {
    q: one(input, "q"),
    category: one(input, "category"),
    profession: one(input, "profession"),
    place: one(input, "place") ?? one(input, "mesto"),
    city: one(input, "city"),
    salaryMin: one(input, "salaryMin") ?? one(input, "mzda"),
    workMode: one(input, "mode") ?? one(input, "workMode"),
    contract: one(input, "contract"),
    page: one(input, "page"),
    sort: one(input, "sort"),
  };
  const parsed = searchSchema.safeParse(raw);
  if (!parsed.success) return { sort: "newest", page: 1 };

  const data = parsed.data;
  const place = data.place || data.city;
  const category =
    data.category || (data.profession && isCategoryDb(data.profession) ? data.profession : undefined);

  return {
    q: data.q || undefined,
    category: category || undefined,
    profession: data.profession || undefined,
    place: place || undefined,
    city: data.city || place || undefined,
    salaryMin: data.salaryMin,
    workMode: data.workMode,
    contract: data.contract,
    page: data.page ?? 1,
    sort: data.sort,
  };
}

export function searchHasFilters(query: SearchQuery): boolean {
  return Boolean(
    query.q ||
      query.place ||
      query.city ||
      query.category ||
      query.profession ||
      query.salaryMin ||
      query.workMode ||
      query.contract,
  );
}

/** Advanced facets shown on the Filtry control. Query and place live in the search bar. */
export function facetCount(query: SearchQuery): number {
  let n = 0;
  if (query.category) n += 1;
  if (query.profession && query.profession !== query.category) n += 1;
  if (query.salaryMin != null) n += 1;
  if (query.workMode) n += 1;
  if (query.contract) n += 1;
  return n;
}

export function nabidkyHref(query: SearchQuery, patch: Partial<SearchQuery> = {}): string {
  const next: SearchQuery = { ...query, ...patch };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.place) params.set("place", next.place);
  if (next.category) params.set("category", next.category);
  if (next.profession && next.profession !== next.category) params.set("profession", next.profession);
  if (next.salaryMin != null) params.set("salaryMin", String(next.salaryMin));
  if (next.workMode) params.set("mode", next.workMode);
  if (next.contract) params.set("contract", next.contract);
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  if (next.page && next.page > 1) params.set("page", String(next.page));
  const s = params.toString();
  return s ? `/nabidky?${s}` : "/nabidky";
}
