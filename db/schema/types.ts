export type TranslationContent = {
  tagline: string,
  description: string,
  aiintro: string
};

export type SEOContent = {
  title: string,
  description: string,
  keywords: string[],
}

export interface PathSegment {
  slug_type: string;
  slug: string;
}