import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.schema';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/registerUserDto';
import { comparePassword, hashPassword } from './utils/hashedPassword';
import { Response } from 'express';
import { IUser, JwtService } from './jwt/jwt.service';
import { LoginDto } from './dto/loginUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

  async loginUser(loginUserDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginUserDto;

      const user = await this.userModel.findOne({
        email: email,
      });
      const verifyPassword = await comparePassword(password, user.password);
      if (!user || !verifyPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid credentials',
          success: false,
        });
      }
      const tokenPayload: IUser = {
        username: user.username,
        basicPayForThisMonth: user.basicPayForThisMonth,
        committedHoursForThisMonth: user.committedHoursForThisMonth,
        id: user._id.toString(),
        email: user.email,
        role: user.role.toString(),
      };
      const token = this.jwt.generateToken(tokenPayload);

      return res.status(HttpStatus.OK).json({
        message: 'LoggedIn successfully ',
        success: true,
        token,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        success: false,
      });
    }
  }
}
