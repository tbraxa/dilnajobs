export const PACKAGES = [
  {
    code: "trial",
    name: "Zkušební",
    priceCzkExVat: 0,
    period: "year" as const,
    adLimit: 10,
    blurb: "10 inzerátů za rok. Ověříte, že sem chodí správní lidé, ne agentury.",
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
    blurb: "40 inzerátů za rok. Pro závod, který nabírá průběžně.",
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

export const PUBLIC_PLANS = [
  {
    code: "start",
    name: "Start",
    priceCzk: 2490,
    note: "Pro jeden rychlý nábor",
    features: ["1 nabídka na 30 dní", "Firemní profil a logo", "Odpovědi přímo do přehledu"],
  },
  {
    code: "standard",
    name: "Standard",
    priceCzk: 4990,
    note: "Nejčastější volba",
    features: ["1 nabídka na 45 dní", "TOP pozice na 7 dní", "Doporučení vhodným uchazečům"],
  },
  {
    code: "plus",
    name: "Plus",
    priceCzk: 8990,
    note: "Pro více otevřených rolí",
    features: ["3 nabídky na 45 dní", "TOP pozice na 14 dní", "Prioritní kontrola a podpora"],
  },
] as const;

export function formatCzk(amount: number): string {
  return `${new Intl.NumberFormat("cs-CZ").format(amount)} Kč`;
}

export function formatSalary(min?: number | null, max?: number | null, note?: string | null): string {
  if (note) return note;
  if (min && max) {
    if (min === max) return `${formatCzk(min)} / měsíc`;
    const minFmt = new Intl.NumberFormat("cs-CZ").format(min);
    const maxFmt = new Intl.NumberFormat("cs-CZ").format(max);
    return `${minFmt} až ${maxFmt} Kč / měsíc`;
  }
  if (min) return `od ${formatCzk(min)} / měsíc`;
  if (max) return `do ${formatCzk(max)} / měsíc`;
  return "Mzda dohodou";
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
