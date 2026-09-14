import { searchSchema } from "./validation";

export type SearchQuery = {
  q?: string;
  profession?: string;
  city?: string;
  sort?: "newest" | "salary";
};

export function parseSearch(input: Record<string, string | string[] | undefined>): SearchQuery {
  const raw = {
    q: typeof input.q === "string" ? input.q : undefined,
    profession: typeof input.profession === "string" ? input.profession : undefined,
    city: typeof input.city === "string" ? input.city : undefined,
    sort: typeof input.sort === "string" ? input.sort : undefined,
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
