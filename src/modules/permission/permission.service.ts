import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './entities/permission.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/permssionDto';
import { Response } from 'express';
import { transformArray, transformObject } from 'src/common/transform.object';
import { AdminPermissions, EmployeePermissions } from 'src/common/enum';
import { Role } from '../role/entities/role.schema';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async createPermission(permissionDto: CreatePermissionDto, res: Response) {
    try {
      const permission = await this.permissionModel.create(permissionDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'permission created successfully',
        success: true,
        data: { permission },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getAllPermissions(query: any, res: Response) {
    try {
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;
      const skip = (page - 1) * limit;

      if (page <= 0 || limit <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid page or limit value',
          success: 'false',
        });
      }
      const countPermissions = await this.permissionModel.countDocuments();
      const permissions = await this.permissionModel
        .find()
        .skip(skip)
        .limit(limit);
      if (permissions.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'no permission found',
          success: false,
        });
      }
      const transformPermissions = transformArray(permissions);
      return res.status(HttpStatus.CREATED).json({
        message: 'successfully retrived permissions array',
        success: true,
        data: { countPermissions, transformPermissions },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getOnePermission(query: any, res: Response) {
    try {
      const { id } = query;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Permissin id is required',
          success: false,
        });
      }
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'permission is not found',
          success: false,
        });
      }
      const updatePermission = transformObject(permission);
      return res.status(HttpStatus.OK).json({
        message: 'permission got successfully',
        success: true,
        data: { updatePermission },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }

  async updatePermission(query: any, res: Response, dto: CreatePermissionDto) {
    try {
      const { id } = query;
      if (!id || !mongoose.Types.ObjectId.isValid(id.toString())) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'permission id is required and must be a valid mongoose id',
          success: false,
        });
      }
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'permission not found',
          success: false,
        });
      }
      const seedPermissions = [
        ...Object.values(EmployeePermissions),
        ...Object.values(AdminPermissions),
      ];
      if (
        seedPermissions.includes(
          permission.name as EmployeePermissions | AdminPermissions,
        )
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `cannot modify ${permission.name}'s permission `,
          success: false,
        });
      }
      if (dto.name !== permission.name) {
        const existPermission = await this.permissionModel.findOne({
          name: dto.name,
        });
        if (existPermission) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'permission name already exists',
            success: false,
          });
        }
      }
      permission.name = dto.name;
      permission.description = dto.description;
      await permission.save();
      const update_permission = transformObject(permission);
      return res.status(HttpStatus.OK).json({
        message: 'permission updated successfully',
        success: true,
        data: { update_permission },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async deletePermission(query: any, res: Response) {
    try {
      const { id, name } = query;
      if (!id && !name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'id or name is required',
          success: false,
        });
      }
      const permission = await this.permissionModel.findOne({
        $or: [{ name: name }, { _id: id }],
      });
      if (!permission) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'permission not found',
          success: false,
        });
      }
      const seedPermissions = [
        ...Object.values(AdminPermissions),
        ...Object.values(EmployeePermissions),
      ];
      if (
        seedPermissions.includes(
          permission.name as AdminPermissions | EmployeePermissions,
        )
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `you cannot delete this ${permission.name}`,
          success: false,
        });
      }
      const roleCount = await this.roleModel.countDocuments({
        permissions: permission._id,
      });
      if (roleCount > 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'permission is assigned to more than one role',
          success: false,
        });
      }
      await permission.deleteOne();
      return res.status(HttpStatus.OK).json({
        message: 'permission deleted successfully',
        success: true,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
}
