import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUserDto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ) {
    return await this.authService.registerUser(registerUserDto, res);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    return await this.authService.loginUser(loginUserDto, res);
  }
}
