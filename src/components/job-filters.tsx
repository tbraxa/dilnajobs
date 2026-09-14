import Link from "next/link";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";
import { Button } from "./ui";
import { IconSearch, professionIcon } from "./icons";

export function FilterChips({
  defaults,
  cities = false,
}: {
  defaults?: SearchQuery;
  cities?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Link href={toNabidkyHref(defaults, { profession: undefined })} className={`chip ${defaults?.profession ? "" : "is-on"}`}>
          Vše
        </Link>
        {PROFESSIONS.map((p) => {
          const Icon = professionIcon(p.db);
          const on = defaults?.profession === p.db;
          return (
            <Link
              key={p.db}
              href={toNabidkyHref(defaults, { profession: on ? undefined : p.db })}
              className={`chip ${on ? "is-on" : ""}`}
              aria-current={on ? "true" : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              {p.label}
            </Link>
          );
        })}
      </div>
      {cities ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <Link href={toNabidkyHref(defaults, { city: undefined })} className={`chip ${defaults?.city ? "" : "is-on"}`}>
            Celá ČR
          </Link>
          {CITIES.map((c) => {
            const on = defaults?.city === c.label;
            return (
              <Link
                key={c.slug}
                href={toNabidkyHref(defaults, { city: on ? undefined : c.label })}
                className={`chip ${on ? "is-on" : ""}`}
                aria-current={on ? "true" : undefined}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function JobFilters({
  action = "/nabidky",
  defaults,
  chips = true,
}: {
  action?: string;
  defaults?: SearchQuery;
  chips?: boolean;
}) {
  return (
    <div className="space-y-4">
      {chips ? <FilterChips defaults={defaults} cities /> : null}
      <form action={action} method="get" className="grid gap-3 border border-line bg-paper p-3 sm:grid-cols-12 sm:p-4">
        <label className="sm:col-span-5">
          <span className="label">Hledat</span>
          <input
            name="q"
            defaultValue={defaults?.q}
            placeholder="Pozice, nástroj, technologie"
            className="mt-1 w-full rounded-none border border-line bg-paper-0 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="sm:col-span-3">
          <span className="label">Profese</span>
          <select
            name="profession"
            defaultValue={defaults?.profession ?? ""}
            className="mt-1 w-full rounded-none border border-line bg-paper-0 px-3 py-2.5 text-sm"
          >
            <option value="">Všechny</option>
            {PROFESSIONS.map((p) => (
              <option key={p.db} value={p.db}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="label">Město</span>
          <select
            name="city"
            defaultValue={defaults?.city ?? ""}
            className="mt-1 w-full rounded-none border border-line bg-paper-0 px-3 py-2.5 text-sm"
          >
            <option value="">Celá ČR</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="label">Řazení</span>
          <select
            name="sort"
            defaultValue={defaults?.sort ?? "newest"}
            className="mt-1 w-full rounded-none border border-line bg-paper-0 px-3 py-2.5 text-sm"
          >
            <option value="newest">Nejnovější</option>
            <option value="salary">Mzda</option>
          </select>
        </label>
        <div className="sm:col-span-12">
          <Button type="submit" className="w-full sm:w-auto">
            <IconSearch className="h-4 w-4" />
            Filtrovat
          </Button>
        </div>
      </form>
    </div>
  );
}
