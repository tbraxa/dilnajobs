import { copy } from "@/lib/copy";

export function CatalogUnavailable({
  title = copy.nabidky.emptyErrorTitle,
  detail = copy.nabidky.emptyErrorBody,
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
