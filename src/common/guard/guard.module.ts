import { forwardRef, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [forwardRef(() => RoleModule)],
  controllers: [],
  providers: [AuthGuard, AdminGuard],
  exports: [AuthGuard, AdminGuard],
})
export class GuardModule {}
