export type PublicDestinationKind = "editorial" | "learning" | "tool";

export const PUBLIC_DESTINATION_HUBS = [
  { id: "articles", label: "Poradna", href: "/poradna", kind: "editorial" },
  { id: "courses", label: "Kurzy", href: "/kurzy", kind: "learning" },
  { id: "tools", label: "Nástroje", href: "/nastroje", kind: "tool" },
] as const satisfies readonly {
  id: string;
  label: string;
  href: string;
  kind: PublicDestinationKind;
}[];

export const GUIDE_NAV_COLUMNS = [
  {
    id: "articles",
    title: "Poradna",
    hub: "/poradna",
    links: [
      ["Jak hledat práci", "/poradna"],
      ["Mzda a vyjednávání", "/poradna"],
      ["Změna oboru", "/poradna"],
      ["Úřad práce a doklady", "/poradna"],
      ["Všechny články", "/poradna"],
    ],
  },
  {
    id: "courses",
    title: "Kurzy a rekvalifikace",
    hub: "/kurzy",
    links: [
      ["Rekvalifikace", "/kurzy"],
      ["Online kurzy", "/kurzy"],
      ["Kurzy podle oboru", "/kurzy"],
      ["Jak financovat kurz", "/kurzy"],
      ["Všechny kurzy", "/kurzy"],
    ],
  },
  {
    id: "tools",
    title: "Nástroje",
    hub: "/nastroje",
    links: [
      ["Čistý plat", "/nastroje/cisty-plat"],
      ["Orientace ve mzdě", "/nastroje/mzda-obor"],
      ["Přehled kalkulaček", "/nastroje"],
    ],
  },
] as const;
