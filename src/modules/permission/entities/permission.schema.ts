import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;
  @Prop({ type: String })
  description?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
