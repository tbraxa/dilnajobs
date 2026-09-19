/** Seeded analytics from preview-v6-soa — line/area + horizontal funnel only. */

export function SeedBadge() {
  return (
    <span className="badge-seed" title="Seedovaná ukázka pro Design SoT">
      Ukázková data
    </span>
  );
}

export function ActivityLineChart({
  title,
  subtitle,
  ariaLabel,
}: {
  title: string;
  subtitle: string;
  ariaLabel: string;
}) {
  return (
    <section className="chart" aria-labelledby="chart-activity-title">
      <div className="chart-head">
        <div>
          <h2 className="chart-title" id="chart-activity-title">
            {title}
          </h2>
          <p className="seed" style={{ marginTop: 4 }}>
            {subtitle}
          </p>
        </div>
        <div className="tabs" role="tablist" aria-label="Období">
          <button type="button" role="tab">
            7d
          </button>
          <button type="button" role="tab" className="on" aria-selected={true}>
            30d
          </button>
          <button type="button" role="tab">
            90d
          </button>
        </div>
      </div>
      <div className="legend" aria-hidden="true">
        <span>
          <i /> Primární
        </span>
        <span>
          <i className="sec" /> Sekundární
        </span>
      </div>
      <svg className="line-chart" viewBox="0 0 560 180" role="img" aria-label={ariaLabel}>
        <g className="grid" aria-hidden="true">
          <line x1="0" y1="20" x2="560" y2="20" />
          <line x1="0" y1="60" x2="560" y2="60" />
          <line x1="0" y1="100" x2="560" y2="100" />
          <line x1="0" y1="140" x2="560" y2="140" />
        </g>
        <path
          className="area"
          d="M0,120 L40,112 L80,108 L120,95 L160,100 L200,88 L240,82 L280,70 L320,74 L360,58 L400,52 L440,48 L480,40 L520,36 L560,28 L560,160 L0,160 Z"
        />
        <path
          className="line"
          d="M0,120 L40,112 L80,108 L120,95 L160,100 L200,88 L240,82 L280,70 L320,74 L360,58 L400,52 L440,48 L480,40 L520,36 L560,28"
        />
        <path
          className="line secondary"
          d="M0,145 L40,142 L80,140 L120,138 L160,136 L200,132 L240,130 L280,126 L320,124 L360,118 L400,114 L440,110 L480,106 L520,102 L560,98"
        />
      </svg>
      <div className="axis-labels">
        <span>1. 8.</span>
        <span>8. 8.</span>
        <span>15. 8.</span>
        <span>22. 8.</span>
        <span>dnes</span>
      </div>
    </section>
  );
}

export function HiringFunnel() {
  const steps = [
    { name: "Zobrazení", width: "100%", val: "12,4k", title: "100% výchozí" },
    { name: "Přihlášky", width: "42%", val: "346", title: "2,8 % ze zobrazení" },
    { name: "Shortlist", width: "18%", val: "48", title: "13,9 % z přihlášek" },
    { name: "Pohovor", width: "10%", val: "12", title: "25 % ze shortlistu" },
    { name: "Najatí", width: "5%", val: "6", title: "50 % z pohovorů" },
  ];
  return (
    <section className="chart" aria-labelledby="funnel-title">
      <div className="chart-head">
        <div>
          <h2 className="chart-title" id="funnel-title">
            Náborový funnel
          </h2>
          <p className="seed" style={{ marginTop: 4 }}>
            Ukázková data · 30d
          </p>
        </div>
      </div>
      <div className="funnel" role="list">
        {steps.map((s) => (
          <div key={s.name} className="step" role="listitem" tabIndex={0} title={s.title}>
            <span className="name">{s.name}</span>
            <div className="bar" aria-hidden="true">
              <i style={{ width: s.width }} />
            </div>
            <span className="val">{s.val}</span>
          </div>
        ))}
      </div>
      <p className="seed" style={{ marginTop: 16 }}>
        Horizontální funnel — žádné sloupcové grafy.
      </p>
    </section>
  );
}

export function Sparkline({ d }: { d: string }) {
  return (
    <svg className="sparkline" viewBox="0 0 120 40" aria-hidden="true">
      <path className="area" d={`${d} L120,40 L0,40 Z`} />
      <path className="line" d={d} />
    </svg>
  );
}
