import type { Metadata } from "next";
import Link from "next/link";
import { EmployerConsoleShell, type EmployerConsoleSection } from "@/components/employer-console-shell";

export const metadata: Metadata = {
  title: "Ukázka firemní konzole",
  robots: { index: false, follow: false },
};

const jobs = [
  { id: "customer-care", title: "Vedoucí zákaznické péče", place: "Praha · Hybrid", status: "Zveřejněno", replies: 8, salary: "55 000 až 68 000 Kč", validity: "14. 10." },
  { id: "service", title: "Servisní technik", place: "Brno · Na místě", status: "Zveřejněno", replies: 4, salary: "45 000 až 57 000 Kč", validity: "19. 10." },
  { id: "payroll", title: "Mzdová účetní", place: "Praha · Hybrid", status: "Čeká na kontrolu", replies: 0, salary: "48 000 až 60 000 Kč", validity: "Po schválení" },
];

const candidates = [
  { id: "lucie", initials: "LN", name: "Lucie Novotná", job: "Vedoucí zákaznické péče", state: "Nová", time: "Dnes v 9:42", match: "Praxe 6 let" },
  { id: "martin", initials: "MK", name: "Martin Kříž", job: "Servisní technik", state: "Posouzení", time: "Dnes v 8:15", match: "Nástup ihned" },
  { id: "eva", initials: "EH", name: "Eva Horáková", job: "Mzdová účetní", state: "Pohovor", time: "Včera", match: "Praxe 4 roky" },
  { id: "adam", initials: "AS", name: "Adam Svoboda", job: "Servisní technik", state: "Nová", time: "Včera", match: "Brno" },
];

function DemoOverview() {
  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head">
        <div><p>Dobrý den, Petro</p><h1>Přehled náboru</h1><span>Co potřebuje vaši pozornost právě teď.</span></div>
        <Link href="/firma/demo?sekce=nabidky" className="fj-console-button primary">Vytvořit nabídku</Link>
      </header>
      <section className="fj-console-metrics">
        <Link href="/firma/demo?sekce=nabidky"><span>Aktivní nabídky</span><strong>2</strong><small>Obě jsou zveřejněné</small></Link>
        <Link href="/firma/demo?sekce=kandidati"><span>Nové odpovědi</span><strong>12</strong><small>4 čekají na reakci</small></Link>
        <Link href="/firma/demo?sekce=kandidati&stav=pohovor"><span>Pohovory</span><strong>3</strong><small>Tento týden</small></Link>
        <Link href="/firma/demo?sekce=kandidati"><span>Otevřený výběr</span><strong>17</strong><small>Aktivní kandidáti</small></Link>
      </section>
      <div className="fj-console-dashboard-grid">
        <section className="fj-console-panel fj-console-attention">
          <div className="fj-console-panel-head">
            <div><h2>Odpovědi k posouzení</h2><p>Nejnovější kandidáti napříč nabídkami.</p></div>
            <Link href="/firma/demo?sekce=kandidati">Celá doručená pošta →</Link>
          </div>
          <div className="fj-console-candidate-list">
            {candidates.slice(0, 3).map((candidate) => (
              <Link href={`/firma/demo?sekce=kandidati&kandidat=${candidate.id}`} key={candidate.id}>
                <span className="fj-console-avatar">{candidate.initials}</span>
                <div><strong>{candidate.name}</strong><small>{candidate.job}</small></div>
                <span className={`fj-console-status status-${candidate.state === "Nová" ? "new" : candidate.state === "Pohovor" ? "interview" : "reviewing"}`}>{candidate.state}</span>
                <time>{candidate.time}</time>
              </Link>
            ))}
          </div>
        </section>
        <aside className="fj-console-next">
          <h2>Další krok</h2>
          <strong>Odpovězte 4 novým kandidátům</strong>
          <p>Nejstarší odpověď čeká od včerejška.</p>
          <Link href="/firma/demo?sekce=kandidati">Otevřít kandidáty</Link>
        </aside>
      </div>
      <section className="fj-console-panel fj-console-jobs-overview">
        <div className="fj-console-panel-head"><div><h2>Aktivní nábory</h2><p>Výkon otevřených pozic.</p></div><Link href="/firma/demo?sekce=nabidky">Spravovat nabídky →</Link></div>
        <div className="fj-console-job-table">
          <div className="fj-console-table-head"><span>Pozice</span><span>Stav</span><span>Odpovědi</span><span>Mzda</span><span /></div>
          {jobs.slice(0, 2).map((job) => (
            <div className="fj-console-job-row" key={job.id}>
              <div><strong>{job.title}</strong><small>{job.place}</small></div>
              <span className="fj-console-status status-published">{job.status}</span>
              <b>{job.replies}</b><span>{job.salary}</span>
              <Link href="/firma/demo?sekce=nabidky">→</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function DemoJobs() {
  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head">
        <div><p>Správa inzerce</p><h1>Nabídky</h1><span>Stav, odpovědi a platnost otevřených pozic.</span></div>
        <Link href="/firma/demo?sekce=nabidky" className="fj-console-button primary">+ Nová nabídka</Link>
      </header>
      <nav className="fj-console-tabs"><Link className="active" href="/firma/demo?sekce=nabidky">Všechny <span>3</span></Link><Link href="/firma/demo?sekce=nabidky">Aktivní <span>2</span></Link><Link href="/firma/demo?sekce=nabidky">Kontrola <span>1</span></Link></nav>
      <section className="fj-console-panel fj-console-jobs-page">
        {jobs.map((job) => (
          <article className="fj-console-job-card" key={job.id}>
            <div className="fj-console-job-card-main">
              <div><span className={`fj-console-status ${job.status === "Zveřejněno" ? "status-published" : "status-pending_review"}`}>{job.status}</span><h2>{job.title}</h2><p>{job.place} · {job.salary}</p></div>
              <div className="fj-console-job-card-stat"><strong>{job.replies}</strong><span>odpovědí</span></div>
              <div className="fj-console-job-card-stat"><strong>{job.validity}</strong><span>platnost</span></div>
            </div>
            <footer><Link href="/firma/demo?sekce=nabidky">Veřejný náhled ↗</Link><Link href="/firma/demo?sekce=kandidati">Zobrazit kandidáty</Link><button type="button">Další akce</button></footer>
          </article>
        ))}
      </section>
    </main>
  );
}

function DemoCandidates({ selectedId }: { selectedId?: string }) {
  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0];
  return (
    <main className="fj-console-page fj-console-inbox-page">
      <header className="fj-console-page-head"><div><p>Doručená pošta</p><h1>Kandidáti</h1><span>Odpovědi, kontakty a stav výběru.</span></div></header>
      <nav className="fj-console-tabs"><Link className="active" href="/firma/demo?sekce=kandidati">Všichni <span>17</span></Link><Link href="/firma/demo?sekce=kandidati">Noví <span>4</span></Link><Link href="/firma/demo?sekce=kandidati&stav=pohovor">Pohovor <span>3</span></Link></nav>
      <div className="fj-console-inbox">
        <section className="fj-console-inbox-list">
          {candidates.map((candidate) => (
            <Link href={`/firma/demo?sekce=kandidati&kandidat=${candidate.id}`} className={candidate.id === selected.id ? "active" : ""} key={candidate.id}>
              <span className="fj-console-avatar">{candidate.initials}</span>
              <div><strong>{candidate.name}</strong><small>{candidate.job}</small><time>{candidate.time}</time></div>
              <span className={`fj-console-status status-${candidate.state === "Nová" ? "new" : candidate.state === "Pohovor" ? "interview" : "reviewing"}`}>{candidate.state}</span>
            </Link>
          ))}
        </section>
        <section className="fj-console-candidate-detail">
          <header><span className="fj-console-avatar large">{selected.initials}</span><div><p>{selected.job}</p><h2>{selected.name}</h2><span className="fj-console-status status-new">{selected.state}</span></div></header>
          <div className="fj-console-contact-grid"><a href="tel:+420777123456"><span>Telefon</span><strong>+420 777 123 456</strong></a><a href="mailto:demo@example.cz"><span>E-mail</span><strong>lucie@example.cz</strong></a></div>
          <div className="fj-console-message"><span>Profil</span><p>{selected.match}. O pozici má zájem a může nastoupit po dohodě.</p></div>
          <div className="fj-console-document"><div><span>Životopis</span><strong>{selected.name.replace(" ", "-").toLowerCase()}.pdf</strong></div><button type="button">Náhled CV</button></div>
          <div className="fj-console-pipeline-actions"><span>Posunout ve výběru</span><div>{["Posouzení", "Pohovor", "Přijat", "Zamítnuta"].map((label) => <Link href={`/firma/demo?sekce=kandidati&kandidat=${selected.id}&stav=${encodeURIComponent(label)}`} key={label}>{label}</Link>)}</div></div>
        </section>
      </div>
    </main>
  );
}

function DemoSettings() {
  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head"><div><p>Firemní účet</p><h1>Nastavení</h1><span>Veřejný profil, ověření a plán inzerce.</span></div></header>
      <div className="fj-console-settings-grid">
        <section className="fj-console-panel fj-console-settings-form">
          <div className="fj-console-panel-head"><div><h2>Veřejný profil firmy</h2><p>Údaje viditelné u nabídek.</p></div></div>
          <form><label><span>Název firmy</span><input defaultValue="AltoCare s.r.o." /></label><label><span>Město</span><input defaultValue="Praha" /></label><div className="fj-console-readonly-grid"><div><span>IČO</span><strong>27082440</strong></div><div><span>Stav ověření</span><strong>Ověřeno</strong></div></div><button type="button" className="fj-console-button primary">Uložit profil</button></form>
        </section>
        <aside className="fj-console-panel fj-console-account-card"><h2>Účet a bezpečnost</h2><div><span>Přihlášení</span><strong>Jednorázový odkaz</strong></div><div><span>Uživatel</span><strong>Petra Horáková</strong></div><div><span>Role</span><strong>Vlastník</strong></div><p>Ukázková data. V ostrém účtu jsou přístupy oddělené podle firmy.</p></aside>
      </div>
    </main>
  );
}

export default async function EmployerConsoleDemo({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = typeof params.sekce === "string" ? params.sekce : "prehled";
  const active: EmployerConsoleSection = value === "nabidky" ? "jobs" : value === "kandidati" ? "candidates" : value === "nastaveni" ? "settings" : "overview";
  const selectedCandidate = typeof params.kandidat === "string" ? params.kandidat : undefined;

  return (
    <EmployerConsoleShell
      active={active}
      companyName="AltoCare s.r.o."
      userName="Petra Horáková"
      email="petra@altocare.cz"
      planName="Standard"
      usage={{ used: 3, limit: 10 }}
      candidateCount={4}
      demo
    >
      {active === "jobs" ? <DemoJobs /> : active === "candidates" ? <DemoCandidates selectedId={selectedCandidate} /> : active === "settings" ? <DemoSettings /> : <DemoOverview />}
    </EmployerConsoleShell>
  );
}
