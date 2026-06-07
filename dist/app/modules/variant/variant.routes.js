"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantRoutes = void 0;
const express_1 = __importDefault(require("express"));
const variant_controller_1 = require("./variant.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const variant_validation_1 = require("./variant.validation");
const router = express_1.default.Router();
router.post("/create-variant", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(variant_validation_1.createVariantSchema), variant_controller_1.VariantController.createVariant);
router.get("/all-variants", variant_controller_1.VariantController.getAllVariantsWithProductDetails);
router.get("/product/:productId", variant_controller_1.VariantController.getProductVariants);
router.patch("/update-variant/:id", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(variant_validation_1.updateVariantSchema), variant_controller_1.VariantController.updateVariant);
router.patch("/update-variant-stock/:id", (0, auth_1.default)("admin", "superadmin"), variant_controller_1.VariantController.updateVariantStock);
router.delete("/delete-variant/:id", (0, auth_1.default)("admin", "superadmin"), variant_controller_1.VariantController.deleteVariant);
exports.VariantRoutes = router;
