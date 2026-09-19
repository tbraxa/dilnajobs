"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FavoriteJobButton } from "@/components/favorite-controls";
import type { SearchJob } from "@/lib/jobs/search";
import { cleanUiBlock, cleanUiText } from "@/lib/fairjobs-visual";
import { formatSalary } from "@/lib/pricing";

function compactSalary(job: SearchJob) {
  if (job.salaryNote) {
    const note = cleanUiText(job.salaryNote);
    return {
      amount: note.toLocaleLowerCase("cs").includes("dohod") ? "Dohodou" : note,
      unit: "mzda",
    };
  }
  if (job.salaryMin && job.salaryMax) {
    if (job.salaryMin === job.salaryMax) {
      return { amount: `${Math.round(job.salaryMin / 1000)}k`, unit: "Kč / měsíc" };
    }
    return {
      amount: `${Math.round(job.salaryMin / 1000)}–${Math.round(job.salaryMax / 1000)}k`,
      unit: "Kč / měsíc",
    };
  }
  if (job.salaryMin) {
    return { amount: `od ${Math.round(job.salaryMin / 1000)}k`, unit: "Kč / měsíc" };
  }
  if (job.salaryMax) {
    return { amount: `do ${Math.round(job.salaryMax / 1000)}k`, unit: "Kč / měsíc" };
  }
  return { amount: "Dohodou", unit: "mzda" };
}

function publishedLabel(value: Date | null) {
  if (!value) return "Nová nabídka";
  const date = value instanceof Date ? value : new Date(value);
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days === 0) return "Dnes";
  if (days === 1) return "Včera";
  if (days < 5) return `Před ${days} dny`;
  return `Před ${days} dny`;
}

function workMode(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
}

function employment(value: string) {
  if (value === "part_time") return "Zkrácený úvazek";
  if (value === "shift") return "Směnný provoz";
  return "Hlavní pracovní poměr";
}

function highlights(job: SearchJob) {
  const source = [job.requirements, job.benefits]
    .filter(Boolean)
    .flatMap((value) => cleanUiBlock(value).split(/\n+|[.!?]\s+/))
    .map((value) => value.replace(/^[-•]\s*/, "").trim())
    .filter((value) => value.length > 12)
    .slice(0, 3);
  return source.length
    ? source
    : [
        "Jasná mzda před odpovědí",
        job.isAgency ? "Ověřený zaměstnavatel" : "Přímo od firmy, bez agentury",
        "Kontakt odešlete pouze této firmě",
      ];
}

function PreviewContent({
  job,
  favorite,
  returnTo,
  onClose,
}: {
  job: SearchJob;
  favorite: boolean;
  returnTo: string;
  onClose?: () => void;
}) {
  return (
    <>
      {onClose ? (
        <header className="gx-mobile-preview-head">
          <span>Náhled nabídky</span>
          <button type="button" onClick={onClose} aria-label="Zavřít náhled">×</button>
        </header>
      ) : null}
      <div className="gx-preview-body">
        <div className="gx-preview-label">Náhled · bez odchodu ze seznamu</div>
        <div className="gx-preview-wordmark">{cleanUiText(job.companyName)}</div>
        <div className="gx-preview-company">
          {cleanUiText(job.companyName)}
          {job.verificationStatus === "verified" ? <span>✓ Ověřeno</span> : null}
        </div>
        <h2>{cleanUiText(job.title)}</h2>
        <div className="gx-preview-salary">
          {cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}
        </div>
        <p className="gx-preview-meta">
          {cleanUiText(job.city)} · {workMode(job.workMode)} · {employment(job.employmentType)} ·{" "}
          {publishedLabel(job.publishedAt)}
        </p>

        <div className="gx-preview-facts">
          <div><span>Místo</span><strong>{cleanUiText(job.city)}, {cleanUiText(job.region)}</strong></div>
          <div><span>Režim</span><strong>{workMode(job.workMode)}</strong></div>
          <div><span>Úvazek</span><strong>{employment(job.employmentType)}</strong></div>
        </div>

        <p className="gx-preview-copy">{cleanUiBlock(job.description)}</p>
        <ul>
          {highlights(job).map((item) => <li key={item}>{item}</li>)}
        </ul>

        <div className="gx-preview-actions">
          <Link href={`/nabidka/${job.slug}#odpovedet`} className="gx-primary-action">
            Odeslat firmě
          </Link>
          <FavoriteJobButton
            jobId={job.id}
            initialSaved={favorite}
            returnTo={returnTo}
            label={`nabídku ${cleanUiText(job.title)}`}
            showText
          />
          <Link href={`/nabidka/${job.slug}`} className="gx-detail-link">Celý detail →</Link>
        </div>
      </div>
    </>
  );
}

export function JobsSplitView({
  jobs,
  favoriteIds,
  returnTo,
}: {
  jobs: SearchJob[];
  favoriteIds: string[];
  returnTo: string;
}) {
  const [selectedId, setSelectedId] = useState(jobs[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0] ?? null;

  function choose(id: string) {
    setSelectedId(id);
    setMobileOpen(true);
  }

  function moveSelection(currentId: string, delta: number) {
    const current = jobs.findIndex((job) => job.id === currentId);
    const next = Math.min(jobs.length - 1, Math.max(0, current + delta));
    const nextJob = jobs[next];
    if (!nextJob) return;
    setSelectedId(nextJob.id);
    document.querySelector<HTMLElement>(`[data-job-id="${nextJob.id}"]`)?.focus();
  }

  if (!jobs.length) return null;

  return (
    <section className="gx-split-serp" aria-label="Výsledky a náhled nabídky">
      <div className="gx-results-rail" role="listbox" aria-label="Nabídky práce">
        {jobs.map((job) => {
          const salary = compactSalary(job);
          const active = selected?.id === job.id;
          return (
            <article
              key={job.id}
              className={`gx-rail-item${active ? " is-selected" : ""}`}
              role="option"
              aria-selected={active}
              tabIndex={0}
              data-job-id={job.id}
              onClick={() => choose(job.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveSelection(job.id, 1);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveSelection(job.id, -1);
                } else if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  choose(job.id);
                }
              }}
            >
              <div className="gx-salary-spine">
                <strong>{salary.amount}</strong>
                <span>{salary.unit}</span>
              </div>
              <div className="gx-rail-main">
                <h2>{cleanUiText(job.title)}</h2>
                <p>
                  {cleanUiText(job.companyName)}
                  {job.verificationStatus === "verified" ? <span> · Ověřeno</span> : null}
                </p>
                <small>
                  {cleanUiText(job.city)} · {workMode(job.workMode)} · {publishedLabel(job.publishedAt)}
                </small>
              </div>
              <span
                className="gx-rail-heart"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <FavoriteJobButton
                  jobId={job.id}
                  initialSaved={favorites.has(job.id)}
                  returnTo={returnTo}
                  label={`nabídku ${cleanUiText(job.title)}`}
                />
              </span>
            </article>
          );
        })}
      </div>

      <aside className="gx-preview-pane" aria-live="polite">
        {selected ? (
          <PreviewContent
            job={selected}
            favorite={favorites.has(selected.id)}
            returnTo={returnTo}
          />
        ) : (
          <div className="gx-preview-empty">Vyberte nabídku vlevo.</div>
        )}
      </aside>

      {mobileOpen && selected ? (
        <div className="gx-mobile-preview" role="dialog" aria-modal="true" aria-label="Náhled nabídky">
          <PreviewContent
            job={selected}
            favorite={favorites.has(selected.id)}
            returnTo={returnTo}
            onClose={() => setMobileOpen(false)}
          />
        </div>
      ) : null}
    </section>
  );
}
