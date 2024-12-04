import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
