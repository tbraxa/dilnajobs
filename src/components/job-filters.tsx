import Link from "next/link";
import { CATEGORIES, CITIES, CONTRACT_TYPES, professionByDb } from "@/lib/catalog";
import { copy, contractLabel, salaryFrom, workModeLabel } from "@/lib/copy";
import { HOME_FIELDS } from "@/lib/craft";
import { facetCount, nabidkyHref, type SearchQuery } from "@/lib/search-params";
import { fieldIcons, type FieldIconName } from "./craft-marks";

const MODES = [
  { value: "", label: copy.nabidky.filterModeAll },
  { value: "onsite", label: copy.nabidky.filterModeOnsite },
  { value: "hybrid", label: copy.nabidky.filterModeHybrid },
  { value: "remote", label: copy.nabidky.filterModeRemote },
] as const;

const SALARY_FROM = [25_000, 40_000, 50_000, 70_000, 100_000] as const;
const CITY_PICKS = CITIES.slice(0, 8);
const FILTERS_ID = "serp-filters-open";

const FIELD_ICON: Partial<Record<string, FieldIconName>> = Object.fromEntries(
  HOME_FIELDS.map((field) => [field.db, field.icon]),
);

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
  compact = false,
}: {
  action?: string;
  defaults?: SearchQuery;
  includeMode?: boolean;
  compact?: boolean;
}) {
  return (
    <form action={action} method="get" role="search">
      <div className={`search-shell${compact ? " search-shell-compact" : ""}`}>
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
          <label htmlFor={compact ? "serp-q" : "q"}>{copy.home.labelQuery}</label>
          <input
            id={compact ? "serp-q" : "q"}
            name="q"
            type="search"
            defaultValue={defaults?.q}
            placeholder={copy.home.placeholderQuery}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor={compact ? "serp-place" : "place"}>{copy.home.labelPlace}</label>
          <input
            id={compact ? "serp-place" : "place"}
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

function activeChips(query: SearchQuery) {
  const chips: { key: string; label: string; href: string }[] = [];
  if (query.q) {
    chips.push({ key: "q", label: query.q, href: nabidkyHref(query, { q: undefined, page: 1 }) });
  }
  if (query.place) {
    chips.push({
      key: "place",
      label: query.place,
      href: nabidkyHref(query, { place: undefined, city: undefined, page: 1 }),
    });
  }
  if (query.category) {
    chips.push({
      key: "category",
      label: professionByDb(query.category)?.label ?? query.category,
      href: nabidkyHref(query, { category: undefined, page: 1 }),
    });
  }
  if (query.profession && query.profession !== query.category) {
    chips.push({
      key: "profession",
      label: professionByDb(query.profession)?.label ?? query.profession,
      href: nabidkyHref(query, { profession: undefined, page: 1 }),
    });
  }
  if (query.salaryMin != null) {
    chips.push({
      key: "salaryMin",
      label: salaryFrom(query.salaryMin),
      href: nabidkyHref(query, { salaryMin: undefined, page: 1 }),
    });
  }
  if (query.workMode) {
    chips.push({
      key: "workMode",
      label: workModeLabel(query.workMode),
      href: nabidkyHref(query, { workMode: undefined, page: 1 }),
    });
  }
  if (query.contract) {
    chips.push({
      key: "contract",
      label: contractLabel(query.contract),
      href: nabidkyHref(query, { contract: undefined, page: 1 }),
    });
  }
  return chips;
}

function ActiveFilterChips({ query }: { query: SearchQuery }) {
  const chips = activeChips(query);
  if (chips.length === 0) return null;
  return (
    <div className="serp-chips" aria-label={copy.nabidky.filtersActiveAria}>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className="filter-chip is-active serp-chip"
          aria-label={`${chip.label}. ${copy.nabidky.chipRemove}`}
        >
          <span>{chip.label}</span>
          <span className="serp-chip-x" aria-hidden="true">
            <ChipX />
          </span>
        </Link>
      ))}
      <Link href="/nabidky" className="filter-chip">
        {copy.nabidky.emptyNoResultsCta}
      </Link>
    </div>
  );
}

function CategoryPicks({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" role="group" aria-label={copy.nabidky.filtersCategory}>
      <Link
        href={nabidkyHref(query, { category: undefined, profession: undefined, page: 1 })}
        className={`filter-chip${!query.category && !query.profession ? " is-active" : ""}`}
      >
        <span className="chip-icon">{fieldIcons.grid}</span>
        {copy.nabidky.filtersAllCategories}
      </Link>
      {CATEGORIES.map((field) => {
        const icon = FIELD_ICON[field.db];
        const active = query.category === field.db;
        return (
          <Link
            key={field.db}
            href={nabidkyHref(query, { category: field.db, profession: undefined, page: 1 })}
            className={`filter-chip${active ? " is-active" : ""}`}
          >
            {icon ? <span className="chip-icon">{fieldIcons[icon]}</span> : null}
            {field.label}
          </Link>
        );
      })}
    </div>
  );
}

function CityPicks({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" role="group" aria-label={copy.nabidky.filtersPlace}>
      {CITY_PICKS.map((city) => {
        const active = (query.place ?? "").toLocaleLowerCase("cs") === city.label.toLocaleLowerCase("cs");
        return (
          <Link
            key={city.slug}
            href={nabidkyHref(query, { place: city.label, city: city.label, page: 1 })}
            className={`filter-chip${active ? " is-active" : ""}`}
          >
            {city.label}
          </Link>
        );
      })}
    </div>
  );
}

function SalaryPicks({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" role="group" aria-label={copy.nabidky.filtersSalary}>
      <Link
        href={nabidkyHref(query, { salaryMin: undefined, page: 1 })}
        className={`filter-chip${query.salaryMin == null ? " is-active" : ""}`}
      >
        {copy.nabidky.filtersSalaryAny}
      </Link>
      {SALARY_FROM.map((amount) => (
        <Link
          key={amount}
          href={nabidkyHref(query, { salaryMin: amount, page: 1 })}
          className={`filter-chip${query.salaryMin === amount ? " is-active" : ""}`}
        >
          {salaryFrom(amount)}
        </Link>
      ))}
    </div>
  );
}

function ModePicks({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" role="group" aria-label={copy.nabidky.filtersMode}>
      {MODES.map((mode) => {
        const active = (query.workMode ?? "") === mode.value;
        return (
          <Link
            key={mode.value || "all"}
            href={nabidkyHref(query, { workMode: (mode.value || undefined) as SearchQuery["workMode"], page: 1 })}
            className={`filter-chip${active ? " is-active" : ""}`}
          >
            {mode.label}
          </Link>
        );
      })}
    </div>
  );
}

function ContractPicks({ query }: { query: SearchQuery }) {
  return (
    <div className="taxonomy-rail" role="group" aria-label={copy.nabidky.filtersContract}>
      <Link
        href={nabidkyHref(query, { contract: undefined, page: 1 })}
        className={`filter-chip${!query.contract ? " is-active" : ""}`}
      >
        {copy.nabidky.filterModeAll}
      </Link>
      {CONTRACT_TYPES.map((type) => (
        <Link
          key={type.slug}
          href={nabidkyHref(query, { contract: type.slug, page: 1 })}
          className={`filter-chip${query.contract === type.slug ? " is-active" : ""}`}
        >
          {type.label}
        </Link>
      ))}
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
            {copy.nabidky.ctaShowFilters}
          </h2>
          <label className="btn btn-ghost serp-sheet-close" htmlFor={FILTERS_ID}>
            {copy.nabidky.ctaFiltersClose}
          </label>
        </div>
        <div className="serp-sheet-body">
          <section className="serp-sheet-section">
            <h3 className="serp-sheet-label">{copy.nabidky.filtersCategory}</h3>
            <CategoryPicks query={query} />
          </section>
          <section className="serp-sheet-section">
            <h3 className="serp-sheet-label">{copy.nabidky.filtersPlace}</h3>
            <CityPicks query={query} />
          </section>
          <section className="serp-sheet-section">
            <h3 className="serp-sheet-label">{copy.nabidky.filtersSalary}</h3>
            <SalaryPicks query={query} />
          </section>
          <section className="serp-sheet-section">
            <h3 className="serp-sheet-label">{copy.nabidky.filtersMode}</h3>
            <ModePicks query={query} />
          </section>
          <section className="serp-sheet-section">
            <h3 className="serp-sheet-label">{copy.nabidky.filtersContract}</h3>
            <ContractPicks query={query} />
          </section>
        </div>
        <div className="serp-sheet-foot">
          <Link href="/nabidky" className="btn btn-ghost">
            {copy.nabidky.emptyNoResultsCta}
          </Link>
          <label className="btn btn-primary" htmlFor={FILTERS_ID}>
            {copy.nabidky.ctaFiltersDone}
          </label>
        </div>
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

export function JobFilters({ defaults }: { defaults: SearchQuery }) {
  const facets = facetCount(defaults);
  return (
    <div className="serp-filters">
      <input id={FILTERS_ID} className="serp-filters-toggle" type="checkbox" />
      <div className="serp-toolbar">
        <div className="serp-toolbar-inner">
          <SearchShell defaults={defaults} compact />
          <label className="btn btn-secondary serp-filter-btn" htmlFor={FILTERS_ID}>
            <FilterGlyph />
            {copy.nabidky.ctaFilters}
            {facets > 0 ? (
              <span className="serp-filter-badge" aria-label={copy.nabidky.filtersCount(facets)}>
                {facets}
              </span>
            ) : null}
          </label>
        </div>
      </div>
      <ActiveFilterChips query={defaults} />
      <FilterSheet query={defaults} />
    </div>
  );
}
