import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/registerUserDto';
import { comparePassword, hashPassword } from './utils/hashedPassword';
import { Response } from 'express';
import { IUser, JwtService } from './jwt/jwt.service';
import { LoginDto } from './dto/loginUserDto';
import { Role } from '../role/entities/role.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly jwt: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, res: Response) {
    try {
      // Check if user already exists
      const existUser = await this.userModel.findOne({
        $or: [
          { email: registerUserDto.email },
          { username: registerUserDto.username },
        ],
      });

      if (existUser) {
        // Return response without crashing
        return res.status(HttpStatus.CONFLICT).json({
          message: 'User already exists',
          success: false,
        });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(registerUserDto.password);
      const newUser = await this.userModel.create({
        ...registerUserDto,
        password: hashedPassword,
      });

      // Ensure role is set correctly
      if (!newUser.role) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'User role is not set',
          success: false,
        });
      }

      // Generate JWT token
      const tokenPayload: IUser = {
        username: newUser.username,
        basicPayForThisMonth: newUser.basicPayForThisMonth,
        committedHoursForThisMonth: newUser.committedHoursForThisMonth,
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role.toString(),
      };
      const genToken = this.jwt.generateToken(tokenPayload);

      // Send response
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        success: true,
        data: { token: genToken },
      });
    } catch (error) {
      console.error('Error during registration:', error.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An unexpected error occurred',
        success: false,
      });
    }
  }

  async loginUser(loginUserDto: LoginDto, res: Response, req: Request) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userModel.findOne({
        email: email,
      });
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid credentials',
          success: false,
        });
      }

      const verifyPassword = await comparePassword(password, user.password);
      if (!verifyPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid credentials',
          success: false,
        });
      }

      // const origin = req.headers.origin || req.headers.referrer;
      const origin = req.headers['origin'] || 'Unknown Origin';
      if (origin === process.env.ADMIN_PORTAL_URL) {
        const role = await this.roleModel.findOne({ _id: user.role });
        if (role.name !== 'admin') {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: 'Invalid credentials',
            success: false,
          });
        }
      }
      const tokenPayload: IUser = {
        username: user.username,
        basicPayForThisMonth: user.basicPayForThisMonth,
        committedHoursForThisMonth: user.committedHoursForThisMonth,
        id: user._id.toString(),
        email: user.email,
        role: user.role._id.toString(),
      };
      const token = this.jwt.generateToken(tokenPayload);

      return res.status(HttpStatus.OK).json({
        message: 'LoggedIn successfully ',
        success: true,
        token,
        role: user.role,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
}
