import dotenv from "dotenv";
import mongoose from "mongoose";

import { Permission } from "../models/permission.model";
import { Role } from "../models/role.model";
import { RolePermission } from "../models/rolePermission.model";
import { permissions, roles } from "./data";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";

export const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Mongo for seeding");

    // Create permissions
    for (const permissionName of permissions) {
      const exists = await Permission.findOne({ name: permissionName });

      if (!exists) {
        await Permission.create({ name: permissionName });
        console.log(`Permission created: ${permissionName}`);
      }
    }

    // Create roles
    for (const roleName of roles) {
      const exists = await Role.findOne({ name: roleName });

      if (!exists) {
        await Role.create({ name: roleName });
        console.log(`Role created: ${roleName}`);
      }
    }

    const allRoles = await Role.find();
    const allPermissions = await Permission.find();

    for (const role of allRoles) {
      for (const permission of allPermissions) {
        const rolePermissionExists = await RolePermission.findOne({
          role: role._id,
          permission: permission._id,
        });

        if (rolePermissionExists) continue;

        // ADMIN — всё
        if (role.name === "admin") {
          await RolePermission.create({
            role: role._id,
            permission: permission._id,
          });
        }

        // MANAGER
        if (
          role.name === "manager" &&
          ["view_ad", "delete_any_ad", "ban_user", "view_stats"].includes(
            permission.name,
          )
        ) {
          await RolePermission.create({
            role: role._id,
            permission: permission._id,
          });
        }

        // SELLER
        if (
          role.name === "seller" &&
          [
            "view_ad",
            "contact_seller",
            "create_ad",
            "edit_own_ad",
            "delete_own_ad",
          ].includes(permission.name)
        ) {
          await RolePermission.create({
            role: role._id,
            permission: permission._id,
          });
        }

        // BUYER
        if (
          role.name === "buyer" &&
          ["view_ad", "contact_seller"].includes(permission.name)
        ) {
          await RolePermission.create({
            role: role._id,
            permission: permission._id,
          });
        }
      }
    }

    console.log("Seeding completed");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
