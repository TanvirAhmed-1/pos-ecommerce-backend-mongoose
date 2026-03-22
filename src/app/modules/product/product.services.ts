import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

const createProductIntoDB = async (payload: IProduct) => {
  const result = await ProductModel.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, category, subcategory, brand, minPrice, maxPrice, sort } = query;
  
  let filter: any = { isActive: true };

  // ডাইনামিক সার্চ লজিক (Name, Keywords, or Slug)
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { keywords: { $elemMatch: { $regex: searchTerm, $options: "i" } } },
    ];
  }

  // ফিল্টারিং লজিক
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (brand) filter.brand = brand;
  
  // প্রাইজ রেঞ্জ ফিল্টার
  if (minPrice || maxPrice) {
    filter.salePrice = {};
    if (minPrice) filter.salePrice.$gte = Number(minPrice);
    if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
  }

  const productQuery = ProductModel.find(filter)
    .populate("category")
    .populate("brand")
    .populate("productVariants"); // ভার্চুয়াল পপুলেট

  // সর্টিং (Default: Newest first)
  if (sort) {
    productQuery.sort(sort as string);
  } else {
    productQuery.sort("-createdAt");
  }

  return await productQuery;
};

const getSingleProductBySlugFromDB = async (slug: string) => {
  const result = await ProductModel.findOne({ slug, isActive: true })
    .populate("category")
    .populate("brand")
    .populate("productVariants");
    
  if (!result) throw new Error("Product not found!");
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<IProduct>) => {
  const result = await ProductModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new Error("Product not found to update");
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);
  if (!result) throw new Error("Product not found to delete");
  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductBySlugFromDB,
  updateProductInDB,
  deleteProductFromDB,
};