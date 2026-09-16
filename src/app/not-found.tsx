export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Tady nic není</h1>
      <p className="mt-3 text-slate-600">
        Stránka neexistuje, nebo nabídka už nesvíti. Zkuste{" "}
        <a href="/nabidky" className="underline">
          katalog
        </a>
        .
      </p>
    </main>
  );
}
