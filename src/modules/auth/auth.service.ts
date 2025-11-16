import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenPayload } from '../../common/interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

    const accessToken = this.jwtService.sign(payload);

    return {
      user: sanitizedUser,
      accessToken,
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

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return this.usersService.sanitize(user);
  }
}

