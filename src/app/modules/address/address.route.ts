import { Router } from "express";
import auth from "../../middlewares/auth";
import validateData from "../../middlewares/validateData";
import { createAddressSchema, updateAddressSchema } from "./address.validation";
import { AddressController } from "./address.controller";

const router = Router();

router.post(
  "/create-address",
  auth(),
  validateData(createAddressSchema),
  AddressController.createAddress
);

router.get("/get-my-addresses", auth(), AddressController.getMyAddresses);
router.patch(
  "/update-address/:id",
  auth(),
  validateData(updateAddressSchema),
  AddressController.updateAddress
);
router.put(
  "/update-address/:id",
  auth(),
  validateData(updateAddressSchema),
  AddressController.updateAddress
);
router.delete("/delete-address/:id", auth(), AddressController.deleteAddress);

export const AddressRoutes = router;
