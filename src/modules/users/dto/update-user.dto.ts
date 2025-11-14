import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import {  UserStatus } from '../users.schema';

class CreateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Company' })
  @IsEmail()
  company: string;

  @ApiProperty({ example: '+33123456789' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ minLength: 6, example: 'secret123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;


  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;

}


export class UpdateUserDto extends PartialType(CreateUserDto) {}

