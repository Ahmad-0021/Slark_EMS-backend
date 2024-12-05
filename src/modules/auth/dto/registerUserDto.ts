import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
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

  // Assuming Invoices field should be an array of ObjectIds referencing Invoice documents
  Invoices: Types.ObjectId[]; // If this is supposed to reference Invoice documents

  @IsEnum(['visitor', 'admin', 'user'])
  @IsNotEmpty()
  role: 'subAdmin' | 'admin' | 'employee';
}
