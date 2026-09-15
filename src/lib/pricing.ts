import { copy, salaryFrom, salaryRange } from "./copy";

export const PACKAGES = [
  {
    code: "trial",
    name: "Zkušební",
    priceCzkExVat: 0,
    period: "year" as const,
    adLimit: 10,
    blurb: "10 inzerátů za rok. Vyzkoušíte inzerci bez závazku.",
  },
  {
    code: "single",
    name: "Jednorázový",
    priceCzkExVat: 2990,
    period: "days" as const,
    days: 30,
    adLimit: 1,
    blurb: "Jeden inzerát, 30 dní. Když potřebujete jednoho člověka, ne balíček.",
  },
  {
    code: "basic",
    name: "Basic",
    priceCzkExVat: 8900,
    period: "year" as const,
    adLimit: 40,
    blurb: "40 inzerátů za rok. Pro firmu, která nabírá průběžně.",
  },
  {
    code: "standard",
    name: "Standard",
    priceCzkExVat: 19900,
    period: "year" as const,
    adLimit: null,
    blurb: "Neomezený počet inzerátů na rok. Bez počítání kusů.",
  },
  {
    code: "top",
    name: "Top 7 dní",
    priceCzkExVat: 1350,
    period: "days" as const,
    days: 7,
    adLimit: null,
    blurb: "Zvýraznění existujícího inzerátu na 7 dní v seznamu nabídek.",
  },
] as const;

/** Lean public placeholder prices on /pro-firmy#cenik. Not Stripe SKUs. */
export const PUBLIC_PLANS = [
  {
    code: "start",
    name: copy.employers.pricingStartName,
    priceCzk: 2490,
    note: copy.employers.pricingStartNote,
    featured: false,
    features: copy.employers.pricingStartItems,
  },
  {
    code: "standard",
    name: copy.employers.pricingStandardName,
    priceCzk: 4990,
    note: copy.employers.pricingStandardNote,
    featured: true,
    features: copy.employers.pricingStandardItems,
  },
  {
    code: "plus",
    name: copy.employers.pricingPlusName,
    priceCzk: 8990,
    note: copy.employers.pricingPlusNote,
    featured: false,
    features: copy.employers.pricingPlusItems,
  },
] as const;

export function formatCzk(amount: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(amount)} Kč`;
}

export function formatSalary(min?: number | null, max?: number | null, note?: string | null): string {
  if (note) return note;
  if (min && max) {
    if (min === max) return `${formatCzk(min)} / měsíc`;
    return salaryRange(min, max);
  }
  if (min) return salaryFrom(min);
  if (max) return `do ${formatCzk(max)} / měsíc`;
  return copy.card.salaryUnspecified;
}

export function displayJobSalary(job: {
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string | null;
  salaryNote?: string | null;
}): string {
  if (job.salaryMin || job.salaryMax) {
    return formatSalary(job.salaryMin, job.salaryMax, job.salaryType === "negotiable" ? null : job.salaryNote);
  }
  const note = job.salaryNote?.trim();
  if (job.salaryType === "negotiable" || (note && /dohod/i.test(note))) {
    return copy.card.salaryNegotiable;
  }
  if (note) return note;
  return copy.card.salaryUnspecified;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium" }).format(date);
}

export const PLAN_LIMITS: Record<string, number | null> = {
  trial: 10,
  single: 1,
  basic: 40,
  standard: null,
};
