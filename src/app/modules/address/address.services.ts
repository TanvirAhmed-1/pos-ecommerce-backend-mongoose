import { IAddress } from "./address.interface";
import { AddressModel } from "./address.model";

const createAddress = async (userId: string, payload: IAddress) => {
  if (payload.isDefault) {
    await AddressModel.updateMany({ user: userId }, { isDefault: false });
  }
  const result = await AddressModel.create({ ...payload, user: userId });
  return result;
};

const getMyAddresses = async (userId: string) => {
  return await AddressModel.find({ user: userId });
};

const deleteAddress = async (userId: string, id: string) => {
  return await AddressModel.findOneAndDelete({ _id: id, user: userId });
};

export const AddressServices = {
  createAddress,
  getMyAddresses,
  deleteAddress,
};
