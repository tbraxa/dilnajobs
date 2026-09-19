import { redirect } from "next/navigation";
import { SeekerProfileForm } from "@/components/seeker-profile-form";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

export default async function SeekerProfilePage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/profil");
  const data = await loadSeekerAccountData(session.userId);
  const profile = data.profile;

  return (
    <main className="fj-seeker-page">
      <header className="fj-seeker-page-head">
        <div>
          <p>Účet uchazeče</p>
          <h1>Profil</h1>
          <span>Kontakt a zaměření pro rychlejší odpovědi na nabídky.</span>
        </div>
      </header>
      <section className="fj-seeker-panel fj-seeker-profile-panel">
        <header>
          <div>
            <h2>Osobní údaje</h2>
            <p>Firmě je pošleme jen v konkrétní odpovědi.</p>
          </div>
          <span className="fj-seeker-security-label">Soukromé</span>
        </header>
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
