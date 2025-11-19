import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @ApiProperty({ example: '64f0c2ad2b4f3a5c1d2e3f4a', description: 'Identifiant du produit' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 'HP Pavilion 15', description: 'Nom du produit' })
  @IsString()
  @MaxLength(120)
  name: string;


  @ApiProperty({ minimum: 1, example: 2, description: 'Quantité vendue' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ minimum: 0.01, example: 549.99, description: 'Prix unitaire' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}


