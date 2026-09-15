"use client";

import { useState } from "react";

type PreviewSection = "overview" | "jobs" | "candidates" | "settings";

const sections: { id: PreviewSection; label: string; icon: string }[] = [
  { id: "overview", label: "Přehled", icon: "⌂" },
  { id: "jobs", label: "Nabídky", icon: "▤" },
  { id: "candidates", label: "Kandidáti", icon: "●" },
  { id: "settings", label: "Nastavení", icon: "⚙" },
];

function OverviewPanel({ openCandidates }: { openCandidates: () => void }) {
  return (
    <>
      <div className="fj-preview-welcome">
        <span>Dobré ráno, Petro</span>
        <strong>Jak se daří náboru?</strong>
      </div>
      <div className="fj-preview-metrics">
        <button type="button"><span>Aktivní nabídky</span><strong>3</strong><small>Vše je zveřejněné</small></button>
        <button type="button" onClick={openCandidates}><span>Nové odpovědi</span><strong>12</strong><small>+4 od včerejška</small></button>
        <button type="button" onClick={openCandidates}><span>Čeká na reakci</span><strong>4</strong><small>Nejdéle 2 dny</small></button>
      </div>
      <div className="fj-preview-section-title">
        <strong>Aktivní nábory</strong>
        <button type="button">Zobrazit vše</button>
      </div>
      <div className="fj-preview-job">
        <span className="fj-preview-job-dot" />
        <div><strong>Vedoucí zákaznické péče</strong><small>Praha · Hybrid · 55 000 až 68 000 Kč</small></div>
        <span>8 odpovědí</span>
        <button type="button">Otevřít</button>
      </div>
      <div className="fj-preview-job">
        <span className="fj-preview-job-dot fj-preview-job-dot-soft" />
        <div><strong>Servisní technik</strong><small>Brno · Na místě · 45 000 až 57 000 Kč</small></div>
        <span>4 odpovědi</span>
        <button type="button">Otevřít</button>
      </div>
      <div className="fj-preview-inbox">
        <div className="fj-preview-avatar">LN</div>
        <div><span>Nová odpověď</span><strong>Lucie Novotná · Vedoucí zákaznické péče</strong></div>
        <button type="button" onClick={openCandidates}>Prohlédnout</button>
      </div>
    </>
  );
}

function JobsPanel() {
  return (
    <>
      <div className="fj-preview-panel-head">
        <div><span>Vaše nabídky</span><strong>3 aktivní pozice</strong></div>
        <button type="button">+ Nová nabídka</button>
      </div>
      <div className="fj-preview-filter-tabs">
        <button type="button" className="active">Aktivní 3</button>
        <button type="button">Koncepty 1</button>
        <button type="button">Uzavřené 6</button>
      </div>
      <div className="fj-preview-table">
        <div className="fj-preview-table-head"><span>Pozice</span><span>Stav</span><span>Odpovědi</span><span /></div>
        {[
          ["Vedoucí zákaznické péče", "Zveřejněno", "8"],
          ["Servisní technik", "Zveřejněno", "4"],
          ["Mzdová účetní", "Kontrola", "0"],
        ].map(([title, status, count]) => (
          <div className="fj-preview-table-row" key={title}>
            <div><strong>{title}</strong><small>Upraveno dnes</small></div>
            <span className={status === "Kontrola" ? "pending" : ""}>{status}</span>
            <b>{count}</b>
            <button type="button">•••</button>
          </div>
        ))}
      </div>
    </>
  );
}

function CandidatesPanel() {
  return (
    <>
      <div className="fj-preview-panel-head">
        <div><span>Doručená pošta</span><strong>Kandidáti</strong></div>
        <button type="button">Exportovat</button>
      </div>
      <div className="fj-preview-filter-tabs">
        <button type="button" className="active">Noví 12</button>
        <button type="button">Posouzení 5</button>
        <button type="button">Pohovor 3</button>
      </div>
      <div className="fj-candidate-list">
        {[
          ["LN", "Lucie Novotná", "Vedoucí zákaznické péče", "Před 4 min", "92 %"],
          ["MK", "Martin Kříž", "Servisní technik", "Dnes v 9:20", "86 %"],
          ["EH", "Eva Horáková", "Mzdová účetní", "Včera", "79 %"],
        ].map(([initials, name, job, time, match], index) => (
          <button type="button" className={index === 0 ? "selected" : ""} key={name}>
            <span className="fj-preview-avatar">{initials}</span>
            <span><strong>{name}</strong><small>{job}</small></span>
            <span><small>{time}</small><b>{match} shoda</b></span>
          </button>
        ))}
      </div>
      <div className="fj-candidate-actions">
        <button type="button">Přesunout do posouzení</button>
        <button type="button">Napsat kandidátovi</button>
      </div>
    </>
  );
}

function SettingsPanel() {
  return (
    <>
      <div className="fj-preview-panel-head">
        <div><span>Firemní profil</span><strong>Nastavení</strong></div>
        <button type="button">Uložit změny</button>
      </div>
      <div className="fj-preview-settings">
        <div className="fj-preview-setting-logo">AC</div>
        <div><strong>AltoCare s.r.o.</strong><span>IČO ověřeno</span></div>
        <button type="button">Změnit logo</button>
      </div>
      <label className="fj-preview-input"><span>Veřejný název firmy</span><input value="AltoCare" readOnly /></label>
      <label className="fj-preview-input"><span>Kontaktní e-mail</span><input value="nabor@altocare.cz" readOnly /></label>
      <label className="fj-preview-toggle">
        <span><strong>Týdenní přehled</strong><small>Nové odpovědi a stav náborů</small></span>
        <input type="checkbox" defaultChecked />
      </label>
    </>
  );
}

export function EmployerDashboardPreview() {
  const [section, setSection] = useState<PreviewSection>("overview");

  return (
    <div className="fj-employer-product-preview" aria-label="Interaktivní ukázka firemního přehledu">
      <div className="fj-preview-topbar">
        <span />
        <span />
        <span />
        <p>Firemní přehled FairJobs</p>
      </div>
      <div className="fj-preview-body">
        <div className="fj-preview-sidebar">
          <strong>FairJobs</strong>
          {sections.map((item) => (
            <button
              type="button"
              key={item.id}
              className={section === item.id ? "fj-preview-active" : ""}
              onClick={() => setSection(item.id)}
              aria-pressed={section === item.id}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.id === "candidates" ? <b>12</b> : null}
            </button>
          ))}
        </div>
        <div className="fj-preview-main">
          {section === "overview" ? <OverviewPanel openCandidates={() => setSection("candidates")} /> : null}
          {section === "jobs" ? <JobsPanel /> : null}
          {section === "candidates" ? <CandidatesPanel /> : null}
          {section === "settings" ? <SettingsPanel /> : null}
        </div>
      </div>
    </div>
  );
}
