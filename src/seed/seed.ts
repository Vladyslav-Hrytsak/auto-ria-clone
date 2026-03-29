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
  await mongoose.connect(MONGO_URL);

  console.log("Connected to DB");

  await Permission.deleteMany({});
  await RolePermission.deleteMany({});

  for (const perm of Object.values(Permissions)) {
    await Permission.create({ name: perm });
  }

  for (const roleName of Object.values(RolesEnum)) {
    let role = await Role.findOne({ name: roleName });

    if (!role) {
      role = await Role.create({ name: roleName });
    }

    const perms = rolePermissionsMap[roleName];

    for (const permName of perms) {
      const perm = await Permission.findOne({ name: permName });

      await RolePermission.create({
        role: role._id,
        permission: perm!._id,
      });
    }
  }

  console.log("SEED FINISHED");

  await mongoose.disconnect();
};

seed();
