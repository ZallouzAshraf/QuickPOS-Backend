import { Type } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { InvoiceItemDto } from './invoice-item.dto';
import { InvoiceStatus } from '../invoices.schema';

const PAYMENT_METHODS = ['cash', 'card', 'transfer', 'mobile', 'other'] as const;

export class CreateInvoiceDto {
  @ApiPropertyOptional({ example: '64f0c2ad2b4f3a5c1d2e3f4a' })
  @IsMongoId()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ example: 'Jean Dupont' })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  clientName?: string;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsEmail()
  @IsOptional()
  clientEmail?: string;

  @ApiPropertyOptional({ example: '+2250700000000' })
  @IsString()
  @MaxLength(32)
  @IsOptional()
  clientPhone?: string;

  @ApiPropertyOptional({ example: 'Abidjan, Cocody' })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  clientAddress?: string;

  @ApiProperty({ type: [InvoiceItemDto], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @ApiProperty({ example: 'XOF' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiPropertyOptional({ example: 18 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountRate?: number;

  @ApiProperty({ enum: PAYMENT_METHODS, example: 'card' })
  @IsIn(PAYMENT_METHODS)
  paymentMethod: (typeof PAYMENT_METHODS)[number];

  @ApiPropertyOptional({ enum: InvoiceStatus, example: InvoiceStatus.ISSUED })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;


  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ example: '2025-11-19T08:30:00.000Z' })
  @IsDateString()
  @IsOptional()
  issuedAt?: string;
}

export { PAYMENT_METHODS };


