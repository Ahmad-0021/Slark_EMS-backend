import { Injectable } from '@nestjs/common';
import { Permission } from 'src/modules/permission/entities/permission.schema';
import { Role } from '../entities/role.schema';
import {
  CommonPermissions,
  EmployeePermissions,
  SubAdminPermissions,
  UserRoles,
} from '../../../common/enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleSeederService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}
  async seedRoles() {
    try {
      const permissions = await this.permissionModel.find({});

      if (permissions.length === 0) {
        console.log('Please seed permissions first');
        return;
      }

      const permissionMap = permissions.reduce(
        (map, perm) => {
          map[perm.name] = perm._id;
          return map;
        },
        {} as { [key: string]: any },
      );

      const roles = [
        { name: UserRoles.ADMIN, permissions: Object.values(permissionMap) },
        {
          name: UserRoles.SUB_ADMIN,
          permissions: Object.values(SubAdminPermissions).map(
            (perm) => permissionMap[perm],
          ),
        },
        {
          name: UserRoles.EMPLOYEEE,
          permissions: Object.values(EmployeePermissions).map(
            (perm) => permissionMap[perm],
          ),
        },
      ];

      console.log('Seeding roles...');

      await Promise.all(
        roles.map((role) =>
          this.roleModel.findOneAndUpdate(
            { name: role.name },
            { name: role.name, permissions: role.permissions },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          ),
        ),
      );

      console.log('Roles seeded!');
    } catch (err) {
      console.error(err);
      throw new Error('Something went wrong while seeding roles');
    }
  }
}
