"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (_req, res, _next) => {
    return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "API not found",
    });
};
exports.default = notFound;
