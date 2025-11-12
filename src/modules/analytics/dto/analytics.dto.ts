import { IsArray, IsDateString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class TopSellingProductDto {
  @IsOptional()
  productId: Types.ObjectId;

  @IsNumber()
  quantity: number;
}

export class CreateAnalyticsDto {
  @IsOptional()
  userId: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  totalSales?: number;

  @IsOptional()
  @IsNumber()
  totalRevenue?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopSellingProductDto)
  topSellingProducts?: TopSellingProductDto[];

  @IsOptional()
  @IsDateString()
  lastUpdated?: Date;
}
