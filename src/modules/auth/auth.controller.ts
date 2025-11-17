import { Body, Controller, Post, Res, Req, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Response, Request } from 'express';
import type { TokenPayload } from 'src/common/interface/token-payload.interface';

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
    const { accessToken,refreshToken,  user } =
      await this.authService.login(loginDto);

    res
      .cookie(process.env.COOKIE_NAME || '', accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as any,
        maxAge: 10* 1000,
      })
      .cookie(process.env.COOKIE_REFRESH_NAME || '', refreshToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as any,
        maxAge: 10 * 1000,
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
      .clearCookie(process.env.COOKIE_REFRESH_NAME || '', {
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

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshCookieName = process.env.COOKIE_REFRESH_NAME ?? '';
    const token = req.cookies?.[refreshCookieName];
    if (!token) throw new UnauthorizedException('No refresh token');

    const { accessToken } = await this.authService.refresh(token);
    res
      .cookie(process.env.COOKIE_NAME || '', accessToken, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as any,
        maxAge: 60 * 60 * 1000,
      })
      .json({ message: 'Access token refreshed' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getCurrentUser(@CurrentUser() user: TokenPayload) {
    return this.authService.getCurrentUser(user.sub);
  }
}

