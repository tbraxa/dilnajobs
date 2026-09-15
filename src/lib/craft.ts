import { copy } from "./copy";

const MARK_TONES = [
  "co-acme",
  "co-logi",
  "co-north",
  "co-poli",
  "co-kovo",
  "co-fresh",
  "co-stav",
  "co-bistro",
  "co-cloud",
] as const;

export function companyInitial(name: string): string {
  const cleaned = name
    .replace(/\b(s\.r\.o\.|a\.s\.|spol\.)\b/gi, "")
    .trim();
  const source = cleaned || name;
  const letter = source.charAt(0);
  return letter ? letter.toLocaleUpperCase("cs") : "?";
}

export function companyMarkClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return MARK_TONES[hash % MARK_TONES.length];
}

export function jobMediaClass(category: string, profession?: string | null): string {
  const key = category || profession || "other";
  switch (key) {
    case "administration":
    case "accounting":
    case "hr":
      return "media-admin";
    case "it":
    case "marketing":
      return "media-it";
    case "logistics":
    case "driver":
      return "media-logi";
    case "healthcare":
    case "education":
      return "media-health";
    case "manufacturing":
    case "trades":
    case "facility":
    case "cnc":
    case "welder":
    case "operator":
    case "setter":
      return "media-mfg";
    case "sales":
      return "media-sales";
    case "construction":
      return "media-build";
    case "hospitality":
      return "media-gastro";
    default:
      return "media-svc";
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function daysSincePublished(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const published = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(published.getTime())) return null;
  return Math.round((startOfDay(new Date()) - startOfDay(published)) / 86_400_000);
}

export function publishedLabel(date: Date | string | null | undefined): string {
  const days = daysSincePublished(date);
  if (days == null) return "";
  if (days <= 0) return copy.card.publishedToday;
  if (days === 1) return copy.card.publishedYesterday;
  return copy.card.publishedDaysAgo(days);
}

export function isNewJob(date: Date | string | null | undefined): boolean {
  const days = daysSincePublished(date);
  return days != null && days <= 1;
}

export const HOME_FIELDS = [
  { db: "administration", label: "Administrativa", icon: "admin" },
  { db: "it", label: "IT a vývoj", icon: "it" },
  { db: "sales", label: "Obchod a prodej", icon: "sales" },
  { db: "manufacturing", label: "Výroba", icon: "mfg" },
  { db: "logistics", label: "Doprava a logistika", icon: "logi" },
  { db: "healthcare", label: "Zdravotnictví", icon: "health" },
  { db: "construction", label: "Stavebnictví", icon: "build" },
  { db: "customer_service", label: "Služby", icon: "svc" },
  { db: "accounting", label: "Finance", icon: "finance" },
  { db: "hospitality", label: "Gastronomie", icon: "gastro" },
] as const;
