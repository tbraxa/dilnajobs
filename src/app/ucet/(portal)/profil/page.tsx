import { redirect } from "next/navigation";
import { SeekerProfileForm } from "@/components/seeker-profile-form";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

export default async function SeekerProfilePage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/profil");
  const { profile } = await loadSeekerAccountData(session.userId);

  return (
    <main className="py-8">
      <p className="label">Soukromé údaje</p>
      <h1 className="display mt-2 text-3xl font-semibold">Profil</h1>
      <p className="mt-2 max-w-2xl text-sm text-steel">
        Kontakt předvyplníme do odpovědi. Firmě ho odešleme až s konkrétní přihláškou.
      </p>
      <section className="mt-6 max-w-2xl border border-line bg-paper p-4 sm:p-6">
        <SeekerProfileForm
          profile={{
            name: profile?.name ?? session.name,
            email: profile?.email ?? session.email,
            phone: profile?.phone ?? session.phone,
            city: profile?.city ?? session.city,
            desiredRole: profile?.desiredRole ?? session.desiredRole,
            bio: profile?.bio ?? session.bio,
          }}
        />
      </section>
    </main>
  );
}
