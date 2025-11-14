import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Analytics {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalSales: number;

  @Prop({ type: Number, default: 0 })
  totalRevenue: number;

  @Prop({ type: Number, default: 0 })
  totalClients: number;

  @Prop({ type: Number, default: 0 })
  totalProducts: number;

  @Prop({ type: Number, default: 0 })
  activeLicenses: number;
}

export type AnalyticsDocument = Analytics & Document;
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
