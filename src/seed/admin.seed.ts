import mongoose from "mongoose";

import { config } from "../config/configs";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { passwordService } from "../services/password.service";

async function adminSeed() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Connected to MongoDB...");

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      throw new Error("Role 'admin' not found. Please run role seed first.");
    }

    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await passwordService.hash("123456");

      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        phone: "+380958991590",
        roles: [adminRole._id],
      });

      console.log("✅ Admin created successfully with hashed password!");
    } else {
      console.log("ℹ️ Admin already exists in database.");
    }
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

adminSeed();
