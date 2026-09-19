import Link from "next/link";

const HINTS = [
  { q: "IT", label: "IT" },
  { q: "obchod", label: "Obchod" },
  { q: "zdravotnictvi", label: "Zdravotnictví" },
  { q: "remote", label: "Na dálku" },
  { q: "brigada", label: "Brigáda" },
] as const;

export function SearchHero({
  compact = false,
  title,
  lead,
  defaults,
  showHints = false,
}: {
  compact?: boolean;
  title: string;
  lead?: string;
  defaults?: { q?: string; city?: string };
  showHints?: boolean;
}) {
  return (
    <section
      className={`search-hero${compact ? " compact" : ""}`}
      aria-labelledby="search-hero-title"
    >
      <div className="search-hero-inner">
        {!compact ? <p className="eyebrow">Národní pracovní portál</p> : null}
        <h1 id="search-hero-title">{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}

        <form
          className="search-box"
          action="/nabidky"
          method="get"
          role="search"
          aria-label="Hledání nabídek"
        >
          <div className="search-field">
            <label htmlFor="search-q">Pozice nebo klíčové slovo</label>
            <input
              id="search-q"
              name="q"
              type="search"
              placeholder="např. produktový manažer, účetní, řidič"
              defaultValue={defaults?.q}
              autoComplete="off"
            />
          </div>
          <div className="search-field">
            <label htmlFor="search-loc">Lokalita</label>
            <input
              id="search-loc"
              name="loc"
              type="text"
              placeholder="Praha, Brno, na dálku…"
              defaultValue={defaults?.city}
              autoComplete="off"
            />
          </div>
          <button className="btn btn-primary btn-search" type="submit">
            Hledat
          </button>
        </form>

        {showHints ? (
          <div className="search-hints">
            <span className="hint-label">Často hledané:</span>
            {HINTS.map((h) => (
              <Link key={h.q} className="chip" href={`/nabidky?q=${encodeURIComponent(h.q)}`}>
                {h.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
