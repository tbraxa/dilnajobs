export function CatalogUnavailable({
  title = "Katalog teď nejde načíst",
  detail = "Databáze odpovídá, ale tabulky s nabídkami ještě nejsou připravené. Po nasazení migrací stránku obnovte. Pokud je nástěnka prázdná schválně, zkuste to později.",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div style={{ padding: "1.5rem 1.25rem" }}>
      <p className="eyebrow">Katalog</p>
      <h2 className="h2">{title}</h2>
      <p className="lead" style={{ marginTop: "0.75rem" }}>
        {detail}
      </p>
    </div>
  );
}
