import Link from "next/link";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { toNabidkyHref, type SearchQuery } from "@/lib/search-params";
import { formatSalary } from "@/lib/pricing";
import { withoutTypographicDashes } from "@/lib/copy";
import type { searchJobs } from "@/lib/jobs/search";

type Job = Awaited<ReturnType<typeof searchJobs>>[number];

function payLabel(job: Job) {
  return formatSalary(job.salaryMin, job.salaryMax, job.salaryNote).replace(" / měsíc", "");
}

function professionChip(label: string) {
  if (label === "Průmyslový elektrikář") return "Elektrikář";
  return label;
}

export function FilterRail({
  query,
  claim = "Práce ve výrobě. Přímo od firem.",
}: {
  query?: SearchQuery;
  claim?: string;
}) {
  const profession = query?.profession ?? "";
  return (
    <aside className="rail" id="filtry">
      <p className="claim">{claim}</p>
      <form action="/nabidky" method="get">
        {profession ? <input type="hidden" name="profession" value={profession} /> : null}
        <div className="search-row">
          <label className="field">
            <span>Pozice</span>
            <input
              id="hledat"
              name="q"
              type="search"
              defaultValue={query?.q ?? ""}
              placeholder="CNC, svářeč, Fanuc…"
              autoComplete="off"
            />
          </label>
          <button className="btn btn-accent" type="submit">
            Hledat
          </button>
        </div>
        <a className="btn btn-outline sheet-open" href="#filtry-sheet">
          Filtry
        </a>
        <div className="facets" id="filtry-sheet">
          <div className="sheet-head">
            <strong>Filtry</strong>
            <a href="#filtry" className="btn-ghost">
              Hotovo
            </a>
          </div>
          <label className="field field-city">
            <span>Město</span>
            <select name="city" defaultValue={query?.city ?? ""}>
              <option value="">Celá ČR</option>
              {CITIES.map((city) => (
                <option key={city.slug} value={city.label}>
                  {city.label}
                </option>
              ))}
            </select>
          </label>
          <div className="facet">
            <h2>Profese</h2>
            <div className="facet-list">
              <Link href={toNabidkyHref(query, { profession: null })} className={!profession ? "is-on" : undefined}>
                Všechny
              </Link>
              {PROFESSIONS.map((p) => (
                <Link
                  key={p.db}
                  href={toNabidkyHref(query, { profession: profession === p.db ? null : p.db })}
                  className={profession === p.db ? "is-on" : undefined}
                >
                  {professionChip(p.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </form>
    </aside>
  );
}

export function JobList({
  jobs,
  filtered,
  unavailable,
}: {
  jobs: Job[];
  filtered?: boolean;
  unavailable?: boolean;
}) {
  const count = jobs.length;
  const countLabel = count === 1 ? "nabídka" : count < 5 ? "nabídky" : "nabídek";
  return (
    <section className="results" aria-label="Nabídky">
      <div className="results-bar">
        <span>{unavailable ? "Nabídky" : `${count} ${countLabel}`}</span>
        {filtered ? <Link href="/nabidky">Zrušit filtry</Link> : <span>Přímo od firem</span>}
      </div>
      {unavailable ? (
        <CatalogUnavailable />
      ) : jobs.length === 0 ? (
        <p className="empty">
          Na tento filtr teď nic nemáme. Zkuste jinou pozici, nebo <Link href="/nabidky">zrušte filtry</Link>. Hlídání
          nabídek ještě nemáme. Napište na{" "}
          <a href="mailto:ahoj@dilnajobs.cz?subject=Upozornit%20m%C4%9B">ahoj@dilnajobs.cz</a>.
        </p>
      ) : (
        <ol className="jobs">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link className="job" href={`/nabidka/${job.slug}`}>
                <div>
                  <h2>{withoutTypographicDashes(job.title)}</h2>
                  <p>
                    {job.companyName} · {job.city}
                    {job.shiftNote ? ` · ${job.shiftNote}` : ""}
                  </p>
                </div>
                <div className="job-pay">{payLabel(job)}</div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
