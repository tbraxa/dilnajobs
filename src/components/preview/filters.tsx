import Link from "next/link";
import { CITIES } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";

const PROFESSION_CHIPS = [
  { label: "CNC", profession: "cnc" },
  { label: "Sváření", profession: "welder" },
  { label: "Zámečník", profession: "locksmith" },
  { label: "Seřizovači", profession: "setter" },
] as const;

export function FilterChips({ defaults }: { defaults?: SearchQuery }) {
  const regionChips = CITIES.slice(0, 3);
  return (
    <div className="filter-bar" role="group" aria-label="Filtry">
      <span className="filter-label">Filtr</span>
      <Link
        href={toNabidkyHref(defaults, { profession: undefined, city: undefined })}
        className={`filter-chip${!defaults?.profession && !defaults?.city ? " is-active" : ""}`}
      >
        Vše
      </Link>
      {PROFESSION_CHIPS.map((chip) => {
        const on = defaults?.profession === chip.profession;
        return (
          <Link
            key={chip.profession}
            href={toNabidkyHref(defaults, { profession: on ? undefined : chip.profession })}
            className={`filter-chip${on ? " is-active" : ""}`}
          >
            {chip.label}
          </Link>
        );
      })}
      {regionChips.map((city) => {
        const on = defaults?.city === city.label;
        return (
          <Link
            key={city.slug}
            href={toNabidkyHref(defaults, { city: on ? undefined : city.label })}
            className={`filter-chip${on ? " is-active" : ""}`}
          >
            {city.region}
          </Link>
        );
      })}
    </div>
  );
}
