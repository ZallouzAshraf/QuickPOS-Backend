import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class CategoryItem {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;
}

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CategoryItem], default: [] })
  categories: CategoryItem[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);