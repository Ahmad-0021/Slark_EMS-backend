import { Module } from '@nestjs/common';
import { GuardModule } from './guard/guard.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [GuardModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
