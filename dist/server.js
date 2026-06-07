"use strict";
// import express, { Application } from "express";
// import cors from "cors";
// import config from "./app/config";
// import { BaseRouter } from "./app/routers";
// import globalErrorHandler from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/notFound";
// import mongoose from "mongoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app: Application = express();
// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Routes
// app.use("/api", BaseRouter);
// app.get("/", (req, res) => {
//   res.send(" Server is running");
// });
// // 404 Middleware
// app.use(notFound);
// // Global Error Handler
// app.use(globalErrorHandler);
// // MongoDB Connection
// const startServer = async () => {
//   try {
//     await mongoose.connect(config.database.url);
//     console.log(" MongoDB connected");
//     app.listen(config.port, () => {
//       console.log(
//         ` Server running on port ${config.port} in ${config.env} mode`,
//       );
//     });
//   } catch (err) {
//     console.error(" Failed to connect to MongoDB", err);
//     process.exit(1); // Stop server if DB fails
//   }
// };
// startServer();
// export default app;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.database.url);
        console.log("MongoDB connected successfully");
        app_1.default.listen(config_1.default.port, () => {
            console.log(`Server running on port ${config_1.default.port}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}
main();
