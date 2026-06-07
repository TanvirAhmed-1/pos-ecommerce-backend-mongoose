"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const section_services_1 = require("./section.services");
const createSection = (0, catchAsync_1.default)(async (req, res) => {
    const result = await section_services_1.SectionService.createSectionIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Section created successfully",
        data: result,
    });
});
const getHomeSections = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await section_services_1.SectionService.getHomeSectionsFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Sections fetched successfully",
        data: result,
    });
});
const updateSection = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await section_services_1.SectionService.updateSectionInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Section updated successfully",
        data: result,
    });
});
const deleteSection = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await section_services_1.SectionService.deleteSectionFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Section deleted successfully",
        data: null,
    });
});
exports.SectionController = {
    createSection,
    getHomeSections,
    updateSection,
    deleteSection,
};
