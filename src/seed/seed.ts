import dotenv from "dotenv";
import mongoose from "mongoose";

import { Permissions } from "../enums/permissions.enum";
import { RolesEnum } from "../enums/roles.enum";
import { Permission } from "../models/permission.model";
import { Role } from "../models/role.model";
import { RolePermission } from "../models/rolePermission.model";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";

const rolePermissionsMap = {
  [RolesEnum.ADMIN]: Object.values(Permissions),

  [RolesEnum.MANAGER]: [
    Permissions.LISTING_VIEW,
    Permissions.LISTING_DELETE_ANY,
    Permissions.LISTING_VIEW_PENDING,
    Permissions.LISTING_MODERATE,
    Permissions.LISTING_CHANGE_STATUS,
    Permissions.USER_BAN,
    Permissions.BRAND_REQUEST_MODERATE,
    Permissions.STATS_VIEW,
    Permissions.PROFANITY_MANAGE,
    Permissions.VIEW_ALL_USERS,
  ],

  [RolesEnum.SELLER]: [
    Permissions.STATS_VIEW,
    Permissions.LISTING_VIEW,
    Permissions.LISTING_CREATE,
    Permissions.LISTING_EDIT_OWN,
    Permissions.LISTING_DELETE_OWN,
    Permissions.USER_CONTACT_SELLER,
    Permissions.BRAND_REQUEST_CREATE,
    Permissions.USER_UPGRADE_ACCOUNT,
  ],

  [RolesEnum.BUYER]: [
    Permissions.LISTING_VIEW,
    Permissions.USER_CONTACT_SELLER,
    Permissions.USER_UPGRADE_ACCOUNT,
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("🚀 Connected to DB");
    await Permission.deleteMany({});
    await RolePermission.deleteMany({});
    console.log("🧹 Cleaned Permissions and RolePermissions");
    const permissionDocs = await Promise.all(
      Object.values(Permissions).map((name) => Permission.create({ name })),
    );
    console.log(`✅ Created ${permissionDocs.length} permissions`);

    for (const roleName of Object.values(RolesEnum)) {
      const role = await Role.findOneAndUpdate(
        { name: roleName },
        { name: roleName },
        { upsert: true, new: true },
      );

      const requestedPermNames =
        rolePermissionsMap[roleName as RolesEnum] || [];

      const permsForThisRole = permissionDocs.filter((p) =>
        requestedPermNames.includes(p.name as Permissions),
      );

      const rolePermissionEntries = permsForThisRole.map((p) => ({
        role: role._id,
        permission: p._id,
      }));

      if (rolePermissionEntries.length > 0) {
        await RolePermission.insertMany(rolePermissionEntries);
      }

      console.log(
        `🎭 Role [${roleName}] updated with ${rolePermissionEntries.length} permissions`,
      );
    }

    console.log("✨ SEED FINISHED SUCCESSFULLY");
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
};
seed();
