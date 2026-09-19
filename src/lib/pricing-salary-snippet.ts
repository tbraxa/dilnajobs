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
