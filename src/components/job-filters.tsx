import Link from "next/link";
import { CATEGORIES, CITIES, CONTRACT_TYPES, professionByDb } from "@/lib/catalog";
import { copy, contractLabel, salaryFrom } from "@/lib/copy";
import { HOME_FIELDS } from "@/lib/craft";
import { facetCount, nabidkyHref, type SearchQuery } from "@/lib/search-params";
import { fieldIcons, type FieldIconName } from "./craft-marks";

const MODES = [
  { value: "", label: copy.nabidky.filterModeAll },
  { value: "onsite", label: copy.nabidky.filterModeOnsite },
  { value: "hybrid", label: copy.nabidky.filterModeHybrid },
  { value: "remote", label: copy.nabidky.filterModeRemote },
] as const;

const QUICK_MODES = MODES.filter((mode) => mode.value);
const SALARY_FROM = [25_000, 40_000, 50_000, 70_000, 100_000] as const;
const FILTERS_ID = "serp-filters-open";

function ChipX() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" overflow="visible">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" overflow="visible">
      <path
        d="M2.5 3.5h11l-4 4.8V12l-3 1.5V8.3L2.5 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        {!includeMode && defaults?.profession && defaults.profession !== defaults.category ? (
          <input type="hidden" name="profession" value={defaults.profession} />
        ) : null}
        {!includeMode && defaults?.workMode ? <input type="hidden" name="mode" value={defaults.workMode} /> : null}
        {!includeMode && defaults?.contract ? (
          <input type="hidden" name="contract" value={defaults.contract} />
        ) : null}
        {!includeMode && defaults?.salaryMin != null ? (
          <input type="hidden" name="salaryMin" value={String(defaults.salaryMin)} />
        ) : null}
        <div className="field">
          <label htmlFor={includeMode ? "q" : "serp-q"}>{copy.home.labelQuery}</label>
          <input
            id={includeMode ? "q" : "serp-q"}
            name="q"
            type="search"
            defaultValue={defaults?.q}
            placeholder={copy.home.placeholderQuery}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor={includeMode ? "place" : "serp-place"}>{copy.home.labelPlace}</label>
          <input
            id={includeMode ? "place" : "serp-place"}
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
          {QUICK_MODES.map((mode) => (
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

function FacetChip({
  label,
  value,
  clearHref,
}: {
  label: string;
  value?: string;
  clearHref?: string;
}) {
  if (value && clearHref) {
    return (
      <Link
        href={clearHref}
        className="filter-chip is-active serp-chip"
        aria-label={`${value}. ${copy.nabidky.chipRemove}`}
      >
        <span>{value}</span>
        <span className="serp-chip-x" aria-hidden="true">
          <ChipX />
        </span>
      </Link>
    );
  }
  return (
    <label className="filter-chip" htmlFor={FILTERS_ID}>
      {label}
    </label>
  );
}

function ChipRail({ query }: { query: SearchQuery }) {
  const categoryLabel = query.category
    ? (professionByDb(query.category)?.label ?? query.category)
    : undefined;
  const professionLabel =
    query.profession && query.profession !== query.category
      ? (professionByDb(query.profession)?.label ?? query.profession)
      : undefined;
  const salaryLabel = query.salaryMin != null ? salaryFrom(query.salaryMin) : undefined;
  const hasReset = Boolean(
    query.q ||
      query.place ||
      query.category ||
      query.profession ||
      query.salaryMin ||
      query.workMode ||
      query.contract,
  );

  return (
    <div className="serp-row-chips" aria-label={copy.nabidky.filtersActiveAria}>
      <FacetChip
        label={copy.nabidky.filtersCategory}
        value={categoryLabel}
        clearHref={nabidkyHref(query, { category: undefined, page: 1 })}
      />
      {professionLabel ? (
        <FacetChip
          label={copy.nabidky.filtersCategory}
          value={professionLabel}
          clearHref={nabidkyHref(query, { profession: undefined, page: 1 })}
        />
      ) : null}
      <FacetChip
        label={copy.nabidky.filtersPlace}
        value={query.place}
        clearHref={nabidkyHref(query, { place: undefined, city: undefined, page: 1 })}
      />
      <FacetChip
        label={copy.nabidky.filtersSalary}
        value={salaryLabel}
        clearHref={nabidkyHref(query, { salaryMin: undefined, page: 1 })}
      />
      {QUICK_MODES.map((mode) => {
        const active = query.workMode === mode.value;
        return (
          <Link
            key={mode.value}
            href={nabidkyHref(query, {
              workMode: active ? undefined : (mode.value as SearchQuery["workMode"]),
              page: 1,
            })}
            className={`filter-chip${active ? " is-active" : ""}`}
          >
            {mode.label}
          </Link>
        );
      })}
      {query.contract ? (
        <FacetChip
          label={copy.nabidky.filtersContract}
          value={contractLabel(query.contract)}
          clearHref={nabidkyHref(query, { contract: undefined, page: 1 })}
        />
      ) : null}
      {hasReset ? (
        <Link href="/nabidky" className="filter-chip">
          {copy.nabidky.emptyNoResultsCta}
        </Link>
      ) : null}
    </div>
  );
}

function FilterSheet({ query }: { query: SearchQuery }) {
  return (
    <div className="serp-sheet" role="dialog" aria-labelledby="serp-sheet-title" aria-modal="true">
      <label className="serp-sheet-backdrop" htmlFor={FILTERS_ID}>
        <span className="visually-hidden">{copy.nabidky.ctaFiltersClose}</span>
      </label>
      <div className="serp-sheet-panel">
        <div className="serp-sheet-head">
          <h2 className="h3" id="serp-sheet-title">
            {copy.nabidky.ctaEditFilters}
          </h2>
          <label className="btn btn-ghost serp-sheet-close" htmlFor={FILTERS_ID}>
            {copy.nabidky.ctaFiltersClose}
          </label>
        </div>
        <form className="serp-sheet-form" action="/nabidky" method="get">
          {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
          {query.profession && query.profession !== query.category ? (
            <input type="hidden" name="profession" value={query.profession} />
          ) : null}
          <div className="serp-sheet-body">
            <div className="serp-field">
              <label htmlFor="sheet-category">{copy.nabidky.filtersCategory}</label>
              <select id="sheet-category" name="category" defaultValue={query.category ?? ""}>
                <option value="">{copy.nabidky.filtersAllCategories}</option>
                {CATEGORIES.map((field) => (
                  <option key={field.db} value={field.db}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="serp-field">
              <label htmlFor="sheet-place">{copy.nabidky.filtersPlace}</label>
              <input
                id="sheet-place"
                name="place"
                type="text"
                defaultValue={query.place}
                placeholder={copy.home.placeholderPlace}
                list="sheet-cities"
                autoComplete="off"
              />
              <datalist id="sheet-cities">
                {CITIES.map((city) => (
                  <option key={city.slug} value={city.label} />
                ))}
              </datalist>
            </div>
            <div className="serp-field">
              <label htmlFor="sheet-salary">{copy.nabidky.filtersSalary}</label>
              <select
                id="sheet-salary"
                name="salaryMin"
                defaultValue={query.salaryMin != null ? String(query.salaryMin) : ""}
              >
                <option value="">{copy.nabidky.filtersSalaryAny}</option>
                {SALARY_FROM.map((amount) => (
                  <option key={amount} value={amount}>
                    {salaryFrom(amount)}
                  </option>
                ))}
              </select>
            </div>
            <div className="serp-field">
              <label htmlFor="sheet-mode">{copy.nabidky.filtersMode}</label>
              <select id="sheet-mode" name="mode" defaultValue={query.workMode ?? ""}>
                {MODES.map((mode) => (
                  <option key={mode.value || "all"} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="serp-field">
              <label htmlFor="sheet-contract">{copy.nabidky.filtersContract}</label>
              <select id="sheet-contract" name="contract" defaultValue={query.contract ?? ""}>
                <option value="">{copy.nabidky.filterModeAll}</option>
                {CONTRACT_TYPES.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="serp-sheet-foot">
            <Link href="/nabidky" className="btn btn-ghost">
              {copy.nabidky.emptyNoResultsCta}
            </Link>
            <button className="btn btn-primary" type="submit">
              {copy.nabidky.ctaFiltersDone}
            </button>
          </div>
        </form>
      </div>
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

export function JobFilters({ defaults, resultLabel }: { defaults: SearchQuery; resultLabel: string }) {
  const facets = facetCount(defaults);
  return (
    <div className="serp-filters">
      <input id={FILTERS_ID} className="serp-filters-toggle" type="checkbox" />
      <div className="serp-chrome">
        <div className="serp-row-search">
          <SearchShell defaults={defaults} />
          <label className="btn btn-secondary serp-filter-btn" htmlFor={FILTERS_ID}>
            <FilterGlyph />
            {copy.nabidky.ctaEditFilters}
            {facets > 0 ? (
              <span className="serp-filter-badge" aria-label={copy.nabidky.filtersCount(facets)}>
                {facets}
              </span>
            ) : null}
          </label>
          <p className="serp-toolbar-count">{resultLabel}</p>
        </div>
        <ChipRail query={defaults} />
      </div>
      <FilterSheet query={defaults} />
    </div>
  );
}
