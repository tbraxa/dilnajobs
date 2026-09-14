export default function NotFound() {
  return (
    <main>
      <section className="page-hero">
        <div>
          <p className="eyebrow">404</p>
          <h1>Tady nic není</h1>
          <p className="lead">Stránka neexistuje, nebo nabídka už nesvíti.</p>
        </div>
        <a href="/nabidky" className="btn btn-primary btn-square">
          Nabídky →
        </a>
      </section>
    </main>
  );
}
