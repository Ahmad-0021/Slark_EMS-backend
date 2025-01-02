import { Injectable } from '@nestjs/common';
import {
  EmployeePermissions,
  AdminPermissions,
  SubAdminPermissions,
  CommonPermissions,
} from '../../../common/enum';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from '../entities/permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionSeederService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}
  async seedPermissions() {
    try {
      const permissions = [
        ...Object.values(CommonPermissions),
        ...Object.values(EmployeePermissions),
        ...Object.values(SubAdminPermissions),
        ...Object.values(AdminPermissions),
      ];

      console.log('Seeding permissions...');

      await Promise.all(
        permissions.map(async (permission) => {
          await this.permissionModel.findOneAndUpdate(
            { name: permission },
            {
              name: permission,
              description: `can ${permission.replace(/_/g, ' ')}`,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }),
      );

      console.log('Permissions seeded!');
    } catch (err) {
      console.error('Error seeding permissions:', err);
      throw new Error('Something went wrong while seeding permissions');
    }
  }
}
