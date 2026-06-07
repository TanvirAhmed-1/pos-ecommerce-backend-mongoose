"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderService = void 0;
const slider_model_1 = require("./slider.model");
const createSliderIntoDB = async (payload) => {
    return await slider_model_1.SliderModel.create(payload);
};
const getActiveSlidersFromDB = async () => {
    return await slider_model_1.SliderModel.find({ isActive: true }).sort({ priority: 1 });
};
const getAllSlidersForAdminFromDB = async () => {
    return await slider_model_1.SliderModel.find().sort({ priority: 1 });
};
const updateSliderInDB = async (id, payload) => {
    return await slider_model_1.SliderModel.findByIdAndUpdate(id, payload, { new: true });
};
const deleteSliderFromDB = async (id) => {
    return await slider_model_1.SliderModel.findByIdAndDelete(id);
};
exports.SliderService = {
    createSliderIntoDB,
    getActiveSlidersFromDB,
    getAllSlidersForAdminFromDB,
    updateSliderInDB,
    deleteSliderFromDB,
};
