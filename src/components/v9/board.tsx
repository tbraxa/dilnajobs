import Link from "next/link";
import { FilterToggle } from "@/components/v9/chrome";
import { withoutTypographicDashes } from "@/lib/copy";
import { formatSalary } from "@/lib/pricing";
import type { SearchQuery } from "@/lib/search-params";
import type { searchJobs } from "@/lib/jobs/search";

type Job = Awaited<ReturnType<typeof searchJobs>>[number];

type DemoJob = {
  href: string;
  title: string;
  isNew?: boolean;
  company: string;
  city: string;
  meta: string;
  salary: string;
  shift: string;
};

export const DEMO_JOBS: DemoJob[] = [
  {
    href: "/nabidky",
    title: "CNC operátor / programátor",
    isNew: true,
    company: "Moravia Precision s.r.o.",
    city: "Ostrava",
    meta: "HPP · ihned",
    salary: "45 až 55 000 Kč",
    shift: "3směnný provoz",
  },
  {
    href: "/nabidky",
    title: "Svářeč MIG/MAG",
    company: "Brněnská ocel a.s.",
    city: "Brno",
    meta: "HPP",
    salary: "42 až 50 000 Kč",
    shift: "Ranní směna",
  },
  {
    href: "/nabidky",
    title: "Operátor výroby, automobilový díl",
    company: "AutoForm Plzeň",
    city: "Plzeň",
    meta: "HPP · benefity",
    salary: "38 až 44 000 Kč",
    shift: "Kontinuální",
  },
  {
    href: "/nabidky",
    title: "Zámečník / údržbář strojů",
    isNew: true,
    company: "KovoTech Liberec",
    city: "Liberec",
    meta: "HPP",
    salary: "40 až 48 000 Kč",
    shift: "Ranní + pohotovost",
  },
  {
    href: "/nabidky",
    title: "CNC frézař, 5osé centrum",
    company: "Precise Tools s.r.o.",
    city: "Mladá Boleslav",
    meta: "HPP",
    salary: "48 až 58 000 Kč",
    shift: "Dvousměnný",
  },
  {
    href: "/nabidky",
    title: "Svářeč TIG, nerez",
    company: "Nerezová výroba Jihlava",
    city: "Jihlava",
    meta: "HPP · certifikace výhodou",
    salary: "44 až 52 000 Kč",
    shift: "Ranní směna",
  },
  {
    href: "/nabidky",
    title: "Operátor lisovny",
    company: "FormTech Zlín",
    city: "Zlín",
    meta: "HPP",
    salary: "36 až 42 000 Kč",
    shift: "3směnný provoz",
  },
  {
    href: "/nabidky",
    title: "Seřizovač CNC soustruhů",
    company: "TurnTech Ostrava",
    city: "Ostrava, Kunčice",
    meta: "HPP · zkušený",
    salary: "50 až 60 000 Kč",
    shift: "Dvousměnný",
  },
];

function payLabel(job: Job) {
  return formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "");
}

function empShort(code: string) {
  if (code === "full_time") return "HPP";
  if (code === "part_time") return "zkrácený";
  if (code === "shift") return "směnný";
  return code;
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

export function QuickChips({ query, home }: { query?: SearchQuery; home?: boolean }) {
  const chips = [
    { label: "CNC", href: "/nabidky?profession=cnc", on: query?.profession === "cnc" || (home && !query?.profession && !query?.city && !query?.q) },
    { label: "Svářeči", href: "/nabidky?profession=welder", on: query?.profession === "welder" },
    { label: "Operátoři", href: "/nabidky?profession=operator", on: query?.profession === "operator" },
    { label: "Údržba", href: "/nabidky?profession=maintenance", on: query?.profession === "maintenance" },
    { label: "Ranní směna", href: "/nabidky?q=ranní", on: (query?.q ?? "").toLocaleLowerCase("cs") === "ranní" },
    { label: "Ostrava", href: "/nabidky?city=Ostrava", on: query?.city === "Ostrava" },
    { label: "Brno", href: "/nabidky?city=Brno", on: query?.city === "Brno" },
  ];
  return (
    <div className="chips" aria-label="Rychlé filtry">
      {chips.map((chip) => (
        <Link key={chip.label} className={`chip${chip.on ? " is-active" : ""}`} href={chip.href}>
          {chip.label}
        </Link>
      ))}
    </div>
  );
}

function HomeFilters() {
  return (
    <aside className="filters filters-thin" aria-label="Filtry" id="filtry">
      <p className="filters-title">Filtry</p>
      <div className="filter-group">
        <h4>Obor</h4>
        <label>
          <input type="checkbox" defaultChecked /> CNC <span className="count">3</span>
        </label>
        <label>
          <input type="checkbox" /> Sváření <span className="count">2</span>
        </label>
        <label>
          <input type="checkbox" /> Operátor <span className="count">2</span>
        </label>
        <label>
          <input type="checkbox" /> Údržba <span className="count">1</span>
        </label>
      </div>
      <div className="filter-group">
        <h4>Kraj</h4>
        <label>
          <input type="checkbox" /> Moravskoslezský
        </label>
        <label>
          <input type="checkbox" /> Jihomoravský
        </label>
        <label>
          <input type="checkbox" /> Středočeský
        </label>
        <label>
          <input type="checkbox" /> Plzeňský
        </label>
      </div>
      <div className="filter-group">
        <h4>Směna</h4>
        <label>
          <input type="checkbox" /> Ranní
        </label>
        <label>
          <input type="checkbox" /> Odpolední
        </label>
        <label>
          <input type="checkbox" /> Noční
        </label>
        <label>
          <input type="checkbox" /> Kontinuální
        </label>
      </div>
    </aside>
  );
}

function ListFilters() {
  return (
    <aside className="filters" aria-label="Filtry" id="filtry">
      <p className="filters-title">Filtry</p>
      <div className="filter-group">
        <h4>Obor</h4>
        <label>
          <input type="checkbox" /> CNC <span className="count">3</span>
        </label>
        <label>
          <input type="checkbox" /> Sváření <span className="count">2</span>
        </label>
        <label>
          <input type="checkbox" /> Operátor <span className="count">2</span>
        </label>
        <label>
          <input type="checkbox" /> Údržba <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Seřizovač <span className="count">1</span>
        </label>
      </div>
      <div className="filter-group">
        <h4>Kraj</h4>
        <label>
          <input type="checkbox" /> Moravskoslezský <span className="count">2</span>
        </label>
        <label>
          <input type="checkbox" /> Jihomoravský <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Středočeský <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Plzeňský <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Liberecký <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Vysočina <span className="count">1</span>
        </label>
        <label>
          <input type="checkbox" /> Zlínský <span className="count">1</span>
        </label>
      </div>
      <div className="filter-group">
        <h4>Směna</h4>
        <label>
          <input type="checkbox" /> Ranní
        </label>
        <label>
          <input type="checkbox" /> Dvousměnný
        </label>
        <label>
          <input type="checkbox" /> 3směnný
        </label>
        <label>
          <input type="checkbox" /> Kontinuální
        </label>
      </div>
      <div className="filter-group">
        <h4>Typ úvazku</h4>
        <label>
          <input type="checkbox" defaultChecked /> HPP
        </label>
        <label>
          <input type="checkbox" /> DPP / DPČ
        </label>
        <label>
          <input type="checkbox" /> Živnost
        </label>
      </div>
      <div className="filter-group">
        <h4>Plat od</h4>
        <label>
          <input type="checkbox" /> 35 000 Kč
        </label>
        <label>
          <input type="checkbox" /> 40 000 Kč
        </label>
        <label>
          <input type="checkbox" /> 45 000 Kč
        </label>
        <label>
          <input type="checkbox" /> 50 000 Kč
        </label>
      </div>
    </aside>
  );
}

function DemoJobList() {
  return (
    <div className="job-list">
      {DEMO_JOBS.map((job) => (
        <Link className="job-row" href={job.href} key={job.title}>
          <div className="job-main">
            <h3 className="job-title">
              {job.title}
              {job.isNew ? <span className="badge-new">Nové</span> : null}
            </h3>
            <div className="job-meta">
              <span className="company">{job.company}</span>
              <span>{job.city}</span>
              <span>{job.meta}</span>
            </div>
          </div>
          <div className="job-side">
            <span className="salary">{job.salary}</span>
            <span className="shift-tag">{job.shift}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function LiveJobList({ jobs }: { jobs: Job[] }) {
  return (
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
  const useDemo = filterVariant === "thin" || unavailable || (!filtered && jobs.length === 0);
  const shown = useDemo ? DEMO_JOBS.length : jobs.length;
  const countLabel = shown === 1 ? "nabídka" : shown < 5 ? "nabídky" : "nabídek";

  return (
    <main>
      <div className="wrap board-top">
        <p className="claim">{claim}</p>
        <p className="claim-helper">{helper}</p>
        <SearchBar query={query} />
        <QuickChips query={query} home={filterVariant === "thin"} />
      </div>
      <div className="wrap board-layout">
        {filterVariant === "thin" ? <HomeFilters /> : <ListFilters />}
        <section aria-label="Nabídky práce">
          {filterVariant === "full" ? <FilterToggle /> : null}
          <div className="list-meta">
            <h2>{listTitle}</h2>
            <span className="count-label">
              {useDemo ? (
                `${DEMO_JOBS.length} nabídek`
              ) : filtered ? (
                <>
                  {shown} {countLabel} · <Link href="/nabidky">zrušit filtry</Link>
                </>
              ) : (
                `${shown} ${countLabel}`
              )}
            </span>
          </div>
          {useDemo ? (
            <DemoJobList />
          ) : jobs.length === 0 ? (
            <p className="empty">
              Na tento filtr teď nic nemáme. Zkuste jinou pozici, nebo <Link href="/nabidky">zrušte filtry</Link>.
            </p>
          ) : (
            <LiveJobList jobs={jobs} />
          )}
        </section>
      </div>
    </main>
  );
}
