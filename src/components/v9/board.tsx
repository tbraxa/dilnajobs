import Link from "next/link";
import type { ReactNode } from "react";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { FilterToggle } from "@/components/v9/chrome";
import { CITIES } from "@/lib/catalog";
import { withoutTypographicDashes } from "@/lib/copy";
import { formatSalary } from "@/lib/pricing";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";
import type { searchJobs } from "@/lib/jobs/search";

type Job = Awaited<ReturnType<typeof searchJobs>>[number];

const CHIPS = [
  { label: "CNC", href: toNabidkyHref(undefined, { profession: "cnc" }), profession: "cnc" },
  { label: "Svářeči", href: toNabidkyHref(undefined, { profession: "welder" }), profession: "welder" },
  { label: "Operátoři", href: toNabidkyHref(undefined, { profession: "operator" }), profession: "operator" },
  { label: "Údržba", href: toNabidkyHref(undefined, { profession: "maintenance" }), profession: "maintenance" },
  { label: "Ranní směna", href: toNabidkyHref(undefined, { q: "ranní" }), q: "ranní" },
  { label: "Ostrava", href: toNabidkyHref(undefined, { city: "Ostrava" }), city: "Ostrava" },
  { label: "Brno", href: toNabidkyHref(undefined, { city: "Brno" }), city: "Brno" },
] as const;

const HOME_OBOR = [
  { label: "CNC", profession: "cnc" as const },
  { label: "Sváření", profession: "welder" as const },
  { label: "Operátor", profession: "operator" as const },
  { label: "Údržba", profession: "maintenance" as const },
];

const LIST_OBOR = [...HOME_OBOR, { label: "Seřizovač", profession: "setter" as const }];

const SHIFTS_HOME = ["Ranní", "Odpolední", "Noční", "Kontinuální"];
const SHIFTS_LIST = ["Ranní", "Dvousměnný", "3směnný", "Kontinuální"];

function payLabel(job: Job) {
  return formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "");
}

function empShort(code: string) {
  if (code === "full_time") return "HPP";
  if (code === "part_time") return "zkrácený";
  if (code === "shift") return "směnný";
  return code;
}

function regionCity(region: string) {
  return CITIES.find((c) => c.region === region);
}

function FilterCheck({
  href,
  on,
  children,
}: {
  href: string;
  on: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={on ? "is-on" : undefined}>
            <input type="checkbox" checked={on} readOnly tabIndex={-1} onChange={() => undefined} />
      {children}
    </Link>
  );
}

export function SearchBar({ query }: { query?: SearchQuery }) {
  return (
    <form className="search-bar" action="/nabidky" method="get" role="search" id="hledat">
      <div className="search-field">
        <label htmlFor="q-pozice">Pozice</label>
        <input
          id="q-pozice"
          name="q"
          type="search"
          defaultValue={query?.q ?? ""}
          placeholder="např. CNC operátor, svářeč"
          autoComplete="off"
        />
      </div>
      <div className="search-field">
        <label htmlFor="q-mesto">Město</label>
        <input
          id="q-mesto"
          name="city"
          type="search"
          defaultValue={query?.city ?? ""}
          placeholder="např. Ostrava, Brno"
          autoComplete="off"
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Hledat
      </button>
    </form>
  );
}

export function QuickChips({ query }: { query?: SearchQuery }) {
  return (
    <div className="chips" aria-label="Rychlé filtry">
      {CHIPS.map((chip) => {
        const on =
          ("profession" in chip && query?.profession === chip.profession) ||
          ("city" in chip && query?.city === chip.city) ||
          ("q" in chip && (query?.q ?? "").toLocaleLowerCase("cs") === chip.q);
        return (
          <Link key={chip.label} className={`chip${on ? " is-active" : ""}`} href={chip.href}>
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}

function OborFilters({ query, items }: { query?: SearchQuery; items: typeof HOME_OBOR | typeof LIST_OBOR }) {
  const current = query?.profession ?? "";
  return (
    <div className="filter-group">
      <h4>Obor</h4>
      {items.map((item) => (
        <FilterCheck
          key={item.profession}
          href={toNabidkyHref(query, { profession: current === item.profession ? null : item.profession })}
          on={current === item.profession}
        >
          {item.label}
        </FilterCheck>
      ))}
    </div>
  );
}

function KrajFilters({ query, extra }: { query?: SearchQuery; extra?: boolean }) {
  const regions = extra
    ? ["Moravskoslezský", "Jihomoravský", "Středočeský", "Plzeňský", "Liberecký", "Zlínský"]
    : ["Moravskoslezský", "Jihomoravský", "Středočeský", "Plzeňský"];
  const current = query?.city ?? "";
  return (
    <div className="filter-group">
      <h4>Kraj</h4>
      {regions.map((region) => {
        const city = regionCity(region);
        if (!city) return null;
        const on = current.toLocaleLowerCase("cs") === city.label.toLocaleLowerCase("cs");
        return (
          <FilterCheck
            key={region}
            href={toNabidkyHref(query, { city: on ? null : city.label })}
            on={on}
          >
            {region}
          </FilterCheck>
        );
      })}
    </div>
  );
}

function SmenaFilters({ query, items }: { query?: SearchQuery; items: string[] }) {
  const current = (query?.q ?? "").toLocaleLowerCase("cs");
  return (
    <div className="filter-group">
      <h4>Směna</h4>
      {items.map((label) => {
        const needle = label.toLocaleLowerCase("cs");
        const on = current === needle;
        return (
          <FilterCheck key={label} href={toNabidkyHref(query, { q: on ? null : needle })} on={on}>
            {label}
          </FilterCheck>
        );
      })}
    </div>
  );
}

export function FilterAside({
  query,
  variant,
}: {
  query?: SearchQuery;
  variant: "thin" | "full";
}) {
  return (
    <aside className={`filters${variant === "thin" ? " filters-thin" : ""}`} aria-label="Filtry" id="filtry">
      <p className="filters-title">Filtry</p>
      <OborFilters query={query} items={variant === "thin" ? HOME_OBOR : LIST_OBOR} />
      <KrajFilters query={query} extra={variant === "full"} />
      <SmenaFilters query={query} items={variant === "thin" ? SHIFTS_HOME : SHIFTS_LIST} />
      {variant === "full" ? (
        <>
          <div className="filter-group">
            <h4>Typ úvazku</h4>
            <FilterCheck href={toNabidkyHref(query, { q: null })} on={!query?.q}>
              HPP
            </FilterCheck>
            <FilterCheck href={toNabidkyHref(query, { q: query?.q === "DPP" ? null : "DPP" })} on={query?.q === "DPP"}>
              DPP / DPČ
            </FilterCheck>
            <FilterCheck
              href={toNabidkyHref(query, { q: query?.q === "živnost" ? null : "živnost" })}
              on={(query?.q ?? "").toLocaleLowerCase("cs") === "živnost"}
            >
              Živnost
            </FilterCheck>
          </div>
          <div className="filter-group">
            <h4>Plat od</h4>
            {[35000, 40000, 45000, 50000].map((amount) => {
              const label = `${new Intl.NumberFormat("cs-CZ").format(amount)} Kč`;
              const on = query?.q === String(amount);
              return (
                <FilterCheck
                  key={amount}
                  href={toNabidkyHref(query, { q: on ? null : String(amount) })}
                  on={on}
                >
                  {label}
                </FilterCheck>
              );
            })}
          </div>
        </>
      ) : null}
    </aside>
  );
}

export function JobList({
  jobs,
  filtered,
  unavailable,
  title,
  showFilterToggle,
}: {
  jobs: Job[];
  filtered?: boolean;
  unavailable?: boolean;
  title: string;
  showFilterToggle?: boolean;
}) {
  const count = jobs.length;
  const countLabel = count === 1 ? "nabídka" : count < 5 && count > 0 ? "nabídky" : "nabídek";
  return (
    <section aria-label="Nabídky práce">
      {showFilterToggle ? <FilterToggle /> : null}
      <div className="list-meta">
        <h2>{title}</h2>
        <span className="count-label">
          {unavailable ? "teď nedostupné" : filtered ? (
            <>
              {count} {countLabel} · <Link href="/nabidky">zrušit filtry</Link>
            </>
          ) : (
            `${count} ${countLabel}`
          )}
        </span>
      </div>
      {unavailable ? (
        <CatalogUnavailable />
      ) : jobs.length === 0 ? (
        <p className="empty">
          Na tento filtr teď nic nemáme. Zkuste jinou pozici, nebo <Link href="/nabidky">zrušte filtry</Link>. Napište
          na <a href="mailto:ahoj@dilnajobs.cz?subject=Upozornit%20m%C4%9B">ahoj@dilnajobs.cz</a>.
        </p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => {
            const extras = [empShort(job.employmentType), job.shiftNote].filter(Boolean).join(" · ");
            return (
              <Link className="job-row" href={`/nabidka/${job.slug}`} key={job.id}>
                <div className="job-main">
                  <h3 className="job-title">
                    {withoutTypographicDashes(job.title)}
                    {job.isTop ? <span className="badge-new">Nové</span> : null}
                  </h3>
                  <div className="job-meta">
                    <span className="company">{job.companyName}</span>
                    <span>{job.city}</span>
                    {extras ? <span>{extras}</span> : null}
                  </div>
                </div>
                <div className="job-side">
                  <span className="salary">{payLabel(job)}</span>
                  {job.shiftNote ? <span className="shift-tag">{job.shiftNote}</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function BoardPage({
  claim,
  helper,
  query,
  jobs,
  listTitle,
  filterVariant,
  filtered,
  unavailable,
}: {
  claim: string;
  helper: string;
  query?: SearchQuery;
  jobs: Job[];
  listTitle: string;
  filterVariant: "thin" | "full";
  filtered?: boolean;
  unavailable?: boolean;
}) {
  return (
    <main>
      <div className="wrap board-top">
        <p className="claim">{claim}</p>
        <p className="claim-helper">{helper}</p>
        <SearchBar query={query} />
        <QuickChips query={query} />
      </div>
      <div className="wrap board-layout">
        <FilterAside query={query} variant={filterVariant} />
        <JobList
          jobs={jobs}
          filtered={filtered}
          unavailable={unavailable}
          title={listTitle}
          showFilterToggle={filterVariant === "full"}
        />
      </div>
    </main>
  );
}
