import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../entities/user.schema'; // Ensure you're importing the User class
import { forwardRef } from '@nestjs/common';

// export const User = forwardRef(() => User);
@Schema()
export class Invoice extends Document {
  @Prop({ type: Number, required: true })
  basicPayForThisMonth: number;

  @Prop({ type: Number, required: true })
  committedHoursForThisMonth: number;

  @Prop({ type: Number, required: true })
  workingHoursForThisMonth: number;

  @Prop({ type: Number, required: false }) // Optional field
  publiceLeavesForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  publiceLeaveWorkingHourForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  paidLeavesForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  requiredTotalHoursForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  overTimeHoursForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  basicPayPerHourForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  overTimePayPerHourForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  publiceLeavesPayPerHourForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  totalBasicSalaryForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  overTimePayForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  totalPubliceLeavesPayForThisMonth?: number;

  @Prop({ type: Number, required: false }) // Optional field
  totalSalaryForThisMonth?: number;

  @Prop({
    type: String,
    default: () => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1);
      return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        currentDate,
      );
    },
  })
  month: string;

  @Prop({
    type: Number,
    default: () => {
      const currentDate = new Date();
      return currentDate.getFullYear();
    },
  })
  year: number;

  @Prop({
    type: String,
    default: () => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        year: '2-digit',
      };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
        currentDate,
      );
      return formattedDate.replace(' ', '-').toLowerCase();
    },
  })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref:User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
