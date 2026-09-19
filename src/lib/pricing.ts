export const PACKAGES = [
  {
    code: "start",
    name: "Start",
    priceCzkExVat: 2490,
    period: "days" as const,
    days: 30,
    adLimit: 1,
    blurb: "1 aktivní nabídka. Schránka odpovědí. Ověření firmy přes IČO.",
  },
  {
    code: "standard",
    name: "Standard",
    priceCzkExVat: 4990,
    period: "days" as const,
    days: 30,
    adLimit: 5,
    blurb: "Až 5 aktivních nabídek. Zvýraznění ve výsledcích. Schránka a životopisy.",
  },
  {
    code: "plus",
    name: "Plus",
    priceCzkExVat: 8990,
    period: "days" as const,
    days: 30,
    adLimit: 15,
    blurb: "Až 15 aktivních nabídek. Priorita ve výpisu a logo firmy. Prioritní podpora.",
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
  return "mzda dohodou";
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("cs-CZ", { dateStyle: "medium" }).format(date);
}

export const PLAN_LIMITS: Record<string, number | null> = {
  start: 1,
  standard: 5,
  plus: 15,
};
