"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionService = void 0;
const section_model_1 = require("./section.model");
const createSectionIntoDB = async (payload) => {
    const result = await section_model_1.SectionModel.create(payload);
    return result;
};
// হোমপেজের জন্য সব সেকশন একসাথে আনা (পপুলেটসহ)
const getHomeSectionsFromDB = async () => {
    return await section_model_1.SectionModel.find({ isActive: true })
        .sort({ displayOrder: 1 }) // ছোট থেকে বড় সাজাবে
        .populate({
        path: "products",
        match: { isActive: true }, // শুধু এনাবল প্রোডাক্টগুলো দেখাবে
        select: "name price thumbnail slug discountPrice", // শুধু দরকারি ডাটা
    });
};
const updateSectionInDB = async (id, payload) => {
    const result = await section_model_1.SectionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result)
        throw new Error("Section not found to update!");
    return result;
};
const deleteSectionFromDB = async (id) => {
    const result = await section_model_1.SectionModel.findByIdAndDelete(id);
    if (!result)
        throw new Error("Section not found to delete!");
    return result;
};
exports.SectionService = {
    createSectionIntoDB,
    getHomeSectionsFromDB,
    updateSectionInDB,
    deleteSectionFromDB,
};
