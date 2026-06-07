"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val?.path,
            message: val?.message,
        };
    });
    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources,
    };
};
exports.default = handleValidationError;
