import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './entities/role.schema';
import mongoose, { Model } from 'mongoose';
import { RoleDto } from './dto/roleDto';
import { Request, Response } from 'express';
import { transformObject, transformArray } from '../../common/transform.object';
import { UserRoles } from 'src/common/enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}
  async createRole(roleDto: RoleDto, res: Response) {
    try {
      const { name } = roleDto;
      if (!name) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Role details are required', success: false });
      }
      const role = await this.roleModel.create({ name });
      await role.save();
      const transformRole = transformObject(role);

      return res.status(HttpStatus.CREATED).json({
        message: 'Role created successfully',
        success: true,
        data: { transformRole },
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, success: false });
    }
  }
  async getAllRoles(query: any, res: Response) {
    try {
      const pages = parseInt(query.page as string) || 1;
      const limits = parseInt(query.limit as string) || 10;
      const skip = (pages - 1) * 10;
      if (pages <= 0 || limits <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid page or limit value',
          success: false,
        });
      }
      const totalCount = await this.roleModel.countDocuments();
      const roles = await this.roleModel
        .find()
        // .populate('permissions')
        .skip(skip)
        .limit(limits);

      if (roles.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'no role found',
          success: false,
        });
      }
      const updateRole = transformArray(roles);

      return res.status(HttpStatus.OK).json({
        message: 'Successfully retrived roles',
        success: true,
        data: { totalCount, updateRole },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getSingleRole(query: any, res: Response) {
    try {
      const role = await this.roleModel.findById(query.id);
      if (!role) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Role not found',
          success: false,
        });
      }
      const transformRole = transformObject(role);
      return res.status(HttpStatus.OK).json({
        message: 'Successfully retrived role',
        success: true,
        data: { transformRole },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async roleUpdate(query: any, res: Response, body) {
    try {
      const { id } = query;
      const { name } = body;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'role id is required',
          success: false,
        });
      }
      if (!name || typeof name !== 'string') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'role name is required',
          success: false,
        });
      }
      const role = await this.roleModel.findById(id);

      if (!role) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'role not found ',
          success: false,
        });
      }
      const protectedRoles = [UserRoles.ADMIN, UserRoles.SUB_ADMIN];
      if (protectedRoles.includes(role?.name as UserRoles)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `the role ${role.name} can't be updated`,
          success: false,
        });
      }
      if (name !== role.name) {
        const existROle = await this.roleModel.findOne({ name });
        if (existROle) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'role already exist ',
            success: false,
          });
        }
      }
      role.name = name;
      await role.save();
      const transformRole = transformObject(role);
      return res.status(HttpStatus.OK).json({
        message: 'role updated successfully ',
        success: true,
        data: { transformRole },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async deleteRole(query: any, res: Response) {
    try {
      const { id, name } = query;
      if (!name && !id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: ' name or id is required',
          success: false,
        });
      }
      const role = await this.roleModel.findOne({
        $or: [{ _id: id }, { name }],
      });
      console.log(role);
      if (!role) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'role not found ',
          success: false,
        });
      }
      const protectedRoles = [UserRoles.SUB_ADMIN, UserRoles.ADMIN];
      if (protectedRoles.includes(role?.name as UserRoles)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `role ${role.name} can't be deleted`,
          success: false,
        });
      }
      const userCount = await this.roleModel.countDocuments({
        name: role.name,
      });

      if (userCount > 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `the role ${role.name} is assigned to ${userCount} user's and can't be deleted`,
          success: false,
        });
      }
      await role.deleteOne();
      return res.status(HttpStatus.OK).json({
        message: 'role deleted successfully',
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
