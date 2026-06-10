import { ISlider } from "./slider.interface";
import { SliderModel } from "./slider.model";

const createSliderIntoDB = async (payload: ISlider) => {
  return await SliderModel.create(payload);
};

const getActiveSlidersFromDB = async () => {
  return await SliderModel.find({ isActive: true }).sort({ priority: 1 });
};

const getAllSlidersForAdminFromDB = async () => {
  return await SliderModel.find().sort({ priority: 1 });
};

const updateSliderInDB = async (id: string, payload: Partial<ISlider>) => {
  const result = await SliderModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new Error("Slider not found to update!");
  return result;
};

const deleteSliderFromDB = async (id: string) => {
  const result = await SliderModel.findByIdAndDelete(id);
  if (!result) throw new Error("Slider not found to delete!");
  return result;
};

export const SliderService = {
  createSliderIntoDB,
  getActiveSlidersFromDB,
  getAllSlidersForAdminFromDB,
  updateSliderInDB,
  deleteSliderFromDB,
};
