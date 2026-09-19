/** Compensation-first display helpers matching preview-v6-soa SoT. */

export function formatSalaryShort(
  min?: number | null,
  max?: number | null,
  note?: string | null,
): { primary: string; unit: string } {
  if (note && !min && !max) {
    return { primary: note, unit: "uvedeno firmou" };
  }
  if (min && max) {
    if (min === max) {
      return { primary: `${Math.round(min / 1000)} tis.`, unit: "Kč / měsíc" };
    }
    return {
      primary: `${Math.round(min / 1000)} až ${Math.round(max / 1000)} tis.`,
      unit: "Kč / měsíc",
    };
  }
  if (min) return { primary: `od ${Math.round(min / 1000)} tis.`, unit: "Kč / měsíc" };
  if (max) return { primary: `do ${Math.round(max / 1000)} tis.`, unit: "Kč / měsíc" };
  return { primary: "Mzda dohodou", unit: "uvedeno firmou" };
}

export function companyInitials(name: string): string {
  const parts = name
    .replace(/[,.].*$/, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "FJ";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

export function relativeDayLabel(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days <= 0) return "Dnes";
  if (days === 1) return "Včera";
  if (days < 7) return `${days} dny`;
  if (days < 14) return "1 týden";
  return `${Math.floor(days / 7)} týdny`;
}
