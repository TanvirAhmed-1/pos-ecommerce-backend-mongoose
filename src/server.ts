
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { seedDatabase } from "./app/seed";

async function main() {
  try {
    await mongoose.connect(config.database.url as string);
    console.log("MongoDB connected successfully");

    // Automatically seed super admin and Bangladesh locations if not present
    await seedDatabase();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

main();