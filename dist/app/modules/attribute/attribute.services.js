"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeService = void 0;
const attribute_model_1 = require("./attribute.model");
const createAttributeIntoDB = async (payload) => {
    return await attribute_model_1.AttributeModel.create(payload);
};
const getAllAttributesFromDB = async () => {
    return await attribute_model_1.AttributeModel.find({ isActive: true });
};
const getSingleAttributeFromDB = async (id) => {
    return await attribute_model_1.AttributeModel.findById(id);
};
const updateAttributeInDB = async (id, payload) => {
    return await attribute_model_1.AttributeModel.findByIdAndUpdate(id, payload, { new: true });
};
const deleteAttributeFromDB = async (id) => {
    return await attribute_model_1.AttributeModel.findByIdAndDelete(id);
};
exports.AttributeService = {
    createAttributeIntoDB,
    getAllAttributesFromDB,
    getSingleAttributeFromDB,
    updateAttributeInDB,
    deleteAttributeFromDB,
};
