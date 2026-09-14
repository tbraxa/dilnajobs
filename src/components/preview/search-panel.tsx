import Link from "next/link";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";

const QUICK_PROFESSIONS = PROFESSIONS.filter((p) =>
  ["cnc", "welder", "setter", "electrician", "maintenance"].includes(p.db),
);

const CHIP_LABEL: Record<string, string> = {
  cnc: "CNC",
  welder: "Svářeč",
  setter: "Seřizovač",
  electrician: "Elektrikář",
  maintenance: "Údržba",
};

const QUICK_CITIES = CITIES.filter((c) => ["ostrava", "brno", "plzen", "mlada-boleslav"].includes(c.slug));

export function SearchPanel({
  defaults,
  idPrefix = "hp",
  submitLabel = "Hledat nabídky",
}: {
  defaults?: SearchQuery;
  idPrefix?: string;
  submitLabel?: string;
}) {
  const qId = `${idPrefix}-q`;
  const cityId = `${idPrefix}-city`;
  return (
    <form className="search-panel" action="/nabidky" method="get" id={idPrefix === "hp" ? "hledat" : undefined}>
      <label className="sp-field sp-q">
        <span>Pozice</span>
        <input
          id={qId}
          name="q"
          defaultValue={defaults?.q ?? ""}
          placeholder="CNC, svářeč, Fanuc…"
          autoComplete="off"
        />
      </label>
      <label className="sp-field sp-city">
        <span>Město</span>
        <select id={cityId} name="city" defaultValue={defaults?.city ?? ""}>
          <option value="">Celá ČR</option>
          {CITIES.map((city) => (
            <option key={city.slug} value={city.label}>
              {city.label}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary btn-square sp-submit">
        {submitLabel}
      </button>
    </form>
  );
}

export function QuickChips({ defaults }: { defaults?: SearchQuery }) {
  return (
    <div className="chip-row" role="group" aria-label="Rychlé filtry">
      {QUICK_PROFESSIONS.map((chip) => {
        const on = defaults?.profession === chip.db;
        return (
          <Link
            key={chip.db}
            href={toNabidkyHref(defaults, { profession: on ? null : chip.db })}
            className={`filter-chip${on ? " is-active" : ""}`}
          >
            {CHIP_LABEL[chip.db] ?? chip.label}
          </Link>
        );
      })}
      <span className="chip-rule" aria-hidden="true" />
      {QUICK_CITIES.map((city) => {
        const on = defaults?.city === city.label;
        return (
          <Link
            key={city.slug}
            href={toNabidkyHref(defaults, { city: on ? null : city.label })}
            className={`filter-chip${on ? " is-active" : ""}`}
          >
            {city.label}
          </Link>
        );
      })}
    </div>
  );
}
