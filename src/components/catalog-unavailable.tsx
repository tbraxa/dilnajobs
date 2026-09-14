export const CATALOG_UNAVAILABLE_TITLE = "Nabídky teď nejsou k dispozici";
export const CATALOG_UNAVAILABLE_DETAIL =
  "Zkuste to za chvíli, nebo se ozvěte na ahoj@dilnajobs.cz.";

export function CatalogUnavailable({
  title = CATALOG_UNAVAILABLE_TITLE,
  detail = CATALOG_UNAVAILABLE_DETAIL,
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div style={{ padding: "1.5rem 1.25rem" }}>
      <p className="eyebrow">Nabídky</p>
      <h2 className="h2">{title}</h2>
      <p className="lead" style={{ marginTop: "0.75rem" }}>
        {detail}
      </p>
    </div>
  );
}
