import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  workingHoursForThisMonth?: number;

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
}
