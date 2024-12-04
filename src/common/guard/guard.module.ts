import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [],
  providers: [AuthGuard],
  exports: [],
})
export class GuardModule {}
