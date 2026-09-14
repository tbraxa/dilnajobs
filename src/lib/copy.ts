/** User-facing copy must not contain em dash or en dash. */
export function withoutTypographicDashes(value: string): string {
  return value
    .replace(/—/g, ", ")
    .replace(/–/g, " až ")
    .replace(/\s+,/g, ",")
    .replace(/,\s{2,}/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
