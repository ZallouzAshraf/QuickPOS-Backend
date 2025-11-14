import { Body, Controller, Post, Res, Req, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { Response, Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginAuthDto, @Res() res: Response) {
    const { accessToken, user } =
      await this.authService.login(loginDto);

    res
      .cookie(process.env.COOKIE_NAME || '', accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as any,
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: 'Logged in successfully', user });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  logout(@Res() res: Response) {
    res
      .clearCookie(process.env.COOKIE_NAME || '', {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as any,
      })
      .json({ message: 'Logged out successfully' });
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

