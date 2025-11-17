import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenPayload } from '../../common/interface/token-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: JwtSignOptions['expiresIn'];
  private readonly refreshExpiresIn: JwtSignOptions['expiresIn'];

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET') ||
      'yourSecretKey-quickpos';

    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      `${this.accessSecret}-refresh`;

    this.accessExpiresIn = this.resolveExpiration(
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      '15m',
    );

    this.refreshExpiresIn = this.resolveExpiration(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      '7d',
    );
  }

  private resolveExpiration(
    value: string | undefined,
    fallback: JwtSignOptions['expiresIn'],
  ): JwtSignOptions['expiresIn'] {
    if (!value) {
      return fallback;
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }

    return value as JwtSignOptions['expiresIn'];
  }

  async register(registerDto: RegisterAuthDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    return this.usersService.create(registerDto);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return this.usersService.sanitize(user);
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const sanitizedUser = this.usersService.sanitize(user);
    
    const userDoc = user as any;
    const userId = userDoc._id ? String(userDoc._id) : userDoc.id;
    const payload: TokenPayload = {
      sub: userId,
      email: user.email,
      nom: `${user.firstName} ${user.lastName}`,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
    });

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (resetPasswordDto.newPassword === resetPasswordDto.email) {
      throw new BadRequestException('Password cannot match email address.');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    const updatedUser = await this.usersService.updatePasswordByEmail(
      resetPasswordDto.email,
      hashedPassword,
    );

    if (!updatedUser) {
      throw new NotFoundException('Unable to reset password.');
    }

    return { message: 'Password reset successfully.' };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.refreshSecret,
      });

      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          nom: payload.nom,
        },
        {
          secret: this.accessSecret,
          expiresIn: this.accessExpiresIn,
        }
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.usersService.sanitize(user);
  }
}

