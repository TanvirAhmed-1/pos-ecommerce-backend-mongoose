import { IAttribute } from "./attribute.interface";
import { AttributeModel } from "./attribute.model";

const createAttributeIntoDB = async (payload: IAttribute) => {
  return await AttributeModel.create(payload);
};

const getAllAttributesFromDB = async () => {
  return await AttributeModel.find({ isActive: true });
};

const getSingleAttributeFromDB = async (id: string) => {
  return await AttributeModel.findById(id);
};

const updateAttributeInDB = async (
  id: string,
  payload: Partial<IAttribute>,
) => {
  return await AttributeModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteAttributeFromDB = async (id: string) => {
  return await AttributeModel.findByIdAndDelete(id);
};

export const AttributeService = {
  createAttributeIntoDB,
  getAllAttributesFromDB,
  getSingleAttributeFromDB,
  updateAttributeInDB,
  deleteAttributeFromDB,
};
