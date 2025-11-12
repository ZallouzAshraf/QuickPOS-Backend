import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../categories/categories.schema';
import { User } from '../users/users.schema';
 

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Category | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User | Types.ObjectId;

  @Prop()
  image?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
