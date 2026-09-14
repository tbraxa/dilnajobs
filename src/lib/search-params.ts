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
