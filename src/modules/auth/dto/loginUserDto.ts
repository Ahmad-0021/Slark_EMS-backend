import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class LoginDto {


  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  fromAdminPanel: boolean = false;
}
