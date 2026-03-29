export enum Permissions {
  // listings
  LISTING_VIEW = "listing_view",
  LISTING_CREATE = "listing_create",
  LISTING_EDIT_OWN = "listing_edit_own",
  LISTING_DELETE_OWN = "listing_delete_own",

  LISTING_DELETE_ANY = "listing_delete_any",
  LISTING_VIEW_PENDING = "listing_view_pending",
  LISTING_MODERATE = "listing_moderate",
  LISTING_CHANGE_STATUS = "listing_change_status",

  // brand
  BRAND_REQUEST_CREATE = "brand_request_create",
  BRAND_REQUEST_MODERATE = "brand_request_moderate",

  // users
  USER_CONTACT_SELLER = "user_contact_seller",
  USER_UPGRADE_ACCOUNT = "user_upgrade_account",
  USER_CHANGE_ACCOUNT_TYPE_ANY = "user_change_account_type_any",
  USER_BAN = "user_ban",
  VIEW_ALL_USERS = "view_all_users",

  // stats
  STATS_VIEW = "stats_view",

  // system
  ROLE_MANAGE = "role_manage",
  PROFANITY_MANAGE = "profanity_manage",
}
