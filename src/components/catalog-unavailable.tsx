export function CatalogUnavailable({
  title = "Katalog teď nejde načíst",
  detail = "Databáze odpovídá, ale tabulky s nabídkami ještě nejsou připravené. Po nasazení migrací stránku obnovte. Pokud je nástěnka prázdná schválně, zkuste to později.",
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
