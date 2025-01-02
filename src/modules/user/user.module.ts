import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { UserSeedCommand } from './seed/command';
import { UserSeederService } from './seed/userSeed';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
  ],
  controllers: [],
  providers: [UserSeedCommand, UserSeederService],
  exports: [MongooseModule],
})
export class UserModule {}
