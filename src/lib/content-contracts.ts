/**
 * Public content contracts reserved by ARCH-SEO-AEO-CONTENT.
 * These types are storage-agnostic. They do not imply that a CMS or catalog exists.
 */

export type ContentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ArticleContent = {
  id: string;
  slug: string;
  title: string;
  perex: string;
  body: string;
  category: string;
  publishedAt: Date;
  updatedAt: Date;
  authorName: string;
  hero: ContentImage;
  faq: { question: string; answer: string }[];
  jobCategoryTags: string[];
  relatedToolSlugs: string[];
};

export type CourseMode = "online" | "in_person" | "hybrid";

export type CourseContent = {
  id: string;
  slug: string;
  title: string;
  provider: {
    name: string;
    url: string;
  };
  mode: CourseMode;
  durationIso: string;
  priceCzk: number | null;
  isFree: boolean;
  location: {
    city?: string;
    region?: string;
    country: "CZ";
  };
  description: string;
  ctaUrl: string;
  categoryTags: string[];
  professionTags: string[];
  publishedAt: Date;
  updatedAt: Date;
};

export type ToolContent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputCopyKeys: string[];
  relatedArticleSlugs: string[];
  relatedJobQueries: Record<string, string>[];
  updatedAt: Date;
};
