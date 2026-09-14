import { searchSchema } from "./validation";

export type SearchQuery = {
  q?: string;
  profession?: string;
  city?: string;
  sort?: "newest" | "salary";
};

function one(input: string | string[] | undefined): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim();
  return trimmed ? trimmed : undefined;
}

const OBOR_TO_PROFESSION: Record<string, string> = {
  cnc: "cnc",
  svarovani: "welder",
  svarac: "welder",
  operator: "operator",
  udrzba: "maintenance",
  serizovac: "setter",
};

export function parseSearch(input: Record<string, string | string[] | undefined>): SearchQuery {
  const obor = one(input.obor)?.toLocaleLowerCase("cs");
  const raw = {
    q: one(input.q) ?? one(input.smena),
    profession: one(input.profession) ?? (obor ? OBOR_TO_PROFESSION[obor] : undefined),
    city: one(input.city) ?? one(input.mesto),
    sort: one(input.sort),
  };
  const parsed = searchSchema.safeParse(raw);
  if (!parsed.success) return { sort: "newest" };
  return parsed.data;
}

type SearchPatch = {
  q?: string | null;
  profession?: SearchQuery["profession"] | null;
  city?: string | null;
  sort?: SearchQuery["sort"] | null;
};

export function toNabidkyHref(query: SearchQuery | undefined, patch: SearchPatch = {}): string {
  const next: SearchQuery = {
    q: "q" in patch ? patch.q ?? undefined : query?.q,
    profession: "profession" in patch ? patch.profession ?? undefined : query?.profession,
    city: "city" in patch ? patch.city ?? undefined : query?.city,
    sort: "sort" in patch ? patch.sort ?? undefined : query?.sort,
  };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.profession) params.set("profession", next.profession);
  if (next.city) params.set("city", next.city);
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/nabidky?${qs}` : "/nabidky";
}

export function hasActiveFilters(query: SearchQuery | undefined): boolean {
  if (!query) return false;
  return Boolean(query.q || query.profession || query.city || (query.sort && query.sort !== "newest"));
}
