export type ISEO = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
};

export type IPage = {
  title: string;
  slug: string;
  content: string;
  group: string;
  isActive: boolean;
  seo?: ISEO;
};
