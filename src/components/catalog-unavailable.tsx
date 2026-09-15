import { copy } from "@/lib/copy";

export function CatalogUnavailable({
  title = copy.nabidky.emptyErrorTitle,
  detail = copy.nabidky.emptyErrorBody,
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="empty-panel">
      <p className="h3">{title}</p>
      <p className="hint">{detail}</p>
      <a href="/nabidky" className="btn btn-ghost" style={{ marginTop: 12 }}>
        {copy.nabidky.emptyErrorCta}
      </a>
    </div>
  );
}

export function EmptyJobs({
  title,
  body,
  ctaHref = "/nabidky",
  ctaLabel = copy.nabidky.emptyNoResultsCta,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="empty-panel">
      <p className="h3">{title}</p>
      <p className="hint">{body}</p>
      <a href={ctaHref} className="btn btn-ghost" style={{ marginTop: 12 }}>
        {ctaLabel}
      </a>
    </div>
  );
}
