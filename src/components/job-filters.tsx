import Link from "next/link";
import { CATEGORIES, CITIES, CONTRACT_TYPES, professionByDb } from "@/lib/catalog";
import { copy, contractLabel } from "@/lib/copy";
import { HOME_FIELDS } from "@/lib/craft";
import { nabidkyHref, type SearchQuery } from "@/lib/search-params";
import { fieldIcons, type FieldIconName } from "./craft-marks";

const MODES = [
  { value: "", label: copy.nabidky.filterModeAll },
  { value: "onsite", label: copy.nabidky.filterModeOnsite },
  { value: "hybrid", label: copy.nabidky.filterModeHybrid },
  { value: "remote", label: copy.nabidky.filterModeRemote },
] as const;

const QUICK_MODES = MODES.filter((mode) => mode.value);
const SALARY_PILLS = [20_000, 30_000, 40_000, 50_000, 60_000] as const;
const DRAWER_CONTRACTS = [
  CONTRACT_TYPES.find((type) => type.slug === "hpp")!,
  CONTRACT_TYPES.find((type) => type.slug === "dpc")!,
  CONTRACT_TYPES.find((type) => type.slug === "dpp")!,
  CONTRACT_TYPES.find((type) => type.slug === "ico")!,
];
const FILTERS_ID = "serp-filters-open";

function csInt(n: number) {
  return new Intl.NumberFormat("cs-CZ").format(n);
}

function ChipX() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" overflow="visible">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChipChevron() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" overflow="visible">
      <path d="M3 4.5L6 8l3-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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

function CloseGlyph() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" overflow="visible">
      <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
  chevron = false,
}: {
  label: string;
  value?: string;
  clearHref?: string;
  chevron?: boolean;
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
      {chevron ? (
        <span className="serp-chip-chevron" aria-hidden="true">
          <ChipChevron />
        </span>
      ) : null}
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
  const salaryIsPlus = query.salaryMin === 60_000;
  const salaryLabel =
    query.salaryMin != null ? `${csInt(query.salaryMin)}${salaryIsPlus ? "+" : ""}` : undefined;
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
    <div className="serp-row-chips" id="activeChips" aria-label={copy.nabidky.filtersActiveAria}>
      <FacetChip
        label={copy.nabidky.filtersCategory}
        value={categoryLabel}
        clearHref={nabidkyHref(query, { category: undefined, page: 1 })}
        chevron
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
        chevron
      />
      <FacetChip
        label={copy.nabidky.filtersSalaryChip}
        value={salaryLabel}
        clearHref={nabidkyHref(query, { salaryMin: undefined, page: 1 })}
        chevron
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

function FilterSheet({ query, resultCount }: { query: SearchQuery; resultCount: number }) {
  const salaryIsPreset = query.salaryMin != null && (SALARY_PILLS as readonly number[]).includes(query.salaryMin);
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
          <label className="serp-sheet-x" htmlFor={FILTERS_ID}>
            <CloseGlyph />
            <span className="visually-hidden">{copy.nabidky.ctaFiltersClose}</span>
          </label>
        </div>
        <form className="serp-sheet-form" action="/nabidky" method="get">
          {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
          {query.profession && query.profession !== query.category ? (
            <input type="hidden" name="profession" value={query.profession} />
          ) : null}
          <div className="serp-sheet-body">
            <p className="serp-sheet-kicker">{copy.nabidky.filtersCategory}</p>
            <label className="serp-radio">
              <input type="radio" name="category" value="" defaultChecked={!query.category} />
              {copy.nabidky.filtersAllCategories}
            </label>
            {CATEGORIES.map((field) => (
              <label key={field.db} className="serp-radio">
                <input type="radio" name="category" value={field.db} defaultChecked={query.category === field.db} />
                {field.label}
              </label>
            ))}

            <p className="serp-sheet-kicker">{copy.nabidky.filtersPlace}</p>
            <label className="serp-radio">
              <input type="radio" name="place" value="" defaultChecked={!query.place} />
              {copy.nabidky.filtersAllPlaces}
            </label>
            {CITIES.map((city) => (
              <label key={city.slug} className="serp-radio">
                <input type="radio" name="place" value={city.label} defaultChecked={query.place === city.label} />
                {city.label}
              </label>
            ))}

            <p className="serp-sheet-kicker">{copy.nabidky.filtersModeWork}</p>
            <div className="serp-segment" role="radiogroup" aria-label={copy.nabidky.filtersModeWork}>
              {MODES.map((mode) => (
                <label key={mode.value || "all"} className="serp-segment-item">
                  <input
                    type="radio"
                    name="mode"
                    value={mode.value}
                    defaultChecked={(query.workMode ?? "") === mode.value}
                  />
                  {mode.label}
                </label>
              ))}
            </div>

            <p className="serp-sheet-kicker">{copy.nabidky.filtersContract}</p>
            <label className="serp-radio">
              <input type="radio" name="contract" value="" defaultChecked={!query.contract} />
              {copy.nabidky.filterModeAll}
            </label>
            {DRAWER_CONTRACTS.map((type) => (
              <label key={type.slug} className="serp-radio">
                <input
                  type="radio"
                  name="contract"
                  value={type.slug}
                  defaultChecked={query.contract === type.slug}
                />
                {type.slug === "ico" ? copy.nabidky.filtersContractIco : type.label}
              </label>
            ))}

            <p className="serp-sheet-kicker">{copy.nabidky.filtersSalary}</p>
            <div className="serp-salary-pills" role="radiogroup" aria-label={copy.nabidky.filtersSalary}>
              {SALARY_PILLS.map((amount) => (
                <label key={amount} className="serp-salary-pill">
                  <input
                    type="radio"
                    name="salaryMin"
                    value={amount}
                    defaultChecked={salaryIsPreset && query.salaryMin === amount}
                  />
                  {amount === 60_000 ? `${csInt(amount)}+` : csInt(amount)}
                </label>
              ))}
            </div>
            <div className="serp-field serp-salary-custom">
              <span className="serp-salary-custom-label">{copy.nabidky.filtersSalaryCustom}</span>
              <input
                id="sheet-salary-custom"
                name="salaryCustom"
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                defaultValue={salaryIsPreset || query.salaryMin == null ? "" : String(query.salaryMin)}
                placeholder={copy.nabidky.filtersSalaryCustomPlaceholder}
              />
            </div>
          </div>
          <div className="serp-sheet-foot">
            <Link href="/nabidky" className="btn btn-ghost">
              {copy.nabidky.ctaCancel}
            </Link>
            <button className="btn btn-primary" type="submit">
              {copy.nabidky.ctaShowResults(resultCount)}
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

export function JobFilters({
  defaults,
  resultLabel,
  resultCount,
}: {
  defaults: SearchQuery;
  resultLabel: string;
  resultCount: number;
}) {
  return (
    <div className="serp-filters">
      <input id={FILTERS_ID} className="serp-filters-toggle" type="checkbox" />
      <div className="serp-chrome">
        <div className="serp-row-search">
          <SearchShell defaults={defaults} />
          <label className="btn btn-secondary serp-filter-btn" htmlFor={FILTERS_ID}>
            <FilterGlyph />
            {copy.nabidky.ctaEditFilters}
          </label>
          <p className="serp-toolbar-count">{resultLabel}</p>
        </div>
        <ChipRail query={defaults} />
      </div>
      <FilterSheet query={defaults} resultCount={resultCount} />
    </div>
  );
}
