import { IsString, IsBoolean, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class CreateCategoryDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryItemDto)
  @IsOptional()
  categories?: CategoryItemDto[];
}

export class UpdateCategoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryItemDto)
  @IsOptional()
  categories?: CategoryItemDto[];
}

export class AddCategoryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateCategoryItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}