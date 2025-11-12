import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Client } from '../clients/clients.schema';
import { Product } from '../products/products.schema';
import { User } from '../users/users.schema';
 
export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customerId?: Client | Types.ObjectId;

  @Prop({ type: [{ productId: { type: Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }] })
  products: { productId: Product | Types.ObjectId; quantity: number; price: number }[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'En cours' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User | Types.ObjectId;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
