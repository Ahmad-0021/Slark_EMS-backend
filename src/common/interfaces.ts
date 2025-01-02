import { Types } from 'mongoose';
import { UserRoles } from '../common/enum';

export interface IPermissions {
  id: string;
  name: string;
  description: string;
}

export interface IRoles {
  id: string;
  name: UserRoles;
  permissions: IPermissions[];
}

export interface IUser {
  id: string;
}

export interface IUserDoc extends IUser, Document {
  password: string;
}
