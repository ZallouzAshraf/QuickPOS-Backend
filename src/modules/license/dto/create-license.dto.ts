import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLicenseDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsMongoId()
  userId: string;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

