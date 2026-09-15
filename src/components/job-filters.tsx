import Link from "next/link";
import { copy } from "@/lib/copy";
import { HOME_FIELDS } from "@/lib/craft";
import { nabidkyHref, type SearchQuery } from "@/lib/search-params";
import { fieldIcons, type FieldIconName } from "./craft-marks";

const MODES = [
  { value: "", label: copy.nabidky.filterModeAll },
  { value: "onsite", label: copy.nabidky.filterModeOnsite },
  { value: "hybrid", label: copy.nabidky.filterModeHybrid },
  { value: "remote", label: copy.nabidky.filterModeRemote },
] as const;

export function SearchShell({
  action = "/nabidky",
  defaults,
  includeMode = false,
}: {
  action?: string;
  defaults?: SearchQuery;
  includeMode?: boolean;
}) {
  return (
    <form action={action} method="get" role="search">
      <div className="search-shell">
        {!includeMode && defaults?.category ? (
          <input type="hidden" name="category" value={defaults.category} />
        ) : null}
        {!includeMode && defaults?.workMode ? <input type="hidden" name="mode" value={defaults.workMode} /> : null}
        {!includeMode && defaults?.contract ? (
          <input type="hidden" name="contract" value={defaults.contract} />
        ) : null}
        {!includeMode && defaults?.salaryMin != null ? (
          <input type="hidden" name="salaryMin" value={String(defaults.salaryMin)} />
        ) : null}
        <div className="field">
          <label htmlFor="q">{copy.home.labelQuery}</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={defaults?.q}
            placeholder={copy.home.placeholderQuery}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="place">{copy.home.labelPlace}</label>
          <input
            id="place"
            name="place"
            type="text"
            defaultValue={defaults?.place}
            placeholder={copy.home.placeholderPlace}
            autoComplete="off"
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {copy.home.ctaSearch}
        </button>
      </div>
      {includeMode ? (
        <div className="mode-row" role="group" aria-label={copy.card.workModeLabel}>
          <span className="mode-label">{copy.card.workModeLabel}</span>
          {MODES.filter((mode) => mode.value).map((mode) => (
            <label key={mode.value} className="filter-chip">
              <input type="radio" name="mode" value={mode.value} defaultChecked={defaults?.workMode === mode.value} />
              {mode.label}
            </label>
          ))}
        </div>
      ) : null}
    </form>
  );
}

export function ModeChips({ query }: { query: SearchQuery }) {
  return (
    <div className="mode-row" role="group" aria-label={copy.nabidky.filtersMode}>
      <span className="mode-label">{copy.nabidky.filtersMode}</span>
      {MODES.map((mode) => {
        const active = (query.workMode ?? "") === mode.value;
        return (
          <Link
            key={mode.value || "all"}
            href={nabidkyHref({ ...query, page: 1 }, { workMode: (mode.value || undefined) as SearchQuery["workMode"] })}
            className={`filter-chip${active ? " is-active" : ""}`}
          >
            {mode.label}
          </Link>
        );
      })}
      {query.salaryMin ? (
        <span className="filter-chip is-active">
          {copy.nabidky.filtersSalary} {query.salaryMin.toLocaleString("cs-CZ")} Kč
        </span>
      ) : (
        <Link href={nabidkyHref({ ...query, page: 1 }, { salaryMin: 40000 })} className="filter-chip">
          {copy.nabidky.filtersSalary} 40 000 Kč
        </Link>
      )}
      {query.contract === "hpp" ? (
        <span className="filter-chip is-active">{copy.card.contractHpp}</span>
      ) : (
        <Link href={nabidkyHref({ ...query, page: 1 }, { contract: "hpp" })} className="filter-chip">
          {copy.card.contractHpp}
        </Link>
      )}
      <Link href="/nabidky" className="filter-chip">
        {copy.nabidky.emptyNoResultsCta}
      </Link>
    </div>
  );
}

export function FieldChips({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" aria-label={copy.home.sectionFields} style={{ marginTop: 12 }}>
      <Link
        href={nabidkyHref({ ...query, page: 1, category: undefined, profession: undefined })}
        className={`filter-chip${!query.category ? " is-active" : ""}`}
      >
        <span className="chip-icon">{fieldIcons.grid}</span>
        {copy.nabidky.filtersAllCategories}
      </Link>
      {HOME_FIELDS.map((field) => (
        <Link
          key={field.db}
          href={nabidkyHref({ ...query, page: 1 }, { category: field.db })}
          className={`filter-chip${query.category === field.db ? " is-active" : ""}`}
        >
          <span className="chip-icon">{fieldIcons[field.icon as FieldIconName]}</span>
          {field.label}
        </Link>
      ))}
    </div>
  );
}

export function CategoryRail() {
  return (
    <div className="cat-rail" aria-label={copy.home.sectionFields}>
      {HOME_FIELDS.map((field) => (
        <Link key={field.db} className="cat-tile" href={`/nabidky?category=${field.db}`}>
          <span className="cat-well" aria-hidden="true">
            {fieldIcons[field.icon as FieldIconName]}
          </span>
          <span className="cat-name">{field.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function JobFilters({ defaults }: { defaults: SearchQuery }) {
  return (
    <>
      <SearchShell defaults={defaults} />
      <ModeChips query={defaults} />
      <FieldChips query={defaults} />
    </>
  );
}
