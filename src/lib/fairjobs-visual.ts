export const FAIRJOBS_PHOTOS = {
  homeCover: {
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&h=1800&q=86",
    alt: "Lidé spolupracují u jednoho stolu",
  },
  workplace: {
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&h=1000&q=86",
    alt: "Tým při společné práci v kanceláři",
  },
  engineering: {
    src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&h=1000&q=86",
    alt: "Technická práce nad výkresovou dokumentací",
  },
  healthcare: {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&h=1000&q=86",
    alt: "Zdravotník při práci",
  },
  service: {
    src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&h=1000&q=86",
    alt: "Obsluha při práci v kavárně",
  },
  employer: {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&h=1200&q=86",
    alt: "Pracovní pohovor u stolu",
  },
  auth: {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&h=1400&q=86",
    alt: "Tým při poradě v moderní kanceláři",
  },
} as const;

export type FairJobsPhotoKey = keyof typeof FAIRJOBS_PHOTOS;

export function photoForProfession(profession: string) {
  if (["cnc", "welder", "setter", "electrician", "maintenance", "locksmith", "operator"].includes(profession)) {
    return FAIRJOBS_PHOTOS.engineering;
  }
  if (profession === "healthcare") return FAIRJOBS_PHOTOS.healthcare;
  if (profession === "hospitality") return FAIRJOBS_PHOTOS.service;
  return FAIRJOBS_PHOTOS.workplace;
}

export function cleanUiText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[\u2014\u2013]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function cleanUiBlock(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/[\u2014\u2013]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
