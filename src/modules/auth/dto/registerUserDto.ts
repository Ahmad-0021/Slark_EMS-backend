import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose'; // Import this for ObjectId

export class RegisterUserDto {
  @IsString()
  @MinLength(2, { message: 'Too short username' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password must have 8 characters' })
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  basicPayForThisMonth: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  committedHoursForThisMonth: number;

  // Assuming Invoices field should be an array of ObjectIds referencing Invoice documents
  Invoices: Types.ObjectId[]; // If this is supposed to reference Invoice documents

  @IsNotEmpty()
  role: Types.ObjectId;
}
