import Link from "next/link";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";

export function FilterChips({ defaults }: { defaults?: SearchQuery }) {
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Profese">
        <span className="filter-label">Profese</span>
        <Link
          href={toNabidkyHref(defaults, { profession: undefined })}
          className={`filter-chip${!defaults?.profession ? " is-active" : ""}`}
        >
          Vše
        </Link>
        {PROFESSIONS.map((chip) => {
          const on = defaults?.profession === chip.db;
          return (
            <Link
              key={chip.db}
              href={toNabidkyHref(defaults, { profession: on ? undefined : chip.db })}
              className={`filter-chip${on ? " is-active" : ""}`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
      <div className="filter-bar" role="group" aria-label="Město">
        <span className="filter-label">Město</span>
        <Link
          href={toNabidkyHref(defaults, { city: undefined })}
          className={`filter-chip${!defaults?.city ? " is-active" : ""}`}
        >
          Celá ČR
        </Link>
        {CITIES.slice(0, 6).map((city) => {
          const on = defaults?.city === city.label;
          return (
            <Link
              key={city.slug}
              href={toNabidkyHref(defaults, { city: on ? undefined : city.label })}
              className={`filter-chip${on ? " is-active" : ""}`}
            >
              {city.label}
            </Link>
          );
        })}
      </div>
      <form className="filter-bar is-tools" action="/nabidky" method="get" aria-label="Hledat">
        <span className="filter-label">Hledat</span>
        <div className="filter-tools">
          <div className="form-field">
            <label htmlFor="q">Pozice</label>
            <input id="q" name="q" defaultValue={defaults?.q ?? ""} placeholder="Fanuc, TIG, seřízení…" />
          </div>
          <div className="form-field">
            <label htmlFor="profession">Profese</label>
            <select id="profession" name="profession" defaultValue={defaults?.profession ?? ""}>
              <option value="">Všechny</option>
              {PROFESSIONS.map((p) => (
                <option key={p.db} value={p.db}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="city">Město</label>
            <select id="city" name="city" defaultValue={defaults?.city ?? ""}>
              <option value="">Celá ČR</option>
              {CITIES.map((c) => (
                <option key={c.slug} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="sort">Řazení</label>
            <select id="sort" name="sort" defaultValue={defaults?.sort ?? "newest"}>
              <option value="newest">Nejnovější</option>
              <option value="salary">Mzda</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-square">
            Filtrovat
          </button>
        </div>
      </form>
    </>
  );
}
