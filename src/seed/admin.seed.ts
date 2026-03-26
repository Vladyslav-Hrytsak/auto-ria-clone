import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { passwordService } from "../services/password.service";

export const adminSeed = async () => {
  try {
    console.log("🌱 Start seeding...");

    // --- ROLES ---
    let adminRole = await Role.findOne({ name: "admin" });
    let userRole = await Role.findOne({ name: "user" });

    if (!adminRole) {
      adminRole = await Role.create({ name: "admin" });
      console.log("✅ Admin role created");
    }

    if (!userRole) {
      userRole = await Role.create({ name: "user" });
      console.log("✅ User role created");
    }

    // --- ADMIN USER ---
    const adminEmail = "admin@gmail.com";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await passwordService.hash("123456");

      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        phone: "+380000000000",
        roles: [adminRole._id],
      });

      console.log("✅ Admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    console.log("🌱 Seed finished");
  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};
