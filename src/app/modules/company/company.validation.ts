import { z } from "zod";

const socialMediaValidationSchema = z.object({
  platform: z.string().optional(),
  url: z.string().optional(),
});

const seoValidationSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.any().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

const createCompanyZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    companyName: z.string().optional(),
    companyTitle: z.string().optional(),
    logo: z.string().optional(),
    companyLogo: z.string().optional(),
    favicon: z.string().optional(),
    adminFavicon: z.string().optional(),
    careSectionBg: z.string().optional(),
    companyAboutImg: z.string().optional(),
    ogImg: z.string().optional(),
    loginBgImg: z.string().optional(),

    email: z.string().optional(),
    phone: z.string().optional(),
    hotline: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
    billFooter: z.string().optional(),
    bin: z.string().optional(),

    websiteLink: z.string().optional(),
    facebookLink: z.string().optional(),
    googleTag: z.string().optional(),
    googleMap: z.string().optional(),
    facebookPixel: z.string().optional(),
    googleTagManager: z.string().optional(),
    googleAnalytics: z.string().optional(),
    appLink: z.string().optional(),
    iosLink: z.string().optional(),
    parentingLink: z.string().optional(),
    socialMedia: z.array(socialMediaValidationSchema).optional(),

    metaKeyword: z.string().optional(),
    metaKeywords: z.any().optional(),
    metaDescription: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    seo: seoValidationSchema.optional(),

    comingSoon: z.boolean().optional(),
    comingSoonDate: z.string().optional(),

    footerInfo: z.string().optional(),
    footerDescription: z.string().optional(),
    description: z.string().optional(),
    copyright: z.string().optional(),

    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    themeName: z.string().optional(),

    isActive: z.boolean().optional().default(true),
  }),
});

const updateCompanyZodSchema = createCompanyZodSchema;

export const CompanyValidation = {
  createCompanyZodSchema,
  updateCompanyZodSchema,
};
