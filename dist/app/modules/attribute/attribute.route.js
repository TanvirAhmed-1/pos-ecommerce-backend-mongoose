"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const attribute_controller_1 = require("./attribute.controller");
const attribute_validation_1 = require("./attribute.validation");
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const router = express_1.default.Router();
router.post("/create-attributes", (0, validateData_1.default)(attribute_validation_1.AttributeValidation.createAttributeZodSchema), attribute_controller_1.AttributeController.createAttribute);
router.get("/all-attributes", attribute_controller_1.AttributeController.getAllAttributes);
router.patch("/delete-attribute/:id", (0, validateData_1.default)(attribute_validation_1.AttributeValidation.updateAttributeZodSchema), attribute_controller_1.AttributeController.updateAttribute);
router.delete("/delete-attribute/:id", attribute_controller_1.AttributeController.deleteAttribute);
exports.AttributeRoutes = router;
