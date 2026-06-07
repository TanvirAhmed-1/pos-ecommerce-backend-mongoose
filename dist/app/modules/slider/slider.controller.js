"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const slider_services_1 = require("./slider.services");
const createSlider = (0, catchAsync_1.default)(async (req, res) => {
    const result = await slider_services_1.SliderService.createSliderIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Slider created successfully",
        data: result,
    });
});
const getHomeSliders = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await slider_services_1.SliderService.getActiveSlidersFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const getAllSliders = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await slider_services_1.SliderService.getAllSlidersForAdminFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const updateSlider = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await slider_services_1.SliderService.updateSliderInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Slider updated successfully",
        data: result,
    });
});
const deleteSlider = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await slider_services_1.SliderService.deleteSliderFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Slider deleted successfully",
        data: null,
    });
});
exports.SliderController = {
    createSlider,
    getHomeSliders,
    getAllSliders,
    updateSlider,
    deleteSlider,
};
