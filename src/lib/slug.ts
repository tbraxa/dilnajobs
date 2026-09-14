export function slugify(input: string): string {
  return input
    .toLocaleLowerCase("cs")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function jobSlug(title: string, city: string, unique: string): string {
  const base = slugify(`${title}-${city}`);
  return `${base}-${unique.slice(0, 8)}`;
}
