export default function NotFound() {
  return (
    <main className="shell-narrow py-16">
      <h1 className="display text-3xl font-semibold">Tady nic není</h1>
      <p className="mt-3 text-steel">
        Stránka neexistuje, nebo nabídka už nesvíti. Zkuste{" "}
        <a href="/nabidky" className="underline">
          katalog
        </a>
        .
      </p>
    </main>
  );
}
