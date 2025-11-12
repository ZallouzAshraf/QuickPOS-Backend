import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLicenseDto {
  @ApiProperty({ example: 'QP-XXXX-XXXX-XXXX' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ example: '64f0c2ad2b4f3a5c1d2e3f4a' })
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

