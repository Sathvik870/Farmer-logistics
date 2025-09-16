import { Controller, Post, Body, HttpCode, HttpStatus , Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import type { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto , @Res({ passthrough: true }) res: Response,) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    const tokenData = await this.authService.login(user); 
    res.cookie('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600000,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
    };
  }
  
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}