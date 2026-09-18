import { IBanner } from "./banner.interface";
import { BannerModel } from "./banner.model";

const createBannerIntoDB = async (payload: IBanner) => {
  return await BannerModel.create(payload);
};

const getActiveBannersFromDB = async () => {
  return await BannerModel.find({ isActive: true }).sort({ priority: 1, createdAt: -1 });
};

const getAllBannersForAdminFromDB = async () => {
  return await BannerModel.find().sort({ priority: 1, createdAt: -1 });
};

const getSingleBannerFromDB = async (id: string) => {
  const result = await BannerModel.findById(id);
  if (!result) throw new Error("Promotional Banner not found!");
  return result;
};

const updateBannerInDB = async (id: string, payload: Partial<IBanner>) => {
  const result = await BannerModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new Error("Promotional Banner not found to update!");
  return result;
};

const deleteBannerFromDB = async (id: string) => {
  const result = await BannerModel.findByIdAndDelete(id);
  if (!result) throw new Error("Promotional Banner not found to delete!");
  return result;
};

const reorderBannersInDB = async (orders: { id: string; priority: number }[]) => {
  const bulkOps = orders.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: { $set: { priority: item.priority } },
    },
  }));
  return await BannerModel.bulkWrite(bulkOps);
};

export const BannerService = {
  createBannerIntoDB,
  getActiveBannersFromDB,
  getAllBannersForAdminFromDB,
  getSingleBannerFromDB,
  updateBannerInDB,
  deleteBannerFromDB,
  reorderBannersInDB,
};
