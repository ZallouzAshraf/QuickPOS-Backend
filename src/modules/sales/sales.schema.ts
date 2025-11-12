import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class SaleProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;
}

export const SaleProductSchema = SchemaFactory.createForClass(SaleProduct);

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: [SaleProductSchema], default: [] })
  products: SaleProduct[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ required: true })
  paymentMethod: string;
}

export type SaleDocument = Sale & Document;
export const SaleSchema = SchemaFactory.createForClass(Sale);
