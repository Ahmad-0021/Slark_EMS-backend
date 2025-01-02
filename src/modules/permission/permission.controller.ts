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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/permssionDto';
import { query, Response } from 'express';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Post()
  async createPermission(
    @Body() permissionDto: CreatePermissionDto,
    @Res() res: Response,
  ) {
    return await this.permissionService.createPermission(permissionDto, res);
  }
  @Get('get-all')
  async getAllPermissions(@Query() query: any, @Res() res: Response) {
    return await this.permissionService.getAllPermissions(query, res);
  }
  @Get('get-one')
  async getOnePermission(@Query() query: any, @Res() res: Response) {
    return await this.permissionService.getOnePermission(query, res);
  }
  @Put()
  async updatePermission(
    @Query() query: any,
    @Res() res: Response,
    @Body() dto: CreatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(query, res, dto);
  }

  @Delete()
  async deletePermission(@Query() query: any, @Res() res: Response) {
    return await this.permissionService.deletePermission(query, res);
  }
}
