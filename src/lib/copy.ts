/** Czech UI copy from docs/copy/COPY-PACK.md (v1.3). No em dash or en dash. */

export const copy = {
  brand: "FairJobs",
  domain: "fairjobs.cz",
  claim: "Práce v Česku. Od firem.",
  footer: "© 2026 FairJobs · nabídky práce",
  nav: {
    nabidky: "Nabídky",
    proFirmy: "Pro firmy",
    login: "Přihlášení firem",
    register: "Registrace firmy",
    ariaMain: "Hlavní",
    ariaMenu: "Menu",
    personalData: "Osobní údaje",
  },
  home: {
    metaTitle: "FairJobs · nabídky práce",
    metaDescription: "Nabídky práce v Česku. Hledejte podle pozice, místa a mzdy. Odpovězte přímo firmě.",
    helper: "Všechny obory. Filtrujte podle pozice, místa a mzdy.",
    labelQuery: "Pozice nebo klíčové slovo",
    labelPlace: "Místo",
    placeholderQuery: "např. účetní, řidič, vývojář",
    placeholderPlace: "např. Praha, Brno",
    ctaSearch: "Hledat",
    ctaEmployers: "Pro firmy",
    sectionLatest: "Aktuální nabídky",
    sectionFields: "Všechny obory",
    ctaAllJobs: "Zobrazit všechny nabídky",
    shotOffice: "Kancelář",
    shotLogistics: "Logistika",
    shotWorkshop: "Výroba",
  },
  nabidky: {
    metaTitle: "Nabídky práce · FairJobs",
    metaDescription: "Procházejte nabídky práce. Filtrujte podle pozice, místa, úvazku a mzdy.",
    claim: "Všechny nabídky",
    helper: "Upravte filtry podle pozice, místa a mzdy.",
    labelQuery: "Pozice nebo klíčové slovo",
    labelPlace: "Místo",
    ctaSearch: "Hledat",
    ctaShowFilters: "Zobrazit filtry",
    ctaFilters: "Filtry",
    ctaEditFilters: "Upravit filtry",
    ctaFiltersClose: "Zavřít",
    ctaFiltersDone: "Hotovo",
    ctaCancel: "Zrušit",
    ctaShowResults: (n: number) => {
      const abs = Math.abs(n);
      const mod10 = abs % 10;
      const mod100 = abs % 100;
      let noun = "nabídek";
      if (mod10 === 1 && mod100 !== 11) noun = "nabídku";
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) noun = "nabídky";
      return `Zobrazit ${n} ${noun}`;
    },
    sectionResults: "Výsledky",
    filtersPlace: "Místo",
    filtersCategory: "Obor",
    filtersContract: "Úvazek",
    filtersContractIco: "IČO",
    filtersSalary: "Mzda od",
    filtersSalaryChip: "Mzda",
    filtersSalaryAny: "Bez minima",
    filtersSalaryCustom: "Od Kč",
    filtersSalaryCustomPlaceholder: "např. 45000",
    filtersSeniority: "Seniorita",
    filtersMode: "Režim",
    filtersModeWork: "Režim práce",
    filtersAllCategories: "Všechny obory",
    filtersAllPlaces: "Všechna místa",
    filtersActiveAria: "Aktivní filtry",
    chipRemove: "Odebrat filtr",
    filtersCount: (n: number) => {
      if (n === 1) return "1 filtr";
      if (n >= 2 && n <= 4) return `${n} filtry`;
      return `${n} filtrů`;
    },
    filterModeAll: "Vše",
    filterModeOnsite: "Na místě",
    filterModeHybrid: "Hybrid",
    filterModeRemote: "Na dálku",
    resultsCount: (n: number) => `${n} výsledků`,
    pagerNext: "Další",
    pagerPrev: "Předchozí",
    emptyNoResultsTitle: "Žádné nabídky pro tyto filtry",
    emptyNoResultsBody: "Upravte pozici, místo nebo mzdu a zkuste to znovu.",
    emptyNoResultsCta: "Zrušit filtry",
    emptyNoQueryTitle: "Zadejte pozici nebo místo",
    emptyNoQueryBody: "Například účetní v Brně, nebo řidič Praha.",
    emptyErrorTitle: "Nabídky se nepodařilo načíst",
    emptyErrorBody: "Zkuste to znovu. Když problém zůstane, napište nám.",
    emptyErrorCta: "Zkusit znovu",
  },
  card: {
    labelSalary: "Mzda",
    labelPlace: "Místo",
    labelContract: "Úvazek",
    labelSeniority: "Seniorita",
    labelPublished: "Zveřejněno",
    labelField: "Obor",
    badgeNew: "Nové",
    badgeFeatured: "Zvýrazněné",
    badgeVerified: "Ověřeno",
    badgePending: "Ověření probíhá",
    contractHpp: "HPP",
    contractDpp: "DPP",
    contractDpc: "DPČ",
    contractIco: "IČO / živnost",
    ctaOpen: "Zobrazit nabídku",
    salaryNegotiable: "mzda dohodou",
    salaryUnspecified: "Mzda neuvedena",
    badgeAgency: "Agentura",
    workModeLabel: "Režim",
    workModeOnsite: "Na místě",
    workModeHybrid: "Hybrid",
    workModeRemote: "Na dálku",
    publishedToday: "Zveřejněno dnes",
    publishedYesterday: "Zveřejněno včera",
    publishedDaysAgo: (n: number) => `Zveřejněno před ${n} dny`,
    metaCompany: (company: string) => company,
  },
  detail: {
    ctaApply: "Odpovědět na nabídku",
    ctaBack: "Zpět na nabídky",
    sectionAbout: "O pozici",
    sectionRequirements: "Požadavky",
    sectionOffer: "Co nabízíme",
    sectionCompany: "O firmě",
    helperNoAccount: (company: string) => `Bez účtu. Telefon stačí. Údaje uvidí jen ${company}.`,
    applyClaim: "Odpovědět na nabídku",
    applyHelper: (company: string) => `Údaje uvidí jen ${company}.`,
    labelName: "Jméno a příjmení",
    labelPhone: "Telefon",
    labelEmail: "E-mail (nepovinné)",
    labelCv: "Životopis (nepovinné)",
    labelNote: "Zpráva firmě (nepovinné)",
    consentGdpr: "Souhlasím se zpracováním údajů za účelem kontaktování k této nabídce.",
    ctaSubmit: "Odeslat firmě",
    successTitle: "Odpověď je odeslaná",
    successBody: "Ozvou se vám z firmy.",
    errorRequired: "Doplňte povinná pole.",
    errorPhone: "Zkontrolujte telefonní číslo.",
    labelIco: "IČO",
    labelCity: "Město",
  },
  employers: {
    metaTitle: "Pro firmy · FairJobs",
    metaDescription: "Inzerujte nabídky práce na FairJobs. Odpovědi od uchazečů na jednom místě.",
    claim: "Inzerce nabídek práce",
    helper: "Zveřejněte pozici. Uchazeči odpoví přímo vám.",
    ctaPrimary: "Založit účet firmy",
    ctaSecondary: "Přihlásit se",
    ctaPost: "Vystavit nabídku",
    sectionWhy: "Proč FairJobs",
    why1Title: "Jasný inzerát",
    why1Body: "Mzda, místo a úvazek hned vidět. Méně zbytečných odpovědí.",
    why2Title: "Odpovědi na jednom místě",
    why2Body: "Telefon, e-mail a životopis u každé žádosti.",
    why3Title: "Rychlé spuštění",
    why3Body: "Účet firmy a první nabídka během pár minut.",
    bottomHelper: "Založte účet firmy a zveřejněte první nabídku.",
    bandHelper: "Zveřejněte pozici. Uchazeči odpoví přímo vám. Mzda, místo a úvazek hned vidět.",
    photoAlt: "Tým v kanceláři při schůzce",
    sectionPricing: "Ceny",
    pricingHelper: "Ceny bez DPH. Orientace pro firmy. Platbu domluvíte po registraci.",
    pricingPeriod: "30 dní",
    pricingStartName: "Start",
    pricingStartBody: "Jedna nabídka. Mzda, místo a úvazek hned vidět.",
    pricingPlusName: "Plus",
    pricingPlusBody: "Více nabídek najednou. Odpovědi na jednom místě.",
    pricingProName: "Pro",
    pricingProBody: "Pro firmu, která nabírá průběžně.",
  },
  login: {
    metaTitle: "Přihlášení firmy · FairJobs",
    metaDescription: "Přihlaste se k účtu firmy odkazem z e-mailu.",
    claim: "Přihlášení firmy",
    helper: "Na e-mail pošleme odkaz pro přihlášení.",
    labelEmail: "Pracovní e-mail",
    placeholderEmail: "jmeno@firma.cz",
    ctaPrimary: "Poslat přihlašovací odkaz",
    helperAfterSend: "Odkaz jsme poslali. Podívejte se do schránky.",
    helperSecondary: "Nemáte účet?",
    ctaSecondary: "Zaregistrujte firmu",
    previewNote: "Náhled. Odkaz zatím neodesíláme.",
  },
  register: {
    metaTitle: "Registrace firmy · FairJobs",
    metaDescription: "Založte účet firmy. Přihlašovací odkaz přijde na e-mail.",
    claim: "Registrace firmy",
    helper: "Doplňte firmu a kontakt. Přihlašovací odkaz přijde na e-mail.",
    labelCompany: "Název firmy",
    labelIco: "IČO",
    labelDic: "DIČ (nepovinné)",
    labelCity: "Město",
    labelFirstName: "Jméno",
    labelLastName: "Příjmení",
    labelEmail: "Pracovní e-mail",
    helperAres: "Údaje firmy doplníme z ARES podle IČO.",
    placeholderCompany: "např. Acme s.r.o.",
    placeholderIco: "12345678",
    placeholderCity: "Praha",
    placeholderEmail: "personalista@firma.cz",
    ctaPrimary: "Založit účet a poslat odkaz",
    helperAfterSend: "Účet je založený. Odkaz pro přihlášení jsme poslali na e-mail.",
    helperSecondary: "Už máte účet?",
    ctaSecondary: "Přihlaste se",
    previewNote: "Náhled. Účet ani odkaz zatím neodesíláme.",
  },
} as const;

export function salaryRange(from: number, to: number): string {
  const fmt = (n: number) => new Intl.NumberFormat("cs-CZ").format(n);
  return `${fmt(from)} až ${fmt(to)} Kč`;
}

export function salaryFrom(from: number): string {
  return `od ${new Intl.NumberFormat("cs-CZ").format(from)} Kč`;
}

export function contractLabel(slug: string | null | undefined): string {
  switch (slug) {
    case "hpp":
    case "full_time":
    case "shift":
      return copy.card.contractHpp;
    case "dpp":
    case "part_time":
      return copy.card.contractDpp;
    case "dpc":
      return copy.card.contractDpc;
    case "ico":
      return copy.card.contractIco;
    default:
      return slug ?? "";
  }
}

export function workModeLabel(mode: string | null | undefined): string {
  switch (mode) {
    case "hybrid":
      return copy.card.workModeHybrid;
    case "remote":
      return copy.card.workModeRemote;
    case "onsite":
      return copy.card.workModeOnsite;
    default:
      return "";
  }
}
