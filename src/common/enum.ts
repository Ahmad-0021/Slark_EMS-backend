export enum UserRoles {
  ADMIN = 'admin',
  SUB_ADMIN = 'subAdmin',
  EMPLOYEEE = 'employee',
}
export enum EmployeePermissions {
  READ_VISITOR_CONTENT = 'read_visitor_content',
}
export enum CommonPermissions {
  // common permissions
  GET_ME = "get_me",
  UPDATE_ME = "update_me",
  DELETE_ME = "delete_me",
  UPLOAD_PROFILE_PIC = "upload_profile_pic",
  REQUEST_PASSWORD_UPDATE = "request_password_update",
  UPDATE_PASSWORD = "update_password",
  ENABLE_TWO_FACTOR_AUTHENTICATION = "enable_two_factor_authentication",
  DISABLE_TWO_FACTOR_AUTHENTICATION = "disable_two_factor_authentication",
  REQUEST_EMAIL_VERIFICATION_OTP = "request_email_verification_otp",
  VERIFY_EMAIL = "verify_email",
  REQUEST_PHONE_VERIFICATION_OTP = "request_phone_verification_otp",
  VERIFY_PHONE = "verify_phone",
}
export enum AdminPermissions {
  // user
  CREATE_USER = 'create_user',
  READ_ALL_USERS = 'read_all_users',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  BLOCK_USER = 'block_user',

  // role
  CREATE_ROLE = 'create_role',
  READ_ALL_ROLES = 'read_all_roles',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
  ASSIGN_NEW_PERMISSION_ROLE = 'assign_new_permission_role',
  CHANGE_USER_ROLE = 'change_user_role',

  // permission
  CREATE_PERMISSION = 'create_permission',
  READ_ALL_PERMISSIONS = 'read_all_permissions',
  READ_PERMISSION = 'read_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',
}
export enum SubAdminPermissions {
  READ_ALL_USERS = "read_all_users",
}
