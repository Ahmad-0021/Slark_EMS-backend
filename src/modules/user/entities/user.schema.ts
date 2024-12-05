import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export const MODEL_NAMES = {
  Invoice: 'Invoice',
  Role: 'Role',
};

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [{ type: { type: Types.ObjectId, ref: 'Invoice' } }],
  })
  invoices: { type: Types.ObjectId; ref: 'Invoice' }[];
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
