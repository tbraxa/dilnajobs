import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { Button } from "./ui";
import { IconSearch } from "./icons";

export function JobFilters({
  action = "/nabidky",
  defaults,
}: {
  action?: string;
  defaults?: { q?: string; profession?: string; city?: string; sort?: string };
}) {
  return (
    <form action={action} method="get" className="grid gap-3 border border-line bg-paper p-3 sm:grid-cols-12 sm:p-4">
      <label className="sm:col-span-4">
        <span className="label">Hledat</span>
        <input
          name="q"
          defaultValue={defaults?.q}
          placeholder="Pozice, nástroj, technologie"
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        />
      </label>
      <label className="sm:col-span-3">
        <span className="label">Profese</span>
        <select
          name="profession"
          defaultValue={defaults?.profession ?? ""}
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        >
          <option value="">Všechny</option>
          {PROFESSIONS.map((p) => (
            <option key={p.db} value={p.db}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-3">
        <span className="label">Město</span>
        <select
          name="city"
          defaultValue={defaults?.city ?? ""}
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
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
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
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
  );
}
