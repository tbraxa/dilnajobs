import { BRAND, BRAND_DESCRIPTION } from "@/lib/brand";
import { resolveAppUrl } from "@/lib/app-url";
import { professionByDb } from "@/lib/catalog";
import { cleanUiBlock, cleanUiText } from "@/lib/fairjobs-visual";

export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

function absoluteUrl(path = "/") {
  return new URL(path, resolveAppUrl()).toString();
}

const publisher = () => ({
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: BRAND,
  url: absoluteUrl("/"),
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo.svg"),
  },
});

export function siteJsonLd(): JsonLdData {
  return [
    {
      "@context": "https://schema.org",
      ...publisher(),
      description: BRAND_DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: BRAND,
      url: absoluteUrl("/"),
      inLanguage: "cs-CZ",
      publisher: { "@id": absoluteUrl("/#organization") },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absoluteUrl("/nabidky")}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function breadcrumbsJsonLd(items: { name: string; path: string }[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items?: { name: string; path: string; type?: string }[];
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl(`${input.path}#collection`),
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "cs-CZ",
    isPartOf: { "@id": absoluteUrl("/#website") },
    ...(input.items?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: input.items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              url: absoluteUrl(item.path),
              ...(item.type ? { additionalType: `https://schema.org/${item.type}` } : {}),
            })),
          },
        }
      : {}),
  };
}

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage";
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": absoluteUrl(`${input.path}#webpage`),
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "cs-CZ",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

export function faqPageJsonLd(input: {
  name: string;
  path: string;
  questions: { question: string; answer: string }[];
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl(`${input.path}#faq`),
    name: input.name,
    url: absoluteUrl(input.path),
    inLanguage: "cs-CZ",
    mainEntity: input.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  image: string;
  published: string;
  modified?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`${input.path}#article`),
    headline: input.headline,
    description: input.description,
    image: [input.image],
    datePublished: input.published,
    dateModified: input.modified ?? input.published,
    inLanguage: "cs-CZ",
    mainEntityOfPage: absoluteUrl(input.path),
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function webApplicationJsonLd(input: {
  name: string;
  description: string;
  path: string;
  features: string[];
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "cs-CZ",
    featureList: input.features,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "CZK",
    },
    provider: { "@id": absoluteUrl("/#organization") },
  };
}

export function jobPostingJsonLd(input: {
  job: {
    id: string;
    slug: string;
    title: string;
    description: string;
    requirements: string | null;
    benefits: string | null;
    profession: string;
    city: string;
    region: string;
    employmentType: string;
    workMode: string;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryNote: string | null;
    publishedAt: Date | null;
    expiresAt: Date | null;
  };
  companyName: string;
  ico: string;
}): JsonLdData {
  const { job } = input;
  const description = [job.description, job.requirements, job.benefits]
    .filter(Boolean)
    .map((part) => cleanUiBlock(part))
    .join("\n\n");
  const employmentType =
    job.employmentType === "part_time"
      ? "PART_TIME"
      : job.employmentType === "full_time"
        ? "FULL_TIME"
        : "OTHER";
  const hasSalary = Boolean(job.salaryMin || job.salaryMax);
  const isRemote = job.workMode === "remote";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": absoluteUrl(`/nabidka/${job.slug}#job`),
    identifier: {
      "@type": "PropertyValue",
      name: input.companyName,
      value: job.id,
    },
    title: cleanUiText(job.title),
    description,
    url: absoluteUrl(`/nabidka/${job.slug}`),
    directApply: true,
    employmentType,
    industry: professionByDb(job.profession)?.label ?? cleanUiText(job.profession),
    datePosted: job.publishedAt?.toISOString(),
    validThrough: job.expiresAt?.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: cleanUiText(input.companyName),
      identifier: {
        "@type": "PropertyValue",
        name: "IČO",
        value: input.ico,
      },
    },
    ...(isRemote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: {
            "@type": "Country",
            name: "Česko",
          },
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: cleanUiText(job.city),
              addressRegion: cleanUiText(job.region),
              addressCountry: "CZ",
            },
          },
        }),
    ...(hasSalary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "CZK",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin ?? undefined,
              maxValue: job.salaryMax ?? undefined,
              unitText: "MONTH",
            },
          },
        }
      : job.salaryNote
        ? { incentiveCompensation: cleanUiText(job.salaryNote) }
        : {}),
  };
}
