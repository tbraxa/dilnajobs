import Link from "next/link";
import { CONTRACT_TYPES, professionByDb } from "@/lib/catalog";
import { copy, contractLabel } from "@/lib/copy";
import { HOME_FIELDS, HOME_FIELDS_FEATURED } from "@/lib/craft";
import { facetCount, nabidkyHref, type SearchQuery } from "@/lib/search-params";
import { fieldIcons, type FieldIconName } from "./craft-marks";

const MODES = [
  { value: "", label: copy.nabidky.filterModeAll },
  { value: "onsite", label: copy.nabidky.filterModeOnsite },
  { value: "hybrid", label: copy.nabidky.filterModeHybrid },
  { value: "remote", label: copy.nabidky.filterModeRemote },
] as const;

const QUICK_MODES = MODES.filter((mode) => mode.value);
const SALARY_STEPS = [20_000, 30_000, 40_000, 50_000, 60_000] as const;
const DRAWER_CITIES = ["Praha", "Brno", "Ostrava", "Plzeň", "Liberec", "České Budějovice"] as const;
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
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" overflow="visible">
      <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DrawerCloseGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" overflow="visible">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
    <form action={action} method="get" role="search" className={includeMode ? undefined : "filter-search"}>
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
        <button className={includeMode ? "btn btn-primary" : "btn-search"} type="submit">
          {copy.home.ctaSearch}
        </button>
      </div>
      {includeMode ? (
        <div className="mode-row" role="group" aria-label={copy.card.workModeLabel}>
          <span className="mode-label">{copy.card.workModeLabel}</span>
          {QUICK_MODES.map((mode) => (
            <Link key={mode.value} className="mode-chip" href={`/nabidky?mode=${mode.value}`}>
              {mode.label}
            </Link>
          ))}
        </div>
      ) : null}
    </form>
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
  const salaryLabel = query.salaryMin != null ? copy.nabidky.chipSalaryFrom(query.salaryMin) : undefined;
  const modeLabel = QUICK_MODES.find((mode) => mode.value === query.workMode)?.label;
  const chips: { key: string; label: string; href: string }[] = [];
  if (categoryLabel) {
    chips.push({ key: "obor", label: categoryLabel, href: nabidkyHref(query, { category: undefined, page: 1 }) });
  }
  if (professionLabel) {
    chips.push({
      key: "profese",
      label: professionLabel,
      href: nabidkyHref(query, { profession: undefined, page: 1 }),
    });
  }
  if (query.place) {
    chips.push({
      key: "misto",
      label: query.place,
      href: nabidkyHref(query, { place: undefined, city: undefined, page: 1 }),
    });
  }
  if (modeLabel) {
    chips.push({ key: "rezim", label: modeLabel, href: nabidkyHref(query, { workMode: undefined, page: 1 }) });
  }
  if (query.contract) {
    chips.push({
      key: "uvazek",
      label: contractLabel(query.contract),
      href: nabidkyHref(query, { contract: undefined, page: 1 }),
    });
  }
  if (salaryLabel) {
    chips.push({
      key: "mzda",
      label: salaryLabel,
      href: nabidkyHref(query, { salaryMin: undefined, page: 1 }),
    });
  }
  if (query.q) {
    chips.push({ key: "q", label: `„${query.q}“`, href: nabidkyHref(query, { q: undefined, page: 1 }) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="active-chips serp-row-chips is-visible" aria-label={copy.nabidky.filtersActiveAria}>
      {chips.map((chip) => (
        <span key={chip.key} className="filter-chip">
          {chip.label}
          <Link
            href={chip.href}
            className="chip-x"
            aria-label={`${copy.nabidky.chipRemove} ${chip.label}`}
          >
            <ChipX />
          </Link>
        </span>
      ))}
      <Link href="/nabidky" className="chip-reset">
        {copy.nabidky.emptyNoResultsCta}
      </Link>
    </div>
  );
}

function OptionRow({
  name,
  value,
  label,
  checked,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="option-row">
      <input type="radio" name={name} value={value} defaultChecked={checked} />
      <span className="check" aria-hidden="true" />
      {label}
    </label>
  );
}

function FilterSheet({ query, resultCount }: { query: SearchQuery; resultCount: number }) {
  const placeOptions = Array.from(
    new Set([query.place, ...DRAWER_CITIES].filter((city): city is string => Boolean(city))),
  );

  return (
    <div className="drawer-root serp-sheet" role="dialog" aria-labelledby="serp-sheet-title" aria-modal="true">
      <label className="drawer-scrim serp-sheet-backdrop" htmlFor={FILTERS_ID}>
        <span className="visually-hidden">{copy.nabidky.ctaFiltersClose}</span>
      </label>
      <div className="drawer-panel serp-sheet-panel">
        <div className="drawer-header serp-sheet-head">
          <h2 className="h3" id="serp-sheet-title">
            {copy.nabidky.ctaEditFilters}
          </h2>
          <label className="drawer-close" htmlFor={FILTERS_ID} aria-label={copy.nabidky.ctaFiltersClose}>
            <DrawerCloseGlyph />
          </label>
        </div>
        <form className="serp-sheet-form" action="/nabidky" method="get">
          {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
          {query.profession && query.profession !== query.category ? (
            <input type="hidden" name="profession" value={query.profession} />
          ) : null}
          <div className="drawer-body serp-sheet-body">
            <section className="drawer-section">
              <h3>{copy.nabidky.filtersCategory}</h3>
              <div className="option-list" role="listbox" aria-label={copy.nabidky.filtersCategory}>
                <OptionRow
                  name="category"
                  value=""
                  label={copy.nabidky.filtersAllCategories}
                  checked={!query.category}
                />
                {HOME_FIELDS.map((field) => (
                  <OptionRow
                    key={field.db}
                    name="category"
                    value={field.db}
                    label={field.label}
                    checked={query.category === field.db}
                  />
                ))}
              </div>
            </section>
            <section className="drawer-section">
              <h3>{copy.nabidky.filtersPlace}</h3>
              <div className="option-list" role="listbox" aria-label={copy.nabidky.filtersPlace}>
                <OptionRow
                  name="place"
                  value=""
                  label={copy.nabidky.filtersAllPlaces}
                  checked={!query.place}
                />
                {placeOptions.map((city) => (
                  <OptionRow key={city} name="place" value={city} label={city} checked={query.place === city} />
                ))}
              </div>
            </section>
            <section className="drawer-section">
              <h3>{copy.nabidky.filtersModeWork}</h3>
              <div className="segmented" role="group" aria-label={copy.nabidky.filtersModeWork}>
                {MODES.map((mode) => (
                  <label key={mode.value || "all"}>
                    <input
                      type="radio"
                      name="mode"
                      value={mode.value}
                      defaultChecked={mode.value ? query.workMode === mode.value : !query.workMode}
                    />
                    {mode.label}
                  </label>
                ))}
              </div>
            </section>
            <section className="drawer-section">
              <h3>{copy.nabidky.filtersContract}</h3>
              <div className="option-list" role="listbox" aria-label={copy.nabidky.filtersContract}>
                <OptionRow
                  name="contract"
                  value=""
                  label={copy.nabidky.filterModeAll}
                  checked={!query.contract}
                />
                {CONTRACT_TYPES.map((type) => (
                  <OptionRow
                    key={type.slug}
                    name="contract"
                    value={type.slug}
                    label={type.label}
                    checked={query.contract === type.slug}
                  />
                ))}
              </div>
            </section>
            <section className="drawer-section">
              <h3>{copy.nabidky.filtersSalary}</h3>
              <div className="salary-steps">
                {SALARY_STEPS.map((amount) => (
                  <Link
                    key={amount}
                    href={nabidkyHref(query, { salaryMin: amount, page: 1 })}
                    className={query.salaryMin === amount ? "is-selected" : undefined}
                  >
                    {amount === 60_000 ? "60 000+" : new Intl.NumberFormat("cs-CZ").format(amount)}
                  </Link>
                ))}
              </div>
              <div className="salary-input serp-field">
                <label htmlFor="mzdaOd">{copy.nabidky.filtersSalaryInput}</label>
                <input
                  id="mzdaOd"
                  name="salaryMin"
                  type="number"
                  min={0}
                  step={1000}
                  defaultValue={query.salaryMin ?? ""}
                  placeholder={copy.nabidky.filtersSalaryPlaceholder}
                />
              </div>
            </section>
          </div>
          <div className="drawer-footer serp-sheet-foot">
            <Link href="/nabidky" className="btn btn-ghost">
              {copy.nabidky.ctaDrawerReset}
            </Link>
            <button className="btn btn-primary" type="submit">
              {copy.nabidky.ctaShowOffers(resultCount)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CategoryRail() {
  return (
    <div className="cat-rail" aria-label={copy.home.sectionCats}>
      {HOME_FIELDS_FEATURED.map((field) => (
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

export function JobFilters({
  defaults,
  resultLabel,
  resultCount = 0,
}: {
  defaults: SearchQuery;
  resultLabel: string;
  resultCount?: number;
}) {
  const facets = facetCount(defaults);
  return (
    <div className="filter-chrome serp-filters">
      <input id={FILTERS_ID} className="serp-filters-toggle" type="checkbox" />
      <div className="wrap serp-chrome">
        <div className="filter-bar serp-row-search">
          <SearchShell defaults={defaults} />
          <div className="bar-actions">
            <label
              className={`btn-filters serp-filter-btn${facets > 0 ? " has-count" : ""}`}
              htmlFor={FILTERS_ID}
            >
              <FilterGlyph />
              {copy.nabidky.ctaEditFilters}
              <span className="badge serp-filter-badge" aria-label={copy.nabidky.filtersCount(facets)}>
                {facets}
              </span>
            </label>
            <span className="results-count serp-toolbar-count">
              {/^\d/.test(resultLabel) ? (
                <>
                  <strong>{resultCount}</strong>
                  {resultLabel.replace(/^\d+/, "")}
                </>
              ) : (
                resultLabel
              )}
            </span>
          </div>
        </div>
        <ChipRail query={defaults} />
      </div>
      <FilterSheet query={defaults} resultCount={resultCount} />
    </div>
  );
}
