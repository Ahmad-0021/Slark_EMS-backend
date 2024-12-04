import { Module } from '@nestjs/common';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [GuardModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
