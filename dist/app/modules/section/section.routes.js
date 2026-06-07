"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionRoutes = void 0;
const express_1 = require("express");
const section_controller_1 = require("./section.controller");
const validateData_1 = __importDefault(require("../../middlewares/validateData"));
const section_validation_1 = require("./section.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
// এডমিন নতুন সেকশন বানাবে
router.post("/create-section", (0, auth_1.default)("admin", "superadmin"), (0, validateData_1.default)(section_validation_1.createSectionSchema), section_controller_1.SectionController.createSection);
// পাবলিকলি হোমপেজের জন্য ডাটা কল হবে
router.get("/get-home-sections", section_controller_1.SectionController.getHomeSections);
// এডমিন সেকশন আপডেট করবে
router.patch("/update-section/:id", (0, auth_1.default)("admin", "superadmin"), section_controller_1.SectionController.updateSection);
// এডমিন সেকশন ডিলিট করবে
router.delete("/delete-section/:id", (0, auth_1.default)("admin", "superadmin"), section_controller_1.SectionController.deleteSection);
exports.SectionRoutes = router;
