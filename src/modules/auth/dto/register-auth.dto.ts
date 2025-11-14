import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Company' })
  @IsString()
  company: string;

  @ApiProperty({ example: '+33123456789' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'secret123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

