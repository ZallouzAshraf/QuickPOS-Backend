import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleProductDto } from './sale-product.dto';

export class CreateSaleDto {
  @ApiProperty({ example: '64f0c2ad2b4f3a5c1d2e3f4a' })
  @IsMongoId()
  clientId: string;

  @ApiProperty({ type: [SaleProductDto], minItems: 1 })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleProductDto)
  @ArrayMinSize(1)
  products: SaleProductDto[];

  @ApiProperty({ minimum: 0, example: 149.97 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiProperty({ example: '2025-06-15T10:30:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ enum: ['cash', 'card', 'transfer', 'mobile'], example: 'card' })
  @IsIn(['cash', 'card', 'transfer', 'mobile'])
  paymentMethod: string;
}

