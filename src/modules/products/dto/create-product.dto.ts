import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Scanner Barcode' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Honeywell' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Category' })
  @IsString()
  category: string;

  @ApiProperty({ minimum: 0, example: 99.9 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ minimum: 0, example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'High-speed USB barcode scanner.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'imageUrl' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
  
}

