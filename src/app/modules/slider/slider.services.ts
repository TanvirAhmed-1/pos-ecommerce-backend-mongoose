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
  return await SliderModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteSliderFromDB = async (id: string) => {
  return await SliderModel.findByIdAndDelete(id);
};

export const SliderService = {
  createSliderIntoDB,
  getActiveSlidersFromDB,
  getAllSlidersForAdminFromDB,
  updateSliderInDB,
  deleteSliderFromDB,
};
