import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleProductDto {
  @ApiProperty({ example: '64f0c2ad2b4f3a5c1d2e3f4a' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ minimum: 1, example: 2 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ minimum: 0, example: 49.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
}

