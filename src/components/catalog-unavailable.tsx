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
    <div className="catalog-empty">
      <h2>{title}</h2>
      <p>{detail}</p>
    </div>
  );
}
