import { forwardRef, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.schema';
import { PermissionModule } from '../permission/permission.module';
import { RoleSeederService } from './seed/roleSeed';
import { SeedCommand } from './seed/command';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    forwardRef(() => PermissionModule), 
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleSeederService, SeedCommand],
  exports: [MongooseModule],
})
export class RoleModule {}
