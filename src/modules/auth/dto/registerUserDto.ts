import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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

  @IsString()
  @IsNotEmpty()
  type: string;

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

  @IsNotEmpty()
  // @Transform(({ value }) => {
  //   // Extracting only the date part (yyyy-mm-dd)
  //   const date = new Date(value);
  //   return date.toISOString().split('T')[0]; // 'yyyy-mm-dd' format
  // })
  @IsString()
  joiningDate?: string;
}
