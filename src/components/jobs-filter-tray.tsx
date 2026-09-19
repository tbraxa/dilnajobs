"use client";

import Link from "next/link";
import { useRef } from "react";
import { CITIES, PROFESSIONS, professionByDb } from "@/lib/catalog";
import { jobsHref, type SearchQuery } from "@/lib/search-params";

const workModes = {
  onsite: "Na místě",
  hybrid: "Hybrid",
  remote: "Na dálku",
} as const;

const employmentTypes = {
  full_time: "Hlavní pracovní poměr",
  part_time: "Zkrácený úvazek",
  shift: "Směnný provoz",
} as const;

function QueryIcon({ kind }: { kind: "search" | "place" }) {
  return kind === "search" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}

function preservedInputs(query: SearchQuery, omit: (keyof SearchQuery)[] = []) {
  const values: [keyof SearchQuery, string | number | undefined][] = [
    ["q", query.q],
    ["city", query.city],
    ["profession", query.profession],
    ["salaryMin", query.salaryMin],
    ["salaryMax", query.salaryMax],
    ["workMode", query.workMode],
    ["employmentType", query.employmentType],
    ["sort", query.sort === "newest" ? undefined : query.sort],
  ];
  return values
    .filter(([key, value]) => value !== undefined && !omit.includes(key))
    .map(([key, value]) => (
      <input key={key} type="hidden" name={key} value={String(value)} />
    ));
}

export function JobsFilterTray({
  query,
  resultCount,
}: {
  query: SearchQuery;
  resultCount: number;
}) {
  const drawer = useRef<HTMLDialogElement>(null);
  const activeFilters = [
    query.profession
      ? {
          id: "profession",
          label: professionByDb(query.profession)?.label ?? "Další obory",
          href: jobsHref(query, { profession: undefined, page: undefined }),
        }
      : null,
    query.city
      ? {
          id: "city",
          label: query.city,
          href: jobsHref(query, { city: undefined, page: undefined }),
        }
      : null,
    query.salaryMin
      ? {
          id: "salaryMin",
          label: `Od ${query.salaryMin.toLocaleString("cs-CZ")} Kč`,
          href: jobsHref(query, { salaryMin: undefined, page: undefined }),
        }
      : null,
    query.salaryMax
      ? {
          id: "salaryMax",
          label: `Do ${query.salaryMax.toLocaleString("cs-CZ")} Kč`,
          href: jobsHref(query, { salaryMax: undefined, page: undefined }),
        }
      : null,
    query.workMode
      ? {
          id: "workMode",
          label: workModes[query.workMode],
          href: jobsHref(query, { workMode: undefined, page: undefined }),
        }
      : null,
    query.employmentType
      ? {
          id: "employmentType",
          label: employmentTypes[query.employmentType],
          href: jobsHref(query, { employmentType: undefined, page: undefined }),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <section className="gx-filter-tray" aria-label="Hledání a filtry">
        <form action="/nabidky" method="get" className="gx-search-grid">
          <label>
            <QueryIcon kind="search" />
            <span>
              <small>Co hledáte</small>
              <input name="q" defaultValue={query.q} placeholder="Pozice, obor nebo firma" />
            </span>
          </label>
          <label>
            <QueryIcon kind="place" />
            <span>
              <small>Kde</small>
              <input
                name="city"
                list="gx-cities"
                defaultValue={query.city}
                placeholder="Město nebo kraj"
              />
            </span>
          </label>
          {preservedInputs(query, ["q", "city"])}
          <button type="submit">
            Hledat
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className="gx-open-filters"
            onClick={() => drawer.current?.showModal()}
          >
            Upravit filtry
            {activeFilters.length ? <b>{activeFilters.length}</b> : null}
          </button>
        </form>

        <datalist id="gx-cities">
          {CITIES.map((city) => <option value={city.label} key={city.slug} />)}
        </datalist>

        <div className="gx-filter-console">
          <div className="gx-filter-tokens">
            {activeFilters.map((filter) => (
              <Link href={filter.href} className="gx-token is-active" key={filter.id}>
                {filter.label}<span aria-hidden="true">×</span>
              </Link>
            ))}
            {!query.salaryMin ? (
              <Link
                href={jobsHref(query, { salaryMin: 45000, page: undefined })}
                className="gx-token"
              >
                45 000 Kč+
              </Link>
            ) : null}
            {query.workMode !== "remote" ? (
              <Link
                href={jobsHref(query, { workMode: "remote", page: undefined })}
                className="gx-token"
              >
                Na dálku
              </Link>
            ) : null}
            {query.employmentType !== "full_time" ? (
              <Link
                href={jobsHref(query, { employmentType: "full_time", page: undefined })}
                className="gx-token"
              >
                Hlavní pracovní poměr
              </Link>
            ) : null}
            {activeFilters.length ? (
              <Link href="/nabidky" className="gx-reset">Zrušit vše</Link>
            ) : null}
          </div>

          <div className="gx-filter-utilities">
            <span>{resultCount} výsledků</span>
            <form action="/nabidky" method="get">
              {preservedInputs(query, ["sort"])}
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
        </div>
      </section>

      <dialog
        ref={drawer}
        className="gx-filter-drawer"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="gx-drawer-shell">
          <header>
            <div>
              <span>Filtry nabídek</span>
              <h2>Zpřesnit výběr</h2>
            </div>
            <button type="button" onClick={() => drawer.current?.close()} aria-label="Zavřít filtry">×</button>
          </header>
          <form action="/nabidky" method="get" className="gx-drawer-form">
            {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
            <fieldset className="gx-compensation-filter">
              <legend>Kompenzace za měsíc</legend>
              <label>
                <span>Od</span>
                <select name="salaryMin" defaultValue={query.salaryMin ?? ""}>
                  <option value="">Bez minima</option>
                  <option value="30000">30 000 Kč</option>
                  <option value="40000">40 000 Kč</option>
                  <option value="50000">50 000 Kč</option>
                  <option value="60000">60 000 Kč</option>
                  <option value="80000">80 000 Kč</option>
                </select>
              </label>
              <label>
                <span>Do</span>
                <select name="salaryMax" defaultValue={query.salaryMax ?? ""}>
                  <option value="">Bez maxima</option>
                  <option value="40000">40 000 Kč</option>
                  <option value="50000">50 000 Kč</option>
                  <option value="60000">60 000 Kč</option>
                  <option value="80000">80 000 Kč</option>
                  <option value="100000">100 000 Kč</option>
                </select>
              </label>
            </fieldset>

            <label className="gx-drawer-field">
              <span>Profese</span>
              <select name="profession" defaultValue={query.profession ?? ""}>
                <option value="">Všechny profese</option>
                {PROFESSIONS.map((profession) => (
                  <option value={profession.db} key={profession.db}>{profession.label}</option>
                ))}
                <option value="other">Další obory</option>
              </select>
            </label>

            <label className="gx-drawer-field">
              <span>Město nebo kraj</span>
              <input name="city" list="gx-cities" defaultValue={query.city} placeholder="Celé Česko" />
            </label>

            <fieldset className="gx-segment-field">
              <legend>Režim práce</legend>
              {[
                ["", "Vše"],
                ["onsite", "Na místě"],
                ["hybrid", "Hybrid"],
                ["remote", "Na dálku"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="workMode"
                    value={value}
                    defaultChecked={(query.workMode ?? "") === value}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="gx-segment-field">
              <legend>Typ úvazku</legend>
              {[
                ["", "Vše"],
                ["full_time", "Hlavní pracovní poměr"],
                ["part_time", "Zkrácený úvazek"],
                ["shift", "Směnný provoz"],
              ].map(([value, label]) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="employmentType"
                    value={value}
                    defaultChecked={(query.employmentType ?? "") === value}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

            {query.sort && query.sort !== "newest" ? (
              <input type="hidden" name="sort" value={query.sort} />
            ) : null}

            <footer>
              <Link href="/nabidky">Obnovit výchozí</Link>
              <button type="submit">Zobrazit {resultCount} nabídek</button>
            </footer>
          </form>
        </div>
      </dialog>
    </>
  );
}
