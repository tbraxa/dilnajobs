export function maskPhone(phone: string): string {
  const compact = phone.replace(/\s+/g, "");
  if (compact.length <= 6) return "•••";
  return `${compact.slice(0, 3)}•••${compact.slice(-3)}`;
}
