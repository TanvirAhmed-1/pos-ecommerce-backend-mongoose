"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const category_route_1 = require("../modules/category/category.route");
const brand_route_1 = require("../modules/brand/brand.route");
const product_route_1 = require("../modules/product/product.route");
const variant_routes_1 = require("../modules/variant/variant.routes");
const attribute_route_1 = require("../modules/attribute/attribute.route");
const cart_routes_1 = require("../modules/cart/cart.routes");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const order_routes_1 = require("../modules/order/order.routes");
const slider_routes_1 = require("../modules/slider/slider.routes");
const section_routes_1 = require("../modules/section/section.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const routet = (0, express_1.Router)();
const allRouters = [
    user_route_1.UserRoutes,
    category_route_1.CategoryRoutes,
    brand_route_1.BrandRoutes,
    product_route_1.ProductRoutes,
    variant_routes_1.VariantRoutes,
    attribute_route_1.AttributeRoutes,
    cart_routes_1.CartRoutes,
    wishlist_route_1.WishlistRoutes,
    order_routes_1.OrderRoutes,
    slider_routes_1.SliderRoutes,
    section_routes_1.SectionRoutes,
    payment_route_1.PaymentRoutes,
];
allRouters.forEach((router) => {
    routet.use(router);
});
exports.BaseRouter = routet;
