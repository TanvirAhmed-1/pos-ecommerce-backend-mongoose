import { CartModel } from "./cart.model";
import { VariantModel } from "../variant/variant.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";

const addToCartIntoDB = async (
  userId: string,
  payload: { product: string; variant?: string; quantity: number },
) => {
  const { product, variant, quantity } = payload;

  const productData = await ProductModel.findById(product);
  if (!productData) throw new Error("Product not found!");

  if (!productData.isActive) {
    throw new Error("This product is currently inactive!");
  }

  let variantData: any = null;

  if (productData.hasVariants) {
    if (!variant || variant === product) {
      throw new Error("Please select a variant for this product!");
    }
    variantData = await VariantModel.findById(variant);
    if (!variantData) throw new Error("Variant not found!");
    if (!variantData.isActive) {
      throw new Error("This variant is currently inactive!");
    }
  } else {
    // Non-variant (simple) product
    if (variant && variant !== product) {
      variantData = await VariantModel.findById(variant);
    }
    if (!variantData) {
      variantData = await VariantModel.findOne({ product: productData._id });
    }
    if (!variantData) {
      variantData = await VariantModel.create({
        product: productData._id,
        attributes: [],
        price: productData.salePrice || productData.basePrice || 0,
        stock: productData.totalStock || 0,
        sku: productData.sku || `${productData.slug.toUpperCase()}-DEF`,
        isActive: true,
        images: [productData.thumbnail].filter(Boolean),
      });
    }
  }

  const availableStock = productData.hasVariants
    ? (variantData.stock ?? 0)
    : (productData.totalStock ?? variantData.stock ?? 0);

  if (availableStock < quantity) {
    throw new Error(`Insufficient stock! Only ${availableStock} items left in stock.`);
  }

  // Determine price
  let price = productData.hasVariants
    ? ((variantData as any).salePrice || (variantData as any).basePrice || (variantData as any).price)
    : (productData.salePrice || productData.basePrice || (variantData as any).price || 0);

  // Check reseller pricing
  const user = await UserModel.findById(userId);
  const isReseller = user?.role?.toLowerCase() === "reseller";

  const resellerPrice = (productData as any).wholesalePrice || (productData as any).resellerPrice;
  if (isReseller && resellerPrice && resellerPrice > 0) {
    if (productData.hasVariants && variantData && variantData.price) {
      if (productData.salePrice && resellerPrice) {
        const ratio = resellerPrice / productData.salePrice;
        price = Math.round(variantData.price * ratio);
      } else {
        price = resellerPrice;
      }
    } else {
      price = resellerPrice;
    }
  }

  if (price === undefined || price === null) {
    throw new Error("Product price is not defined!");
  }

  const itemTotalPrice = price * quantity;

  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    cart = await CartModel.create({
      user: userId,
      items: [
        {
          product: productData._id as any,
          variant: variantData._id as any,
          quantity,
          price,
          totalPrice: itemTotalPrice,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) =>
        item.variant.toString() === variantData._id.toString() ||
        (!productData.hasVariants && item.product.toString() === productData._id.toString())
    );

    if (existingItem) {
      if (availableStock < existingItem.quantity + quantity) {
        throw new Error(
          `Cannot add more. Only ${availableStock} items available in stock (${existingItem.quantity} already in cart).`
        );
      }
      existingItem.quantity += quantity;
      existingItem.price = price;
      existingItem.totalPrice = existingItem.quantity * price;
    } else {
      cart.items.push({
        product: productData._id as any,
        variant: variantData._id as any,
        quantity,
        price,
        totalPrice: itemTotalPrice,
      });
    }
    await cart.save(); // pre-save hook calculates totalAmount & totalItems
  }

  return cart;
};

const getMyCartFromDB = async (userId: string) => {
  return await CartModel.findOne({ user: userId })
    .populate("items.product", "name thumbnail slug basePrice salePrice totalStock hasVariants")
    .populate({
      path: "items.variant",
      select: "sku price stock images attributes isActive",
      populate: { path: "attributes.attribute", select: "name" },
    });
};

const removeItemFromCartDB = async (userId: string, variantId: string) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found!");

  cart.items = cart.items.filter(
    (item) => item.variant.toString() !== variantId && item.product.toString() !== variantId
  );

  await cart.save();
  return cart;
};

const updateQuantityInCartDB = async (
  userId: string,
  variantId: string,
  action?: "increment" | "decrement",
  targetQuantity?: number
) => {
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found!");

  const item = cart.items.find(
    (i) => i.variant.toString() === variantId || i.product.toString() === variantId
  );
  if (!item) throw new Error("Item not found in cart!");

  const variantData = await VariantModel.findById(item.variant);
  const productData = await ProductModel.findById(item.product);

  const availableStock = productData?.hasVariants
    ? (variantData?.stock ?? 0)
    : (productData?.totalStock ?? variantData?.stock ?? 0);

  if (targetQuantity !== undefined) {
    if (targetQuantity <= 0) {
      return await removeItemFromCartDB(userId, item.variant.toString());
    }
    if (availableStock < targetQuantity) {
      throw new Error(`Only ${availableStock} items available in stock!`);
    }
    item.quantity = targetQuantity;
  } else if (action === "increment") {
    if (availableStock <= item.quantity) {
      throw new Error(`Only ${availableStock} items available in stock!`);
    }
    item.quantity += 1;
  } else if (action === "decrement") {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      return await removeItemFromCartDB(userId, item.variant.toString());
    }
  }

  item.totalPrice = item.quantity * item.price;
  await cart.save();
  return cart;
};

const clearCartFromDB = async (userId: string) => {
  return await CartModel.findOneAndUpdate(
    { user: userId },
    { items: [], totalAmount: 0, totalItems: 0 },
    { new: true },
  );
};

export const CartService = {
  addToCartIntoDB,
  getMyCartFromDB,
  removeItemFromCartDB,
  updateQuantityInCartDB,
  clearCartFromDB,
};