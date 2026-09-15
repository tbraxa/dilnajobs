import { CATEGORIES } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { Button } from "./ui";

export function JobFilters({
  action = "/nabidky",
  defaults,
}: {
  action?: string;
  defaults?: {
    q?: string;
    category?: string;
    profession?: string;
    place?: string;
    city?: string;
    salaryMin?: number;
    sort?: string;
  };
}) {
  const place = defaults?.place || defaults?.city || "";
  const category = defaults?.category || defaults?.profession || "";
  return (
    <form action={action} method="get" className="grid gap-3 border border-line bg-paper p-3 sm:grid-cols-12 sm:p-4">
      <label className="sm:col-span-4">
        <span className="label">{copy.nabidky.labelQuery}</span>
        <input
          name="q"
          defaultValue={defaults?.q}
          placeholder={copy.home.placeholderQuery}
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        />
      </label>
      <label className="sm:col-span-3">
        <span className="label">{copy.nabidky.filtersPlace}</span>
        <input
          name="place"
          defaultValue={place}
          placeholder={copy.home.placeholderPlace}
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        />
      </label>
      <label className="sm:col-span-3">
        <span className="label">{copy.nabidky.filtersCategory}</span>
        <select
          name="category"
          defaultValue={category}
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        >
          <option value="">{copy.nabidky.filtersAllCategories}</option>
          {CATEGORIES.map((p) => (
            <option key={p.db} value={p.db}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">{copy.nabidky.filtersSalary}</span>
        <input
          name="salaryMin"
          type="number"
          min={0}
          step={1000}
          defaultValue={defaults?.salaryMin ?? ""}
          placeholder="Kč"
          className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-12">
        <Button type="submit">{copy.nabidky.ctaSearch}</Button>
        <a href="/nabidky" className="text-sm underline">
          {copy.nabidky.emptyNoResultsCta}
        </a>
      </div>
    </form>
  );
}
