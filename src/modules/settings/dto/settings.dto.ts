import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSettingsDto {
  @IsString()
  userId: Types.ObjectId;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  language?: string;


  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  backupEnabled?: boolean;
}
