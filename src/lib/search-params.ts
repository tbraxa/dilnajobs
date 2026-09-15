import { searchSchema } from "./validation";
import { isCategoryDb } from "./catalog";

export type SearchQuery = {
  q?: string;
  category?: string;
  profession?: string;
  place?: string;
  city?: string;
  salaryMin?: number;
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
    place: one(input, "place"),
    city: one(input, "city"),
    salaryMin: one(input, "salaryMin") ?? one(input, "mzda"),
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
    page: data.page ?? 1,
    sort: data.sort,
  };
}

export function searchHasFilters(query: SearchQuery): boolean {
  return Boolean(query.q || query.place || query.city || query.category || query.profession || query.salaryMin);
}
