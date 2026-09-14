export const PROFESSIONS = [
  { slug: "cnc", label: "CNC", db: "cnc" },
  { slug: "svarac", label: "Svářeč", db: "welder" },
  { slug: "serizovac", label: "Seřizovač", db: "setter" },
  { slug: "elektrikar", label: "Průmyslový elektrikář", db: "electrician" },
  { slug: "udrzba", label: "Údržba", db: "maintenance" },
  { slug: "zamecnik", label: "Zámečník", db: "locksmith" },
  { slug: "operator", label: "Operátor výroby", db: "operator" },
] as const;

export type ProfessionDb = (typeof PROFESSIONS)[number]["db"] | "other";
export type ProfessionSlug = (typeof PROFESSIONS)[number]["slug"];

export const CITIES = [
  { slug: "brno", label: "Brno", region: "Jihomoravský" },
  { slug: "ostrava", label: "Ostrava", region: "Moravskoslezský" },
  { slug: "plzen", label: "Plzeň", region: "Plzeňský" },
  { slug: "mlada-boleslav", label: "Mladá Boleslav", region: "Středočeský" },
  { slug: "liberec", label: "Liberec", region: "Liberecký" },
  { slug: "zlin", label: "Zlín", region: "Zlínský" },
  { slug: "pardubice", label: "Pardubice", region: "Pardubický" },
  { slug: "ceske-budejovice", label: "České Budějovice", region: "Jihočeský" },
  { slug: "kolin", label: "Kolín", region: "Středočeský" },
  { slug: "kladno", label: "Kladno", region: "Středočeský" },
] as const;

export type CitySlug = (typeof CITIES)[number]["slug"];

export const EMPLOYMENT_TYPES = [
  { slug: "full_time", label: "Hlavní pracovní poměr" },
  { slug: "part_time", label: "Zkrácený úvazek" },
  { slug: "shift", label: "Směnný provoz" },
] as const;

export function professionBySlug(slug: string) {
  return PROFESSIONS.find((p) => p.slug === slug);
}

export function professionByDb(db: string) {
  return PROFESSIONS.find((p) => p.db === db);
}

export function cityBySlug(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

export function cityByLabel(label: string) {
  const lower = label.toLocaleLowerCase("cs");
  return CITIES.find((c) => c.label.toLocaleLowerCase("cs") === lower);
}
