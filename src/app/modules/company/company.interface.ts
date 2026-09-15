export type ISocialMedia = {
  platform: string;
  url: string;
};

export type ISEO = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[] | string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
};

export type ICompany = {
  // General details
  name: string;
  companyName?: string;
  companyTitle?: string;
  phone: string;
  hotline?: string;
  whatsapp?: string;
  email: string;
  address: string;
  billFooter?: string;
  bin?: string;

  // Media & Images
  logo: string;
  companyLogo?: string;
  favicon?: string;
  adminFavicon?: string;
  careSectionBg?: string;
  companyAboutImg?: string;
  ogImg?: string;
  loginBgImg?: string;

  // External Links & Tracking
  websiteLink?: string;
  facebookLink?: string;
  googleTag?: string;
  googleMap?: string;
  facebookPixel?: string;
  googleTagManager?: string;
  googleAnalytics?: string;
  appLink?: string;
  iosLink?: string;
  parentingLink?: string;
  socialMedia?: ISocialMedia[];

  // SEO & Social
  metaKeyword?: string;
  metaKeywords?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  seo?: ISEO;

  // Maintenance
  comingSoon?: boolean;
  comingSoonDate?: string;

  // Footer Content
  footerInfo?: string;
  footerDescription?: string;
  description?: string;
  copyright?: string;

  // Theme & Appearance
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  themeName?: string;

  isActive: boolean;
};
