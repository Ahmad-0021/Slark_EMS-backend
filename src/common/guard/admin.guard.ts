import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/modules/role/entities/role.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor( @InjectModel(Role.name) private readonly roleModel: Model<Role>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract request and user
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied. User role is missing.');
    }
    console.log(user,'admin')

    // Fetch role details from the database
    const role = await this.roleModel.findById(user.role);
    console.log(role)

    // Check if user exists and has the 'admin' role
    if (role && role.name === 'admin') {
      return true;
    }

    throw new ForbiddenException('Access denied. Admins only.');
  }
}
