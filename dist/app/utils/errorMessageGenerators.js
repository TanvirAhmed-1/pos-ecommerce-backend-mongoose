"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZodError = exports.generateMongooseError = void 0;
const generateMongooseError = (err) => Object.values(err.errors)
    .map((e) => e.message)
    .join(", ");
exports.generateMongooseError = generateMongooseError;
const generateZodError = (err) => err.issues
    .map((i) => `${i.path[i.path.length - 1]} is ${i.message.toLowerCase()}`)
    .join(", ");
exports.generateZodError = generateZodError;
