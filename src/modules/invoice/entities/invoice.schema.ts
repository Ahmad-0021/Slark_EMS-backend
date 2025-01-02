import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/entities/user.schema';

@Schema()
export class Invoice extends Document {
  @Prop({ type: Number, required: true })
  basicPayForThisMonth: number;

  @Prop({ type: Number, required: true })
  committedHoursForThisMonth: number;

  @Prop({ type: Number, required: true })
  workingHoursForThisMonth: number;

  @Prop({ type: Number, default: 0 }) // Optional field with default value
  publiceLeavesForThisMonth?: number;

  @Prop({ type: Number, default: 0 }) // Optional field with default value
  publiceLeaveWorkingHourForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  paidLeavesForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  requiredTotalHoursForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  basicPay?: number;

  @Prop({ type: Number, default: 0 })
  basicPayPerHourForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  overTimeHoursForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  overTimePayPerHourForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  overTimePayForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  publiceLeavesPayPerHourForThisMonth?: number;

  @Prop({ type: Number, default: 0 })
  totalPubliceLeavesPayForThisMonth?: number;

  // Additional fields omitted for brevity...

  @Prop({
    type: String,
    default: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    },
  })
  month: string;

  @Prop({
    type: Number,
    default: new Date().getFullYear(),
  })
  year: number;

  @Prop({
    type: String,
    default: () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        year: '2-digit',
      };
      return new Intl.DateTimeFormat('en-US', options)
        .format(date)
        .replace(' ', '-')
        .toLowerCase();
    },
  })
  slug: string;
  @Prop({ type: Number, default: 0 })
  totalSalaryForThisMonth: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
