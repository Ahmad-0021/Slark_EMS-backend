import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { RoleDto } from './dto/roleDto';
import { query, Response } from 'express';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(@Body() roleDto: RoleDto, @Res() res: Response) {
    return await this.roleService.createRole(roleDto, res);
  }
  @Get('all')
  async getAllRoles(@Query() query: any, @Res() res: Response) {
    return await this.roleService.getAllRoles(query, res);
  }
  @Get('single')
  async getSingleRole(@Query() query: any, @Res() res: Response) {
    return await this.roleService.getSingleRole(query, res);
  }
  @Put('update')
  async updateRole(@Query() query: any, @Res() res: Response, @Body() body) {
    return await this.roleService.roleUpdate(query, res, body);
  }
  @Delete('delete')
  async deleteRole(@Query() query: any, @Res() res: Response) {
    return await this.roleService.deleteRole(query, res);
  }
}
