import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { Invoice, InvoiceSchema } from './entities/invoice.schema';
import { Role, RoleSchema } from '../role/entities/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
