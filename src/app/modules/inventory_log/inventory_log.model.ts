import { Schema, model } from "mongoose";
import { IInventoryLog } from "./inventory_log.interface";

const inventoryLogSchema = new Schema<IInventoryLog>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export const InventoryLogModel = model<IInventoryLog>("InventoryLog", inventoryLogSchema);
