// import express, { Application } from "express";
// import cors from "cors";
// import config from "./app/config";
// import { BaseRouter } from "./app/routers";
// import globalErrorHandler from "./app/middlewares/globalErrorHandler";
// import notFound from "./app/middlewares/notFound";
// import mongoose from "mongoose";

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
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function main() {
  try {
    await mongoose.connect(config.database.url as string);
    console.log("✅ MongoDB connected successfully");

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}

main();