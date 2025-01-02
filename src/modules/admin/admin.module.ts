import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, RoleModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [],
})
export class AdminModule {}
