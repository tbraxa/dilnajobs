import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { applications, employerUsers, employers, jobs, orders } from "../src/db/schema";
import { makeValidIco } from "../src/lib/ico";
import { jobSlug } from "../src/lib/slug";

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86400000);
}

function envFlag(name: string) {
  return ["1", "true", "yes"].includes((process.env[name] ?? "").trim().toLowerCase());
}

const DEMO = {
  novak: "11111111-1111-4111-8111-111111111111",
  morava: "22222222-2222-4222-8222-222222222222",
  ucto: "33333333-3333-4333-8333-333333333333",
  logi: "44444444-4444-4444-8444-444444444444",
  soft: "55555555-5555-4555-8555-555555555555",
  pending: "66666666-6666-4666-8666-666666666666",
  north: "77777777-7777-4777-8777-777777777777",
} as const;

async function main() {
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_ADMIN_URL or DATABASE_URL required");
  const sql = postgres(url, { max: 1, prepare: false, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require" });
  const db = drizzle(sql);

  const deploySeed = envFlag("SEED_ON_DEPLOY");
  if (deploySeed) {
    try {
      const existing = await sql<{ n: number }[]>`select count(*)::int as n from employers`;
      if ((existing[0]?.n ?? 0) > 0) {
        console.log("SEED_ON_DEPLOY: employers already present, skip");
        await sql.end({ timeout: 5 });
        return;
      }
    } catch (err) {
      console.error("SEED_ON_DEPLOY: cannot read employers (run migrations first)", err);
      await sql.end({ timeout: 5 });
      throw err;
    }
  } else {
    await sql`truncate applications, jobs, sessions, magic_tokens, admin_sessions, employer_users, employers, orders, audit_events, rate_limit_events restart identity cascade`;
  }

  const icoNovak = makeValidIco("2691930");
  const icoMorava = makeValidIco("2777268");
  const icoUcto = makeValidIco("2559664");
  const icoLogi = makeValidIco("4455667");
  const icoSoft = makeValidIco("2708244");
  const icoPending = makeValidIco("5566778");
  const icoNorth = makeValidIco("2789012");

  await db.insert(employers).values([
    {
      id: DEMO.novak,
      ico: icoNovak,
      companyName: "Kovovýroba Novák s.r.o.",
      displayName: "Kovovýroba Novák s.r.o.",
      legalName: "Kovovýroba Novák s.r.o.",
      city: "Brno",
      address: { city: "Brno", region: "Jihomoravský" },
      verificationStatus: "verified",
      planCode: "standard",
      adsPostedYear: 3,
    },
    {
      id: DEMO.morava,
      ico: icoMorava,
      companyName: "Těžká konstrukce Morava a.s.",
      displayName: "Těžká konstrukce Morava a.s.",
      legalName: "Těžká konstrukce Morava a.s.",
      city: "Ostrava",
      address: { city: "Ostrava", region: "Moravskoslezský" },
      verificationStatus: "verified",
      planCode: "basic",
      adsPostedYear: 2,
    },
    {
      id: DEMO.ucto,
      ico: icoUcto,
      companyName: "Účetní servis Praha s.r.o.",
      displayName: "Účetní servis Praha s.r.o.",
      legalName: "Účetní servis Praha s.r.o.",
      city: "Praha",
      address: { city: "Praha", region: "Hlavní město Praha" },
      verificationStatus: "verified",
      planCode: "trial",
      adsPostedYear: 2,
    },
    {
      id: DEMO.logi,
      ico: icoLogi,
      companyName: "LogiTrans jih s.r.o.",
      displayName: "LogiTrans jih s.r.o.",
      legalName: "LogiTrans jih s.r.o.",
      city: "Brno",
      address: { city: "Brno", region: "Jihomoravský" },
      verificationStatus: "verified",
      planCode: "basic",
      adsPostedYear: 2,
    },
    {
      id: DEMO.soft,
      ico: icoSoft,
      companyName: "SoftForge Czech s.r.o.",
      displayName: "SoftForge Czech s.r.o.",
      legalName: "SoftForge Czech s.r.o.",
      city: "Praha",
      address: { city: "Praha", region: "Hlavní město Praha" },
      verificationStatus: "verified",
      planCode: "standard",
      adsPostedYear: 2,
    },
    {
      id: DEMO.pending,
      ico: icoPending,
      companyName: "Čekající služby s.r.o.",
      displayName: "Čekající služby s.r.o.",
      legalName: "Čekající služby s.r.o.",
      city: "Jihlava",
      address: { city: "Jihlava", region: "Vysočina" },
      verificationStatus: "pending",
      planCode: "trial",
      adsPostedYear: 1,
    },
    {
      id: DEMO.north,
      ico: icoNorth,
      companyName: "Northbyte s.r.o.",
      displayName: "Northbyte s.r.o.",
      legalName: "Northbyte s.r.o.",
      city: "Praha",
      address: { city: "Praha", region: "Hlavní město Praha" },
      verificationStatus: "verified",
      planCode: "standard",
      adsPostedYear: 1,
    },
  ]);

  await db.insert(employerUsers).values([
    { employerId: DEMO.novak, email: "novak@kovovyroba-novak.test", name: "Jan Novák", role: "owner" },
    { employerId: DEMO.morava, email: "hr@tkmorava.test", name: "Petra Holubová", role: "owner" },
    { employerId: DEMO.ucto, email: "hr@ucetni-praha.test", name: "Eva Svobodová", role: "owner" },
    { employerId: DEMO.logi, email: "dispecink@logitrans.test", name: "Martin Král", role: "owner" },
    { employerId: DEMO.soft, email: "jobs@softforge.test", name: "Lucie Benešová", role: "owner" },
    { employerId: DEMO.pending, email: "info@cekajici.test", name: "Hana Malá", role: "owner" },
    { employerId: DEMO.north, email: "jobs@northbyte.test", name: "Nina Procházková", role: "owner" },
  ]);

  const seedJobs = [
    {
      employerId: DEMO.novak,
      slug: "cnc-operator-brno-demo",
      title: "CNC operátor",
      profession: "cnc",
      category: "manufacturing",
      city: "Brno",
      region: "Jihomoravský",
      employmentType: "shift",
      contractType: "hpp",
      shiftNote: "dvousměnný provoz",
      salaryMin: 42000,
      salaryMax: 52000,
      salaryType: "monthly",
      workMode: "onsite",
      isTop: true,
      description:
        "Obsluha 5osého centra. Upínání, měření, drobné korekce. Díly do 800 mm, ocel a hliník.",
      requirements: "Praxe na CNC aspoň 2 roky.\nČtení výkresu.\nZáklady M a G kódu.",
      benefits: "Příspěvek na stravování, dílenská šatna, roční prémie.",
    },
    {
      employerId: DEMO.morava,
      slug: "svarac-ostrava-demo",
      title: "Svářeč MIG/MAG",
      profession: "welder",
      category: "trades",
      city: "Ostrava",
      region: "Moravskoslezský",
      employmentType: "shift",
      contractType: "hpp",
      salaryMin: 40000,
      salaryMax: 55000,
      salaryType: "monthly",
      workMode: "onsite",
      isTop: true,
      description: "Svařování nosníků a rámových konstrukcí. Poloha PA, PF.",
      requirements: "Oprávnění MIG/MAG.\nČtení WPS.",
      benefits: "Příplatek za výšku a přesčasy.",
    },
    {
      employerId: DEMO.ucto,
      slug: "uctetni-praha-demo",
      title: "Účetní",
      profession: "accounting",
      category: "accounting",
      city: "Praha",
      region: "Hlavní město Praha",
      employmentType: "full_time",
      contractType: "hpp",
      salaryMin: 38000,
      salaryMax: 48000,
      salaryType: "monthly",
      workMode: "hybrid",
      description: "Vedete agendu malých s.r.o. DPH, mzdy, komunikace s klienty. Pohoda a Excel denně.",
      requirements: "Praxe v podvojném účetnictví.\nDaňová evidence.\nSlušná čeština.",
      benefits: "Home office 2 dny v týdnu, stravenkový paušál.",
    },
    {
      employerId: DEMO.logi,
      slug: "ridic-brno-demo",
      title: "Řidič C+E",
      profession: "driver",
      category: "driver",
      city: "Brno",
      region: "Jihomoravský",
      employmentType: "full_time",
      contractType: "hpp",
      salaryMin: 45000,
      salaryMax: 60000,
      salaryType: "monthly",
      workMode: "onsite",
      description: "Rozvozy po ČR. Ráno depo, večer zpátky. Tahač s návěsem, žádné mezinárodní týdny mimo domov.",
      requirements: "Skupina C+E.\nKartu řidiče.\nČistý bodový účet.",
      benefits: "Služební telefon, příplatek za víkend.",
    },
    {
      employerId: DEMO.north,
      slug: "vyvojar-praha-demo",
      title: "Frontend vývojář",
      profession: "it",
      category: "it",
      city: "Praha",
      region: "Hlavní město Praha",
      employmentType: "full_time",
      contractType: "hpp",
      salaryMin: 70000,
      salaryMax: 95000,
      salaryType: "monthly",
      workMode: "hybrid",
      description: "React a TypeScript pro produkt, který používají české firmy každý den.",
      requirements: "TypeScript v produkci.\nCit pro přístupné rozhraní.\nČeština nebo slovenština.",
      benefits: "Hybridní práce v Praze, notebook a rozpočet na vzdělávání.",
    },
    {
      employerId: DEMO.ucto,
      slug: "asistentka-praha-demo",
      title: "Asistentka kanceláře",
      profession: "administration",
      category: "administration",
      city: "Praha",
      region: "Hlavní město Praha",
      employmentType: "part_time",
      contractType: "dpp",
      salaryType: "negotiable",
      salaryNote: "Mzda dohodou",
      workMode: "onsite",
      description: "Příjem pošty, faktury, kalendář jednatelů. Kancelář u metra C.",
      requirements: "Jistá čeština v e-mailu.\nExcel základy.",
      benefits: "Pružná pracovní doba.",
    },
    {
      employerId: DEMO.logi,
      slug: "skladnik-brno-demo",
      title: "Skladník",
      profession: "logistics",
      category: "logistics",
      city: "Brno",
      region: "Jihomoravský",
      employmentType: "shift",
      contractType: "hpp",
      salaryMin: 32000,
      salaryMax: 38000,
      salaryType: "monthly",
      workMode: "onsite",
      description: "Příjem, výdej, paletový vozík. Směny po 8 hodinách.",
      requirements: "Vysokozdvižný vozík výhodou.\nSměnný provoz.",
      benefits: "Doprava od nádraží.",
    },
    {
      employerId: DEMO.soft,
      slug: "obchodnik-praha-demo",
      title: "Obchodní zástupce",
      profession: "sales",
      category: "sales",
      city: "Praha",
      region: "Hlavní město Praha",
      employmentType: "full_time",
      contractType: "hpp",
      salaryMin: 50000,
      salaryMax: 80000,
      salaryType: "monthly",
      workMode: "onsite",
      description: "Noví klienti v Praze a Středočeském kraji. Software pro firmy, žádný telco džbán.",
      requirements: "B2B prodej.\nŘidičák B.\nČeština.",
      benefits: "Provize navíc k základu, auto.",
    },
    {
      employerId: DEMO.morava,
      slug: "kuchar-ostrava-demo",
      title: "Kuchař závodní jídelny",
      profession: "hospitality",
      category: "hospitality",
      city: "Ostrava",
      region: "Moravskoslezský",
      employmentType: "full_time",
      contractType: "hpp",
      salaryType: "monthly",
      workMode: "onsite",
      description: "Obědy pro halu. Klasická česká kuchyně, žádný fine dining.",
      requirements: "Vyučení kuchař.\nHygienický průkaz.",
      benefits: "Strava v práci, ranní směna.",
    },
    {
      employerId: DEMO.ucto,
      slug: "sestra-brno-demo",
      title: "Všeobecná sestra",
      profession: "healthcare",
      category: "healthcare",
      city: "Brno",
      region: "Jihomoravský",
      employmentType: "full_time",
      contractType: "hpp",
      salaryMin: 42000,
      salaryMax: 50000,
      salaryType: "monthly",
      workMode: "onsite",
      description: "Ambulance praktického lékaře. Objednávání, odběry, dokumentace.",
      requirements: "Registrace sestry.\nPraxe v ambulanci výhodou.",
      benefits: "Bez nočních, 5 týdnů dovolené.",
    },
  ];

  const inserted = [];
  for (const job of seedJobs) {
    const slug = job.slug || jobSlug(job.title, job.city, "demo");
    const [row] = await db
      .insert(jobs)
      .values({
        ...job,
        slug,
        status: "published",
        publishedAt: new Date(),
        expiresAt: daysFromNow(28),
        topUntil: job.isTop ? daysFromNow(7) : null,
      })
      .returning();
    inserted.push(row);
  }

  await db.insert(jobs).values({
    employerId: DEMO.pending,
    slug: "asistent-jihlava-ke-schvaleni",
    title: "Asistent kanceláře (návrh)",
    profession: "administration",
    category: "administration",
    city: "Jihlava",
    region: "Vysočina",
    employmentType: "full_time",
    contractType: "hpp",
    salaryMin: 28000,
    salaryMax: 34000,
    salaryType: "monthly",
    description: "Tento inzerát čeká na schválení. Ve veřejném výpisu není.",
    requirements: "Čeština, základy Excelu.",
    status: "draft",
    expiresAt: daysFromNow(30),
  });

  await db.insert(orders).values({
    employerId: DEMO.novak,
    packageCode: "standard",
    status: "stub",
    provider: "stub",
    amountCzkExVat: 19900,
  });

  await db.insert(applications).values([
    {
      jobId: inserted[0]!.id,
      employerId: DEMO.novak,
      fullName: "Tomáš Dvořák",
      phone: "+420777111222",
      email: "tomas.dvorak@example.test",
      message: "Pět let na CNC. Mohu nastoupit od 1. v měsíci.",
      consentGdpr: true,
      consentAt: new Date(),
      status: "new",
    },
    {
      jobId: inserted[1]!.id,
      employerId: DEMO.morava,
      fullName: "Marek Polách",
      phone: "+420603444555",
      consentGdpr: true,
      consentAt: new Date(),
      status: "new",
      message: "Zkouška MAG platná. Konstrukce hal.",
    },
    {
      jobId: inserted[2]!.id,
      employerId: DEMO.ucto,
      fullName: "Marie Pokorná",
      phone: "+420603444555",
      consentGdpr: true,
      consentAt: new Date(),
      status: "seen",
      message: "Účetní s praxí v DPH. Praha.",
    },
  ]);

  console.log(`Seeded ${inserted.length} published jobs + 1 draft, 7 employers (all-profession demo).`);
  console.log("Dev login firmy: novak@kovovyroba-novak.test (magic link v konzoli serveru)");
  console.log("Další demo: hr@ucetni-praha.test, jobs@northbyte.test, jobs@softforge.test, dispecink@logitrans.test");
  if (envFlag("DEMO_SEED")) console.log("DEMO_SEED=true");
  await sql.end({ timeout: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
