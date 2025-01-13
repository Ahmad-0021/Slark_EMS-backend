import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Too short username' })
  username?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  committedHoursForThisMonth: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  basicPayForThisMonth: number;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'password must have 8 characters' })
  password?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsOptional() // Assuming Invoices field should be an array of ObjectIds referencing Invoice documents
  Invoices?: Types.ObjectId[]; // If this is supposed to reference Invoice documents
  @IsOptional()
  role?: Types.ObjectId;
}
