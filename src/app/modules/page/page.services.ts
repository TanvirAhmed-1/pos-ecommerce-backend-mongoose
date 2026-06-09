import slugify from "slugify";
import { IPage } from "./page.interface";
import { PageModel } from "./page.model";

const createPageIntoDB = async (payload: IPage) => {
  const finalSlug = slugify(payload.slug || payload.title, {
    lower: true,
    strict: true,
  });

  // Check if a page with the same slug already exists
  const existingPage = await PageModel.findOne({ slug: finalSlug });
  if (existingPage) {
    throw new Error(`A page with slug '${finalSlug}' already exists.`);
  }

  const result = await PageModel.create({
    ...payload,
    slug: finalSlug,
  });
  return result;
};

const getAllPagesFromDB = async (query: Record<string, any>) => {
  // Simple filtering (e.g. search by title or filter by group, isActive)
  const filter: Record<string, any> = {};
  
  if (query.group) {
    filter.group = query.group;
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true' || query.isActive === true;
  }
  if (query.searchTerm) {
    filter.title = { $regex: query.searchTerm, $options: "i" };
  }

  const result = await PageModel.find(filter).sort({ createdAt: -1 });
  return result;
};

const getPageBySlugFromDB = async (slug: string) => {
  const result = await PageModel.findOne({ slug, isActive: true });
  if (!result) {
    throw new Error("Page not found or is inactive.");
  }
  return result;
};

const getPageByIdFromDB = async (id: string) => {
  const result = await PageModel.findById(id);
  if (!result) {
    throw new Error("Page not found.");
  }
  return result;
};

const updatePageInDB = async (id: string, payload: Partial<IPage>) => {
  const isPageExists = await PageModel.findById(id);
  if (!isPageExists) {
    throw new Error("Page not found.");
  }

  const updateData = { ...payload };

  // If slug is provided, slugify it. If title is provided but no slug, regenerate slug
  if (payload.slug) {
    updateData.slug = slugify(payload.slug, { lower: true, strict: true });
  } else if (payload.title) {
    updateData.slug = slugify(payload.title, { lower: true, strict: true });
  }

  // If slug is changing, verify uniqueness
  if (updateData.slug && updateData.slug !== isPageExists.slug) {
    const existingPage = await PageModel.findOne({ slug: updateData.slug });
    if (existingPage) {
      throw new Error(`A page with slug '${updateData.slug}' already exists.`);
    }
  }

  const result = await PageModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deletePageFromDB = async (id: string) => {
  const isPageExists = await PageModel.findById(id);
  if (!isPageExists) {
    throw new Error("Page not found.");
  }
  return await PageModel.findByIdAndDelete(id);
};

export const PageServices = {
  createPageIntoDB,
  getAllPagesFromDB,
  getPageBySlugFromDB,
  getPageByIdFromDB,
  updatePageInDB,
  deletePageFromDB,
};
