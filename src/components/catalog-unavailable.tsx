export function CatalogUnavailable({
  title = "Katalog teď nejde načíst",
  detail = "Databáze odpovídá, ale tabulky s nabídkami ještě nejsou připravené. Po nasazení migrací stránku obnovte. Pokud je nástěnka prázdná schválně, zkuste to později.",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="empty">
      <p className="micro">Katalog</p>
      <p className="display" style={{ marginTop: "0.5rem", fontSize: "1.25rem" }}>
        {title}
      </p>
      <p style={{ marginTop: "0.5rem" }}>{detail}</p>
    </div>
  );
}
