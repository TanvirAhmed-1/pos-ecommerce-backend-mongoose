export type ISocialMedia = {
  platform: string;
  url: string;
};

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

export type ICompany = {
  name: string;
  logo: string;
  favicon?: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: ISocialMedia[];
  googleMap?: string;
  seo?: ISEO;
  description?: string;
  copyright?: string;
  isActive: boolean;
};
