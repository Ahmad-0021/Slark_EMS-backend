import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.schema';
import { Model } from 'mongoose';
import { Response } from 'express';
import { transformArray, transformObject } from 'src/common/transform.object';
import { RegisterUserDto } from '../auth/dto/registerUserDto';
import { Role } from '../role/entities/role.schema';
import { hashPassword } from '../auth/utils/hashedPassword';
import { UpdateUserDto } from '../auth/dto/updateUserDto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async findAllUser(query: any, res: Response) {
    try {
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 10;

      if (page < 1 || limit < 1) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid parameters page and limit for pagination',
          success: false,
        });
      }
      const skip = (page - 1) * limit;
      const totalCount = await this.userModel.countDocuments();
      const users = await this.userModel
        .find()
        .populate('role')
        .skip(skip)
        .limit(limit)
        .select('-password -__v');

      if (!users || users.length === 0) {
        return res.status(HttpStatus.OK).json({
          message: 'No user record found',
          success: false,
          data: [],
        });
      }
      const totalPages = Math.ceil(totalCount / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const paginationInfo = {
        currentPage: page,
        totalPages,
        totalRecords: totalCount,
        hasNextPage,
        hasPrevPage,
      };
      const updateUserArr = transformArray(users);
      return res.status(HttpStatus.OK).json({
        message: 'User records retrieved successfully',
        success: true,
        data: { users: updateUserArr, pagination: paginationInfo },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async getSingleUser(query: any, res: Response) {
    try {
      const { id } = query;

      // Validate if `id` is provided
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User ID is required',
          success: false,
        });
      }

      // Find user and populate the role field
      const user = await this.userModel
        .findById(id)
        .select('-password -__v')
        .populate('role')
        .populate('invoices');

      // Check if user exists
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }

      // Transform user object if needed
      const updateUser = transformObject(user);

      // Return success response
      return res.status(HttpStatus.OK).json({
        message: 'User retrieved successfully',
        success: true,
        data: { user: updateUser },
      });
    } catch (error) {
      // Handle errors
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async deleteUser(query: any, res: Response) {
    try {
      const { id } = query;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User ID is required',
          success: false,
        });
      }
      const user = await this.userModel.findOneAndDelete({ _id: id });

      // Check if user exists
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }
      const updateUser = transformObject(user);
      return res.status(HttpStatus.OK).json({
        message: 'user deleted successfully',
        success: true,
        data: { user: updateUser },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async createUser(dto: RegisterUserDto, res: Response) {
    try {
      const {
        username,
        email,
        password,
        role,
        basicPayForThisMonth,
        committedHoursForThisMonth,
        type,
      } = dto;
      const existsRole = await this.roleModel.findOne({ name: role });
      if (!existsRole) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid role',
          success: false,
        });
      }
      const hashedpassword = await hashPassword(password);
      const newUser = await this.userModel.create({
        username,
        email,
        type,
        password: hashedpassword,
        role: existsRole._id,
        committedHoursForThisMonth: committedHoursForThisMonth,
        basicPayForThisMonth: basicPayForThisMonth,
      });
      await newUser.save();
      const updateUser = transformObject(newUser);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        success: true,
        user: updateUser,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
  async updateUser(query: any, dto: UpdateUserDto, res: Response) {
    try {
      const { id } = query;
      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User ID is required',
          success: false,
        });
      }

      const user = await this.userModel
        .findOneAndUpdate({ _id: id }, { ...dto }, { new: true })
        .select('-password -__v');

      // Check if user exists
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
          success: false,
        });
      }
      const updateUser = transformObject(user);
      return res.status(HttpStatus.OK).json({
        message: 'user updated successfully',
        success: true,
        data: { user: updateUser },
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, success: false });
    }
  }
}
