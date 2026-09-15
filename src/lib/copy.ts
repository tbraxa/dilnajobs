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
    cenik: "Ceník",
    ariaMain: "Hlavní",
    ariaMenu: "Menu",
    personalData: "Osobní údaje",
  },
  home: {
    metaTitle: "FairJobs · nabídky práce",
    metaDescription: "Nabídky práce v Česku. Hledejte podle pozice, místa a mzdy. Odpovězte přímo firmě.",
    helper: "Pozice, místo, mzda. Všechny obory.",
    labelQuery: "Pozice",
    labelPlace: "Místo",
    placeholderQuery: "např. účetní, řidič, vývojář",
    placeholderPlace: "např. Praha, Brno",
    ctaSearch: "Hledat",
    ctaEmployers: "Pro firmy",
    sectionCats: "Obory",
    sectionCatsHelper: "Vyberte oblast a jděte rovnou na nabídky",
    sectionLatest: "Aktuální nabídky",
    sectionLatestHelper: "Mzda, místo a firma hned vidět",
    sectionFields: "Všechny obory",
    ctaAllJobs: "Zobrazit všechny nabídky",
    trust1Title: "Ověřené firmy",
    trust1Body: "Ověření přes IČO a ARES. Zelený štítek jen u skutečně ověřených.",
    trust2Title: "Přímo firmě",
    trust2Body: "Odpověď jde rovnou zaměstnavateli. Bez zbytečného prostředníka.",
    trust3Title: "Jasná mzda",
    trust3Body: "Mzda je na kartě jako cena. Hledáte podle čísla, ne podle dohadů.",
    shotOffice: "Kancelář",
    shotLogistics: "Logistika",
    shotWorkshop: "Výroba",
  },
  nabidky: {
    metaTitle: "Nabídky práce · FairJobs",
    metaDescription: "Procházejte nabídky práce. Filtrujte podle pozice, místa, úvazku a mzdy.",
    claim: "Všechny nabídky",
    filteredClaim: "Filtrované nabídky",
    helper: "Upravte filtry podle pozice, místa a mzdy.",
    labelQuery: "Pozice",
    labelPlace: "Místo",
    ctaSearch: "Hledat",
    ctaShowFilters: "Zobrazit filtry",
    ctaFilters: "Filtry",
    ctaEditFilters: "Upravit filtry",
    ctaFiltersClose: "Zavřít",
    ctaFiltersDone: "Hotovo",
    ctaDrawerReset: "Zrušit",
    ctaShowOffers: (n: number) => `Zobrazit ${n} nabídek`,
    filtersAllPlaces: "Celá ČR",
    filtersModeWork: "Režim práce",
    filtersSalaryInput: "Od Kč",
    filtersSalaryPlaceholder: "např. 45000",
    chipSalaryFrom: (n: number) => `Mzda od ${new Intl.NumberFormat("cs-CZ").format(n)} Kč`,
    sectionResults: "Výsledky",
    filtersPlace: "Místo",
    filtersCategory: "Obor",
    filtersContract: "Úvazek",
    filtersSalary: "Mzda od",
    filtersSalaryAny: "Bez minima",
    filtersSeniority: "Seniorita",
    filtersMode: "Režim",
    filtersAllCategories: "Všechny obory",
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
    sectionAbout: "Náplň práce",
    sectionRequirements: "Požadavky",
    sectionOffer: "Benefity",
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
    ctaSubmit: "Odeslat odpověď",
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
    helper: "Jasná mzda. Odpovědi rovnou vám.",
    ctaPrimary: "Založit účet firmy",
    ctaSecondary: "Přihlásit se",
    ctaPost: "Vystavit nabídku",
    ctaPricing: "Zobrazit ceník",
    sectionWhy: "Proč FairJobs",
    why1Title: "Jasný inzerát",
    why1Body: "Mzda, místo a úvazek hned vidět. Méně zbytečných odpovědí.",
    why2Title: "Odpovědi na jednom místě",
    why2Body: "Telefon, e-mail a životopis u každé žádosti.",
    why3Title: "Rychlé spuštění",
    why3Body: "Účet firmy a první nabídka během pár minut.",
    bottomHelper: "Založte účet firmy a zveřejněte první nabídku.",
    bandTitle: "Zveřejněte pozici. Uchazeči odpoví přímo vám.",
    bandHelper: "Jasná mzda. Odpovědi rovnou vám.",
    photoAlt: "Tým v kanceláři",
    sectionHow: "Jak to funguje",
    how1Title: "Založte účet firmy",
    how1Body: "Registrace e-mailem. Doplníte IČO. Ověření přes ARES, kde je dostupné.",
    how2Title: "Zveřejněte nabídku",
    how2Body: "Strukturovaná pole: mzda, místo, úvazek, režim. Uchazeči vidí fakta hned.",
    how3Title: "Přijímejte odpovědi",
    how3Body: "Schránka přihlášek s kontaktem a volitelným CV. Odpovídáte přímo.",
    sectionCulture: "Ověření firmy přes IČO",
    cultureBody:
      "FairJobs ověřuje firmy přes IČO a ARES. Zelený štítek Ověřeno patří jen skutečně ověřeným firmám, ne jako dekorace.",
    culture1: "IČO na detailu nabídky",
    culture2: "Ověření před zvýrazněním důvěry",
    culture3: "Stejná značka pro uchazeče i firmy",
    culturePhotoAlt: "Tým při spolupráci",
    sectionPricing: "Ceník inzerce",
    pricingHelper: "Ceny bez DPH. Platba po registraci.",
    pricingPeriod: "/ 30 dní",
    pricingStartName: "Start",
    pricingStartNote: "Pro první pozici",
    pricingStartBody: "Jedna nabídka. Mzda, místo a úvazek hned vidět.",
    pricingStartItems: ["1 aktivní nabídka", "Schránka přihlášek", "Ověření firmy přes IČO"],
    pricingStandardName: "Standard",
    pricingStandardNote: "Pro rostoucí týmy",
    pricingStandardItems: ["Až 5 aktivních nabídek", "Zvýraznění ve výsledcích", "Schránka přihlášek + CV"],
    pricingPlusName: "Plus",
    pricingPlusNote: "Pro více pozic najednou",
    pricingPlusBody: "Více nabídek najednou. Odpovědi na jednom místě.",
    pricingPlusItems: ["Až 15 aktivních nabídek", "Topování a logo firmy", "Prioritní podpora"],
    pricingProName: "Pro",
    pricingProBody: "Pro firmu, která nabírá průběžně.",
    payCard: "Zaplatit kartou",
    payOrder: "Objednat",
    orderReceived: "Objednávka je přijatá. Ozveme se na e-mail.",
    orderPaid: "Platba proběhla. Balíček se připíše.",
    orderCanceled: "Platbu jste zrušili. Můžete to zkusit znovu.",
    orderActivated: "Zkušební balíček je aktivní.",
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
