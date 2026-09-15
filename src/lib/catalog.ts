import { copy } from "./copy";

export const CATEGORIES = [
  { slug: "administration", label: "Administrativa", db: "administration" },
  { slug: "accounting", label: "Účetnictví a finance", db: "accounting" },
  { slug: "sales", label: "Obchod a prodej", db: "sales" },
  { slug: "customer_service", label: "Zákaznický servis", db: "customer_service" },
  { slug: "logistics", label: "Doprava a logistika", db: "logistics" },
  { slug: "driver", label: "Řidiči", db: "driver" },
  { slug: "it", label: "IT a vývoj", db: "it" },
  { slug: "healthcare", label: "Zdravotnictví", db: "healthcare" },
  { slug: "education", label: "Školství", db: "education" },
  { slug: "hospitality", label: "Gastronomie a ubytování", db: "hospitality" },
  { slug: "construction", label: "Stavebnictví", db: "construction" },
  { slug: "manufacturing", label: "Výroba a dílna", db: "manufacturing" },
  { slug: "trades", label: "Řemesla", db: "trades" },
  { slug: "facility", label: "Úklid a správa", db: "facility" },
  { slug: "marketing", label: "Marketing", db: "marketing" },
  { slug: "hr", label: "Personalistika", db: "hr" },
  { slug: "other", label: "Ostatní", db: "other" },
] as const;

/** Legacy manufacturing slugs still stored on older rows. */
export const LEGACY_PROFESSIONS = [
  { slug: "cnc", label: "CNC", db: "cnc", category: "manufacturing" },
  { slug: "svarac", label: "Svářeč", db: "welder", category: "trades" },
  { slug: "serizovac", label: "Seřizovač", db: "setter", category: "manufacturing" },
  { slug: "elektrikar", label: "Průmyslový elektrikář", db: "electrician", category: "trades" },
  { slug: "udrzba", label: "Údržba", db: "maintenance", category: "trades" },
  { slug: "zamecnik", label: "Zámečník", db: "locksmith", category: "trades" },
  { slug: "operator", label: "Operátor výroby", db: "operator", category: "manufacturing" },
] as const;

export const PROFESSIONS = CATEGORIES;

export type CategoryDb = (typeof CATEGORIES)[number]["db"];
export type ProfessionDb = CategoryDb | (typeof LEGACY_PROFESSIONS)[number]["db"] | "other";
export type ProfessionSlug = (typeof CATEGORIES)[number]["slug"] | (typeof LEGACY_PROFESSIONS)[number]["slug"];

export const CATEGORY_DB = CATEGORIES.map((c) => c.db);
export const PROFESSION_DB = [
  ...CATEGORY_DB,
  ...LEGACY_PROFESSIONS.map((p) => p.db),
] as const;

export const CITIES = [
  { slug: "praha", label: "Praha", region: "Hlavní město Praha" },
  { slug: "brno", label: "Brno", region: "Jihomoravský" },
  { slug: "ostrava", label: "Ostrava", region: "Moravskoslezský" },
  { slug: "plzen", label: "Plzeň", region: "Plzeňský" },
  { slug: "olomouc", label: "Olomouc", region: "Olomoucký" },
  { slug: "liberec", label: "Liberec", region: "Liberecký" },
  { slug: "ceske-budejovice", label: "České Budějovice", region: "Jihočeský" },
  { slug: "hradec-kralove", label: "Hradec Králové", region: "Královéhradecký" },
  { slug: "pardubice", label: "Pardubice", region: "Pardubický" },
  { slug: "zlin", label: "Zlín", region: "Zlínský" },
  { slug: "mlada-boleslav", label: "Mladá Boleslav", region: "Středočeský" },
  { slug: "kladno", label: "Kladno", region: "Středočeský" },
  { slug: "kolin", label: "Kolín", region: "Středočeský" },
] as const;

export type CitySlug = (typeof CITIES)[number]["slug"];

export const CONTRACT_TYPES = [
  { slug: "hpp", label: copy.card.contractHpp },
  { slug: "dpp", label: copy.card.contractDpp },
  { slug: "dpc", label: copy.card.contractDpc },
  { slug: "ico", label: copy.card.contractIco },
] as const;

export const EMPLOYMENT_TYPES = [
  { slug: "full_time", label: "Hlavní pracovní poměr", contract: "hpp" },
  { slug: "part_time", label: "Zkrácený úvazek", contract: "dpp" },
  { slug: "shift", label: "Směnný provoz", contract: "hpp" },
] as const;

export const WORK_MODES = [
  { slug: "onsite", label: copy.card.workModeOnsite },
  { slug: "hybrid", label: copy.card.workModeHybrid },
  { slug: "remote", label: copy.card.workModeRemote },
] as const;

export const PAGE_SIZE = 20;

export function categoryByDb(db: string) {
  return CATEGORIES.find((c) => c.db === db) ?? LEGACY_PROFESSIONS.find((p) => p.db === db);
}

export function professionBySlug(slug: string) {
  return CATEGORIES.find((p) => p.slug === slug) ?? LEGACY_PROFESSIONS.find((p) => p.slug === slug);
}

export function professionByDb(db: string) {
  return categoryByDb(db);
}

export function cityBySlug(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

export function cityByLabel(label: string) {
  const lower = label.toLocaleLowerCase("cs");
  return CITIES.find((c) => c.label.toLocaleLowerCase("cs") === lower);
}

export function categoryForProfession(profession: string): string {
  const legacy = LEGACY_PROFESSIONS.find((p) => p.db === profession);
  if (legacy) return legacy.category;
  if (CATEGORY_DB.includes(profession as CategoryDb)) return profession;
  return "other";
}

export function contractForEmployment(employmentType: string): string {
  if (employmentType === "part_time" || employmentType === "dpp") return "dpp";
  if (employmentType === "dpc") return "dpc";
  if (employmentType === "ico") return "ico";
  return "hpp";
}

export function isProfessionDb(value: string): value is ProfessionDb {
  return (PROFESSION_DB as readonly string[]).includes(value);
}

export function isCategoryDb(value: string): value is CategoryDb {
  return (CATEGORY_DB as readonly string[]).includes(value);
}
