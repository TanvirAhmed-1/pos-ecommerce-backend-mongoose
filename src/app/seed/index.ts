import bcrypt from "bcrypt";
import { UserModel } from "../modules/user/user.model";
import config from "../config";

export const seedSuperAdmin = async () => {
  try {
    // 1. Check if superadmin already exists (by email or role)
    const superAdminExists = await UserModel.findOne({ email: config.superAdmin.email });
    
    if (!superAdminExists) {
      const saltRounds = config.bcrypt.saltRounds || 10;
      const hashedPassword = await bcrypt.hash(config.superAdmin.password, saltRounds);

      await UserModel.create({
        name: config.superAdmin.name,
        email: config.superAdmin.email,
        password: hashedPassword,
        phone: config.superAdmin.phone,
        role: "superadmin",
        status: "active",
      });

      console.log(`✅ Super Admin account seeded successfully (${config.superAdmin.email})`);
    } else {
      console.log("ℹ️ Super Admin account already exists. Skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Failed to seed Super Admin:", error);
  }
};
