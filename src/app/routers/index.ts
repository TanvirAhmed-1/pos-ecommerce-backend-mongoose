import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { ProductRoutes } from "../modules/product/product.route";
import { VariantRoutes } from "../modules/variant/variant.routes";
import { AttributeRoutes } from "../modules/attribute/attribute.route";
import { CartRoutes } from "../modules/cart/cart.routes";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { OrderRoutes } from "../modules/order/order.routes";
import { SliderRoutes } from "../modules/slider/slider.routes";
import { SectionRoutes } from "../modules/section/section.routes";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { CompanyRoutes } from "../modules/company/company.route";
import { PageRoutes } from "../modules/page/page.route";
import { FooterRoutes } from "../modules/footer/footer.route";
import { AddressRoutes } from "../modules/address/address.route";
import { InvoiceRoutes } from "../modules/invoice/invoice.route";

const routet = Router();
const allRouters = [
  UserRoutes,
  CategoryRoutes,
  BrandRoutes,
  ProductRoutes,
  VariantRoutes,
  AttributeRoutes,
  CartRoutes,
  WishlistRoutes,
  OrderRoutes,
  SliderRoutes,
  SectionRoutes,
  PaymentRoutes,
  CompanyRoutes,
  PageRoutes,
  FooterRoutes,
  AddressRoutes,
  InvoiceRoutes,
];

allRouters.forEach((router) => {
  routet.use(router);
});

export const BaseRouter = routet;
