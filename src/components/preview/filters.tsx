import Link from "next/link";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";
import { SpriteIcon } from "./sprite";

const ICONS: Record<string, string> = {
  cnc: "cnc",
  welder: "welder",
  setter: "setter",
  electrician: "electrician",
  maintenance: "maintenance",
  locksmith: "locksmith",
  operator: "operator",
};

export function FilterChips({ defaults }: { defaults?: SearchQuery }) {
  return (
    <div className="filter-bar">
      <Link href={toNabidkyHref(defaults, { profession: undefined })} className={`filter-chip${defaults?.profession ? "" : " is-on"}`}>
        Vše
      </Link>
      {PROFESSIONS.map((p) => {
        const on = defaults?.profession === p.db;
        return (
          <Link
            key={p.db}
            href={toNabidkyHref(defaults, { profession: on ? undefined : p.db })}
            className={`filter-chip${on ? " is-on" : ""}`}
          >
            <SpriteIcon name={ICONS[p.db] ?? "operator"} />
            {p.label}
          </Link>
        );
      })}
    </div>
  );
}

export function PreviewFilters({ defaults }: { defaults?: SearchQuery }) {
  return (
    <>
      <FilterChips defaults={defaults} />
      <form className="filters" action="/nabidky" method="get">
        <label className="field">
          <span className="micro">Hledat</span>
          <input name="q" defaultValue={defaults?.q} placeholder="Pozice, nástroj, technologie" />
        </label>
        <label className="field">
          <span className="micro">Profese</span>
          <select name="profession" defaultValue={defaults?.profession ?? ""}>
            <option value="">Všechny</option>
            {PROFESSIONS.map((p) => (
              <option key={p.db} value={p.db}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="micro">Město</span>
          <select name="city" defaultValue={defaults?.city ?? ""}>
            <option value="">Celá ČR</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="micro">Řazení</span>
          <select name="sort" defaultValue={defaults?.sort ?? "newest"}>
            <option value="newest">Nejnovější</option>
            <option value="salary">Mzda</option>
          </select>
        </label>
        <button className="btn btn-square btn-primary" type="submit">
          Filtrovat
        </button>
      </form>
    </>
  );
}
