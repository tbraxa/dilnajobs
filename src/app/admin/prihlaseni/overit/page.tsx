import { redirect } from "next/navigation";
import { Button } from "@/components/ui";
import { AdminLoginChrome } from "@/components/admin-chrome";

export default async function AdminOveritPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  if (!token) redirect("/admin/prihlaseni?chyba=odkaz");

  return (
    <AdminLoginChrome>
      <main className="mx-auto max-w-md px-4 py-16">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Správa</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Odkaz je v pořádku</h1>
        <p className="mt-3 text-sm text-slate-600">
          Prohlížeče občas odkaz přednačtou. Přihlášení proto potvrdíte tlačítkem. Odkaz se spotřebuje až teď.
        </p>
        <form action="/admin/prihlaseni/overit/akce" method="post" className="mt-6">
          <input type="hidden" name="token" value={token} />
          <Button type="submit">Vstoupit do správy</Button>
        </form>
      </main>
    </AdminLoginChrome>
  );
}
