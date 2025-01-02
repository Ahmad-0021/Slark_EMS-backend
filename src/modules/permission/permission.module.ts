import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './entities/permission.schema';
import { RoleModule } from '../role/role.module';
import { SeedCommand } from './seed/command';
import { PermissionSeederService } from './seed/permission.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    forwardRef(() => RoleModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, SeedCommand, PermissionSeederService],
  exports: [MongooseModule],
})
export class PermissionModule {}
