export default function NotFound() {
  return (
    <main className="page">
      <h1>Tady nic není</h1>
      <p className="lede">Stránka neexistuje, nebo nabídka už nesvíti.</p>
      <a href="/nabidky" className="btn btn-primary">
        Nabídky
      </a>
    </main>
  );
}
