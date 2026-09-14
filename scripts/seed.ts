import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { applications, employerUsers, employers, jobs, orders } from "../src/db/schema";
import { makeValidIco } from "../src/lib/ico";
import { jobSlug } from "../src/lib/slug";
import { randomBytes } from "node:crypto";

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86400000);
}

function token(n = 6) {
  return randomBytes(n).toString("base64url");
}

async function main() {
  const url = process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_ADMIN_URL or DATABASE_URL required");
  const sql = postgres(url, { max: 1, prepare: false });
  const db = drizzle(sql);

  const icoNovak = makeValidIco("2691930");
  const icoMorava = makeValidIco("2777268");
  const icoPlast = makeValidIco("2559664");
  const icoEnergo = makeValidIco("4455667");

  const deploySeed = ["1", "true", "yes"].includes((process.env.SEED_ON_DEPLOY ?? "").trim().toLowerCase());
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

  const [novak] = await db
    .insert(employers)
    .values({
      ico: icoNovak,
      companyName: "Kovovýroba Novák s.r.o.",
      legalName: "Kovovýroba Novák s.r.o.",
      city: "Brno",
      verificationStatus: "verified",
      planCode: "standard",
      adsPostedYear: 3,
    })
    .returning();

  const [morava] = await db
    .insert(employers)
    .values({
      ico: icoMorava,
      companyName: "Těžká konstrukce Morava a.s.",
      legalName: "Těžká konstrukce Morava a.s.",
      city: "Ostrava",
      verificationStatus: "verified",
      planCode: "basic",
      adsPostedYear: 2,
    })
    .returning();

  const [plast] = await db
    .insert(employers)
    .values({
      ico: icoPlast,
      companyName: "PlastForm s.r.o.",
      legalName: "PlastForm s.r.o.",
      city: "Mladá Boleslav",
      verificationStatus: "verified",
      planCode: "trial",
      adsPostedYear: 2,
    })
    .returning();

  const [energo] = await db
    .insert(employers)
    .values({
      ico: icoEnergo,
      companyName: "EnergoServis západ s.r.o.",
      legalName: "EnergoServis západ s.r.o.",
      city: "Plzeň",
      verificationStatus: "verified",
      planCode: "basic",
      adsPostedYear: 2,
    })
    .returning();

  const [cekani] = await db
    .insert(employers)
    .values({
      ico: makeValidIco("5566778"),
      companyName: "Čekající kovovýroba s.r.o.",
      legalName: "Čekající kovovýroba s.r.o.",
      city: "Jihlava",
      verificationStatus: "pending",
      planCode: "trial",
      adsPostedYear: 1,
    })
    .returning();

  await db.insert(employerUsers).values([
    { employerId: novak.id, email: "novak@kovovyroba-novak.test", name: "Jan Novák", role: "owner" },
    { employerId: morava.id, email: "hr@tkmorava.test", name: "Petra Holubová", role: "owner" },
    { employerId: plast.id, email: "vyroba@plastform.test", name: "Martin Král", role: "owner" },
    { employerId: energo.id, email: "servis@energoservis.test", name: "Lucie Benešová", role: "owner" },
    { employerId: cekani.id, email: "info@cekajici-kov.test", name: "Hana Malá", role: "owner" },
  ]);

  const seedJobs = [
    {
      employerId: novak.id,
      title: "CNC operátor, 5osá frézka",
      profession: "cnc",
      city: "Brno",
      region: "Jihomoravský",
      employmentType: "shift",
      shiftNote: "dvousměnný provoz",
      salaryMin: 42000,
      salaryMax: 52000,
      isTop: true,
      description:
        "Obsluha 5osého centra DMG MORI. Upínání, měření, drobné korekce. Díly do 800 mm, ocel a hliník. Mistr je na hale, ne v kanceláři.",
      requirements: "Praxe na CNC aspoň 2 roky. Čtení výkresu. Základy M a G kódu. Řidičák vítán, není podmínka.",
      benefits: "Příspěvek na stravování, dílenská šatna, roční prémie podle zmetkovitosti.",
    },
    {
      employerId: novak.id,
      title: "CNC soustružník",
      profession: "cnc",
      city: "Zlín",
      region: "Zlínský",
      employmentType: "full_time",
      salaryMin: 38000,
      salaryMax: 47000,
      description:
        "Přesné soustružení na Okuma. Malé série, tolerance v setinách. Předáváte díl kontrolorovi, ne do krabice „někam“.",
      requirements: "Praxe na CNC soustruhu. Mikrometr, posuvka, drsnost. Slušná čeština nebo slovenština.",
      benefits: "Stabilní HPP, nářadí od firmy.",
    },
    {
      employerId: morava.id,
      title: "Svářeč MIG/MAG, ocelové konstrukce",
      profession: "welder",
      city: "Ostrava",
      region: "Moravskoslezský",
      employmentType: "shift",
      shiftNote: "ranní / odpolední",
      salaryMin: 40000,
      salaryMax: 55000,
      isTop: true,
      description:
        "Svařování nosníků a rámových konstrukcí do 12 m. Poloha PA, PF. Díly jdou ven na stavbu, ne do e-shopu.",
      requirements: "Oprávnění MIG/MAG. Čtení WPS. Výška do 3 m bez problémů. Svůj svářecí štít klidně přineste.",
      benefits: "Příplatek za výšku a přesčasy. Nové odsávání od 2025.",
    },
    {
      employerId: morava.id,
      title: "Svářeč TIG, nerez",
      profession: "welder",
      city: "Pardubice",
      region: "Pardubický",
      employmentType: "full_time",
      salaryMin: 43000,
      salaryMax: 58000,
      description:
        "Potravinářská nerez, potrubí DN 25 až 150. Švy musí vydržet audit, ne jen pohled z dálky.",
      requirements: "TIG nerez min. 1 rok. Zkouška 141. Čistota pracoviště je část práce.",
      benefits: "Zkoušky platíme my. 5 týdnů dovolené po roce.",
    },
    {
      employerId: plast.id,
      title: "Seřizovač vstřikolisů",
      profession: "setter",
      city: "Mladá Boleslav",
      region: "Středočeský",
      employmentType: "shift",
      shiftNote: "třísměnný provoz",
      salaryMin: 45000,
      salaryMax: 60000,
      description:
        "Engel a Arburg 80 až 400 t. Seřízení, výměna forem, první kusy. Když linka stojí, voláte vy. Ne IT.",
      requirements: "Seřizování vstřiku aspoň 2 roky. Základy hydrauliky. Klid při noční.",
      benefits: "Příplatky za směny. Svoz z Mělníka po dohodě.",
    },
    {
      employerId: energo.id,
      title: "Průmyslový elektrikář, údržba",
      profession: "electrician",
      city: "Plzeň",
      region: "Plzeňský",
      employmentType: "full_time",
      salaryMin: 44000,
      salaryMax: 56000,
      description:
        "Rozvaděče 400 V, pohony, čidla na lince. Diagnostika, ne jen výměna stykače naslepo.",
      requirements: "Vyhláška 50/1978 Sb. min. §6. Čtení schémat.",
      benefits: "Služební dodávka na výjezdy. Nářadí Fluke.",
    },
    {
      employerId: energo.id,
      title: "Mechanik údržby, směnný provoz",
      profession: "maintenance",
      city: "Liberec",
      region: "Liberecký",
      employmentType: "shift",
      salaryMin: 39000,
      salaryMax: 50000,
      description:
        "Ložiska, převodovky, dopravníky. Preventivní prohlídky podle plánu, havárie když spadne řemen v noci.",
      requirements: "Vyučený strojař / mechanik. Svářečka drobných oprav vítána. Ochota ke směnám.",
      benefits: "13. plat při docházce. Ubytovna na první měsíc.",
    },
    {
      employerId: novak.id,
      title: "Zámečník výroby",
      profession: "locksmith",
      city: "České Budějovice",
      region: "Jihočeský",
      employmentType: "full_time",
      salaryMin: 36000,
      salaryMax: 45000,
      description:
        "Kusová výroba rámů a krytů. Řezání, ohýbání, montáž. Výkres na stole, ne v PowerPointu.",
      requirements: "Vyučení, čtení výkresu, úhlová bruska bez nehod. Sváření bodů stačí.",
      benefits: "Čistá hala, nový ohraňovací lis.",
    },
    {
      employerId: plast.id,
      title: "Operátor CNC frézky",
      profession: "operator",
      city: "Kolín",
      region: "Středočeský",
      employmentType: "shift",
      salaryMin: 34000,
      salaryMax: 41000,
      description:
        "Obsluha 3osých center, výměna palet, kontrola prvního kusu. Program připravuje seřizovač.",
      requirements: "Šikovné ruce, směny, základní měření. Zaškolíme obsluhu Fanuc.",
      benefits: "Doprava od nádraží. Příspěvek na bydlení do 6 měsíců.",
    },
    {
      employerId: morava.id,
      title: "Údržbář, Kladno",
      profession: "maintenance",
      city: "Kladno",
      region: "Středočeský",
      employmentType: "full_time",
      salaryMin: 37000,
      salaryMax: 46000,
      description:
        "Hala lisovny. Hydraulika, pneumatika, drobné elektro. Jste na místě, ne na telefonu z Brna.",
      requirements: "Praxe v údržbě výroby. §4 elektro výhodou. Ochota k pohotovosti 1× za 3 týdnů.",
      benefits: "Fond pracovní doby, stravenkový paušál.",
    },
  ];

  const inserted = [];
  for (const job of seedJobs) {
    const slug = jobSlug(job.title, job.city, token(6));
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
    employerId: cekani.id,
    slug: jobSlug("Zámečník, ke schválení", "Jihlava", token(6)),
    title: "Zámečník, ke schválení",
    profession: "locksmith",
    city: "Jihlava",
    region: "Vysočina",
    employmentType: "full_time",
    salaryMin: 36000,
    salaryMax: 44000,
    description: "Kusová výroba. Tento inzerát čeká na schválení provozovatelem.",
    requirements: "Vyučení, čtení výkresu.",
    status: "pending_review",
    expiresAt: daysFromNow(30),
  });

  await db.insert(orders).values({
    employerId: novak.id,
    packageCode: "standard",
    status: "stub",
    provider: "stub",
    amountCzkExVat: 19900,
  });

  await db.insert(applications).values([
    {
      jobId: inserted[0]!.id,
      employerId: novak.id,
      fullName: "Tomáš Dvořák",
      phone: "+420777111222",
      email: "tomas.dvorak@example.test",
      message: "Pět let na 3ose, chci 5osu. Mohu nastoupit od 1. v měsíci.",
      consentGdpr: true,
    },
    {
      jobId: inserted[2]!.id,
      employerId: morava.id,
      fullName: "Marek Polách",
      phone: "+420603444555",
      consentGdpr: true,
      message: "Zkouška MAG 135 platná. Konstrukce hal.",
    },
  ]);

  console.log(`Seeded ${inserted.length} published jobs + 1 pending_review, 5 employers.`);
  console.log("Dev login firmy: novak@kovovyroba-novak.test (magic link v konzoli serveru)");
  console.log("Dev admin: tomas@dilnajobs.test. npm run magic:admin");
  await sql.end({ timeout: 5 });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
