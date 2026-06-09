import { CompanyModel } from "../company/company.model";
import { CategoryModel } from "../category/category.model";
import { PageModel } from "../page/page.model";

const getFooterData = async () => {
  // 1. Fetch Company Info
  const company = await CompanyModel.findOne({ isActive: true }).select(
    "name logo email phone address socialMedia googleMap description copyright"
  );

  // 2. Fetch Top Navigation Categories (Level 0, Active)
  const categories = await CategoryModel.find({ isActive: true, level: 0 })
    .select("name slug")
    .limit(6)
    .lean();

  // 3. Fetch Dynamic Pages (Active)
  const pages = await PageModel.find({ isActive: true })
    .select("title slug group")
    .lean();

  // Group pages by their group field (e.g., "Quick Links", "Policies", etc.)
  const groupedPages: Record<string, Array<{ title: string; slug: string }>> = {};

  pages.forEach((page) => {
    const groupName = page.group || "Quick Links";
    if (!groupedPages[groupName]) {
      groupedPages[groupName] = [];
    }
    groupedPages[groupName].push({
      title: page.title,
      slug: page.slug,
    });
  });

  // 4. Industry standard e-commerce payment methods (URLs can be customized/rendered in frontend)
  const paymentMethods = [
    {
      name: "Cash on Delivery",
      icon: "https://cdn-icons-png.flaticon.com/512/6491/6491490.png",
    },
    {
      name: "bKash",
      icon: "https://raw.githubusercontent.com/aamarpay/logos/main/bkash.png",
    },
    {
      name: "Nagad",
      icon: "https://raw.githubusercontent.com/aamarpay/logos/main/nagad.png",
    },
    {
      name: "Rocket",
      icon: "https://raw.githubusercontent.com/aamarpay/logos/main/rocket.png",
    },
    {
      name: "Visa",
      icon: "https://cdn-icons-png.flaticon.com/512/196/196578.png",
    },
    {
      name: "Mastercard",
      icon: "https://cdn-icons-png.flaticon.com/512/196/196561.png",
    },
  ];

  return {
    company: company || null,
    categories,
    groupedPages,
    paymentMethods,
  };
};

export const FooterServices = {
  getFooterData,
};
