import { Role } from '../modules/role/entities/role.schema';

export const transformObject = (role: any) => {
  const roleObject = role.toObject(); // Convert Mongoose document to plain object
  const { _id, ...rest } = roleObject; // Remove _id
  return {
    ...rest,
    id: _id, // Rename _id to id
  };
};

export const transformArray = (arr: any[]) => {
  return arr.map((role: any) => {
    const RoleObject = role.toObject(); // Convert Mongoose document to plain object
    const { _id, ...rest } = RoleObject; // Destructure to remove _id
    return {
      ...rest,
      id: _id, // Rename _id to id
    };
  });
};

export const transformInvoice = (invoice: any) => {
  const invoiceObject = invoice.toObject(); // Convert Mongoose document to plain object
  const { _id, ...rest } = invoiceObject; // Destructure to remove _id
  return {
    ...rest,
    id: _id, // Rename _id to id
  };
};
