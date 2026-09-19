"use client";

import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PROFESSIONS } from "@/lib/catalog";
import { copy } from "@/lib/copy";

export function FilterBar({ sort = "newest" }: { sort?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function apply(formData: FormData) {
    const next = new URLSearchParams(params.toString());
    const payFrom = String(formData.get("payFrom") ?? "").trim();
    const profession = String(formData.get("profession") ?? "").trim();
    const mode = String(formData.get("mode") ?? "").trim();
    if (payFrom) next.set("payFrom", payFrom);
    else next.delete("payFrom");
    if (profession) next.set("profession", profession);
    else next.delete("profession");
    if (mode) next.set("mode", mode);
    else next.delete("mode");
    setOpen(false);
    router.push(`/nabidky?${next.toString()}`);
  }

  function onSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value === "salary" ? "salary" : "newest");
    router.push(`/nabidky?${next.toString()}`);
  }

  return (
    <>
      <div className="results-tools">
        <label className="sr-only" htmlFor="sort">
          Řazení
        </label>
        <select
          className="sort"
          id="sort"
          aria-label="Řazení"
          defaultValue={sort === "salary" ? "salary" : "newest"}
          onChange={(e) => onSort(e.target.value)}
        >
          <option value="newest">Nejnovější</option>
          <option value="salary">Nejvyšší mzda</option>
          <option value="relevance">Relevance</option>
        </select>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>
          {copy.listings.ctaShowFilters}
        </button>
      </div>

      <div
        className={`drawer-backdrop${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="drawer">
          <h2 id={titleId}>{copy.listings.drawerTitle}</h2>
          <form action={apply}>
            <div className="field">
              <label htmlFor="pay-from">{copy.listings.filtersSalary}</label>
              <input
                id="pay-from"
                name="payFrom"
                type="number"
                min={0}
                step={5000}
                defaultValue={params.get("payFrom") ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="obor">{copy.listings.filtersProfession}</label>
              <select id="obor" name="profession" defaultValue={params.get("profession") ?? ""}>
                <option value="">Všechny</option>
                {PROFESSIONS.map((p) => (
                  <option key={p.db} value={p.db}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <span id="mode-label">Režim práce</span>
              <div className="mode-chips" role="group" aria-labelledby="mode-label">
                {[
                  { v: "", label: "Vše" },
                  { v: "onsite", label: "Na místě" },
                  { v: "hybrid", label: "Hybrid" },
                  { v: "remote", label: "Na dálku" },
                ].map((m) => (
                  <label key={m.v || "all"} className="chip">
                    <input
                      type="radio"
                      name="mode"
                      value={m.v}
                      defaultChecked={(params.get("mode") ?? "") === m.v}
                      style={{ marginRight: 6 }}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="drawer-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Zrušit
              </button>
              <button type="submit" className="btn btn-primary">
                {copy.listings.ctaApplyFilters}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export function ActiveFilterChips() {
  const params = useSearchParams();
  const router = useRouter();
  const chips: { key: string; label: string }[] = [];
  const payFrom = params.get("payFrom");
  const profession = params.get("profession");
  const q = params.get("q");
  const loc = params.get("loc") ?? params.get("city");
  const mode = params.get("mode");
  if (q) chips.push({ key: "q", label: q });
  if (loc) chips.push({ key: "loc", label: loc });
  if (mode) {
    const modeLabel =
      mode === "onsite" ? "Na místě" : mode === "hybrid" ? "Hybrid" : mode === "remote" ? "Na dálku" : mode;
    chips.push({ key: "mode", label: modeLabel });
  }
  if (payFrom) {
    chips.push({
      key: "payFrom",
      label: `Mzda od ${Math.round(Number(payFrom) / 1000)} tis.`,
    });
  }
  if (profession) {
    const p = PROFESSIONS.find((x) => x.db === profession);
    chips.push({ key: "profession", label: p?.label ?? profession });
  }
  if (chips.length === 0) return null;

  function remove(key: string) {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    if (key === "loc") next.delete("city");
    router.push(`/nabidky?${next.toString()}`);
  }

  return (
    <div className="filter-row" aria-label="Aktivní filtry">
      {chips.map((c) => (
        <span key={c.key} className="chip active">
          {c.label}{" "}
          <button type="button" aria-label={`Odebrat filtr ${c.label}`} onClick={() => remove(c.key)}>
            ×
          </button>
        </span>
      ))}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        style={{ marginLeft: 4 }}
        onClick={() => router.push("/nabidky")}
      >
        {copy.listings.ctaClearFilters}
      </button>
    </div>
  );
}
