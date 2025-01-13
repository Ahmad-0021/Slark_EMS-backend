import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/modules/role/entities/role.schema';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  username: string;
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String, required: true })
  type: string;
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Invoice' }],
  })
  invoices: Types.ObjectId[];
  @Prop({ type: Number, required: true })
  basicPayForThisMonth: number;
  @Prop({ type: Number, required: true })
  committedHoursForThisMonth: number;
  @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
