export function CatalogUnavailable({
  title = "Katalog teď nejde načíst",
  detail = "Nabídky teď nejde načíst. Zkuste stránku obnovit za chvíli.",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="border border-line bg-paper p-4 text-sm">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-steel">{detail}</p>
    </div>
  );
}
