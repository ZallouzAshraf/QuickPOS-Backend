import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleProductDto } from './sale-product.dto';

export class CreateSaleDto {
  @IsMongoId()
  clientId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleProductDto)
  @ArrayMinSize(1)
  products: SaleProductDto[];

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsIn(['cash', 'card', 'transfer', 'mobile'])
  paymentMethod: string;
}

