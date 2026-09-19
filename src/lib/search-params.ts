import { searchSchema } from "./validation";

export type SearchQuery = {
  q?: string;
  profession?: string;
  city?: string;
  sort?: "newest" | "salary";
  payFrom?: number;
};

export function parseSearch(input: Record<string, string | string[] | undefined>): SearchQuery {
  const raw = {
    q: typeof input.q === "string" ? input.q : undefined,
    profession: typeof input.profession === "string" ? input.profession : undefined,
    city:
      typeof input.city === "string"
        ? input.city
        : typeof input.loc === "string"
          ? input.loc
          : undefined,
    sort: typeof input.sort === "string" ? input.sort : undefined,
  };
  const parsed = searchSchema.safeParse(raw);
  const base: SearchQuery = parsed.success ? parsed.data : { sort: "newest" };
  const payRaw = typeof input.payFrom === "string" ? Number(input.payFrom) : NaN;
  if (Number.isFinite(payRaw) && payRaw > 0) {
    base.payFrom = Math.floor(payRaw);
  }
  return base;
}
