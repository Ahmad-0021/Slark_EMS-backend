import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { RegisterUserDto } from '../auth/dto/registerUserDto';
import { UpdateUserDto } from '../auth/dto/updateUserDto';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('all-users')
  async getAllUser(@Query() query: any, @Res() res: Response) {
    return await this.adminService.findAllUser(query, res);
  }
  @Get('user')
  async getSingleUSerUser(@Query() query: any, @Res() res: Response) {
    return await this.adminService.getSingleUser(query, res);
  }
  @Delete('user')
  async deleteUser(@Query() query: any, @Res() res: Response) {
    return await this.adminService.deleteUser(query, res);
  }
  @Post('register-user')
  async createUser(@Body() dto: RegisterUserDto, @Res() res: Response) {
    return await this.adminService.createUser(dto, res);
  }
  @Put('user')
  async updateUser(
    @Query() query: any,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return await this.adminService.updateUser(query, dto, res);
  }
}
