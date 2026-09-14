import Link from "next/link";
import { CITIES, PROFESSIONS, professionByDb } from "@/lib/catalog";
import { hasActiveFilters, type SearchQuery } from "@/lib/search-params";
import { QuickChips } from "./search-panel";

export function FilterHq({ defaults }: { defaults?: SearchQuery }) {
  const active = hasActiveFilters(defaults);
  const professionLabel = defaults?.profession ? professionByDb(defaults.profession)?.label : null;
  const parts = [
    defaults?.q ? `„${defaults.q}“` : null,
    professionLabel,
    defaults?.city,
    defaults?.sort === "salary" ? "mzda" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="search-hq" id="filtry">
      <form className="search-panel is-hq" action="/nabidky" method="get">
        <label className="sp-field sp-q">
          <span>Pozice</span>
          <input id="q" name="q" defaultValue={defaults?.q ?? ""} placeholder="CNC, svářeč, Fanuc…" autoComplete="off" />
        </label>
        <div className="hq-fields" id="filtry-sheet">
          <div className="hq-sheet-head">
            <strong>Filtry</strong>
            <a href="#filtry" className="hq-sheet-close">
              Hotovo
            </a>
          </div>
          <label className="sp-field">
            <span>Město</span>
            <select id="city" name="city" defaultValue={defaults?.city ?? ""}>
              <option value="">Celá ČR</option>
              {CITIES.map((city) => (
                <option key={city.slug} value={city.label}>
                  {city.label}
                </option>
              ))}
            </select>
          </label>
          <label className="sp-field">
            <span>Profese</span>
            <select id="profession" name="profession" defaultValue={defaults?.profession ?? ""}>
              <option value="">Všechny</option>
              {PROFESSIONS.map((p) => (
                <option key={p.db} value={p.db}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="sp-field">
            <span>Řazení</span>
            <select id="sort" name="sort" defaultValue={defaults?.sort === "salary" ? "salary" : ""}>
              <option value="">Nejnovější</option>
              <option value="salary">Mzda</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary btn-square hq-sheet-apply">
            Použít filtry
          </button>
        </div>
        <a className="btn btn-secondary btn-square hq-sheet-open" href="#filtry-sheet">
          Filtry
        </a>
        <button type="submit" className="btn btn-primary btn-square sp-submit">
          Hledat
        </button>
      </form>
      <a href="#filtry" className="hq-sheet-backdrop" tabIndex={-1} aria-label="Zavřít filtry" />
      <div className="hq-chips">
        <QuickChips defaults={defaults} />
        {active ? (
          <p className="filter-status">
            <span>{parts.join(" · ")}</span>
            <Link href="/nabidky">Zrušit filtry</Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
