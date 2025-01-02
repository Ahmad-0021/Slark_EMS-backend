import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateInvoiceDto {
  // @IsNumber()
  // @IsNotEmpty()
  // @Type(() => Number)
  // basicPayForThisMonth: number;

  // @IsNumber()
  // @IsNotEmpty()
  // @Type(() => Number)
  // committedHoursForThisMonth: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  workingHoursForThisMonth: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  publiceLeavesForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  publiceLeaveWorkingHourForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  paidLeavesForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  requiredTotalHoursForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  overTimeHoursForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  basicPayPerHourForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  overTimePayPerHourForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  publiceLeavesPayPerHourForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBasicSalaryForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  overTimePayForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalPubliceLeavesPayForThisMonth?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalSalaryForThisMonth?: number;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsString()
  slug?: string;
}
