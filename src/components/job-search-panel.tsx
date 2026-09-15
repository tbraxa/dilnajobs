"use client";

import Link from "next/link";
import { useRef } from "react";
import { CITIES, PROFESSIONS, professionByDb } from "@/lib/catalog";
import { jobsHref, type SearchQuery } from "@/lib/search-params";

const workModeLabels = {
  onsite: "Na místě",
  hybrid: "Hybrid",
  remote: "Na dálku",
} as const;

const employmentLabels = {
  full_time: "Hlavní pracovní poměr",
  part_time: "Zkrácený úvazek",
  shift: "Směnný provoz",
} as const;

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

function hiddenFilters(query: SearchQuery, omit: (keyof SearchQuery)[] = []) {
  const values: [keyof SearchQuery, string | number | undefined][] = [
    ["profession", query.profession],
    ["salaryMin", query.salaryMin],
    ["workMode", query.workMode],
    ["employmentType", query.employmentType],
    ["sort", query.sort === "newest" ? undefined : query.sort],
  ];
  return values
    .filter(([key, value]) => value !== undefined && !omit.includes(key))
    .map(([key, value]) => <input key={key} type="hidden" name={key} value={String(value)} />);
}

export function JobSearchPanel({
  query,
  resultCount,
}: {
  query: SearchQuery;
  resultCount: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = [
    query.profession
      ? {
          key: "profession",
          label: professionByDb(query.profession)?.label ?? "Další obory",
          href: jobsHref(query, { profession: undefined, page: undefined }),
        }
      : null,
    query.city
      ? {
          key: "city",
          label: query.city,
          href: jobsHref(query, { city: undefined, page: undefined }),
        }
      : null,
    query.salaryMin
      ? {
          key: "salary",
          label: `Od ${new Intl.NumberFormat("cs-CZ").format(query.salaryMin)} Kč`,
          href: jobsHref(query, { salaryMin: undefined, page: undefined }),
        }
      : null,
    query.workMode
      ? {
          key: "mode",
          label: workModeLabels[query.workMode],
          href: jobsHref(query, { workMode: undefined, page: undefined }),
        }
      : null,
    query.employmentType
      ? {
          key: "type",
          label: employmentLabels[query.employmentType],
          href: jobsHref(query, { employmentType: undefined, page: undefined }),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="fj-serp-controls">
      <form action="/nabidky" method="get" className="fj-serp-searchbar">
        <label className="fj-serp-search-field">
          <span className="sr-only">Pozice nebo obor</span>
          <SearchGlyph />
          <input name="q" defaultValue={query.q} placeholder="Pozice, obor nebo firma" />
        </label>
        <label className="fj-serp-place-field">
          <span className="sr-only">Město nebo kraj</span>
          <input name="city" list="fj-cities" defaultValue={query.city} placeholder="Město nebo kraj" />
        </label>
        {hiddenFilters(query, ["city"])}
        <button type="submit">Hledat</button>
      </form>

      <datalist id="fj-cities">
        {CITIES.map((city) => (
          <option value={city.label} key={city.slug} />
        ))}
      </datalist>

      <div className="fj-filter-strip">
        <div className="fj-filter-chips" aria-label="Aktivní a rychlé filtry">
          {active.map((item) => (
            <Link href={item.href} className="fj-filter-chip fj-filter-chip-active" key={item.key}>
              {item.label}
              <span aria-hidden="true">×</span>
            </Link>
          ))}
          {query.workMode !== "remote" ? (
            <Link href={jobsHref(query, { workMode: "remote", page: undefined })} className="fj-filter-chip">
              Na dálku
            </Link>
          ) : null}
          {!query.salaryMin ? (
            <Link href={jobsHref(query, { salaryMin: 45000, page: undefined })} className="fj-filter-chip">
              Mzda od 45 000 Kč
            </Link>
          ) : null}
          {query.employmentType !== "full_time" ? (
            <Link
              href={jobsHref(query, { employmentType: "full_time", page: undefined })}
              className="fj-filter-chip"
            >
              Hlavní pracovní poměr
            </Link>
          ) : null}
          <button
            type="button"
            className="fj-filter-more"
            onClick={() => dialogRef.current?.showModal()}
          >
            Upravit filtry
            {active.length ? <span>{active.length}</span> : null}
          </button>
        </div>

        <form action="/nabidky" method="get" className="fj-sort-form">
          {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
          {query.city ? <input type="hidden" name="city" value={query.city} /> : null}
          {hiddenFilters(query, ["sort"])}
          <label>
            <span>Řazení</span>
            <select
              name="sort"
              defaultValue={query.sort ?? "newest"}
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
            >
              <option value="newest">Nejnovější</option>
              <option value="salary">Nejvyšší mzda</option>
            </select>
          </label>
        </form>
      </div>

      <dialog
        ref={dialogRef}
        className="fj-filter-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="fj-filter-dialog-card">
          <div className="fj-filter-dialog-head">
            <div>
              <p className="fj-eyebrow">Přesnější výběr</p>
              <h2>Upravit filtry</h2>
            </div>
            <button type="button" aria-label="Zavřít filtry" onClick={() => dialogRef.current?.close()}>
              ×
            </button>
          </div>

          <form action="/nabidky" method="get" className="fj-filter-dialog-form">
            {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
            <label className="fj-form-field">
              <span>Profese</span>
              <select name="profession" defaultValue={query.profession ?? ""}>
                <option value="">Všechny profese</option>
                {PROFESSIONS.map((profession) => (
                  <option value={profession.db} key={profession.db}>
                    {profession.label}
                  </option>
                ))}
                <option value="other">Další obory</option>
              </select>
            </label>

            <label className="fj-form-field">
              <span>Město nebo kraj</span>
              <input name="city" list="fj-cities" defaultValue={query.city} placeholder="Celé Česko" />
            </label>

            <label className="fj-form-field">
              <span>Minimální měsíční mzda</span>
              <select name="salaryMin" defaultValue={query.salaryMin ?? ""}>
                <option value="">Bez omezení</option>
                <option value="30000">30 000 Kč</option>
                <option value="40000">40 000 Kč</option>
                <option value="50000">50 000 Kč</option>
                <option value="60000">60 000 Kč</option>
                <option value="80000">80 000 Kč</option>
              </select>
            </label>

            <fieldset className="fj-filter-choice-group">
              <legend>Režim práce</legend>
              <label>
                <input type="radio" name="workMode" value="" defaultChecked={!query.workMode} />
                Vše
              </label>
              <label>
                <input type="radio" name="workMode" value="onsite" defaultChecked={query.workMode === "onsite"} />
                Na místě
              </label>
              <label>
                <input type="radio" name="workMode" value="hybrid" defaultChecked={query.workMode === "hybrid"} />
                Hybrid
              </label>
              <label>
                <input type="radio" name="workMode" value="remote" defaultChecked={query.workMode === "remote"} />
                Na dálku
              </label>
            </fieldset>

            <fieldset className="fj-filter-choice-group">
              <legend>Typ úvazku</legend>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  value=""
                  defaultChecked={!query.employmentType}
                />
                Vše
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  value="full_time"
                  defaultChecked={query.employmentType === "full_time"}
                />
                Hlavní pracovní poměr
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  value="part_time"
                  defaultChecked={query.employmentType === "part_time"}
                />
                Zkrácený úvazek
              </label>
              <label>
                <input
                  type="radio"
                  name="employmentType"
                  value="shift"
                  defaultChecked={query.employmentType === "shift"}
                />
                Směnný provoz
              </label>
            </fieldset>

            {query.sort && query.sort !== "newest" ? (
              <input type="hidden" name="sort" value={query.sort} />
            ) : null}

            <div className="fj-filter-dialog-actions">
              <Link href="/nabidky">Zrušit vše</Link>
              <button type="submit" className="fj-primary-button fj-primary-button-blue">
                Ukázat {resultCount} nabídek
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
