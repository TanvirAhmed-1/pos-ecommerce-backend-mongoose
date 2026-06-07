"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const attribute_services_1 = require("./attribute.services");
const createAttribute = (0, catchAsync_1.default)(async (req, res) => {
    const result = await attribute_services_1.AttributeService.createAttributeIntoDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Attribute created successfully",
        data: result,
    });
});
const getAllAttributes = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await attribute_services_1.AttributeService.getAllAttributesFromDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
});
const updateAttribute = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await attribute_services_1.AttributeService.updateAttributeInDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Attribute updated successfully",
        data: result,
    });
});
const deleteAttribute = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await attribute_services_1.AttributeService.deleteAttributeFromDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Attribute delete successfully",
    });
});
exports.AttributeController = {
    createAttribute,
    getAllAttributes,
    updateAttribute,
    deleteAttribute,
};
