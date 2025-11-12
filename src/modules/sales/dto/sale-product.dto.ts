import { IsMongoId, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleProductDto {
  @IsMongoId()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
}

