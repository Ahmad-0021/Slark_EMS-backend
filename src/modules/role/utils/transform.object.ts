import { Role } from '../entities/role.schema';

export const transformObject = (role: any) => {
  const roleObject = role.toObject(); // Convert Mongoose document to plain object
  const { _id, ...rest } = roleObject; // Remove _id
  return {
    ...rest,
    id: _id, // Rename _id to id
  };
};

export const transformRole = (roles: Role[]) => {
  return roles.map((role: any) => {
    const RoleObject = role.toObject(); // Convert Mongoose document to plain object
    const { _id, ...rest } = RoleObject; // Destructure to remove _id
    return {
      ...rest,
      id: _id, // Rename _id to id
    };
  });
};
