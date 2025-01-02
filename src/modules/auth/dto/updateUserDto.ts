import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @MinLength(2, { message: 'Too short username' })
  username?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  committedHoursForThisMonth: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  basicPayForThisMonth: number;
  
  @IsString()
  @MinLength(8, { message: 'password must have 8 characters' })
  password?: string;

  // Assuming Invoices field should be an array of ObjectIds referencing Invoice documents
  Invoices?: Types.ObjectId[]; // If this is supposed to reference Invoice documents

  @IsEnum(['visitor', 'admin', 'user'])
  role?: 'subAdmin' | 'admin' | 'employee';
}
