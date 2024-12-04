import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.schema';
import { Invoice, InvoiceSchema } from '../user/entities/invoice.schema';
import { Role, RoleSchema } from '../role/entities/role.schema';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
